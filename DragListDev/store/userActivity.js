/**
 * UserActivity Model for database schema
 * 
 * @exports User
 */
var mongoose = require('mongoose'),
Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

var activity =  new Schema({
	userID:{ type: ObjectId, required: true ,ref: 'User'},
	date:{type:Number,required:true},
	message:{ type: String ,required:true}
});

module.exports =  mongoose.model('UserActivity', activity);