'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manager = require('../manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AssignmentManager extends _manager2.default {

  constructor(core) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  createOrUpdate(classId, payload) {
    const assignmentModel = this.core.getModel('Assignment');

    return assignmentModel.sequelize.transaction(t => {
      return assignmentModel.findOne({
        transaction: t,
        where: {
          class_id: classId,
          name: payload.name
        }
      }).then(assignment => {
        payload.class_id = classId;
        if (assignment) {
          return assignment.update(payload, {
            isUpdateOperation: true
          });
        } else {
          return assignmentModel.create(payload, {
            transaction: t
          });
        }
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

}

exports.default = AssignmentManager;