import Manager from './manager';

class TestHasQuestionManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'TestHasQuestion'
    }));
  }
}

export default TestHasQuestionManager;
