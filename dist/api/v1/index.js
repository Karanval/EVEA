'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restifyNamespace = require('restify-namespace');

var _restifyNamespace2 = _interopRequireDefault(_restifyNamespace);

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadRoutes(routersMap, server, core) {
  for (let key in routersMap) {
    let Route = routersMap[key].default ? routersMap[key].default : routersMap[key];
    Route(server, core);
  }
}

exports.default = (server, core) => {
  (0, _restifyNamespace2.default)(server, '/v1', () => {
    (0, _auth2.default)(server, core);

    var routersMap = (0, _requireAll2.default)({
      dirname: `${__dirname}/route`,
      recursive: false
    });

    loadRoutes(routersMap, server, core);
  });
};