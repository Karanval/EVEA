'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserHasClassManager extends _manager2.default {

  constructor(core) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    super(core, Object.assign(options, {
      modelName: 'UserHasClass'
    }));
  }
}

exports.default = UserHasClassManager;