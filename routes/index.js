var express = require('express');
var router = express.Router();
var $ = require("jquery");

var request = require('request');
var sphero = require("sphero");
var orb = new sphero("/dev/tty.Sphero-BBY-AMP-SPP", {emitPacketErrors: true, timeout: 300});


/**
 *
 * Home
 *
 */

router.get('/', function(req, res, next) {
	var strings = ["rad", "bla", "ska"]
    var n = Math.floor(Math.random() * strings.length)
    res.send(strings[n])


    res.render('index');
});



/**
 *
 * Tutorial
 *
 */

router.get('/tuto', function(req, res, next) {
	res.render('tuto');
});


/**
 *
 * Program
 *
 */

router.get('/program', function(req, res, next) {
	res.render('program');
});



/**
 *
 * Roll
 *
 */

router.get('/roll', function(req, res, next) {

	orb.connect(function() {

		orb.on("error", function(err, data) {
			console.log ( err, data );
		});

		orb.color("purple");

		orb.detectCollisions();

		orb.on("collision", function(data) {

			orb.color("red");
		 
		    setTimeout(function() {
				
				res.redirect('/')

			}, 100);

		});

		res.render('roll');

	});

});






module.exports = router;
