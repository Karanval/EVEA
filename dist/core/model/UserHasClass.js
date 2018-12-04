'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('./Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['user_id', 'class_id'];

class UserHasClass extends _Base2.default {}

UserHasClass.fields = {
  user_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'User',
      key: 'user_id'
    }
  },
  class_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    references: {
      model: 'Class',
      key: 'class_id'
    }
  }
};
UserHasClass.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
UserHasClass.updatableFields = [];
UserHasClass.associatedModels = [{
  modelName: 'User',
  type: 'belongsTo',
  options: {
    as: 'user',
    foreignKey: 'user_id'
  }
}, {
  modelName: 'Class',
  type: 'belongsTo',
  options: {
    as: 'class',
    foreignKey: 'class_id'
  }
}];
UserHasClass.options = {
  tableName: 'user_has_class'
};
exports.default = UserHasClass;