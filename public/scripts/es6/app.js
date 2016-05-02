let socket;
let state;

jQuery(function($) {

	$(window).load( () => {

		/**
		 *
		 * General
		 *
		 */

		state = 0



		/**
		 *
		 * Init
		 *
		 */		

		function init() {

			console.log( "INIT")

			socket = io.connect('http://localhost:3700')
			socket.emit('hello', { message: 'hello'})

			// $.each( dom, (key, value) => {

			// 	TweenLite.set(value, {autoAlpha: 0})

			// 	console.log(value)
			// })



		}

		init()


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