'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['test_id', 'question_id'];

class TestHasQuestion extends _Base2.default {}

TestHasQuestion.fields = {
  test_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'Test',
      key: 'test_id'
    }
  },
  question_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    references: {
      model: 'Question',
      key: 'question_id'
    }
  }
};
TestHasQuestion.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
TestHasQuestion.updatableFields = [];
TestHasQuestion.associatedModels = [{
  modelName: 'Test',
  type: 'belongsTo',
  options: {
    as: 'test',
    foreignKey: 'test_id'
  }
}, {
  modelName: 'Question',
  type: 'belongsTo',
  options: {
    as: 'question',
    foreignKey: 'question_id'
  }
}];
TestHasQuestion.options = {
  tableName: 'test_has_question'
};
exports.default = TestHasQuestion;