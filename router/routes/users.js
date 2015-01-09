var express = require('express');
var router = express.Router();
var Users = require('mongoose').model('users');

/* POST /api/v1/users/afterdate/:userid --> get user parameters if the client has not the last version */
router.post('/afterdate/:userid', function (req, res) {
	var date = req.body.date;
	date = new Date(date);
	// get user parameters only if the client is not synchronized
	var query = {'_id' : req.params.userid, lastUpdate: { $gte: date }};
	Users.find(query, function (err,user){
	    if (err) {
			console.log(err.message);
			res.send(err.message);
	    } else {
			res.send(user);
		}
  	});
  	
  	/* TEST 
		res.send("user parameters");
  	*/
});

/* POST /api/v1/users --> create a new user */
router.post('/', function (req, res) {
	var pseudo = null || req.body.pseudo;
	var email = null || req.body.email;
	var geolocation = null || req.body.geolocation;
	var language = null || req.body.language;
	var lastUpdate = new Date();
	var lastSynchro = lastUpdate; // first synchronization

	var valid = pseudo || email || geolocation || language;
	if (valid == null){
		res.send("invalid argument");
	} else {
		var user = new Users({
			'pseudo' : pseudo, 
			'email' : email, 
			'geolocation' : geolocation, 
			'language' : language,
			'lastUpdate' : lastUpdate,
			'lastSynchro' : lastSynchro
		});
		user.save(function(err){
			if (err){
				console.log(err);
				res.send(err);
			} else {
				res.send({'userid': user.id});
			}
		});
		
		/* TEST
		res.send("user added")
		*/
	}
});

/* PUT /api/v1/users/:userid --> modify a user */
router.put('/:userid', function (req, res) {
	var pseudo = null || req.body.pseudo;
	var geolocation = null || req.body.geolocation;
	var language = null || req.body.language;
	var date = null || req.body.date;
	var updates = {};

	if (pseudo != null)
		updates.pseudo = pseudo;
	if (geolocation != null)
		updates.geolocation = geolocation;
	if (language!= null)
		updates.language = language;
	if (date != null)
		updates.lastSynchro = date;
	updates.lastUpdate = new Date();

	Users.findByIdAndUpdate(req.params.userid, { $set: updates }, function (err){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.end();
		}
	});

	/* TEST
	res.send("user modified");
	*/
});

module.exports = router;