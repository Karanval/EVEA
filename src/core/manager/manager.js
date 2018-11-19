const errorCodesMap = {
  NotFoundError: true,
  ValidationError: true,
  ConfigurationError: true
};

class Manager {

  constructor(core, options = {}) {

    this.options = options;

    this.core = core;

    this.modelName = this.options.modelName;
    if (!this.modelName) {
      throw new Error('A modelName must be passed to the manager.');
    }

    this.model = core.getModel(this.modelName);

    if (!this.model) {
      throw new Error('A valid model must be assigned to the manager.');
    }

    this.updateStorage = {};

    this.core.emit('manager:created', this.modelName);
  }

  emitEvent(event, data) {
    this.core.emit(event, data);
  }

  emitCreated(createdItem) {
    this.core.emit('model:created', {
      name: this.modelName,
      data: createdItem
    });

    this.core.emit(this.modelName + ':created', createdItem);
  }

  emitUpdated(updatedItem) {
    this.core.emit('model:updated', {
      name: this.modelName,
      data: updatedItem
    });

    this.core.emit(this.modelName + ':updated', updatedItem);
  }

  emitDeleted(deletedItem) {
    this.core.emit('model:deleted', {
      name: this.modelName,
      data: deletedItem
    });

    this.core.emit(this.modelName + ':deleted', deletedItem);
  }

  beforeCreate(newItemData, creationOptions = {}) {
    return newItemData;
  }

  afterCreate(createdItem, originalItemData) {
    return createdItem;
  }

  beforeUpdate(updatedItemData, savedItem) {
    return updatedItemData;
  }

  afterUpdate(updatedItem, updatedItemData) {
    return updatedItem;
  }

  afterFindAll(collection, options = {}) {
    return collection;
  }

