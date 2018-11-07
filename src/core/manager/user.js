import Manager from './manager';
import moment from 'moment';

class UserManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'User'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }

  includeOption(associationName = 'user', withDetails = false) {
    let options = Object.assign({
      association: associationName
    }, this.findAllDefaultOptions());

    if (withDetails) {
      options.include = [
        this.core.getUserDetailsManager().includeOption()
      ];
    }

    return options;
  }

  parseResultItem(user) {
    return new Promise((resolve, reject) => {
      delete user.password;

      user.roles = user.roles || [];
      let roleNames = [];
      user.roles.forEach((userRole) => {
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
    return new Promise((resolve, reject) => {
      this.model.scope('login').findOne({
          where: {
            email: email
          },
          include: [{
            association: 'roles'
          }]
        }).then((user) => {
          if (user) {
            return this.model.matchPasswordHashPromise(password, user.password)
              .then((match) => {
                return (match) ? user : null;
              });
          }

          return user;
        })
        .then((user) => {
          if (user) {
            return user.updateAttributes({
                logged_in_at: moment().format()
              }, {
                isUpdateOperation: true
              })
              .then(() => {
                return this._parseOutputItem(user);
              })
              .then(resolve);
          }
          resolve();
        })
        .catch(reject);
    });
  }

  createUser(newUser) {
    const userModel = this.core.getModel('User');
    let userPayload = { email: newUser.email }

    return userModel.sequelize.transaction((t) => {
      return userModel.findOne({
          where: {
            email: newUser.email
          }
        })
        .then((user) => {
          if (user) {
            throw new Error("This email is already taken.");
          }
          return userModel.passwordHashPromise(newUser.password)
        })
        .then((hash) => {
          userPayload.password = hash;
          return;
        })
        .then(() => {

          return userModel.create(userPayload, {
            transaction: t
          });
        });
    });
  }
}

export default UserManager;
