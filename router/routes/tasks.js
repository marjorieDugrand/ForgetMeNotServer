var express = require('express');
var router = express.Router();
var Tasks = require('mongoose').model('tasks');
var Contexts = require('mongoose').model('contexts');

/* GET /api/v1/tasks/bygeolocation/:userid/:lat/:long */
router.get('/bygeolocation/:userid/:lat/:long', function (req, res){
	var location = { type : 'Point', coordinates : [req.params.lat, req.params.long]};
	var id = req.params.userid;

	Contexts.find({ 'owner' : id, 'loc' : { $near : location } }, { '_id': 1}).lean().exec(function(err, contexts) {
		if (err) {
			console.log(err);
			res.send(err);
		}
		else {
			var ids = [];
			for (var i = 0; i < contexts.length; i++) {
				ids[i] = contexts[i]._id;
			};

			Tasks.find({ 'context': {$in: ids} }, {'context' : 0, 'owner' : 0, '__v' : 0}, function (err, tasks){
				if (err){
					console.log(err);
					res.send(err);
				} 
				else {
					res.send(tasks);
				}
			});
		}
	})
});

/* POST /api/v1/tasks/afterdate --> get task if the client has not the last version */
router.post('/afterdate', function (req, res) {
	var date = req.body.date;
	var owner = req.body.owner;
	date = new Date(date);
	
	var query = { 'owner' : owner, lastUpdate: { $gte: date } };
	var fields = { 'owner' : 0 };
	var opts = { '_id' :0, 'name' : 1, }; // location address' };

	Tasks.find(query, fields).populate('context', opts).exec(function (err,tasks){
	    if (err) {
			console.log(err.message);
			res.send(err.message);
	    } else {
			if (err) {
				console.log(err.message);
				res.send(err);
			} else {
				res.send(tasks);
			}
		}
  	});

  	/* TEST 
		res.send("context details");
  	*/
});

/* POST /api/v1/tasks --> create a new task */
router.post('/', function (req, res) {
	var name = null || req.body.name;
	var owner = null || req.body.owner;
	var description = null || req.body.description;
	var context = null || req.body.context;
	var dueDate = null || req.body.dueDate;
	var duration = null || req.body.duration;
	var priority = 0 || req.body.priority;
	var label = null || req.body.label;
	var progress = 0 || req.body.progress;
	var lastUpdate = new Date();

	var valid = name || owner;
	if (valid == null){
		res.send("invalid argument");
	} else {
		var task = new Tasks({
			'name' : name, 
			'owner' : owner,
			'description' : description,
			'context' : context,
			'dueDate' : dueDate,
			'duration' : duration,
			'priority' : priority,
			'label' : label,
			'progress' : progress,
			'lastUpdate' : lastUpdate
		});
		task.save(function(err){
			if (err){
				console.log(err);
				res.send(err);
			} else {
				res.end();
			}
		});
		
		/* TEST
		res.send("task added")
		*/
	}
});

/* PUT /api/v1/tasks/:taskid --> modify a task */
router.put('/:taskid', function (req, res) {
	var name = null || req.body.name;
	var owner = null || req.params.owner;
	var description = null || req.body.description;
	var context = null || req.body.context;
	var dueDate = null || req.body.dueDate;
	var duration = null || req.body.duration;
	var priority = null || req.body.priority;
	var label = null || req.body.label;
	var progress = null || req.body.progress;
	var lastUpdate =  new Date();
	var setUpdates = {};

	if (name != null)
		setUpdates.name = name;
	if (owner != null)
		setUpdates.owner = owner;
	if (description != null)
		setUpdates.description = description;
	if (context != null)
		setUpdates.context = context;
	if (dueDate != null)
		setUpdates.dueDate = dueDate;
	if (duration != null)
		setUpdates.duration = duration;
	if (priority != null)
		if (priority >= 0 && priority <= 3)
		setUpdates.priority = priority;
	if (label != null)
		setUpdates.label = label;
	if (progress != null)
		if (progress >= 0 && progress <= 100)
			setUpdates.progress = progress;
	setUpdates.lastUpdate = new Date();

	Tasks.findByIdAndUpdate(req.params.taskid, { '$set': setUpdates }, function (err){
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.end()
		}
	});

	/* TEST
	res.send("task modified");
	*/
});


/* DELETE /api/v1/tasks/:taskid --> suppress a task */
router.delete('/:taskid', function (req, res) {
	var id = req.params.taskid;
	Tasks.findByIdAndRemove(id, function (err) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.end();
		}
	});

	/* TEST
	res.send("task deleted");
	*/
});

module.exports = router;