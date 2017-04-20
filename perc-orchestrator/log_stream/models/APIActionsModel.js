/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Model to store api actions
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

var apiActionsSchema = new mongoose.Schema({
	object: String,
	method: String,
	actions: [{
		name: String,
		environment: String,
		external: Boolean,
		objectId: {
			container: String, //request or response
			field: String, // params, query or body
			param: []
		},
		criteria: {
			container: String, //request or response
			field: String, // params, query or body
			param: [],
			paramValue: mongoose.Schema.Types.Mixed,
			partials: Boolean
		}
	}]
},{ collection: 'api_actions' });
apiActionsSchema.set('versionKey', false);
module.exports = mongoose.model('APIActionsModel', apiActionsSchema);
