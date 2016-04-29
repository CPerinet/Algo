var express = require('express');
var router = express.Router();
var $ = require("jquery");
var request = require('request');

var sphero = require("sphero");
    orb = sphero("/dev/tty.Sphero-BBY-AMP-SPP"); // change port accordingly 



/**
 *
 * Home
 *
 */

router.get('/', function(req, res, next) {

	orb.connect(function() {

		orb.on("error", function(err, data) {
			console.log ( err, data );
		});

	  // roll Sphero forward 
	  orb.roll(100, 0);
	 
	  // turn Sphero green 
	  orb.color("green");
	 
	  // have Sphero tell you when it detect collisions 
	  orb.detectCollisions();
	 
	  // when Sphero detects a collision, turn red for a second, then back to green 
	  orb.on("collision", function(data) {
	    console.log("collision detected");
	    console.log("  data:", data);
	 
	    orb.color("red");
	 
	    setTimeout(function() {
	      orb.color("green");
	    }, 100);

	  });

	});

    res.render('index');

});


module.exports = router;
