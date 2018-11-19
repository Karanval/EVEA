import Manager from '../manager';
import moment from 'moment';

class AnswerManager extends Manager {

  constructor(core, options = {}) {
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

    answerModel.sequelize.transaction((t) => {
      answerModel.findOne({
        transaction: t,
        where: {
          question_id: questionId,
          user_id: userId
        }
      })
      .then((answer) => {
        let answerPayload = {
          question_id: questionId,
          user_id: userId,
          value: payload.value
        }
        if(answer) {
          return answer.update(answerPayload, {
            isUpdateOperation: true
          });
        } else {
          return answerModel.create(answerPayload,{
            transaction: t
          });
        }
      }); 
    })
    .catch((error) => {
      throw Manager.createSequelizeError(error);
    })
  }
}

export default AnswerManager;
