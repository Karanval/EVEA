import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';

const allFields = ['class_id', 'name', 'class_code', 'description'];

class Class extends Base {

  static fields = {
    class_id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class_code: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  };

  static displayFields = {
    basic: allFields,
    summary: allFields,
    detail: allFields
  };

  static updatableFields = ['name', 'class_code', 'description'];

  static associatedModels = [{
    modelName: 'User',
    type: 'hasMany',
    options: {
      as: 'users',
      foreignKey: 'class_id'
    }
  },{
    modelName: 'Assignment',
    type: 'hasMany',
    options: {
      as: 'assignment',
      foreignKey: 'class_id'
    }
  }];

  static options = {
    tableName: 'class'
  };
}

User.generateCode = function() {
  return new Promise((resolve, reject) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    resolve(text);
  });
};

export default Class;
