/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * CSV Import log Model
 *
 * @author Mahesh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var csvImportQueueSchema = new mongoose.Schema({
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	courseId: String,
	courseName: String,
	status: String,
	type: String,
	total: Number,
	inserted: Number,
	updated: Number,
	deleted: Number,
	duplicate: Number,
	failed: Number,
	warning: Number,
	filepath: String,
	importFilename: String,
	importFilePath: String,
	importFileType: String,
	uploadTime: Date,
	startTime: Date,
	endTime: Date,
	exeTime: Number,
	uploadedBy: String,
	errorDetails: [String],
	logFile: String
},{ collection: 'csv_import_queue' });
csvImportQueueSchema.set('versionKey', false);
module.exports = mongoose.model('CSVImportQueueModel', csvImportQueueSchema);
