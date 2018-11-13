import Manager from './manager';

class ClassManager extends Manager {

  constructor(core, options = {}) {
    super(core, Object.assign(options, {
      modelName: 'Class'
    }));
  }

  findAllDefaultOptions() {
    return {
      attributes: this.model.displayFields['basic']
    };
  }

  createClass(payload) {
    const classModel = this.core.getModel('Class');
    
    return classModel.sequelize.transaction((t) => {
      return classModel.generateCode()
      .then((code) => {
        payload.class_code = code;
        return classModel.findOne({
          transaction: t,
          where: {
            name: payload.name
          }
        })
      })
      .then((subject) => {
        if(subject) {
          throw new Error('Class name already taken');
        }
        return classModel.create(payload, {
          transaction: t
        });
      });
    })
    .catch((error) => {
      throw Manager.createSequelizeError(error);
    })
  }

  signup(userId, classId, payload) {
    const classModel = this.core.getModel('Class');
    const userModel = this.core.getModel('User');
    const classHasUserModel = this.core.getModel('ClassHasUser');

    let savedClass;

    return classModel.sequelize.transaction((t) => {
      return classModel.findById(classId,{
        transaction: t
      })
      .then((subject) => {
        savedClass = subject
        return userModel.findById(userId, {
          transaction: t
        });
      })
      .then((user) => {
        if(user && savedClass) {
          if(payload.code && savedClass.class_code != payload.code) {
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
      })
    })
    .catch((error) => {
      throw Manager.createSequelizeError(error);
    })
  }
}

export default ClassManager;
