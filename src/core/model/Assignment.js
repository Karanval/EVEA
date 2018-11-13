import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['assignment_id', 'class_id', 'description', 'start', 'end', 'name'];

class Assignment extends Base {

  static fields = {
    assignment_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
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
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['name', 'end', 'description'];

  static associatedModels = [{
    modelName: 'Class',
    type: 'belongsToOne',
    options: {
      as: 'class',
      foreignKey: 'class_id'
    }
  },{
    modelName: 'Score',
    type: 'hasOne',
    options: {
      as: 'score',
      foreignKey: 'assignment_id'
    }
  }];

  static options = {
    tableName: 'assingment'
  };
}

export default Assignment;
