import Manager from './manager';

class UserHasClassManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'UserHasClass'
    }));
  }
}

export default UserHasClassManager;
