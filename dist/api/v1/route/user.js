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
  let routesCreator = new _routesCreator2.default(server, core, 'user', 'User', {
    filters: {
      email: 'email'
    }
  });

  routesCreator.registerBasics(['delete', 'getAll', 'getOneById']);

  server.post('/makeProf/:id', (req, res, next) => {
    const manager = core.getUserManager();

    manager.createProfessor(req.params.id).then(function (user) {
      return res.send(201, {
        id: user.user_id,
        message: `Professor created: '${user.user_id}'.`
      });
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.post('/user', (req, res, next) => {
    let newUser = _utils2.default.copyObject(req.body);

    const manager = core.getUserManager();

    manager.createUser(newUser).then(function (user) {
      return res.send(201, {
        id: user.user_id,
        message: `User created: '${user.user_id}'.`
      });
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.get('/nonProfessors', (req, res, next) => {
    const userManager = core.getUserManager;

    userManager.getNonProfessors().then(function (users) {
      return res.send(201, users);
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.get('/user/:id/session', (req, res, next) => {
    const model = core.getModel('User');

    let options = {
      attributes: Array.from(model.displayFields['session']),
      include: [{
        association: 'roles'
      }]
    };

    routesCreator.getOneById(req, res, next, req.params.id, options);
  });
};