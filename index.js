var port = 3700;

/**
 *
 * Dependencies
 *
 */

var express = require("express");
var router = express.Router();
var $ = require("jquery");

var sphero = require("sphero");
var orb;





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

const server = app.listen(port);





/**
 *
 * Router
 *
 */

router.get('/', function(req, res, next) {

  //io.emit('sp_connect', {msg:'Sphero connected !'});

  var io = require('socket.io')(server);

  io.on('connection', function(socket) {

    console.log('=> USER CONNECTED');

    //orb = new sphero("/dev/tty.Sphero-BBY-AMP-SPP", {emitPacketErrors: true, timeout: 300});

    // orb.connect(function() {

    //   orb.on("error", function(err, data) {
    //     console.log ( err, data );
    //   });

    //   io.emit('sp_connected', {msg:'Sphero connected !'});

    //   orb.color("purple");

    //   orb.detectCollisions();

    //   orb.on("collision", function(data) {

    //     io.emit('sp_collision', {msg:'Sphero falled !'});

    //   });

    // });
   
    socket.on('hello', function() {
      console.log("  -> User says hello !")
    })

    socket.on('disconnect', function() {
      console.log('=> USER DISCONNECTED');
    });
  
  });

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

