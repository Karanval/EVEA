'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _create_core = require('./create_core');

var _create_core2 = _interopRequireDefault(_create_core);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.PORT || 3000;

let server = (0, _server2.default)(_config2.default.server);
let core = (0, _create_core2.default)(_config2.default.database);

(0, _api2.default)(server, core);