'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _manager = require('./manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ClassManager extends _manager2.default {

  constructor(core) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    super(core, Object.assign(options, {
      modelName: 'Class'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }

  getClass(classId) {
    const classModel = this.core.getModel('Class');

    return classModel.findByPk(classId).then(subject => {
      return subject;
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  getMyClasses(userId) {
    const classModel = this.core.getModel('Class');

    return classModel.findAll({
      include: [{
        model: this.core.getModel('UserHasClass'),
        as: 'class_has_users',
        where: {
          user_id: userId
        }
      }]
    }).then(classes => {
      return classes;
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  getClasses() {
    const classModel = this.core.getModel('Class');

    return classModel.findAll().then(classes => {
      return classes;
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  createClass(payload) {
    const classModel = this.core.getModel('Class');

    return classModel.sequelize.transaction(t => {
      return classModel.generateCode().then(code => {
        payload.class_code = code;
        return classModel.findOne({
          transaction: t,
          where: {
            name: payload.name
          }
        });
      }).then(subject => {
        if (subject) {
          throw new Error('Class name already taken');
        }
        return classModel.create(payload, {
          transaction: t
        });
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }

  signup(userId, classId, payload) {
    const classModel = this.core.getModel('Class');
    const userModel = this.core.getModel('User');
    const classHasUserModel = this.core.getModel('UserHasClass');

    let savedClass;

    return classModel.sequelize.transaction(t => {
      return classModel.findByPk(classId, {
        transaction: t
      }).then(subject => {
        savedClass = subject;
        return userModel.findByPk(userId, {
          transaction: t
        });
      }).then(user => {
        if (user && savedClass) {
          if (payload.code && savedClass.class_code != payload.code) {
            throw new Error('Class code does not match');
          }
          return classHasUserModel.create({
            user_id: userId,
            class_id: classId
          }, {
            transaction: t
          });
        } else {
          throw new Error('User or class does not exist');
        }
      });
    }).catch(error => {
      throw _manager2.default.createSequelizeError(error);
    });
  }
}

exports.default = ClassManager;