/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Note Model
 *
 * @author ravitejagarlapati
 */
var mongoose = require('mongoose');

var noteSchema = new mongoose.Schema({
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	// identifier : String,
	title : String,
	content: String,
	url: String,
	updatedOn: { type: Date, default: Date.now , required : true},
	version: Number,
	learnerId: String,
	evernoteNoteId: String,
	evernoteUpdated: Number,
	evernoteSyncedVersion: Number,
	location: {course: String, module:String, lesson:String,lecture:String},
	courseId: String,
	elementId: String,
	additional_material : {category: String, contentId: String},
	tags:[String],
	deleted:Boolean
},{ collection: 'note' }, { versionKey: false });
module.exports = mongoose.model('NoteModel', noteSchema);