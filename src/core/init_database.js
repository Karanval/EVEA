import Sequelize from 'sequelize';

export default function(config) {

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

  const sequelize = new Sequelize(config.database, config.username, config.password, connectionOptions);

  sequelize
    .authenticate()
    .then(() => {
      console.log(`Connection to ${config.dialect} has been established successfully.`); // eslint-disable-line
    })
    .catch(err => {
      console.error(`Unable to connect to the database: ${config.database}`, err);
    });

  return sequelize;
};
