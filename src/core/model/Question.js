import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['question_id', 'label', 'type', 'percentage', 'grade'];

class Question extends Base {

  static fields = {
    question_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: Sequelize.ENUM,
      values: ['OPEN', 'BOOL', 'INT', 'DECIMAL', 'SIMPLE', 'MULTIPLE'],
      allowNull: false,
      defaultValue: 'OPEN'
    },
    percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    grade: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['label', 'type'];

  static associatedModels = [{
    modelName: 'Test',
    type: 'belongsToMany',
    options: {
      through: 'TestHasQuestion',
      as: 'tests',
      foreignKey: 'question_id'
    }
  }];

  static options = {
    tableName: 'question'
  };
}

export default Question;
