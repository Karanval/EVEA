const allConfigs = {
  development: {
    server: {
      port: 7010
    },
    database: {
      socketPath: '',
      // host: 'localhost',
      // port: 3306,
      host: 'sql10.freemysqlhosting.net',
      port: 3306,
      dialect: 'mysql',
      // database: 'eva',
      // username: 'root',
      // password: 'root',
      database: 'sql10268291',
      username: 'sql10268291',
      password: 'JJLJIBWBAg',
      charset: 'utf8'
    },
    security: {
      signPhrase: 'phrasy',
      issuer: 'evea.com'
    }
  },
};

const env = process.env.NODE_ENV || 'development';

export default allConfigs[env];
// var mysql = require('mysql');

// var connection = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'eva',
//   port: 3306,
//   debug: false,
//   multipleStatements: true,
// });

// module.exports.connection = connection;