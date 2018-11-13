import RoutesCreator from '../routes-creator';
import utils from '../utils';
import errorHandler from '../error-handler';

export default (server, core) => {
  let routesCreator = new RoutesCreator(
    server, core, 'class', 'Class', {});

  routesCreator.registerBasics(['delete', 'getAll', 'getOneById']);

  server.get('/classes', (req, res, next) => {
    const options = routesCreator.extractGetAllOptions(req);

    routesCreator.getAll(req, res, next, options);
  });

  server.post('/class', (req, res, next) => {
    const classManager = this.core.getClassManager();

    let payload = utils.copyObject(req.body);

    classManager.createClass(payload)
    .then(function(subject) {
      return res.status(201).send({
        id: subject.class_id,
        message: `Class created: ${subject.class_id}.`
      });
    }).catch(function(error) {
      return next(errorHandler(error));
    });
  })

  server.post('/signup/user/:userId/class/:classId', (req, res, next) => {
    const classManager = this.core.getClassManager();

    let payload = utils.copyObject(req.body)

    classManager.signup(req.params.userId, req.params.classId, payload)
    .then(function(signUp) {
      return res.status(201).send({
        id: signUp.user_id,
        message: `User ${signup.user_id} signed up in class ${signup.class_id}.`
      });
    }).catch(function(error) {
      return next(errorHandler(error));
    });
  })

};