  _parseOutputItem(item) {
    return new Promise((resolve, reject) => {
      if (!item) {
        return resolve(item);
      }

      item = item.toJSON();

      this.parseResultItem(item)
        .then(function(itemChanged) {
          resolve(itemChanged);
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }

  parseResultItem(item) {
    return new Promise((resolve, reject) => {
      resolve(item);
    });
  }

  _create(newItemData, model, resolve, reject, options = {}) {

    model = model || this.model;

    Promise.resolve(this.beforeCreate(newItemData, options))
      .then((curatedNewItemData) => {

        return model.create(curatedNewItemData, options)
          .then((createdItem) => {

            return Promise.resolve(this.afterCreate(createdItem, curatedNewItemData))
              .then((curatedNewItem) => {

                let idKey = model.primaryKeyAttributes[0];
                curatedNewItem.id = curatedNewItem[idKey];

                return this._parseOutputItem(curatedNewItem)
                  .then((curatedNewItemChanged) => {
                    this.emitCreated(curatedNewItemChanged);

                    resolve(curatedNewItemChanged);
                  });
              });
          });
      })
      .catch((error) => {
        reject(Manager.createSequelizeError(error));
      });
  }

  create(newItemData, options) {
    return new Promise((resolve, reject) => {
      this._create(newItemData, null, resolve, reject, options);
    });
  }

  createChild(parentId, childModelName, newChildItemData) {

    parentId = parentId || this.missingAttributeError('parentId');
    childModelName = childModelName || this.missingAttributeError('childModelName');

    return new Promise((resolve, reject) => {
      this.model.findByPk(parentId, {
          attributes: [this.model.primaryKeyAttributes[0]]
        })
        .then((parent) => {
          if (!parent) {
            return reject(Manager.createError('NotFoundError', `${this.modelName} '${parentId}' doesn't exist.`));
          }

          this._create(newChildItemData, this.core.getModel(childModelName), resolve, reject);
        })
        .catch(reject);
    });
  }

  update(id, updatedItemData) {
    return new Promise((resolve, reject) => {

      let promise;

      if (typeof id === 'object') {
        promise = this.model.findOne({
          where: id
        });
      } else {
        promise = this.model.findByPk(id);
      }

      promise
        .then((item) => {

          if (!item) {
            return reject(Manager.createError('NotFoundError', `${this.modelName} '${this._stringifyId(id)}' doesn't exist.`));
          }

          Promise.resolve(this.beforeUpdate(updatedItemData, item))
            .then((curatedUpdatedItemData) => {

              curatedUpdatedItemData = this.filterUpdatableFields(curatedUpdatedItemData);

              if (Object.keys(curatedUpdatedItemData.disposable).length > 0) {
                reject(Manager.createError('ValidationError', 'Trying to update with forbidden properties: ' + Object.keys(curatedUpdatedItemData.disposable).join(', ')));
              }

              if (Object.keys(curatedUpdatedItemData).length === 0) {
                reject(Manager.createError('ValidationError', 'Trying to update without specifying properties.'));
              }

              curatedUpdatedItemData = curatedUpdatedItemData.updatable;

              let originalData = Object.assign({}, item.toJSON());
              item.update(curatedUpdatedItemData, {
                  isUpdateOperation: true
                })
                .then((updatedItem) => {
                  updatedItem.id = updatedItem[this.model.primaryKeyAttributes[0]];

                  Promise.resolve(this.afterUpdate(updatedItem, originalData))
                    .then((curatedUpdatedItem) => {

                      return this._parseOutputItem(curatedUpdatedItem)
                        .then((curatedUpdatedItemChanged) => {
                          this.emitUpdated(curatedUpdatedItemChanged);
                          resolve(curatedUpdatedItemChanged);
                        });
                    })
                    .catch((error) => {
                      reject(Manager.createSequelizeError(error));
                    });
                })
                .catch(reject);
            })
            .catch((error) => {
              reject(Manager.createSequelizeError(error));
            });
        })
        .catch(reject);
    });
  }

  filterUpdatableFields(updatedItemData) {
    var result = {
      updatable: {},
      disposable: {}
    };

    let updatableFields = this.model.updatableFields || [];

    Object.assign(result.disposable, updatedItemData);

    updatableFields.forEach(function(updatableFieldName) {
      if ('undefined' !== typeof updatedItemData[updatableFieldName]) {
        result.updatable[updatableFieldName] = result.disposable[updatableFieldName];
        delete result.disposable[updatableFieldName];
      }
    });

    return result;
  }

  _stringifyId(id) {
    if (typeof id === 'object') {
      let identifier = '';

      Object.keys(id).forEach((key) => {
        identifier = `${identifier} ${key}=${id[key]}`;
      });

      return identifier.trim();
    }

    return id;
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      let promise;

      if (typeof id === 'object') {
        promise = this.model.findOne({
          where: id
        });
      } else {
        promise = this.model.findByPk(id);
      }

      promise
        .then((item) => {

          if (!item) {
            return reject(Manager.createError('NotFoundError', `${this.modelName} '${this._stringifyId(id)}' doesn't exist.`));
          }

          return item.destroy()
            .then(() => {

              return this._parseOutputItem(item)
                .then((curatedDeletedItem) => {
                  this.emitDeleted(curatedDeletedItem);
                  resolve(id);
                });
            });
        })
        .catch(reject);
    });
  }

  findByPk(id, options = {}) {
    return new Promise((resolve, reject) => {

      let findOptions = Object.assign({}, options);

      if (options.fields) {
        findOptions.attributes = options.fields;
      }

      let promise;

      if (!findOptions.attributes && (options.include || []).length === 0) {
        promise = this.model
          .scope('detail', {
            method: ['associated', this.model, 'basic']
          })
          .findByPk(id, findOptions);
      } else {
        promise = this.model.findByPk(id, findOptions);
      }

      return promise
        .then((item) => {
          return this._parseOutputItem(item)
            .then(function(itemChanged) {
              resolve(itemChanged);
            });
        })
        .catch(reject);
    });
  }

  findOne(options = {}) {
    return new Promise((resolve, reject) => {

      if (!options.where) {
        throw new Error('A \'where\' condition must be included in options.');
      }

      let findOptions = Object.assign({}, options);

      if (options.fields) {
        findOptions.attributes = options.fields;
      }

      let query = this.model;

      if (!findOptions.attributes && (options.include || []).length === 0) {
        query.scope('detail', {
          method: ['associated', this.model, 'basic']
        });
      }

      let promise;

      if (!findOptions.attributes && (options.include || []).length === 0) {
        promise = this.model
          .scope('detail', {
            method: ['associated', this.model, 'basic']
          })
          .findOne(findOptions);
      } else {
        promise = this.model.findOne(findOptions);
      }

      return promise
        .then((item) => {
          return this._parseOutputItem(item)
            .then(function(itemChanged) {
              resolve(itemChanged);
            });
        })
        .catch(reject);
    });
  }

  parseFilters(findOptions = {}, filters = {}) {
    findOptions.where = findOptions.where || {};

    for (let filterName in filters) {
      this.parseFilter(findOptions, filterName, filters[filterName]);
    }

    return findOptions;
  }

  parseFilter(findOptions = {}, filterName, filterContent) {
    if (filterName.indexOf('.') === -1) {
      findOptions.where[filterName] = filterContent;
    } else {
      let filterComponents = filterName.split('.');
      findOptions.associationConditions = findOptions.associationConditions || {};
      findOptions.associationConditions[filterComponents[0]] = {};
      findOptions.associationConditions[filterComponents[0]][filterComponents[1]] = filterContent;
    }
  }

  findAll(options = {}) {
    const Sequelize = this.model.sequelize;
    const Op = Sequelize.Op;

    return new Promise((resolve, reject) => {

      let findOptions = Object.assign({
        subQuery: true,
        order: this.order || [
          [this.model.primaryKeyAttributes[0], 'DESC']
        ]
      }, options);

      if (options.fields) {
        findOptions.attributes = options.fields;
      }

      if (options.filters) {
        findOptions = this.parseFilters(findOptions, options.filters);
      }

      if (options.before) {
        findOptions.where = findOptions.where || {};
        findOptions.where.created_at = findOptions.where.created_at || {};
        findOptions.where.created_at[Op.lt] = options.before;
      }

      if (options.after) {
        findOptions.where = findOptions.where || {};
        findOptions.where.created_at = findOptions.where.created_at || {};
        findOptions.where.created_at[Op.gt] = options.after;
      }

      if (options.keywords) {
        findOptions.where = Object.assign((findOptions.where || {}), this.parseKeywords(options.keywords));
      }

      let promise;

      if ((options.include || []).length === 0 && !findOptions.attributes) {
        let associationConditions = findOptions.associationConditions;
        let excludedModels = findOptions.excludedModels || [];

        promise = this.model
          .scope('summary', {
            method: ['associated', this.model, 'basic', excludedModels, associationConditions]
          })
          .findAll(findOptions);
      } else {
        promise = this.model.findAll(findOptions);
      }

      return promise
        .then((collection) => {
          let self = this;
          let parseOutputItems = [];
          collection.forEach(function(item) {
            parseOutputItems.push(self._parseOutputItem(item));
          });

          return Promise.all(parseOutputItems)
            .then(function(collectionChanged) {
              Promise.resolve(self.afterFindAll(collectionChanged, options))
                .then((result) => {
                  return resolve(result);
                })
                .catch((error) => {
                  reject(Manager.createSequelizeError(error));
                });
            });
        })
        .catch(reject);
    });
  }

  count(options = {}) {
    const Sequelize = this.model.sequelize;
    const Op = Sequelize.Op;

    return new Promise((resolve, reject) => {

      let findOptions = Object.assign({
        subQuery: false
      }, options);

      if (options.include) {
        findOptions.distinct = true;
      }

      if (options.filters) {
        findOptions = this.parseFilters(findOptions, options.filters);
      }

      if (options.before) {
        findOptions.where = findOptions.where || {};
        findOptions.where.created_at = findOptions.where.created_at || {};
        findOptions.where.created_at[Op.lt] = options.before;
      }

      if (options.after) {
        findOptions.where = findOptions.where || {};
        findOptions.where.created_at = findOptions.where.created_at || {};
        findOptions.where.created_at[Op.gt] = options.after;
      }

      if (options.keywords) {
        findOptions.where = Object.assign((findOptions.where || {}), this.parseKeywords(options.keywords));
      }

      return this.model.count(findOptions)
        .then((count) => {
          return resolve(count);
        })
        .catch(reject);
    });
  }

  parseKeywords(keywords) {
    const Sequelize = this.model.sequelize;
    const Op = Sequelize.Op;
    const invalidQueries = ['de', 'del', 'a', 'y', 'o', 'u', 'con'];

    return {
      [Op.or]: Object.keys(keywords).map((keyword) => {

        let value = keywords[keyword];

        value = value.replace(/""/g, '" "');
        let tokens = value.split(' ');

        let curatedTokens = [];

        if ((value.match(/"/g) || []).length % 2 === 0) {
          let onQuery = false;
          let secureQuery = '';

          tokens.forEach((token) => {
            if (token == '""') {
              return;
            }

            if (!onQuery && token !== '"' && token.startsWith('"') && token.endsWith('"')) {
              curatedTokens.push(token.replace(/"/g, ''));

              return;
            }

            if (!onQuery && token.startsWith('"')) {
              onQuery = true;
              secureQuery = token;

              return;
            }

            if (onQuery) {
              secureQuery = `${secureQuery} ${token}`;
            } else {
              curatedTokens.push(token.trim());
            }

            if (onQuery && token.endsWith('"')) {
              onQuery = false;
              curatedTokens.push(secureQuery.replace(/"/g, ''));
              secureQuery = '';
            }
          });

          if (secureQuery !== '') {
            curatedTokens.push(secureQuery.replace(/"/g, ''));
          }

        } else {
          curatedTokens = tokens;
        }

        let queries = [];

        curatedTokens.forEach((token) => {
          let value = token;

          if (value.length > 1 && !invalidQueries.includes(value)) {
            queries.push(value);
          }
        });

        let uniqueQueries;

        if (queries.length === 0) {
          uniqueQueries = [''];
        } else {
          uniqueQueries = queries.filter((elem, pos, arr) => {
            return arr.indexOf(elem) == pos;
          });
        }

        return {
          [Op.or]: uniqueQueries.map((query) => {
            let likeQuery = {};

            likeQuery[keyword] = {
              [Op.like]: `%${query}%`
            };

            return likeQuery;
          })
        };
      })
    };
  }

  static missingAttributeError(attributeName) {
    throw new Error('A \'attributeName\' must be passed.');
  }

  static createError(code, messages) {

    if (!errorCodesMap[code]) {
      throw new Error(`Invalid error code: ${code}.`);
    }

    messages = Array.isArray(messages) ? messages : [messages];

    return {
      code: code,
      messages: messages
    };
  }

  static createSequelizeError(sequelizeError) {

    console.warn(sequelizeError);

    if (typeof sequelizeError === 'string') {
      return Manager.createError(
        'ValidationError',
        sequelizeError
      );
    } else if (sequelizeError.errors) {
      return Manager.createError(
        'ValidationError',
        sequelizeError.errors.map((error) => {
          return error.message
        })
      );
    } else if (sequelizeError.code) {
      return sequelizeError;
    } else {
      return Manager.createError(
        'ValidationError', [sequelizeError.message]
      );
    }
  }

}

export default Manager;
