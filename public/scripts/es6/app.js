let socket;
let state;

jQuery(function($) {

	$(window).load( () => {

		/**
		 *
		 * General
		 *
		 */

		//let state = 0




		/**
		 *
		 * Splash
		 *
		 */

		let splash = {

			dom : {
				main : $("#splash"),
				logo : $(".splash_logo"),
				next : $(".splash_next")
			},

			show() {
				console.log("-> Splash show !")

				state = 0


				//
				// EVENTS

				splash.dom.main.on('click', () => {
					splash.hide( menu.show )
				})


				//
				// ANNIMATION

				let timelineShow = new TimelineMax()

				.set( splash.dom.main, {autoAlpha: 1})
				.to( this.dom.logo, 0.8, {autoAlpha : 1, ease : Expo.easeInOut})
				.to( this.dom.next, 1.3, {y: 0, ease : Expo.easeInOut}, 0.3)

			},

			hide(callback) {
				console.log("-> Splash hide !")


				//
				// EVENTS

				splash.dom.main.off("click")


				//
				// ANNIMATION

				let timeline = new TimelineMax({
					onComplete() {

						if ( typeof callback === "function" ) callback()

					}
				})

				.to( splash.dom.next, 0.6, {y: 200, ease : Expo.easeInOut})
				.to( splash.dom.logo, 0.6, {autoAlpha : 0, y: -100, ease : Expo.easeInOut}, 0)
				.set( splash.dom.main, {autoAlpha: 0})
				
			}

		}


		let menu = {

			dom : {
				main : $("#menu"),
				items : $("#menu .btn"),
				start : $("#menu_start"),
				config : $("#menu_config"),
				about : $("#menu_about"),
				quit : $("#menu_quit")
			},

			init() {
				console.log("-> Menu init !")

				menu.dom.quit.click( () => {
					menu.hide( menu.quit )
				})

				menu.dom.start.click( () => {
					menu.hide( tuto.show )
				})


			},

			show() {
				console.log("-> Menu show !")

				state = 1

				//
				// ANNIMATION

				let timelineShow = new TimelineMax()

				.set( menu.dom.main, {autoAlpha: 1})
				.set( menu.dom.items, {y: 10})
				.staggerTo( menu.dom.items, 0.8, {y: 0, autoAlpha: 1,  ease: Elastic.easeOut.config(1, 0.5)}, 0.1, 0)
			},

			hide(callback) {
				console.log("-> Menu hide !")

				let timeline = new TimelineMax({
					onComplete() {

						if ( typeof callback === "function") callback()

					}
				})

				.staggerTo( menu.dom.items, 0.4, {y: 0, autoAlpha: 0,  ease: Expo.easeInOut}, -0.07)
				.set( menu.dom.main, {autoAlpha: 0})
			},

			quit() {
				console.log("-> App Quit !")

				//window.top.close();
			}
		}

		menu.init()




		/**
		 *
		 * Tuto
		 *
		 */
		
		let tuto = {

			dom : {
				main : $("#tuto"),
				create : $("#tuto_create"),
				calibrate : $("#tuto_calibrate"),
				controls : $("#tuto_controls .btn"),
				video : $("#tuto_video"),
				back : $("#tuto_back"),
				next : $("#tuto_next")
			},

			init() {

				tuto.slide = 0

				tuto.dom.back.click(tuto.back)
				tuto.dom.next.click(tuto.slide)

			},

			show() {
				console.log("-> Tuto show !")

				state = 2

				//
				// ANNIMATION

				let timelineShow = new TimelineMax()

				.set( tuto.dom.main, {autoAlpha: 1})
				.to( tuto.dom.create, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})
				.staggerTo( tuto.dom.controls, 0.6, {y:0, autoAlpha: 1, ease : Expo.easeInOut}, 0.1, 0)

			},

			hide(callback) {
				console.log("-> Tuto hide !")

				let timelineShow = new TimelineMax({
					onComplete() {

						if ( typeof callback === "function" ) callback()

					}
				})

				.staggerTo( tuto.dom.controls, 0.6, {y:200, autoAlpha: 0, ease : Expo.easeInOut}, 0.2)
				.set( tuto.dom.main, {autoAlpha: 0})

			},

			slide() {
				if ( tuto.slide == 1 ) tuto.hide(program.show)
				else if ( tuto.slide == 0 ) {
					let timelineShow = new TimelineMax()


				}
			},

			back() {
				if ( tuto.slide == 0 ) tuto.hide(menu.show)
				else if ( tuto.slide == 1 ) {

				}
			}

		}

		tuto.init()





		/**
		 *
		 * Init
		 *
		 */		

		function init() {

			console.log( "INIT")

			//
			// IPAD
			   
			FastClick.attach(document.body);


			//
			// SOCKET

			socket = io.connect('http://localhost:3700')
			socket.emit('hello', { message: 'hello'})


			//
			// DISPLAY SHOW

			splash.show()

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