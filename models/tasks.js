var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tasksSchema = new Schema({
	//_id : Schema.Types.ObjectId,
	name : {
		type : String,
		required : true
	},
	owner : { 
		type: Schema.Types.ObjectId,
		ref: 'users',
		required : true,
		index : true 
	},
	description : String,	
	context : { 
		type: Schema.Types.ObjectId, 
		ref: 'contexts', 
		index : true 
	},
	dueDate : Date,
	duration : Number,
	priority : Number,
	label : String,
	progress : Number,
	lastUpdate : { 
		type : Date, 
		index : true 
	}
}, { collection: 'tasks' });

module.exports = mongoose.model('tasks', tasksSchema);