'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('./core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};


  const core = new _core2.default(config);

  core.on('message', function (message) {
    console.log(`New message from core: ${message}`); // eslint-disable-line
  });

  core.start();

  return core;
};