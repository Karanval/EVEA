'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manager = require('../manager');

var _manager2 = _interopRequireDefault(_manager);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AnswerManager extends _manager2.default {

  constructor(core) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    super(core, Object.assign(options, {
      modelName: 'Answer'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }

  createOrUpdate(questionId, userId, payload) {
    const answerModel = this.core.getModel('Answer');

    answerModel.sequelize.transaction(t => {
      answerModel.findOne({
        transaction: t,
        where: {
          question_id: questionId,
          user_id: userId
        }
      }).then(answer => {
        let answerPayload = {
          question_id: questionId,
          user_id: userId,
          value: payload.value
        };
        if (answer) {
          return answer.update(answerPayload, {
            isUpdateOperation: true
          });
        } else {
          return answerModel.create(answerPayload, {
            transaction: t
          });
        }
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }
}

exports.default = AnswerManager;