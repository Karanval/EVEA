'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['real_answer_id', 'question_id', 'value'];

class RealAnswer extends _Base2.default {}

RealAnswer.fields = {
  real_answer_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  question_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: true
  },
  value: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  }
};
RealAnswer.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
RealAnswer.updatableFields = ['value'];
RealAnswer.associatedModels = [{
  modelName: 'Question',
  type: 'belongsTo',
  options: {
    as: 'question',
    foreignKey: 'question_id'
  }
}];
RealAnswer.options = {
  tableName: 'real_answer'
};
exports.default = RealAnswer;