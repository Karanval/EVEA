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

  routesCreator.registerBasics(['delete', 'getAll', 'getOneById']);

  server.get('/class/:classId/assignments', (req, res, next) => {
    const assignmentManager = undefined.core.getAssaignmentManager();

    assignmentManager.getAssignments(req.params.classId).then(result => {
      return res.send(201, result);
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });

  server.post('/class/:classId/assignment', (req, res, next) => {
    const assignmentManager = undefined.core.getAssaignmentManager();

    let payload = _utils2.default.copyObject(req.body);
    assignmentManager.createOrUpdate(req.params.classId, payload).then(assignment => {
      return res.send(201, {
        id: assignment.assignment_id,
        message: `Assignment created/updated: ${assignment.assignment_id}.`
      });
    }).catch(function (error) {
      return next((0, _errorHandler2.default)(error));
    });
  });
};