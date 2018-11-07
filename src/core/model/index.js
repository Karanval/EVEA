import Sequelize from 'sequelize';
import requireAll from 'require-all';

var models;

function loadModels(modelsMap, sequelize) {
  for (let key in modelsMap) {
    let Model = modelsMap[key].default ? modelsMap[key].default : modelsMap[key];

    let modelOptions = Model.options;

    models[key] = Model.init(
      Model.fields,
      Object.assign({
        sequelize
      }, modelOptions)
    );
  }
}

export default {
  generate(sequelize) {
    models = {};

    var modelsMap = requireAll({
      dirname: `${__dirname}/../model`,
      recursive: false,
      filter: function(fileName) {
        var parts = fileName.split('.');
        if (parts[0] == 'index' || parts[0] == 'Base') {
          return;
        }

        return parts[0];
      }
    });

    loadModels(modelsMap, sequelize);

    Object.keys(models).forEach(function(modelName) {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }

      models[modelName].addBasicScopes();
    });

    models.sequelize = sequelize;

    return models;
  }
};
