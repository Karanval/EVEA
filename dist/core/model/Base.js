'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

class Base extends _sequelize.Model {

  static init(fields) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if (!this.updatableFields || this.updatableFields.length === 0) {
      let forbiddenFields = ['id'];
      this.updatableFields = Object.keys(fields).filter(fieldName => {
        return forbiddenFields.indexOf(fieldName) !== -1;
      });
    }

    fields.id = _sequelize.Sequelize.VIRTUAL;

    return super.init(fields, options);
  }

  static associate(models) {
    this.associatedModels.forEach(association => {

      let associationOptions = association.options;

      if (!associationOptions) {
        throw new Error('An \'options\' object must be provided.');
      }

      if (!associationOptions.as) {
        throw new Error('An \'as\' option must be provided.');
      }

      this[association.type](models[association.modelName], associationOptions);
    });
  }

  static addBasicScopes() {

    // Add basic, summary and detail scopes
    Object.keys(this.displayFields).forEach(displayFieldsKey => {
      this.addScope(displayFieldsKey, {
        attributes: this.displayFields[displayFieldsKey]
      });
    });

    // Scope to get all associated models
    this.addScope('associated', function (instance) {
      let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'basic';
      let excludedModels = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      let where = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

      let include = [];

      this.associatedModels.forEach(association => {

        if (excludedModels.indexOf(association.modelName) !== -1) {
          return;
        }

        let associationSettings = {
          required: association.required || false,
          association: instance.associations[association.options.as],
          as: instance.associations[association.options.as],
          model: instance.sequelize.models[association.modelName].scope(type)
        };

        if (where[association.options.as]) {
          associationSettings.where = where[association.options.as];
        }

        include.push(associationSettings);
      });

      return {
        include: include
      };
    });
  }
}

Base.associatedModels = [];
Base.getPrimaryKey = function () {
  return this.primaryKeyAttributes[0];
};

exports.default = Base;