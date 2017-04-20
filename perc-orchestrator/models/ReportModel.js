/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Roles Model
 *
 * @author Mahesh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var reportSchema = new mongoose.Schema({
	courseId : {
		type : String,
		required : true
	},
	type: {
		type : String,
		required : true
	},
	name: String,
	reportURL: String,
	params: mongoose.Schema.Types.Mixed,
	reportInfo: mongoose.Schema.Types.Mixed,
	status: String,
	createdDate: Date,
	createdBy: String,
},{ collection: 'reports' });

module.exports = mongoose.model('ReportModel', reportSchema);
