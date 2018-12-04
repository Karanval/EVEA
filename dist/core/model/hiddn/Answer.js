'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['answer_id', 'question_id', 'user_id', 'value'];

class Answer extends _Base2.default {}

Answer.fields = {
  answer_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  question_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: true
  },
  user_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: true
  },
  value: {
    type: _sequelize.DataTypes.STRING,
    allowNull: true
  }
};
Answer.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Answer.updatableFields = ['value'];
Answer.associatedModels = [{
  modelName: 'Question',
  type: 'belongsTo',
  options: {
    as: 'question',
    foreignKey: 'question_id'
  }
}, {
  modelName: 'User',
  type: 'belongsTo',
  options: {
    as: 'user',
    foreignKey: 'user_id'
  }
}];
Answer.options = {
  tableName: 'answer'
};
exports.default = Answer;