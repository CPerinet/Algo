"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

jQuery(function ($) {

	$(window).load(function () {

		/**
   *
   * General
   *
   */

		var state = 0;

		var dom = {

			splash: $("#splash")

		};

		/**
   *
   * Socket
   *
   */

		var socket = io.connect('http://localhost:3700');

		function init() {
			console.log("INIT");

			dom.each(function (el, value) {
				console.log(el);
				console.log(value);
			});
		}

		var Splash = function () {
			function Splash(dom) {
				_classCallCheck(this, Splash);

				this.el = dom;
			}

			_createClass(Splash, [{
				key: "hide",
				value: function hide() {}
			}, {
				key: "show",
				value: function show() {

					console.log(dom);
				}
			}]);

			return Splash;
		}();

		var splash = new Splash(dom.splash);
	});
});

// socket.on('sp_connect', function (data) {
//        if(data) {
//        	console.log(data);
//        }
//        else console.log("There is a problem:", data)
//    })

//    $(".send").click( () => {
//    	socket.emit('send', { message: $(".field").val() })
//    })