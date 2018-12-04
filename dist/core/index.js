'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _init_database = require('./init_database');

var _init_database2 = _interopRequireDefault(_init_database);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let managers;
let models;

class Core extends _events2.default {

  constructor() {
    let config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    super();
    this.db = (0, _init_database2.default)(config);
    models = _model2.default.generate(this.db);

    managers = {};
    var managersMap = (0, _requireAll2.default)({
      dirname: `${__dirname}/manager`,
      recursive: false,
      filter: function filter(fileName) {
        var parts = fileName.split('.');
        if (parts[0] == 'manager') {
          return;
        }

        return parts[0];
      }
    });

    this.loadManagers(managersMap);
  }

  loadManagers(managersMap) {
    for (let key in managersMap) {
      let Manager = managersMap[key].default ? managersMap[key].default : managersMap[key];
      let manager = new Manager(this);
      managers[manager.modelName] = manager;

      this[`get${manager.modelName}Manager`] = function () {
        return manager;
      };
    }
  }

  start() {
    this.emit('message', 'core started');
  }

  getModel(name) {
    return models[name];
  }

  getManager(name) {
    return managers[name];
  }
}

exports.default = Core;