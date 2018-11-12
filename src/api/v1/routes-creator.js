import restifyErrors from 'express-server-error';

import utils from './utils';
import formatter from './response-formatter';
import errorHandler from './error-handler';

const checkProperty = (instance, property, value) => {
  if (!value) {
    throw new Error(`Property ${property} must be assigned.`);
  }

  return value;
};

class RoutesCreator {

  constructor(server, core, resourceName, modelName, options = {}) {
    this.server = checkProperty(this, 'server', server);
    this.core = checkProperty(this, 'core', core);
    this.resourceName = checkProperty(this, 'resourceName', resourceName);
    this.modelName = checkProperty(this, 'modelName', modelName);

    this.options = Object.assign({
      filters: {},
      queries: {},
    }, options);

    this.serverMethodSpecifications = {
      post: () => {
        server.post('/' + resourceName, (req, res, next) => {
          this.create(req, res, next);
        });
      },
      patch: () => {
        server.patch('/' + resourceName + '/:id', (req, res, next) => {
          this.update(req, res, next, req.params.id);
        });
      },
      delete: () => {
        server.delete('/' + resourceName + '/:id', (req, res, next) => {
          this.delete(req, res, next, req.params.id);
        });
      },
      getOneById: () => {
        server.get('/' + resourceName + '/:id', (req, res, next) => {
          this.getOneById(req, res, next, req.params.id);
        });
      },
      getAll: () => {
        server.get('/' + resourceName, (req, res, next) => {
          const options = this.extractGetAllOptions(req);
          this.getAll(req, res, next, options);
        });
      }
    };
  }

  _getManager() {
    return this.core.getManager(this.modelName);
  }

  extractGetAllOptions(req) {
    let options = {};

    if (req.query.limit) {
      options.limit = parseInt(req.query.limit);
    }

    if (req.query.offset) {
      options.offset = parseInt(req.query.offset);
    }

    if (req.query.filters) {
      options.filters = req.query.filters;
    }

    if (req.query.before) {
      options.before = req.query.before;
    }

    if (req.query.after) {
      options.after = req.query.after;
    }

    return options;
  }

  _retrieveGlobalOptions(req, options = {}) {
    return new Promise((resolve, reject) => {
      this.globalOptions(resolve, reject, req, options);
    });
  }

  globalOptions(resolve, reject, req, options = {}) {
    return resolve(options);
  }

  create(req, res, next, newItem, id_properties = []) {

    newItem = newItem || utils.copyObject(req.body);

    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler(`Manager '${this.modelName}' not found.`));
    }

    manager.create(newItem)
      .then((newItem) => {
        let identifier;

        if (id_properties.length > 0) {
          identifier = {};
          id_properties.forEach((property) => {
            identifier[property] = newItem[property];
          });
        } else {
          identifier = newItem.id;
        }

        return res.status(201).send({
          id: identifier,
          message: `${this.modelName} created: '${utils.stringifyId(identifier)}'.`
        });
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  createChild(req, res, next, childmodelName, parentModelId, newItemData) {

    newItemData = newItemData || utils.copyObject(req.body);

    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler('Manager \'' + this.modelName + '\' not found.'));
    }

    manager.createChild(parentModelId, childmodelName, newItemData)
      .then((newItem) => {
        return res.status(201).send({
          id: newItem.id,
          message: `${childmodelName} created: '${newItem.id}'.`
        });
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  update(req, res, next, modelId, updatedItemData) {

    modelId = modelId || req.params.id;
    updatedItemData = updatedItemData || utils.copyObject(req.body);

    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler(`Manager '${this.modelName}' not found.`));
    }

    manager.update(modelId, updatedItemData)
      .then((updatedItem) => {
        return res.status(200).send({
          id: modelId,
          message: this.modelName + ' updated: \'' + utils.stringifyId(modelId) + '\'.'
        });
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  delete(req, res, next, modelId) {

    modelId = modelId || req.params.id;

    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler('Manager \'' + this.modelName + '\' not found.'));
    }

    manager.delete(modelId, req.body)
      .then((deletedId) => {
        return res.status(200).send({
          id: deletedId,
          message: this.modelName + ' deleted: \'' + utils.stringifyId(deletedId) + '\'.'
        });
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  getOneById(req, res, next, modelId, options = {}) {
    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler('Manager \'' + this.modelName + '\' not found.'));
    }

    modelId = modelId || req.params.id;

    this._retrieveGlobalOptions(req, options)
      .then((findOptions) => {
        return manager.findById(modelId, findOptions)
      })
      .then((item) => {

        if (!item) {
          return next(new restifyErrors.NotFoundError(this.modelName + ' \'' + modelId + '\' not found.'));
        }

        return res.status(200).send(formatter.toJSON(item));
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  getOne(req, res, next, options = {}) {

    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler('Manager \'' + this.modelName + '\' not found.'));
    }

    this._retrieveGlobalOptions(req, options)
      .then((findOptions) => {
        return manager.findOne(findOptions);
      })
      .then((item) => {

        if (!item) {
          return next(new restifyErrors.NotFoundError(this.modelName + ' not found.'));
        }

        return res.status(200).send(formatter.toJSON(item));
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  getAll(req, res, next, options = {}) {
    const manager = this._getManager();

    if (!manager) {
      return next(errorHandler('Manager \'' + this.modelName + '\' not found.'));
    }

    const findAllDefaultOptions = {};
    let findOptions = {};

    this._retrieveGlobalOptions(req, options)
      .then((globalOptions) => {

        findOptions = Object.assign(findAllDefaultOptions, globalOptions);

        findOptions.filters = this.parseFilters(req.query.filters, this.options.filters);
        findOptions.keywords = this.parseQuery(req.query.q, this.options.queries);
        findOptions.q = req.query.q;

        return manager.findAll(findOptions)
      })
      .then((collection) => {

        collection = collection || []
        res.header('X-Total-Count', collection.length)

        if (req.header('X-Paginated') === 'true') {

          return manager.count(findOptions)
            .then((count) => {
              let totalPages = Math.ceil(count / (findOptions.limit || count));
              res.header('X-Total-Pages', totalPages);

              return res.status(200).send(collection);
            });
        } else {
          return res.status(200).send(collection);
        }
      })
      .catch((error) => {
        return next(errorHandler(error));
      });
  }

  registerBasics(serverMethods = ['post', 'patch', 'delete', 'getOneById', 'getAll']) {
    serverMethods.forEach((serverMethod) => {
      this.serverMethodSpecifications[serverMethod]();
    });
  }

  parseFilters(filters, allowedFilters = {}) {

    if (!filters || filters === '') {
      return;
    }

    return filters.split(';').reduce((memo, filter) => {

      filter = filter.split(':');

      if (allowedFilters[filter[0]]) {
        memo[allowedFilters[filter[0]]] = filter[1].split(',');
      }

      return memo;
    }, {});
  }

  parseQuery(query, allowedQueries = {}) {

    if (!query || query === '') {
      return;
    }

    const allowedQueriesKeys = Object.keys(allowedQueries);

    if (allowedQueriesKeys.length === 0) {
      return;
    }

    return allowedQueriesKeys.reduce((memo, property) => {
      memo[property] = query;

      return memo;
    }, {});
  }
}

export default RoutesCreator;
