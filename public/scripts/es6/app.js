let socket;
let state;

jQuery(function($) {

	$(window).load( () => {


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
				console.log("-> Tuto init !")

				tuto.slideIndex = 0

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

				.staggerTo( tuto.dom.controls, 0.6, {y:200, autoAlpha: 0, ease : Expo.easeInOut}, 0.2, 0)
				.to( tuto.dom.create, 0.3, {autoAlpha: 0, ease: Expo.easeInOut}, 0.1)
				.to( tuto.dom.calibrate, 0.3, {autoAlpha: 0, ease: Expo.easeInOut}, 0.1)
				.set( tuto.dom.main, {autoAlpha: 0})

			},

			slide() {
				if ( tuto.slideIndex == 1 ) { // GO TO PROGRAM FROM CALIBRATE

					socket.emit('endCalibrate')

					tuto.hide(program.show)

				}

				else if ( tuto.slideIndex == 0 ) { // GO TO CALIBRATE FROM CREATE

					tuto.slideIndex ++;

					socket.emit('startCalibrate')

					let timelineShow = new TimelineMax()
					.to( tuto.dom.create, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
					.to( tuto.dom.calibrate, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})
				}
			},

			back() {
				if ( tuto.slideIndex == 0 ) tuto.hide(menu.show) // GO TO MENU FROM CREATE

				else if ( tuto.slideIndex == 1 ) { // GO TO CREATE FROM CALIBRATE

					tuto.slideIndex --;

					socket.emit('endCalibrate')

					let timelineShow = new TimelineMax()
					.to( tuto.dom.calibrate, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
					.to( tuto.dom.create, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})
					
				}
			}

		}

		tuto.init()





		/**
		 *
		 * Program
		 *
		 */
		
		let program = {

			instructions : [],
			sortables : [],
			playing : false,
			error : null,

			dom : {
				program : $("#program"),
				play : $("#program_play"),
				controls : $("#program_controls"),
				instructions : $("#program_instructions"),
				trash : $('#program_trash'),
				loop_more : $('.more'),
				loop_less : $('.less'),
				group : $("#program_group"),
				group_new : $('#program_new-group'),

				playing : $("#program_playing"),

				playing_section_roll : $("#playing_section_roll"),
				playing_cancel : $("#playing_cancel"),

				playing_section_success : $("#playing_section_success"),
				playing_reset : $("#playing_reset"),

				playing_section_fail : $("#playing_section_fail"),
				playing_correct : $("#playing_correct"),

				playing_section_calibrate : $("#playing_section_calibrate"),
				playing_continue : $("#playing_continue"),
			},

			init() {
				console.log("-> Program init !")

				program.dom.play.click(program.play)
				program.dom.program.click(program.unselect)
				program.dom.group_new.click(program.createFuntion)

				program.dom.playing_cancel.click(program.playingCancel)
				program.dom.playing_reset.click(program.playingReset)
				program.dom.playing_correct.click(program.playingCorrect)
				program.dom.playing_continue.click(program.playingContinue)

				$("body").on('click', ".more", (event) => {
					program.loop_change(event, 1)
				})
				
				$("body").on('click', ".less", (event) => {
					program.loop_change(event, -1)
				})

				$(document).on('click', '#program_instructions .instruction', (event) => {
					program.onInstructionClicked(event)
				})

				let sortable_i = new Sortable(program_instructions, {
				    group: {name:"group1", pull: true, put: true},
				    animation: 200,

				    scroll: program.dom.program[0],
				    scrollSensitivity: 130,
				    scrollSpeed: 20,

				    draggable: ".instruction",

				    ghostClass: "instruction_ghost",
    				chosenClass: "instruction_chosen",
    				fallbackClass: "instruction_fallback",

				    store: null,  // @see Store

				    onStart: function (/**Event*/evt) {
				        TweenLite.to( program.dom.trash, 0.2, { autoAlpha: 1 });

				        program.unselectAll()
				        program.updateFonction()
				    },

				    onEnd: function (evt) {
				        evt.oldIndex;
				        evt.newIndex;

				        TweenLite.to( program.dom.trash, 0.2, { autoAlpha: 0 });

				    	if ( program.dom.instructions.find('.instruction').length === 0 ) {
				    		TweenMax.to( program.dom.play, 0.2, {autoAlpha: 0});
				    	} else {
				    		TweenMax.to( program.dom.play, 0.2, {autoAlpha: 1});
				    	}
				    },

				    onAdd: function (evt) {
				        var instructionDropped = $(evt.item);

				        let scroll = instructionDropped.offset().left + program.dom.program.scrollLeft() - $(window).width() / 2;

				        TweenMax.killTweensOf( program.dom.program )
				        TweenMax.to( program.dom.program, 1, {scrollTo:{x: scroll, ease: Expo.easeOut }})

				        program.dom.instructions.find('.origin-fx').removeClass('origin-fx')

				        if ( program.dom.instructions.find('.instruction').length === 0 ) {
				    		TweenMax.to( program.dom.play, 0.3, {autoAlpha: 0});
				    	} else {
				    		TweenMax.to( program.dom.play, 0.3, {autoAlpha: 1});
				    	}
				    },

				    onSort: function (evt) {

				    },

				    onRemove: function (evt) {
				        
				    }
				});

				program.sortables.push( sortable_i )

				let sortable_c = new Sortable(program_controls, {
				    group: {name:"group1", pull: 'clone', put: false},
				    sort: false,
				    animation: 0,

				    scroll: program.dom.program[0],
				    scrollSensitivity: 130,
				    scrollSpeed: 20,

				    draggable: ".instruction",

				    ghostClass: "instruction_ghost",
    				chosenClass: "instruction_chosen",
    				fallbackClass: "instruction_fallback",

				    store: null,  // @see Store

				    onEnd: function (/**Event*/evt) {
				        evt.oldIndex;
				        evt.newIndex;

				        $("#program_controls .instruction_chosen").removeClass('instruction_chosen')

				        if ( $('.selected').length === 1 ) {

				        	program.unselectAll()

				        } else if ( $('.selected').length > 1 ) {

				        	program.dom.instructions.find('.instruction').eq( evt.newIndex ).addClass('selected')

				        	program.updateFonction()

				        }
				        
				    },

				    onRemove: function (/**Event*/evt) {
				        // same properties as onUpdate
				    }

				})

				program.sortables.push( sortable_c )

				let program_trash = document.getElementById("program_trash")

				let sortable_t = new Sortable(program_trash, {
				    group: {name:"group1", pull: false, put: true},
				    sort: false,
				    animation: 0,

				    ghostClass: "hover",
    				chosenClass: "hover",
    				fallbackClass: "hover",

				    store: null,  // @see Store

				    onRemove: function (/**Event*/evt) {
				        // same properties as onUpdate
				    },

				    onAdd () {

				    	if ( program.dom.trash.find('.origin-fx').length != 0 ) {
				    		program.deleteFunction()
				    	}

				    }

				})

				program.sortables.push( sortable_t )

				let sortable_g = new Sortable(program_group, {
				    group: {name:"group1", pull: 'clone', put: false},
				    animation: 0,

				    draggable: ".instruction",

				    ghostClass: "instruction_ghost",
    				chosenClass: "instruction_chosen",
    				fallbackClass: "instruction_fallback",

				    store: null,  // @see Store

				    onStart: function (/**Event*/evt) {
				        // TweenLite.to( program.dom.trash, 0.2, { autoAlpha: 1 });

				        // program.unselectAll()
				        // program.updateFonction()
				        TweenLite.to( program.dom.trash, 0.2, { autoAlpha: 1 })
				    },

				    onEnd: function (evt) {

				     	TweenLite.to( program.dom.trash, 0.2, { autoAlpha: 0 })

				    	// if ( program.dom.instructions.find('.instruction').length === 0 ) {
				    	// 	TweenMax.to( program.dom.play, 0.2, {autoAlpha: 0});
				    	// } else {
				    	// 	TweenMax.to( program.dom.play, 0.2, {autoAlpha: 1});
				    	// }
				    },

				    onSort: function (evt) {

				    },

				    onRemove: function (evt) {
				        
				    }
				});

				program.sortables.push( sortable_g )

			},

			show() {
				console.log("-> Program show !")

				TweenMax.to( program.dom.program, 0.3, { autoAlpha: 1, ease: Expo.easeInOut})

			},

			onInstructionClicked(event) {
				let el = $(event.target)

				if ( !el.hasClass('more') && !el.hasClass('less') ) {

					if ( el.hasClass('selected') ) { // UNSELECT
						el.removeClass('selected')

						if ( program.dom.instructions.find('.selected').length === 0 ) { // IF IT WAS THE LAST ONE, HIDE LOOP

							$('.addMore').removeClass('addMore')
							program.dom.instructions.removeClass('selectionMode')

						} else if ( program.dom.instructions.find('.selected').length === 1 ) { // IF THERE IS ONLY ONE LEFT, HIDE FX AND DISPLAY LOOP

							$('.selected').addClass('addMore')

						}

					} else if ( !el.hasClass('selected')) {
						

						if ( program.dom.group.children('.instruction').length != 0 ) { // IF ALREADY A GROUP

							program.unselectAll()

						}

						el.addClass('selected')

						if ( program.dom.instructions.find('.selected').length > 1 ) { // IF THERE IS MORE THAN ONE SELECTED, HIDE LOOP DISPLAY FX

							$('.addMore').removeClass('addMore')

						} else { // IF HE IS THE FIRST ONE, SHOW LOOP
							
							$('.selected').addClass('addMore')
							program.dom.instructions.addClass('selectionMode')

						}

					}

				}

				program.updateFonction()

			},

			loop_change(event, amount) {

				let el = $(event.target).parent()

				let loops = parseInt(el.attr("data-loop")) + amount

				if ( loops > 0 && loops < 10 ) el.attr("data-loop", loops )

			},

			updateFonction () {

				let selected = $('.selected')

				if ( selected.length > 1 ) {

					var pos = $( selected[0] ).offset().left + 40  + program.dom.program.scrollLeft()// - $(window).width()
					var width = $(selected[ selected.length - 1 ]).offset().left - $(selected[0]).offset().left

					TweenLite.to( program.dom.group_new, 0.2, { x : pos, width: width, autoAlpha: 1 })

				} else {

					TweenLite.to( program.dom.group_new, 0.2, { autoAlpha: 0 });

				}

			},

			createFuntion () {

				let els = program.dom.instructions.find('.selected')
				let el = els.eq(0)

				program.unselectAll()
				program.updateFonction()

				let directions = []

				els.each( (index, value) => {
					let direction = els.eq(index).attr("data-direction")
					let loops = els.eq(index).attr("data-loop")

					for ( var i = 0; i < loops; i ++ ) {
						directions.push( direction )
					}
					
				})

				el.addClass('function')
				el.attr('data-type', 'fx')
				el.attr('data-direction', directions.toString() )
				el.attr('data-loop', 1 )


				el.clone().appendTo( program.dom.group )

				program.dom.group.find( '.instruction' ).addClass( 'origin-fx' )

				TweenLite.to( els.not(':eq(0)'), 0.3, { scale: 0, autoAlpha: 0, ease: Expo.easeInOut, onComplete() {
					(this.target).remove()
				}})
			},

			deleteFunction () {

				TweenMax.staggerTo( $('.function'), 0.3, { scale: 0, autoAlpha: 0, onComplete() {
					(this.target).remove()
				}})

			},

			unselectAll() {

				$('.selectionMode').removeClass('selectionMode')
				$('.selected').removeClass('selected')
				$('.addMore').removeClass('addMore')

			},

			unselect(event) {

				if ( $(event.target).is( $("#program_instructions") ) ) {
					program.unselectAll()
					program.updateFonction()
				}

			},

			play() {

				program.playing = true

				program.instructions = []
				program.dom.instructions.find('.instruction').each( (index, el) => {

					let inst = $(el)
					let direction = inst.attr("data-direction")
					let loop = inst.attr("data-loop")

					for ( let i = 0; i < loop; i++ ) {
						program.instructions.push(direction);
					}
				})

				program.dom.program.addClass('blur')

				let timeline = new TimelineMax()
				.to(program.dom.playing, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})
				.to(program.dom.playing_section_roll, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})
				

				socket.emit('roll', { message: program.instructions })
			},

			// ROLL
			playingCancel() {
				socket.emit('stopRoll')

				let timeline = new TimelineMax()
				.to(program.dom.playing_section_roll, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
				.to(program.dom.playing_section_calibrate, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})

				socket.emit('startCalibrate')
			},
			
			// SUCCESS
			onSuccess(data) {

				if ( program.playing ) {
					let timeline = new TimelineMax()
					.to(program.dom.playing_section_roll, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
					.to(program.dom.playing_section_success, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})	
				}
				
			},

			playingReset() {
				program.dom.instructions.empty()

				let timeline = new TimelineMax()
				.to(program.dom.playing_section_success, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
				.to(program.dom.playing_section_calibrate, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})

				socket.emit('startCalibrate')
			},

			// FAIL
			onCollision(data) {

				if ( program.playing ) {

					let timeline = new TimelineMax()
					.to(program.dom.playing_section_roll, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
					.to(program.dom.playing_section_fail, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})	
				}
				
			},

			playingCorrect() {

				//
				// CIBLER ERREUR ET Y SCROLLER
				//


				let timeline = new TimelineMax()
				.to(program.dom.playing_section_fail, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
				.to(program.dom.playing_section_calibrate, 0.3, {autoAlpha: 1, ease: Expo.easeInOut})

				socket.emit('startCalibrate')
			},

			// CALIBRATE
			playingContinue() {

				socket.emit('endCalibrate')

				program.playing = false

				program.dom.program.removeClass('blur')

				let timeline = new TimelineMax()
				.to(program.dom.playing_section_calibrate, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})
				.to(program.dom.playing, 0.3, {autoAlpha: 0, ease: Expo.easeInOut})				
			},



			hide() {
				console.log("-> Program hide !")

				TweenMax.to( program.dom.program, 0.3, { autoAlpha: 0, ease: Expo.easeInOut})

			}

		}

		program.init()



		/**
		 *
		 * Init
		 *
		 */		

		function init() {

			//
			// IPAD
			   
			FastClick.attach(document.body);


			//
			// SOCKET

			socket = io.connect(window.location.href)
			socket.emit('hello', { message: 'hello'})

			socket.on('sp_success', () => {
				program.onSuccess()
			})
				
			socket.on('sp_collision', () => {
				program.onCollision()
			})


			//
			// DISPLAY SHOW

			splash.show()

		}

		init()

	})

})