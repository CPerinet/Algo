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

 var speed = 50;
 var time = 500;



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

    // orb = new sphero("/dev/tty.Sphero-BBY-AMP-SPP");

    // orb.connect(function() {

    //   orb.on("error", function(err, data) {
    //     console.log ( err, data );
    //   });

    //   io.emit('sp_connected', {msg:'Sphero connected !'});

    //   orb.detectCollisions();

    //   orb.on("collision", function(data) {

    //     io.emit('sp_collision', {msg:'Sphero falled !'});

    //     console.log(orb);
    //     orb.color("red");

    //   });

    //   socket.on('startCalibrate', function() {
    //     console.log("  -> START CLAIBRATE !");

    //     orb.startCalibration();
    //   })

    //   socket.on('endCalibrate', function() {
    //     console.log("  -> END CLAIBRATE !");

    //     orb.finishCalibration();
    //     orb.color("green");
    //   })

    //   socket.on('roll', function(data) {
    //     console.log("  -> ROLL !!!!!");

    //     rollFor(data.message);

    //     orb.color("blue");
    //   })

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
 * ROLLFOR
 *
 */


function rollFor (array) {

  var interval, i = 0;

  function dostuff() {
      
      if(i <= array.length ) { 

        if ( i == array.length ) {

          orb.roll(0, 0);

        } else {

          var direction = directions[array[i]];
          console.log(direction)

          orb.roll(speed, direction);

        }

        i++;

      }

      else clearInterval(interval);
  }

  interval = setInterval(dostuff, time);

}





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

