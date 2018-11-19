import RoutesCreator from '../routes-creator';
import utils from '../utils';
import errorHandler from '../error-handler';

export default (server, core) => {
  let routesCreator = new RoutesCreator(
    server, core, 'user', 'User', {
      filters: {
        email: 'email'
      }
    });

  routesCreator.registerBasics(['delete', 'getAll', 'getOneById']);

  server.post('/v1/makeProf/:id', (req, res, next) => {
    
    const manager = core.getUserManager();

    manager.createProf(req.params.id)
      .then(function(user) {
        return res.send(201,{
          id: user.user_id,
          message: `Professor created: '${user.user_id}'.`
        });
      }).catch(function(error) {
        return next(errorHandler(error));
      });
  });

  server.post('/user', (req, res, next) => {
    let newUser = utils.copyObject(req.body);

    const manager = core.getUserManager();

    manager.createUser(newUser)
      .then(function(user) {
        return res.send(201,{
          id: user.user_id,
          message: `User created: '${user.user_id}'.`
        });
      }).catch(function(error) {
        return next(errorHandler(error));
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
