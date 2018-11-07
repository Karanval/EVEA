import jwt from 'jsonwebtoken';
import restifyErrors from 'express-server-error';
import config from '../../../config';

export default (server, core) => {
  return () => {
    server.post('/login', (req, res, next) => {
      core.getUserManager().login(req.body.email, req.body.password)
        .then((user) => {
          if (!user) {
            return next(new restifyErrors.UnauthorizedError('Wrong email address or password.'));
          }

          const signPhrase = config.security.signPhrase;
          const issuer = config.security.issuer;

          let token = jwt.sign(user, signPhrase, {
            issuer: issuer
          });

          user.access_token = token;
          delete user.roles;

          return res.send(201, user);
        })
        .catch((error) => {
          return next(new restifyErrors.InvalidContentError(error));
        });
    });
  };
};
