'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restifyNamespace = require('restify-namespace');

var _restifyNamespace2 = _interopRequireDefault(_restifyNamespace);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

var _route = require('./route');

var _route2 = _interopRequireDefault(_route);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

var _acl = require('acl');

var _acl2 = _interopRequireDefault(_acl);

var _permissions = require('./permissions');

var _permissions2 = _interopRequireDefault(_permissions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (server, core) => {

  console.log('Initializing authentication...');

  (0, _restifyNamespace2.default)(server, '/auth', (0, _route2.default)(server, core));

  _passport2.default.serializeUser(function (user, done) {
    done(null, user);
  });

  _passport2.default.deserializeUser(function (user, done) {
    done(null, user);
  });

  server.use(_passport2.default.initialize());

  const JwtStrategy = _passportJwt2.default.Strategy;
  const ExtractJwt = _passportJwt2.default.ExtractJwt;
  const signPhrase = _config2.default.security.signPhrase;
  const issuer = _config2.default.security.issuer;

  let passportJwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: signPhrase,
    issuer: issuer
  };

  _passport2.default.use(new JwtStrategy(passportJwtOptions, (jwtPayload, done) => {
    return done(null, jwtPayload.user_id ? jwtPayload : false);
  }));

  let memoryBackendAcl = new _acl2.default(new _acl2.default.memoryBackend());

  memoryBackendAcl.allow(_permissions2.default).then(() => {
    console.log('ACL initialized in memory backend.');
  }).catch(error => {
    console.warn('ACL error: ' + error);
  });

  server.use(function (req, res, next) {
    let authenticate = _passport2.default.authenticate('jwt', {
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
      let resourcePath = req.route.path;
      console.log(resourcePath);

      memoryBackendAcl.areAnyRolesAllowed(roles, resourcePath, operation, (error, isAllowed) => {
        if (error) {
          return next(new _restifyErrors2.default.InternalServerError('Unexpected authorization error.'));
        }

        if (!isAllowed) {
          return next(new _restifyErrors2.default.ForbiddenError('You are not allowed to perform this action.'));
        }

        if (roles.length == 1 && roles[0] == 'visitor') {
          return next();
        }

        if (authenticationError || !user) {
          return next(new _restifyErrors2.default.InvalidCredentialsError('Unauthorized.'));
        }

        req.login(user, loginError => {
          if (loginError) {
            return next(new _restifyErrors2.default.InternalServerError(loginError));
          }

          return next();
        });
      });
    });

    authenticate(req, res, next);
  });
};