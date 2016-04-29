

/**
 *
 * Dependencies
 *
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/DBNAME');
var routes = require('./routes/index');
var users = require('./routes/users');





/**
 *
 * Main App
 *
 */

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));





/**
 *
 * Sessions
 *
 */

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'azerty12354'
}))




/**
 *
 * Database
 *
 */

app.use(function(req,res,next){
    req.db = db;
    next();
});




/**
 *
 * Routes
 *
 */

app.use('/', routes);
app.use('/users', users);





/**
 *
 * Views
 *
 */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');





/**
 *
 * 404
 *
 */

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});





/**
 *
 * Errors
 *
 */

// DEV
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// PROD
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





/**
 *
 * Export
 *
 */

module.exports = app;
