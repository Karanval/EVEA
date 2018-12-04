'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routesCreator = require('../routes-creator');

var _routesCreator2 = _interopRequireDefault(_routesCreator);

var _utils = require('../utils');

var _utils2 = _interopRequireDefault(_utils);

var _errorHandler = require('../error-handler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (server, core) => {
  let routesCreator = new _routesCreator2.default(server, core, 'class', 'Class', {});

  routesCreator.registerBasics([]);

  server.get('/classes', (req, res, next) => {
    const classManager = core.getClassManager();

    classManager.getClasses().then(classes => {
      res.send(201, classes);
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.get('/classes/:userId', (req, res, next) => {
    const classManager = core.getClassManager();

    classManager.getMyClasses(req.params.userId).then(classes => {
      res.send(201, classes);
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.post('/class', (req, res, next) => {
    const classManager = core.getClassManager();

    let payload = _utils2.default.copyObject(req.body);

    classManager.createClass(payload).then(function (subject) {
      return res.send(201, {
        id: subject.class_id,
        message: `Class created: ${subject.class_id}.`
      });
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.post('/signup/user/:userId/class/:classId', (req, res, next) => {
    const classManager = core.getClassManager();

    let payload = _utils2.default.copyObject(req.body);

    classManager.signup(req.params.userId, req.params.classId, payload).then(function (signUp) {
      return res.send(201, {
        id: signUp.user_id,
        message: `User ${signUp.user_id} signed up in class ${signUp.class_id}.`
      });
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  // server.get('/Class/:classId', (req, res, next) => {
  //   const classManager = core.getClassManager();

  //   classManager.getClass(req.params.classId)
  //   .then((classes) => {
  //     res.send(201, classes);
  //   })
  //   .catch(function(error) {
  //     return next(errorHandler(error));
  //   });
  // });
};