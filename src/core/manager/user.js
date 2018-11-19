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

  includeOption(associationName = 'user') {
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
        .then(async (user) => {
          if (user) {
            const value = await this._parseOutputItem(user);
            return resolve(value);
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
          userPayload.name = newUser.name;
          return userModel.create(userPayload, {
            transaction: t
          });
        });
    })
    .catch((error) => {
      console.log("This string is fire");
    });
  }

  createAdmin(userId) {
    let userModel = this.core.getModel('User');
    let roleModel = this.core.getModel('Role');
    let userRoleModel = this.core.getModel('UserRole');
    let savedRole;

    return userModel.sequelize.transaction((t) => {
      return roleModel.findOne({
        transaction: t, 
        where: {
          name: 'admin'
        }
      })
      .then((role) => {
        if(!role) {
          throw new Error('There is not a role "admin"');
        }

        savedRole = role;

        return userModel.findById(userId,{
          transaction: t
        });
      })
      .then((user) => {
        if(!user) {
          throw('User not found');
        }

        return userRoleModel.create({
          role_id: savedRole.role_id,
          user_id: user.user_id
        },{
          transaction: t
        });
      });
    })
    .catch((error) => {
      throw Manager.createSequelizeError(error);
    })
  }
}

export default UserManager;
