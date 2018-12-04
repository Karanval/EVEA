'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('../Base');

var _Base2 = _interopRequireDefault(_Base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['score_id', 'user_id', 'test_id', 'assignment_id', 'score'];

class Score extends _Base2.default {}

Score.fields = {
  file_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  test_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  assignment_id: {
    type: _sequelize.DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  score: {
    type: _sequelize.DataTypes.DECIMAL,
    allowNull: true
  }
};
Score.displayFields = {
  basic: allFields,
  summary: allFields,
  detail: allFields
};
Score.updatableFields = ['score'];
Score.associatedModels = [{
  modelName: 'User',
  type: 'belongsTo',
  options: {
    as: 'user',
    foreignKey: 'user_id'
  }
}];
Score.options = {
  tableName: 'score'
};
exports.default = Score;