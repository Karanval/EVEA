'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var models;

function loadModels(modelsMap, sequelize) {
  for (let key in modelsMap) {
    let Model = modelsMap[key].default ? modelsMap[key].default : modelsMap[key];

    let modelOptions = Model.options;

    models[key] = Model.init(Model.fields, Object.assign({
      sequelize: sequelize
    }, modelOptions));
  }
}

exports.default = {
  generate: function generate(sequelize) {
    models = {};

    var modelsMap = (0, _requireAll2.default)({
      dirname: `${__dirname}/../model`,
      recursive: false,
      filter: function filter(fileName) {
        var parts = fileName.split('.');
        if (parts[0] == 'index' || parts[0] == 'Base') {
          return;
        }

        return parts[0];
      }
    });

    loadModels(modelsMap, sequelize);

    Object.keys(models).forEach(function (modelName) {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }

      models[modelName].addBasicScopes();
    });

    models.sequelize = sequelize;

    return models;
  }
};