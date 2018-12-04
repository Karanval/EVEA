'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class UserManager extends _manager2.default {

  constructor(core) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    super(core, Object.assign(options, {
      modelName: 'User'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }

  includeOption() {
    let associationName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'user';

    let options = Object.assign({
      association: associationName
    }, this.findAllDefaultOptions());

    return options;
  }

  parseResultItem(user) {
    return new Promise((resolve, reject) => {
      delete user.password;

      user.roles = user.roles || [];
      let roleNames = [];
      user.roles.forEach(userRole => {
        roleNames.push(userRole.name);
      });

      if (roleNames.length > 0) {
        user.roles = roleNames;
      } else {
        delete user.roles;
      }

      resolve(user);
    });
  }

  login(email, password) {
    var _this = this;

    return new Promise((resolve, reject) => {
      this.model.scope('login').findOne({
        where: {
          email: email
        },
        include: [{
          association: 'roles'
        }]
      }).then(user => {

        if (user) {
          return this.model.matchPasswordHashPromise(password, user.password).then(match => {
            return match ? user : null;
          });
        }

        return user;
      }).then((() => {
        var _ref = _asyncToGenerator(function* (user) {
          if (user) {
            const value = yield _this._parseOutputItem(user);
            return resolve(value);
          }

          resolve();
        });

        return function (_x3) {
          return _ref.apply(this, arguments);
        };
      })()).catch(reject);
    });
  }

  createUser(newUser) {
    const userModel = this.core.getModel('User');
    let userPayload = { email: newUser.email };

    return userModel.sequelize.transaction(t => {
      return userModel.findOne({
        where: {
          email: newUser.email
        }
      }).then(user => {
        if (user) {
          throw new Error("This email is already taken.");
        }
        return userModel.passwordHashPromise(newUser.password);
      }).then(hash => {
        userPayload.password = hash;
        return;
      }).then(() => {
        userPayload.name = newUser.name;
        return userModel.create(userPayload, {
          transaction: t
        });
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  getNonProfessors() {
    let userModel = this.core.getModel('User');
    const Op = userModel.sequelize.Op;

    return userModel.sequelize.transaction(t => {
      return userModel.findall({
        transaction: t,
        include: [{
          model: this.core.getModel('UserRole'),
          include: [{
            model: this.core.getModel('Role'),
            where: {
              name: {
                [Op.notIn]: ['professor']
              }
            }
          }],
          required: false
        }]
      }).then(users => {
        return users;
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  createProfessor(userId) {
    let userModel = this.core.getModel('User');
    let roleModel = this.core.getModel('Role');
    let userRoleModel = this.core.getModel('UserRole');
    let savedRole, savedUser;

    return userModel.sequelize.transaction(t => {
      return roleModel.findOne({
        transaction: t,
        where: {
          name: 'professor'
        }
      }).then(role => {
        if (!role) {
          throw new Error('There is not a role "professor"');
        }

        savedRole = role;

        return userModel.findByPk(userId, {
          transaction: t
        });
      }).then(user => {
        if (!user) {
          throw 'User not found';
        }
        savedUser = user;
        return userRoleModel.findOne({
          transaction: t,
          where: {
            user_id: user.user_id,
            role_id: savedRole.role_id
          }
        });
      }).then(userRole => {
        if (!userRole) {
          return userRoleModel.create({
            role_id: savedRole.role_id,
            user_id: savedUser.user_id
          }, {
            transaction: t
          });
        }
        return userRole;
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }
}

exports.default = UserManager;