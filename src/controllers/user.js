var database = require('../database');
var jwt = require('jsonwebtoken');
var token;
process.env.SECRET_KEY = "devesh";

exports.register = async function(req, res) {
  let today = new Date();
  let appData = {"error":1, "data":''};
  let userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    created: today
  }
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData.error = 1;
      appData.data = "Error interno del servidor.";
      appData.error_stacktrace = err;
      send(res, 500, 'register', JSON.stringify(appData));
    } else {
      connection.query('SELECT email FROM user WHERE email=',[])
      connection.query('INSERT INTO user SET ?', userData, function(err, rows, fields) {
        if (!err) {
          appData.error = 0;
          appData.data = "Usuario registrado correctamente.";
          send(res, 201, 'register', JSON.stringify(appData));
        } else {
          appData.data = "Ocurrió un error con la consulta a la bd.";
          appData.error_stacktrace = err;
          send(res, 400, 'register', JSON.stringify(appData));
        }
      });
      connection.release();
    }
  });
};

exports.login = function(req, res) {
  let appData = {};
  let email = req.body.email;
  let password = req.body.password;
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData.error = 1;
      appData.data = "Error interno del servidor.";
      appData.error_stacktrace = err;
      send(res, 500, 'login', JSON.stringify(appData));
    } else {
      connection.query('SELECT * FROM user WHERE email = ?', [email], function(err, rows, fields) {
        if (err) {
          appData.error = 1;
          appData.data = "Ocurrió un error con la consulta a la bd.";
          appData.error_stacktrace = err;
          send(res, 400, 'login', JSON.stringify(appData));
        } else {
          if (rows.length > 0) {
            if (rows[0].password == password) {
              let user = JSON.parse(JSON.stringify(rows[0]));
              token = jwt.sign(user, process.env.SECRET_KEY, {});

              appData.error = 0;
              appData.data = "Sesion iniciada";
              res.set("token", token);
              send(res, 200, 'login', JSON.stringify(appData));
            } else {
              appData.error = 1;
              appData.data = "Email o password incorrecto.";
              send(res, 204, 'login', JSON.stringify(appData));
            }
          } else {
            appData.error = 1;
            appData.data = "El email no está registrado.";
            send(res, 204, 'login', JSON.stringify(appData));
          }
        }
      });
      connection.release();
    }
  });
};

exports.getUsers = function(req, res) {
  var token = req.body.token || req.headers['token'];
  var appData = {};
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Internal Server Error";
      res.status(500).json(appData);
    } else {
      connection.query('SELECT * FROM user', function(err, rows, fields) {
      if (!err) {
        appData["error"] = 0;
        appData["data"] = rows;
        res.status(200).json(appData);
      } else {
        appData["data"] = "No data found";
        res.status(204).json(appData);
      }
    });
    connection.release();
    }
  });
};

function send(res, status, file, data) {
  res.status(status);
  res.render(file, {data})
}