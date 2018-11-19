import RoutesCreator from '../routes-creator';
import utils from '../utils';
import errorHandler from '../error-handler';

export default (server, core) => {
  let routesCreator = new RoutesCreator(
    server, core, 'class', 'Class', {});

  routesCreator.registerBasics(['delete', 'getAll', 'getOneById']);

  server.get('/class/:classId/assignments', (req, res, next) => {
    const assignmentManager = this.core.getAssaignmentManager();

    assignmentManager.getAssignments(req.params.classId)
    .then((result) => {
      return res.send(201, result);
    })
    .catch(function(error) {
      return next(errorHandler(error));
    });
  });

  server.post('/class/:classId/assignment', (req, res, next) => {
    const assignmentManager = this.core.getAssaignmentManager();

    let payload = utils.copyObject(req.body);
    assignmentManager.createOrUpdate(req.params.classId, payload)
    .then((assignment) => {
      return res.send(201, {
        id: assignment.assignment_id,
        message: `Assignment created/updated: ${assignment.assignment_id}.`
      });
    }).catch(function(error) {
      return next(errorHandler(error));
    });
  })
};
