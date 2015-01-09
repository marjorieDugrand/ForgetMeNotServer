var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contextsSchema = new Schema({
	//_id : Schema.Types.ObjectId,
	name : { 
		type : String, 
		index : true 
	},
	owner : {
		type: Schema.Types.ObjectId,
		ref: 'users',
		index : true
	},
	loc : {
      	type: { type: String }, 
      	coordinates: []
    },
	// location : {
	// 	type : [Number], 
	// 	index: '2d'
	// },
	address : String,
	lastUpdate : { 
		type : Date, 
		index : true 
	}
}, { collection: 'contexts' });

contextsSchema.index({ loc : '2dsphere' });

mongoose.model('contexts', contextsSchema);