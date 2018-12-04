'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

var _Base = require('./Base');

var _Base2 = _interopRequireDefault(_Base);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const allFields = ['user_id', 'email', 'password', 'name', 'created'];

class User extends _Base2.default {}

User.fields = {
  user_id: {
    type: _sequelize.DataTypes.INTEGER(10),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: _sequelize.DataTypes.STRING(255),
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
    type: _sequelize.DataTypes.STRING(255),
    allowNull: false,
    field: 'password'
  },
  created: {
    type: _sequelize.Sequelize.DATE,
    allowNull: false,
    defaultValue: _sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
  },
  name: {
    type: _sequelize.DataTypes.STRING(255),
    allowNull: false
  }
};
User.displayFields = {
  basic: ['user_id', 'email'],
  summary: allFields,
  detail: allFields,
  login: ['user_id', 'email', 'password'],
  session: ['user_id']
};
User.updatableFields = ['email', 'password', 'created_at'];
User.associatedModels = [{
  modelName: 'Role',
  type: 'belongsToMany',
  options: {
    through: 'UserRole',
    as: 'roles',
    foreignKey: 'user_id'
  }
}];
User.options = {
  tableName: 'user'
};
User.passwordHashPromise = function (password) {
  return new Promise((resolve, reject) => {
    _bcrypt2.default.hash(password, 10, function (error, hash) {
      if (error) {
        return reject(error);
      }
      resolve(hash);
    });
  });
};

User.matchPasswordHashPromise = function (password, userHash) {
  return new Promise((resolve, reject) => {

    _bcrypt2.default.compare(password, userHash, function (error, match) {
      if (error) {
        return reject(error);
      }

      resolve(match);
    });
  });
};

exports.default = User;