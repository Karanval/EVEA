import RoutesCreator from '../routes-creator';
import utils from '../utils';
import errorHandler from '../error-handler';

export default (server, core) => {
  let routesCreator = new RoutesCreator(
    server, core, 'class', 'Class', {});

  routesCreator.registerBasics([]);

  server.get('/classes', (req, res, next) => {
    const classManager = core.getClassManager();
    
    classManager.getClasses()
    .then((classes) => {
      res.send(201, classes);
    })
    .catch(function(error) {
      return next(errorHandler(error));
    });
  });

  server.get('/classes/:userId', (req, res, next) => {
    const classManager = core.getClassManager();
    
    classManager.getMyClasses(req.params.userId)
    .then((classes) => {
      res.send(201, classes);
    })
    .catch(function(error) {
      return next(errorHandler(error));
    });
  });

  server.post('/class', (req, res, next) => {
    const classManager = core.getClassManager();

    let payload = utils.copyObject(req.body);

    classManager.createClass(payload)
    .then(function(subject) {
      return res.send(201,{
        id: subject.class_id,
        message: `Class created: ${subject.class_id}.`
      });
    }).catch(function(error) {
      return next(errorHandler(error));
    });
  })

  server.post('/signup/user/:userId/class/:classId', (req, res, next) => {
    const classManager = core.getClassManager();

    let payload = utils.copyObject(req.body)

    classManager.signup(req.params.userId, req.params.classId, payload)
    .then(function(signUp) {
      return res.send(201, {
        id: signUp.user_id,
        message: `User ${signUp.user_id} signed up in class ${signUp.class_id}.`
      });
    }).catch(function(error) {
      return next(errorHandler(error));
    });
  })

};
