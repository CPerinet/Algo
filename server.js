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
 * Globals
 *
 */

 var directions = [];

 directions["UP"] = 0;
 directions["RIGHT"] = 90;
 directions["DOWN"] = 180;
 directions["LEFT"] = 270;

 //  var speed = 45;
 // var time = 500;



/**
 *
 * Router
 *
 */

var devMode = false;

router.get('/', function(req, res, next) {

  var io = require('socket.io')(server);

  io.on('connection', function(socket) {

    console.log('=> USER CONNECTED');

    if ( !devMode ) {

      orb = new sphero("/dev/tty.Sphero-BBY-AMP-SPP", {emitPacketErrors: true});

      orb.connect(function() {

        // Init color
        orb.color("blue");

        // Init events
        orb.detectCollisions();

        io.emit('sp_connected', {msg:'Sphero connected !'});

        socket.on('startCalibrate', function() {
          console.log("START CLAIBRATE");

          orb.startCalibration();
        })

        socket.on('endCalibrate', function() {
          console.log("END CLAIBRATE");

          orb.finishCalibration();
          orb.color("blue");
        })

        socket.on('roll', function(data) {
          console.log("ROLL");

          orb.color("yellow");
          doInstructions(data.message, io);

        })

        socket.on('stopRoll', function(data) {
          console.log("ROLL");

          orb.color("yellow");
          doInstructions(data.message, io);

        })

        // Error handler
        orb.on("error", function(err, data) {
          console.log ( err, data );
        });

      });

    }
   
    socket.on('hello', function() {
      console.log("  -> A girl says hello !")
    })

    socket.on('disconnect', function() {
      console.log('=> USER DISCONNECTED');
    });
  
  });

  res.render('index');

});


function doInstructions ( instructions, io ) {

  var index = 0;
  var prevDirection = 0;
  var currentDirection = 0;
  var to_rotate, to_roll, to_sleep;
  var isCollision = false;
  var isRolling = true;

  orb.on("collision", error);

  function init () {

    console.log('- new');

    currentDirection = directions[ instructions[index] ];

    // if ( prevDirection === currentDirection ) out();
    // else rotate();

    rotate()

  }

  if ( instructions.length > 0 ) init()

  function rotate () {

    console.log('-- rotate');

    orb.roll(0, currentDirection);
    prevDirection = currentDirection;
    to_rotate = setTimeout( roll, 100)

  }

  function roll () {

    console.log('-- roll');

    orb.roll(55, currentDirection);
    to_roll = setTimeout( sleep, 800);

  }

  function sleep () {

    console.log('-- sleep');

    orb.roll(0,currentDirection);
    to_sleep = setTimeout( end, 1500 );

  }

  function end () {

    console.log('-- end');

    index ++;

    if ( index < instructions.length ) init();
    else success();

  }

  function error () {

    if ( isRolling ) {

      console.log("-- collision");

      io.emit('sp_collision');
      orb.color("red");

      clear();

    }

  }

  function success () {

    if ( isRolling && !isCollision ) {

      console.log('-- success');

      io.emit('sp_success');
      orb.color("green");

      clear();

    }

  }

  function clear () {

    orb.roll(0, 0);

    clearTimeout(to_rotate);
    clearTimeout(to_roll);
    clearTimeout(to_sleep);

    isRolling = false;
    isCollision = false;

  }

}











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

