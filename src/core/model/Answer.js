import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['answer_id', 'question_id', 'user_id', 'value'];

class Answer extends Base {

  static fields = {
    answer_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    question_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    },
    user_id: {
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
    type: 'belongsToOne',
    options: {
      as: 'question',
      foreignKey: 'question_id'
    }
  }, {
    modelName: 'User',
    type: 'belongsToOne',
    options: {
      as: 'user',
      foreignKey: 'user_id'
    }
  }];

  static options = {
    tableName: 'answer'
  };
}

export default Answer;
