import namespace from 'restify-namespace';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import restifyErrors from 'restify-errors';

import authRoutes from './route';
import config from '../../../config';

import acl from 'acl';
import aclPermissions from './permissions';

export default (server, core) => {

  console.log('Initializing authentication...');

  namespace(server, '/auth', authRoutes(server, core));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  server.use(passport.initialize());

  const JwtStrategy = passportJwt.Strategy;
  const ExtractJwt = passportJwt.ExtractJwt;
  const signPhrase = config.security.signPhrase;
  const issuer = config.security.issuer;

  let passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: signPhrase,
    issuer: issuer
  };

  passport.use(new JwtStrategy(passportJwtOptions, (jwtPayload, done) => {
    return done(null, (jwtPayload.user_id) ? jwtPayload : false);
  }));

  let memoryBackendAcl = new acl(new acl.memoryBackend());
  memoryBackendAcl.allow(aclPermissions)
    .then(() => {
      console.log('ACL initialized in memory backend.');
    })
    .catch((error) => {
      console.warn('ACL error: ' + error);
    });

  server.use(function(req, res, next) {
    let authenticate = passport.authenticate('jwt', {
      session: false
    }, (authenticationError, user, info) => {

      let roles = null;

      if (user) {
        req.user_id = user.user_id;
        roles = user.roles || [];
        roles.push('user');
      }

      roles = roles || ['visitor'];

      console.log(roles);

      let operation = req.method.toLowerCase();
      let resourcePath = req.url;
      console.log(resourcePath);

      memoryBackendAcl.areAnyRolesAllowed(roles, resourcePath, operation,
        (error, isAllowed) => {
          if (error) {
            return next(new restifyErrors.InternalServerError('Unexpected authorization error.'));
          }

          if (!isAllowed) {
            return next(new restifyErrors.ForbiddenError('You are not allowed to perform this action.'));
          }

          if (roles.length == 1 && roles[0] == 'visitor') {
            return next();
          }

          if (authenticationError || !user) {
            return next(new restifyErrors.InvalidCredentialsError('Unauthorized.'));
          }

          req.login(user, (loginError) => {
            if (loginError) {
              return next(new restifyErrors.InternalServerError(loginError));
            }

            return next();
          });
        });
    });

    authenticate(req, res, next);
  });
};

