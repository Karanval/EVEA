import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['test_id', 'question_id'];

class TestHasQuestion extends Base {

  static fields = {
    test_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Test',
        key: 'test_id'
      }
    },
    question_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Question',
        key: 'question_id'
      }
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = [];

  static associatedModels = [{
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

  static options = {
    tableName: 'test_has_question'
  };
}

export default TestHasQuestion;
