/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Actions data model.
 * Actions available for each type of interaction/comment
 *
 * @author abhinav
 */
var mongoose = require('mongoose');

var intActionSchema = new mongoose.Schema({
	interactionType: String, // Forum type
	postType: String, //interaction , comment, post comment
	action: String,
	occurrence: Number,
	occurrenceType: String,
	scope: String,
	interactionRoles: [{
		roleType: String,
		access: Boolean,
 		accessDisplayState: String,
		actionDisplayState: String
	}],
	defaultUserPrivilege: Boolean,
	interationRolesPriority: [],
	inverseOfAction: String // Inverse of which action
}, {collection: 'interaction_actions'});
intActionSchema.set('versionKey', false);
module.exports = mongoose.model('InteractionActionModel', 	intActionSchema);
