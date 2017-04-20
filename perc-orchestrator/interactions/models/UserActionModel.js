/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * User Actions data model.
 * Used to define the actions performed by a user on comments and interactions	
 * @author abhinav
 */
var mongoose = require('mongoose');

var userActionSchema = new mongoose.Schema({
	userId: String,
	interactionId: String,
	actions:[{
		action: String, //Name of the action
		value: String, //If this action has an associated value, eg., ratings
		actedOn: Date //date when the action was performed
	}],
	comments: [{
		commentId: String,
		actions:[{
			action: String, //Name of the action
			value: String, //If this action has an associated value, eg., ratings
			actedOn: Date //date when the action was performed
		}]
	}]
}, {collection: 'user_actions'});
userActionSchema.set('versionKey', false);
module.exports = mongoose.model('UserActionModel', userActionSchema);
