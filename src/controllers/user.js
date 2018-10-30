var database = require('../database');
var jwt = require('jsonwebtoken');
var token;
process.env.SECRET_KEY = "devesh";

exports.register = function(req, res) {
  var today = new Date();
  var appData = {
    "error": 1,
    "data": ""
  };
  var userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    created: today
  }
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Error interno del servidor.";
      appData["error_stacktrace"] = err;
      res.status(500).json(appData);
    } else {
      connection.query('SELECT email FROM user WHERE email=',[])
      connection.query('INSERT INTO user SET ?', userData, function(err, rows, fields) {
        if (!err) {
          appData.error = 0;
          appData["data"] = "Usuario registrado correctamente.";
          res.status(201).json(appData);
        } else {
          appData["data"] = "Ocurrió un error con la consulta a la bd.";
          appData["error_stacktrace"] = err;
          res.status(400).json(appData);
        }
      });
      connection.release();
    }
  });
};

exports.login = function(req, res) {
  var appData = {};
  var email = req.body.email;
  var password = req.body.password;
  database.connection.getConnection(function(err, connection) {
    if (err) {
      appData["error"] = 1;
      appData["data"] = "Error interno del servidor.";
      appData["error_stacktrace"] = err;
      res.status(500).json(appData);
    } else {
      connection.query('SELECT * FROM user WHERE email = ?', [email], function(err, rows, fields) {
        if (err) {
          appData.error = 1;
          appData["data"] = "Ocurrió un error con la consulta a la bd.";
          appData["error_stacktrace"] = err;
          res.status(400).json(appData);
        } else {
          if (rows.length > 0) {
            if (rows[0].password == password) {
              let user = JSON.parse(JSON.stringify(rows[0]));
              token = jwt.sign(user, process.env.SECRET_KEY, {
                expiresIn: 5000
              });
              appData.error = 0;
              appData["data"] = "Sesion iniciada";
              res.set("token", token);
              res.status(200).json(appData);
            } else {
              appData.error = 1;
              appData["data"] = "Email o password incorrecto.";
              res.status(204).json(appData);
            }
          } else {
            appData.error = 1;
            appData["data"] = "El email no está registrado.";
            res.status(204).json(appData);
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