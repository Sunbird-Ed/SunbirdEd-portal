/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Comment Actions data model.
 * A store of the kind of actions possible on comments
 * @author abhinav
 */
var mongoose = require('mongoose');

var commentActionSchema = new mongoose.Schema({
	comment_type: String,
	actions: [{
		action: String, //Name of the action
		serviceCall: String //A service endpoint (a JS function in most cases)
	}]
}, {collection: 'comment_actions'})
commentActionSchema.set('versionKey', false);
module.exports = mongoose.model('CommentActionModel', commentActionSchema);
