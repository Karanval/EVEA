import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['file_id', 'path', 'name', 'class_id', 'assignment_id'];

class File extends Base {

  static fields = {
    file_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    },
    assignment_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['name', 'path'];

  static associatedModels = [];

  static options = {
    tableName: 'file'
  };
}

export default File;
