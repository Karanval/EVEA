'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('./Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['role_id', 'name'];

class Role extends _Base2.default {}

Role.fields = {
  role_id: {
    type: _sequelize.DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: _sequelize.DataTypes.STRING(45),
    allowNull: false
  }
};
Role.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Role.updatableFields = ['name'];
Role.associatedModels = [{
  modelName: 'User',
  type: 'belongsToMany',
  options: {
    through: 'UserRole',
    as: 'users',
    foreignKey: 'role_id'
  }
}];
Role.options = {
  tableName: 'role'
};
exports.default = Role;