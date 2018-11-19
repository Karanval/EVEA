import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from '../Base';

const allFields = ['score_id', 'user_id', 'test_id', 'assignment_id','score'];

class Score extends Base {

  static fields = {
    file_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    test_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    assignment_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    score: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['score'];

  static associatedModels = [{
    modelName: 'User',
    type: 'belongsTo',
    options: {
      as: 'user',
      foreignKey: 'user_id'
    }
  }];

  static options = {
    tableName: 'score'
  };
}

export default Score;
