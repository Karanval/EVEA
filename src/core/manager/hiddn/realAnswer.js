import Manager from '../manager';

class RealAnswerManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'RealAnswer'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }
}

export default RealAnswerManager;
