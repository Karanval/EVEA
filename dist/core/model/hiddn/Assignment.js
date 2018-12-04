'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['assignment_id', 'class_id', 'description', 'start', 'end', 'name'];

class Assignment extends _Base2.default {}

Assignment.fields = {
  assignment_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  class_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  description: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  },
  start: {
    type: _sequelize.Sequelize.DATE,
    allowNull: false
  },
  end: {
    type: _sequelize.Sequelize.DATE,
    allowNull: false
  },
  name: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  }
};
Assignment.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Assignment.updatableFields = ['name', 'end', 'description'];
Assignment.associatedModels = [{
  modelName: 'Class',
  type: 'belongsTo',
  options: {
    as: 'class',
    foreignKey: 'class_id'
  }
}, {
  modelName: 'Score',
  type: 'hasOne',
  options: {
    as: 'score',
    foreignKey: 'assignment_id'
  }
}];
Assignment.options = {
  tableName: 'assingment'
};
exports.default = Assignment;