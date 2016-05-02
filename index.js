var port = 3700;

/**
 *
 * Dependencies
 *
 */

var express = require("express");
var router = express.Router();
var $ = require("jquery");





/**
 *
 * App
 *
 */

var app = express();
app.use( router );
app.use( express.static(__dirname + '/public') );
app.set('view engine', 'jade');






/**
 *
 * Socket
 *
 */

const server = app.listen(port, function() {
  console.log('listening on *:' + port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
  console.log('a user connected');
 
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
});



/**
 *
 * Router
 *
 */

router.get('/', function(req, res, next) {


    setTimeout(function() {
      io.emit('sp_connect', {msg:'Sphero connected !'});
      console.log('Sphero connected');
    }, 4000);
    

    res.render('index');
});





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
 * Error
 *
 */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});








console.log("Listening on port " + port);
