'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['test_id', 'class_id', 'start', 'end', 'name', 'possible_score'];

class Test extends _Base2.default {}

Test.fields = {
  test_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  class_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
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
  },
  possible_score: {
    type: _sequelize.DataTypes.DECIMAL,
    allowNull: false
  }
};
Test.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Test.updatableFields = ['name', 'end', 'possbile_score'];
Test.associatedModels = [{
  modelName: 'Class',
  type: 'belongsTo',
  options: {
    as: 'class',
    foreignKey: 'class_id'
  }
}, {
  modelName: 'Question',
  type: 'hasMany',
  options: {
    as: 'questions',
    foreignKey: 'test_id'
  }
}, {
  modelName: 'Score',
  type: 'hasOne',
  options: {
    as: 'score',
    foreignKey: 'test_id'
  }
}];
Test.options = {
  tableName: 'test'
};
exports.default = Test;