'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _restifyErrors = require('restify-errors');

var _restifyErrors2 = _interopRequireDefault(_restifyErrors);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _responseFormatter = require('./response-formatter');

var _responseFormatter2 = _interopRequireDefault(_responseFormatter);

var _errorHandler = require('./error-handler');

var _errorHandler2 = _interopRequireDefault(_errorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkProperty = (instance, property, value) => {
  if (!value) {
    throw new Error(`Property ${property} must be assigned.`);
  }

  return value;
};

class RoutesCreator {

  constructor(server, core, resourceName, modelName) {
    let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    this.server = checkProperty(this, 'server', server);
    this.core = checkProperty(this, 'core', core);
    this.resourceName = checkProperty(this, 'resourceName', resourceName);
    this.modelName = checkProperty(this, 'modelName', modelName);

    this.options = Object.assign({
      filters: {},
      queries: {}
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
        server.del('/' + resourceName + '/:id', (req, res, next) => {
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

  _retrieveGlobalOptions(req) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Promise((resolve, reject) => {
      this.globalOptions(resolve, reject, req, options);
    });
  }

  globalOptions(resolve, reject, req) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    return resolve(options);
  }

  create(req, res, next, newItem) {
    let id_properties = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];


    newItem = newItem || _utils2.default.copyObject(req.body);

    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)(`Manager '${this.modelName}' not found.`));
    }

    manager.create(newItem).then(newItem => {
      let identifier;

      if (id_properties.length > 0) {
        identifier = {};
        id_properties.forEach(property => {
          identifier[property] = newItem[property];
        });
      } else {
        identifier = newItem.id;
      }

      return res.send(201, {
        id: identifier,
        message: `${this.modelName} created: '${_utils2.default.stringifyId(identifier)}'.`
      });
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  createChild(req, res, next, childmodelName, parentModelId, newItemData) {

    newItemData = newItemData || _utils2.default.copyObject(req.body);

    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)('Manager \'' + this.modelName + '\' not found.'));
    }

    manager.createChild(parentModelId, childmodelName, newItemData).then(newItem => {
      return res.send(201, {
        id: newItem.id,
        message: `${childmodelName} created: '${newItem.id}'.`
      });
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  update(req, res, next, modelId, updatedItemData) {

    modelId = modelId || req.params.id;
    updatedItemData = updatedItemData || _utils2.default.copyObject(req.body);

    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)(`Manager '${this.modelName}' not found.`));
    }

    manager.update(modelId, updatedItemData).then(updatedItem => {
      return res.send(200, {
        id: modelId,
        message: this.modelName + ' updated: \'' + _utils2.default.stringifyId(modelId) + '\'.'
      });
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  delete(req, res, next, modelId) {

    modelId = modelId || req.params.id;

    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)('Manager \'' + this.modelName + '\' not found.'));
    }

    manager.delete(modelId, req.body).then(deletedId => {
      return res.send(200, {
        id: deletedId,
        message: this.modelName + ' deleted: \'' + _utils2.default.stringifyId(deletedId) + '\'.'
      });
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  getOneById(req, res, next, modelId) {
    let options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)('Manager \'' + this.modelName + '\' not found.'));
    }

    modelId = modelId || req.params.id;

    this._retrieveGlobalOptions(req, options).then(findOptions => {
      return manager.findByPk(modelId, findOptions);
    }).then(item => {

      if (!item) {
        return next(new _restifyErrors2.default.NotFoundError(this.modelName + ' \'' + modelId + '\' not found.'));
      }

      return res.send(200, _responseFormatter2.default.toJSON(item));
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  getOne(req, res, next) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};


    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)('Manager \'' + this.modelName + '\' not found.'));
    }

    this._retrieveGlobalOptions(req, options).then(findOptions => {
      return manager.findOne(findOptions);
    }).then(item => {

      if (!item) {
        return next(new _restifyErrors2.default.NotFoundError(this.modelName + ' not found.'));
      }

      return res.send(200, _responseFormatter2.default.toJSON(item));
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  getAll(req, res, next) {
    let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    const manager = this._getManager();

    if (!manager) {
      return next((0, _errorHandler2.default)('Manager \'' + this.modelName + '\' not found.'));
    }

    const findAllDefaultOptions = {};
    let findOptions = {};

    this._retrieveGlobalOptions(req, options).then(globalOptions => {

      findOptions = Object.assign(findAllDefaultOptions, globalOptions);

      findOptions.filters = this.parseFilters(req.query.filters, this.options.filters);
      findOptions.keywords = this.parseQuery(req.query.q, this.options.queries);
      findOptions.q = req.query.q;

      return manager.findAll(findOptions);
    }).then(collection => {

      collection = collection || [];
      res.header('X-Total-Count', collection.length);

      if (req.header('X-Paginated') === 'true') {

        return manager.count(findOptions).then(count => {
          let totalPages = Math.ceil(count / (findOptions.limit || count));
          res.header('X-Total-Pages', totalPages);

          return res.send(200, collection);
        });
      } else {
        return res.send(200, collection);
      }
    }).catch(error => {
      return next((0, _errorHandler2.default)(error));
    });
  }

  registerBasics() {
    let serverMethods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['post', 'patch', 'delete', 'getOneById', 'getAll'];

    serverMethods.forEach(serverMethod => {
      this.serverMethodSpecifications[serverMethod]();
    });
  }

  parseFilters(filters) {
    let allowedFilters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


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

  parseQuery(query) {
    let allowedQueries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


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

exports.default = RoutesCreator;