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

router.get('/', function(req, res, next) {

  var io = require('socket.io')(server);
  var collision = false;

  io.on('connection', function(socket) {

    console.log('=> USER CONNECTED');

    //orb = new sphero("/dev/tty.Sphero-BBY-AMP-SPP", {emitPacketErrors: true});

  //   orb.connect(function() {

  //     // Init color
  //     orb.color("blue");

  //     // Init events
  //     orb.detectCollisions();



  //     io.emit('sp_connected', {msg:'Sphero connected !'});

      

  //     orb.on("collision", function(data) {

  //       io.emit('sp_collision');
  //       collision = true;
  //       console.log("COLLISION");
  //       orb.color("red");

  //     });

  //     socket.on('startCalibrate', function() {
  //       console.log("START CLAIBRATE");

  //       orb.startCalibration();
  //     })

  //     socket.on('endCalibrate', function() {
  //       console.log("END CLAIBRATE");

  //       orb.finishCalibration();
  //       orb.color("blue");
  //     })

  //     socket.on('roll', function(data) {
  //       console.log("ROLL");

  //       orb.color("yellow");
  //       doInstructions(data.message);

  //     })

  //     // Error handler
  //     orb.on("error", function(err, data) {
  //       console.log ( err, data );
  //     });

  //   });
   
    socket.on('hello', function() {
      console.log("  -> User says hello !")
    })

    socket.on('disconnect', function() {
      console.log('=> USER DISCONNECTED');
    });
  
  });

  res.render('index');

});


function doInstructions ( instructions ) {

  var index = 0;
  var prevDirection = 0;
  var currentDirection = 0;

  function init () {

    console.log('- new');

    var currentDirection = directions[ instructions[index] ];

    if ( prevDirection === currentDirection ) roll();
    else rotate();

  }

  function rotate () {

    console.log('-- rotate');

    orb.roll(100, currentDirection);
    prevDirection = currentDirection;
    setTimeout( roll, 100)

  }

  function roll () {

    console.log('-- roll');

    orb.roll(55, currentDirection);
    setTimeout( sleep, 575);

  }

  function sleep () {

    console.log('-- sleep');

    orb.roll(0,0);
    setTimeout( end, 1000 );

  }

  function end () {

    console.log('-- end');

    index ++;

    if ( index < array.length ) {

      init();

    } else success();

  } 

  function success () {

    console.log('-- success');

    io.emit('sp_success');
    orb.color("green");

  }

}



// var t1, t2;





// function collision () {

//   clearInterval(t1);
//   clearInterval(t2);

//   collision = true;

// }









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

