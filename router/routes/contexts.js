var express = require('express');
var router = express.Router();
var Contexts = require('mongoose').model('contexts');


/* POST /api/v1/contexts/afterdate --> get context if the client has not the last version */
router.post('/afterdate', function (req, res) {
	var date = req.body.date;
	var owner = req.body.owner;
	date = new Date(date);
	
	// get context only if the client is not synchronized
	var query = {'owner' : owner, lastUpdate: { $gte: date }};
	var fields = {'owner' : 0};

	Contexts.find(query, fields, function (err,context){
	    if (err) {
			console.log(err.message);
			res.send(err.message);
	    } else {
			res.send(context);
		}
  	});

  	/* TEST 
		res.send("context details");
  	*/
});


/* POST /api/v1/contexts --> create a new context */
router.post('/', function (req, res) {
	var name = null || req.body.name;
	var owner = null || req.body.owner;
	var address = null || req.body.address;
	var lat = null || req.body.lat;
	var long = null || req.body.long;
	var lastUpdate = new Date();

	var valid = name || owner || address || lat || long;
	if (valid == null){
		res.send("invalid argument");
	} else {
		var context = new Contexts({
			'name' : name, 
			'owner' : owner,
			'address' : address, 
			'loc' : { 'type' : 'Point', 'coordinates' : [lat, long] },
			'lastUpdate' : lastUpdate
		});
		context.save(function(err){
			if (err){
				console.log(err);
				res.send(err);
			} else {
				res.send("context added");
				//res.end();
			}
		});
		
		/* TEST
		res.send("context added");
		*/
	}
});


/* PUT /api/v1/contexts/:contextid --> modify a context */
router.put('/:contextid', function (req, res) {
	var name = null || req.body.name;
	var address = null || req.body.address;
	var lat = null || req.body.lat;
	var long = null || req.body.long;
	var lastUpdate = new Date();
	var setUpdates = {};

	if (name != null)
		setUpdates.name = name;
	if (address != null)
		setUpdates.address = address;
	if (lat != null && long != null)
		setUpdates.loc = { 'type' : 'Point', 'coordinates' : [lat,long] }; //[lat, long];
	setUpdates.lastUpdate = new Date();

	Contexts.findByIdAndUpdate(req.params.contextid, { '$set': setUpdates }, function (err){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.send("context modified");
			//res.end();
		}
	});

	/* TEST
	res.send("context modified");
	*/
});

module.exports = router;