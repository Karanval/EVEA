'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {

  var connectionOptions = {
    host: config.host,
    dialect: config.dialect,
    charset: config.charset,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      camelCase: false,
      timestamps: false
    },
    operatorsAliases: false
  };

  if (config.socketPath) {
    connectionOptions.dialectOptions = {
      socketPath: config.socketPath
    };
  }

  const sequelize = new _sequelize2.default(config.database, config.username, config.password, connectionOptions);

  sequelize.authenticate().then(() => {
    console.log(`Connection to ${config.dialect} has been established successfully.`); // eslint-disable-line
  }).catch(err => {
    console.error(`Unable to connect to the database: ${config.database}`, err);
  });

  return sequelize;
};

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;