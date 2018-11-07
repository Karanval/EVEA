import EventEmitter from 'events';
import requireAll from 'require-all';

import initDatabase from './init_database';
import model from './model';

let managers;
let models;

class Core extends EventEmitter {

  constructor(config = {}) {
    super();
    this.db = initDatabase(config);
    models = model.generate(this.db);

    managers = {};
    var managersMap = requireAll({
      dirname: `${__dirname}/manager`,
      recursive: false,
      filter: function(fileName) {
        var parts = fileName.split('.');
        if (parts[0] == 'manager') {
          return;
        }

        return parts[0];
      }
    });

    this.loadManagers(managersMap);
  }

  loadManagers(managersMap) {
    for (let key in managersMap) {
      let Manager = managersMap[key].default ? managersMap[key].default : managersMap[key];
      let manager = new Manager(this);
      managers[manager.modelName] = manager;

      this[`get${manager.modelName}Manager`] = function() {
        return manager;
      };
    }
  }

  start() {
    this.emit('message', 'core started');
  }

  getModel(name) {
    return models[name];
  }

  getManager(name) {
    return managers[name];
  }
}

export default Core;
