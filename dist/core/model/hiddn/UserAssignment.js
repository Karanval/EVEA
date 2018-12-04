'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['user_assignment_id', 'file_id', 'user_id', 'assingment_id', 'turn_in_date'];

class UserAssignment extends _Base2.default {}

UserAssignment.fields = {
  user_assignment_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  file_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  user_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  assignment_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  turn_in_date: {
    type: _sequelize.Sequelize.DATE,
    allowNull: false
  }
};
UserAssignment.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
UserAssignment.updatableFields = ['file_id', 'turn_in_date'];
UserAssignment.associatedModels = [{
  modelName: 'User',
  type: 'belongsTo',
  options: {
    as: 'user',
    foreignKey: 'user_id'
  }
}, {
  modelName: 'Assignment',
  type: 'belongsTo',
  options: {
    as: 'belongs_assignment',
    foreignKey: 'assignment'
  }
}, {
  modelName: 'File',
  type: 'hasOne',
  options: {
    as: 'file',
    foreignKey: 'file_id'
  }
}];
UserAssignment.options = {
  tableName: 'user_assignment'
};
exports.default = UserAssignment;