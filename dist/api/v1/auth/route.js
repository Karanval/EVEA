'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

var _config = require('../../../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (server, core) => {
  return () => {
    server.post('/login', (req, res, next) => {
      core.getUserManager().login(req.body.email, req.body.password).then(user => {
        if (!user) {
          return next(new _restifyErrors2.default.UnauthorizedError('Wrong email address or password.'));
        }

        const signPhrase = _config2.default.security.signPhrase;
        const issuer = _config2.default.security.issuer;

        let token = _jsonwebtoken2.default.sign(user, signPhrase, {
          issuer: issuer
        });

        user.access_token = token;
        // delete user.roles;

        return res.send(201, user);
      }).catch(error => {
        return next(new Error(error));
      });
    });
  };
};