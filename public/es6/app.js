
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

			dom.each( (el, value) => {
				console.log(el)
				console.log(value)
			})
		}

		class Splash {

			constructor(dom) {
				this.el = dom
			}

			hide() {

			}

			show() {

				console.log(dom)

			}

		} 

		let splash = new Splash(dom.splash)

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