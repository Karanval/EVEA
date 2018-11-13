import {
  Sequelize,
  DataTypes
} from 'sequelize';
import Base from './Base';
import bcrypt from 'bcrypt';

const allFields = ['user_id', 'email', 'password', 'name', 'created',];

class User extends Base {

  static fields = {
    user_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'Must be a valid email address.'
        }
      },
      unique: {
        msg: 'This email is already taken.'
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password'
    },
    created: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  };

  static displayFields = {
    basic: ['id', 'email'],
    summary: allFields,
    detail: allFields,
    login: ['id', 'email', 'password'],
    session: ['id'],
  };

  static updatableFields = ['email', 'password', 'created_at',];

  static associatedModels = [{
    modelName: 'Role',
    type: 'belongsToMany',
    options: {
      through: 'UserRole',
      as: 'roles',
      foreignKey: 'user_id'
    }
  },{
    modelName: 'Class',
    type: 'hasMany',
    options: {
      as: 'classes',
      foreignKey: 'user_id'
    }
  }];

  static options = {
    tableName: 'user'
  };
}

User.passwordHashPromise = function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(error, hash) {
      if (error) {
        return reject(error);
      }

      resolve(hash);
    });
  });
};

User.matchPasswordHashPromise = function(password, userHash) {
  return new Promise((resolve, reject) => {

    bcrypt.compare(password, userHash, function(error, match) {
      if (error) {
        return reject(error);
      }

      resolve(match);
    });
  });
}

export default User;
