'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  let serverConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  const server = _restify2.default.createServer();

  server.use(_restify2.default.plugins.queryParser());
  server.use(_restify2.default.plugins.bodyParser());

  let corsOrigins = ['http://localhost:4201', 'https://evea-client.herokuapp.com'],
      corsAllowHeaders = ['*', 'Authorization'],
      corsExposeHeaders = ['*'];

  const cors = (0, _restifyCorsMiddleware2.default)({
    preflightMaxAge: 25,
    origins: corsOrigins,
    allowHeaders: corsAllowHeaders,
    exposeHeaders: corsExposeHeaders
  });

  server.pre(cors.preflight);
  server.use(cors.actual);

  const port = process.env.PORT || serverConfig.port || 8080;

  server.listen(port, function () {
    console.log('%s listening at %s', server.name, server.url); // eslint-disable-line
  });

  return server;
};

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _restifyCorsMiddleware = require('restify-cors-middleware');

var _restifyCorsMiddleware2 = _interopRequireDefault(_restifyCorsMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;