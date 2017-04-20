var mongoose = require('mongoose');


var logSchema = new mongoose.Schema({
	listTime: [],
	messageTime: [], //An entry of "*" signifies all userss
	totalTime : [],
	statusList : [],
	statusMessage : [],
	id : Number
},{ collection: 'customlog' });
logSchema.set('versionKey', false);
module.exports = mongoose.model('logModel', logSchema);