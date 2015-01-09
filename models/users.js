var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new Schema({
	//_id : Schema.Types.ObjectId,
	pseudo : String,
	email : { 
		type : String, 
		index : true 
	},
	geolocation : Boolean,
	language : String,
	lastUpdate : {
		type : Date,
		index : true 
	},
	lastSynchro : { 
		type : Date, 
		index : true 
	}
}, { collection: 'users' });

mongoose.model('users', usersSchema);