var express = require('express');
var router = express.Router();
var $ = require("jquery");
var request = require('request');


/**
 *
 * Home
 *
 */

router.get('/', function(req, res, next) {

	if ( req.session.user ) {

	 	res.redirect('/dashboard');

	 	return false;
	}

    var db = req.db;

    var errors;

    if ( req.session.errors ) {
    	errors = req.session.errors;
    	req.session.errors = null;
    }

    res.render('index', {
       "errors" : errors
    });

});





/**
 *
 * Signup
 *
 */

router.post('/signup', function(req, res) {

	var db = req.db;

	var collection = db.get('users');

	var username = req.body.sign_user;

	var password = req.body.sign_pass;

	var id = req.body.sign_id;


	collection.find({"username" : username}, function(err, doc) {

		if ( err ) {

			res.send("Erreur de connexion à la base de donnée.")

		} else {

			var errors = [];

			if ( doc.length != 0 ) {
				errors.push("Le nom d'utilisateur existe déjà.")
			}

			if ( username.length <= 6 || username.length >= 25 ) {
				errors.push("Le nom d'utilisateur doit contenir entre 6 et 25 caractères.")
			}

			if ( password.length <= 6 || password.length >= 25 ) {
				errors.push("Le mot de passe doit contenir entre 6 et 25 caractères.")
			}

			if ( id.length != 4 ) {
				errors.push("L' ID est doit être composé de 4 caratères.")
			}

			if ( errors.length == 0 ) {

				addUser();

			} else {

				req.session.errors = errors;
				res.redirect( "/" );

			}

		}

	});

	function addUser() {

		collection.insert({
			"username": username,
			"password": password,
			"printer_id": id
		}, function(err, doc) {
			if ( err ) {
				res.send("Problème lors de l'ajout dans la base de donnée :/");
			} else {

				req.session.user = {
					"id" : doc._id,
					"username" : username,
					"printer_id" : id
				}

				res.redirect('/dashboard');

			}
		});

	}

});





/**
 *
 * Log-in
 *
 */

router.post('/login', function(req, res) {

 	var db = req.db;

	var collection = db.get('users');

	var username = req.body.conn_user;

	var password = req.body.conn_pass;

	collection.find({
		"username" : username,
		"password" : password },

		function(err, doc) {

			if ( err ) {

				res.send("Erreur lors de la connexion à la base de donnée.");

			} else if ( doc.length != 0 ) {

				req.session.user = {
					"id" : doc[0]._id,
					"username" : username,
					"printer_id" : doc[0].printer_id
				}

				res.redirect('/dashboard');

			} else {

				req.session.errors = ["Mauvais nom d'utilisateur ou mot de passe."];
				res.redirect('/');

			}

		}
	)

});





/**
 *
 * Log-out
 *
 */

router.get('/logout', function(req, res, next) {

	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder a cette page."];
	 	res.redirect('/');

	 	return false;
	}

	req.session.destroy(function(err) {

	  if ( err ) {
	  	res.send( "Un problème est survenu lors de la destruction de la session.");
	  } else {
	  	res.redirect("/");
	  }

	});
});



/**
 *
 * Dashboard
 *
 */

router.get('/dashboard', function(req, res, next) {

 	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder au dashboard."];
	 	res.redirect('/');
	}

 	var db = req.db;

	var modulesCollection = db.get('modules');
	var usersCollection = db.get('users');

	usersCollection.findOne({ _id : req.session.user.id}, function(err, doc) {
		if ( err ) res.send( err )

		else {

			var userModules = doc.module;

			modulesCollection.find( {}, function(err, doc) {

				if ( err ) res.send( err )

				else {

					var modules = [];
					var umodules = [];
					//var userModules = [];

					for ( var j = 0; j < doc.length; j++ ) {

						var t = doc[j];

						if ( userModules ) {
							for ( var k = 0; k < userModules.length; k++ ) {

								if ( t._id == userModules[k].id ) {

									t.state = userModules[k].state;
									t.userParams = userModules[k].params;

									break;
								}

							}
						}						

						if ( t.state ) umodules.push( t );
						else modules.push( t );
					}

					res.render('dashboard', {
				 		"title" : "Dashboard",
				 		"session" : req.session.user,
				 		"modules" : modules,
				 		"umodules" : umodules
				 	});
				}

			})

		}

	})

});





/**
 *
 * Add Page
 *
 */

 router.get('/add/:id', function(req, res, next) {

 	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder au dashboard."];
	 	res.redirect('/');

	 	return false;
	}

 	var id = req.params.id;

 	var db = req.db;

 	var modules = db.get('modules');

 	modules.findOne( {"_id" : id}, function(err, doc) {

 		if ( err ) {

 			console.log( "Problème de connexion à la base de donnée." );

 		} else {

			res.render('addmodule', {
	 			"title" : "Ajouter " + doc.name,
	 			"module" : doc
	 		});

 		}
 		
 	});

 });





