'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['question_id', 'label', 'type', 'percentage', 'grade'];

class Question extends _Base2.default {}

Question.fields = {
  question_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  label: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: _sequelize.Sequelize.ENUM,
    values: ['OPEN', 'BOOL', 'INT', 'DECIMAL', 'SIMPLE', 'MULTIPLE'],
    allowNull: false,
    defaultValue: 'OPEN'
  },
  percentage: {
    type: _sequelize.DataTypes.DECIMAL,
    allowNull: true
  },
  grade: {
    type: _sequelize.DataTypes.DECIMAL,
    allowNull: true
  }
};
Question.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Question.updatableFields = ['label', 'type'];
Question.associatedModels = [{
  modelName: 'Test',
  type: 'belongsToMany',
  options: {
    through: 'TestHasQuestion',
    as: 'tests',
    foreignKey: 'question_id'
  }
}];
Question.options = {
  tableName: 'question'
};
exports.default = Question;