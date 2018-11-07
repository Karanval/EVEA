import Manager from './manager';

class UserRoleManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'UserRole'
    }));
  }
}

export default UserRoleManager;
