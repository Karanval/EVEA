'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['file_id', 'path', 'name', 'class_id', 'assignment_id'];

class File extends _Base2.default {}

File.fields = {
  file_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  path: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  class_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: true
  },
  assignment_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: true
  }
};
File.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
File.updatableFields = ['name', 'path'];
File.associatedModels = [];
File.options = {
  tableName: 'file'
};
exports.default = File;