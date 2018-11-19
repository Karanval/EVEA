import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from '../Base';

const allFields = ['user_assignment_id', 'file_id', 'user_id', 'assingment_id', 'turn_in_date'];

class UserAssignment extends Base {

  static fields = {
    user_assignment_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    file_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    assignment_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    turn_in_date: {
      type: Sequelize.DATE,
      allowNull: false
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['file_id', 'turn_in_date'];

  static associatedModels = [{
    modelName: 'User',
    type: 'belongsTo',
    options: {
      as: 'user',
      foreignKey: 'user_id'
    }
  },{
    modelName: 'Assignment',
    type: 'belongsTo',
    options: {
      as: 'belongs_assignment',
      foreignKey: 'assignment'
    }
  },{
    modelName: 'File',
    type: 'hasOne',
    options: {
      as: 'file',
      foreignKey: 'file_id'
    }
  }];

  static options = {
    tableName: 'user_assignment'
  };
}

export default UserAssignment;
