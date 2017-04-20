/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Event Model
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy, pedagogy nodeset and course_draft models*/

var eventSchema = new mongoose.Schema({
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	name: String,
	courseId: String,
	objectId: String,
	objectType: String,
	releasedBy : String,
	releasedDate : Date,
	releaseMsg: String,
	invited: [],
	accepted: [],
	declined: [],
	startDate: Date,
	endDate: Date,
	location: String,
	invites: [{
		id: String,
		type: String
	}],
	actions: [{
		action: String,
		userId: String,
		actionDate: Date
	}],
	media: [{
		title: String,
		mediaUrl: String,
		mediaType: String,
		mediaId: String,
		mimeType: String
	}]
},{ collection: 'events' });
module.exports = mongoose.model('EventModel', eventSchema);
