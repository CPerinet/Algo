
jQuery(function($) {

	$(window).load( () => {

		/**
		 *
		 * General
		 *
		 */

		let state = 0

		let dom = {

			splash : $("#splash")

		}


		/**
		 *
		 * Socket
		 *
		 */
		
		var socket = io.connect('http://localhost:3700')

		function init() {
			console.log( "INIT")

			$.each( dom, (key, value) => {

				TweenLite.set(value, {autoAlpha: 0})

				console.log(value)
			})
		}


	})

})



		// socket.on('sp_connect', function (data) {
	 //        if(data) {
	 //        	console.log(data);
	 //        }
	 //        else console.log("There is a problem:", data)
	 //    })

	 //    $(".send").click( () => {
	 //    	socket.emit('send', { message: $(".field").val() })
	 //    })