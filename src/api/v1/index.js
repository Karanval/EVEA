import namespace from 'restify-namespace';
import requireAll from 'require-all';

import auth from './auth';

function loadRoutes(routersMap, server, core) {
  for (let key in routersMap) {
    let Route = routersMap[key].default ? routersMap[key].default : routersMap[key];
    Route(server, core);
  }
}

export default (server, core) => {
  namespace(server, '/v1', () => {
    auth(server, core);

    var routersMap = requireAll({
      dirname: `${__dirname}/route`,
      recursive: false
    });

    loadRoutes(routersMap, server, core);
  });
};
