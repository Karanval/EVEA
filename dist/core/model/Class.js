'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('./Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['class_id', 'name', 'class_code', 'description', 'objectives', 'professor_name'];

class Class extends _Base2.default {}

Class.fields = {
  class_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  class_code: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  objectives: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  professor_name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  }
};
Class.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Class.updatableFields = ['name', 'class_code', 'description'];
Class.associatedModels = [{
  modelName: 'UserHasClass',
  type: 'hasMany',
  options: {
    as: 'class_has_users',
    foreignKey: 'class_id'
  }
}];
Class.options = {
  tableName: 'class'
};
Class.generateCode = function () {
  return new Promise((resolve, reject) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    resolve(text);
  });
};

exports.default = Class;