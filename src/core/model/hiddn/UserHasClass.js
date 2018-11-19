import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from '../Base';

const allFields = ['user_id', 'class_id'];

class UserHasClass extends Base {

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
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Class',
        key: 'class_id'
      }
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = [];

  static associatedModels = [];

  static options = {
    tableName: 'user_has_class'
  };
}

export default UserHasClass;