/**
 *
 * Add POST
 *
 */

router.post('/postaddmodule/:id', function(req, res) {

	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder a cette page."];
	 	res.redirect('/');

	 	return false;
	}

	var db = req.db;
	var users = db.get('users');

	var p = req.body;
	var params = [];
	
	for ( i = 0; i < Object.keys(p).length; i++ ) {

		var sortedKeys = Object.keys(p).sort();
		
		params.push( p[sortedKeys[i]] );

	}

	var newmodule = {
		id : req.params.id,
		state : 1,
		params : params
	}
	
	users.update( {"_id": req.session.user.id }, { $push : {module : newmodule }}, function(err, doc) {
		if ( err ) {
			res.send(err);
		} else {
			res.redirect('/dashboard');
		}
	});

});





/**
 *
 * State
 *
 */

 router.get('/state/:id/:state', function(req, res, next) {

 	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder a cette page."];
	 	res.redirect('/');

	 	return false;
	}

	var db = req.db;
	var usersCollection = db.get('users');

 	var user_id = req.session.user.id;
 	var module_id = req.params.id;
 	var new_state = req.params.state;

 	console.log(user_id);
 	console.log(module_id);
 	console.log(new_state);

 	usersCollection.update({ "_id" : user_id, "module.id" : module_id }, { $set : { "module.$.state" : new_state } }, function(err, doc) {
 		if ( err ) res.send( err );

 		else {
 			res.redirect('/dashboard');
 		}

 	});



 });





/**
 *
 * Remove
 *
 */

router.get('/remove/:id', function(req, res, next) {

	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder a cette page."];
	 	res.redirect('/');

	 	return false;
	}

	var db = req.db;
	var users = db.get('users');

	var module_id = req.params.id;
	var user_id = req.session.user.id;

	users.update({ "_id" : user_id }, {

		$pull : { "module" : { "id" : module_id } }

	}, function(err, doc) {

		if ( err ) res.send( err );

		else {
			res.redirect('/dashboard');
		} 
	});

});





/**
 *
 * API
 *
 */

 router.get('/api/:id', function(req, res, next) {

 	if ( !req.session.user ) {
		req.session.errors = ["Vous devez être connecté pour accéder a cette page."];
	 	res.redirect('/');

	 	return false;
	}

 	var db = req.db;
	var usersCollection = db.get('users');

 	var user_id = req.session.user.id;
 	var module_id = req.params.id;
 	
 	usersCollection.findOne({ _id : user_id }, function(err, doc) {
 		if ( err ) res.send( err );

 		else {

 			var module_state;
 			var module_params;

 			for ( var i = 0; i < doc.module.length; i++ ) {
 				if ( doc.module[i].id == module_id ) {
 					module_params = doc.module[i].params;
 					module_state = doc.module[i].state;
 					break;
 				}
 			}

			request('http://api.openweathermap.org/data/2.5/forecast?q=' + module_params[0] + ',us&mode=json&appid=5fb2f66679b1eb87e445b6f3a3340b11', function (error, response, body) {
			  if (!error && response.statusCode == 200) {

			  	var temp = [];
			  	var sky = [];
			  	var data = JSON.parse(body);

			  	var respond = {
			  		id : module_id,
 					state : module_state
			  	}

			  	if ( module_state == 0 ) {

			  		respond.error = "Modulé désactivé.";

			  	} else if ( module_state == 1 ) {

			  		getData(1);

			  	} else if ( module_state == 2 ) {

			  		getData(3);

			  	} else if ( module_state == 3 ) {

			  		getData(7);

			  	}

			  	if ( module_state != 0 ) {
			  		respond.body = {
				  		temp : temp,
				  		sky : sky
				  	};
			  	}

			  	function getData (days) {

			  		for ( var i = 0; i < days; i ++ ) {

			  			if ( module_params[1] == "C" ) {

			  				temp.push( Math.round( data.list[i].main.temp - 273.15 ) );

				  		} else if ( module_params[1] == "F" ) {

				  			temp.push( Math.round( ( data.list[i].main.temp - 273.15 ) * 1.8 + 32 ) );

				  		}

				  		sky.push( data.list[i].weather[0].main );
			  		}

			  	}

		        res.send( respond );
			  }
			})

 		}
 	})

 	// http://api.openweathermap.org/data/2.5/forecast?q=Nantes,us&mode=json&appid=5fb2f66679b1eb87e445b6f3a3340b11



 });




module.exports = router;
