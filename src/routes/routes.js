var express = require('express');
var cors = require('cors')
var router = express.Router();
router.use(cors());

var userController = require('../controllers/user');

router.get('/', function(req, res, next) {
  res.render('home', {});
});
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/getUsers', userController.getUsers);

// router.use(function(req, res, next) {
//   console.log(JSON.stringify(req.body));
//   var token = req.body.token || req.headers['token'];
//   var appData = {};
//   if (token) {
//     jwt.verify(token, process.env.SECRET_KEY, function(err) {
//       if (err) {
//         appData["error"] = 1;
//         appData["data"] = "Token no válido.";
//         res.status(500).json(appData);
//       } else {
//         next();
//       }
//     });
//   } else {
//     appData["error"] = 1;
//     appData["data"] = "El token de identificación no fué enviado.";
//     res.status(403).json(appData);
//   }
// });

module.exports = router;
