import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['user_id', 'role_id'];

class UserRole extends Base {

  static fields = {
    user_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'User',
        key: 'user_id'
      }
    },
    role_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Role',
        key: 'role_id'
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
    modelName: 'User',
    type: 'belongsTo',
    options: {
      as: 'user',
      foreignKey: 'user_id'
    }
  }, {
    modelName: 'Role',
    type: 'belongsTo',
    options: {
      as: 'role',
      foreignKey: 'role_id'
    }
  }];

  static options = {
    tableName: 'user_role'
  };
}

export default UserRole;
