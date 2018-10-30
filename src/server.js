var express = require('express');
var exphbs  = require('express-handlebars');
var favicon = require('serve-favicon');
var path = require('path');
var cors = require('cors');
var bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
var routes = require('./routes/routes');
var app = express();

// view engine setup
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views',
  partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({
 extended: false
}));

app.use('/', routes);

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err)
  }
  console.log(`Server is listening on ${port}`)
})
