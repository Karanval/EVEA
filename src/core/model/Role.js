import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['role_id', 'name'];

class Role extends Base {

  static fields = {
    role_id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['name'];

  static associatedModels = [{
    modelName: 'User',
    type: 'belongsToMany',
    options: {
      through: 'UserRole',
      as: 'users',
      foreignKey: 'role_id'
    }
  }];

  static options = {
    tableName: 'role'
  };
}

export default Role;
