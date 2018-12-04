'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('./Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['user_id', 'role_id'];

class UserRole extends _Base2.default {}

UserRole.fields = {
  user_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  role_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    references: {
      model: 'Role',
      key: 'role_id'
    }
  }
};
UserRole.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
UserRole.updatableFields = [];
UserRole.associatedModels = [{
  modelName: 'User',
  type: 'belongsTo',
  options: {
    as: 'user',
    foreignKey: 'user_id'
  }
}, {
  modelName: 'Role',
  type: 'belongsTo',
  options: {
    as: 'role',
    foreignKey: 'role_id'
  }
}];
UserRole.options = {
  tableName: 'user_role'
};
exports.default = UserRole;