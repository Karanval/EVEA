import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['real_answer_id', 'question_id', 'value'];

class RealAnswer extends Base {

  static fields = {
    real_answer_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['value'];

  static associatedModels = [{
    modelName: 'Question',
    type: 'belongsTo',
    options: {
      as: 'question',
      foreignKey: 'question_id'
    }
  }];

  static options = {
    tableName: 'real_answer'
  };
}

export default RealAnswer;
