import Manager from './manager';

class RoleManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'Role'
    }));
  }
}

export default RoleManager;
