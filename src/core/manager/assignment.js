import Manager from './manager';
import assignment from '../../api/v1/route/assignment';

class AssignmentManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'Assignment'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }

  getAssignments(classId) {
    const assignmentModel = this.core.getModel('Assignment');

    return assignmentModel.findAll({
      where: {
        class_id: classId
      }
    })
    .catch((error) => {
      throw Manager.createSequelizeError(error);
    })
  }

  createOrUpdate(classId, payload) {
    const assignmentModel = this.core.getModel('Assignment');

    return assignmentModel.sequelize.transaction((t) => {
      return assignmentModel.findOne({
        transaction: t,
        where: {
          class_id: classId,
          name: payload.name
        }
      })
      .then((assignment) => {
        payload.class_id = classId;
        if(assignment) {
          return assignment.update(payload, {
            isUpdateOperation: true
          });
        } else {
          return assignmentModel.create(payload, {
            transaction: t
          });
        }
      })
    })
    .catch((error) => {
      throw Manager.createSequelizeError(error);
    })
  }

}

export default AssignmentManager;
