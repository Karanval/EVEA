import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['test_id', 'class_id', 'start', 'end', 'name', 
  'possible_score'];

class Test extends Base {

  static fields = {
    test_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    start: {
      type: Sequelize.DATE,
      allowNull: false
    },
    end: {
      type: Sequelize.DATE,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    possible_score: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['name', 'end', 'possbile_score'];

  static associatedModels = [{
    modelName: 'Class',
    type: 'belongsTo',
    options: {
      as: 'class',
      foreignKey: 'class_id'
    }
  },{
    modelName: 'Question',
    type: 'hasMany',
    options: {
      as: 'questions',
      foreignKey: 'test_id'
    }
  },{
    modelName: 'Score',
    type: 'hasOne',
    options: {
      as: 'score',
      foreignKey: 'test_id'
    }
  }];

  static options = {
    tableName: 'test'
  };
}

export default Test;
