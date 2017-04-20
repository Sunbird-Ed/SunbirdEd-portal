/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Media Model
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var mediaSchema = new mongoose.Schema({
	title: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	description: String,
	metadata : mongoose.Schema.Types.Mixed,
	fileName: String,
	url: String,
	tmpURL: String, /* this will be used till video is uploaded to the media server */
	tags: [],
	mediaType: String, /* like video, text, audio, rich text, etc */
	mimeType: String, /* like video/mp4, application/pdf, etc */
	contentType: String, /* One of ["Media", "LearningActivity"] */
	posterImages: [],
	thumbnails: [],
	creator: String,
	state: String,
	is_deleted: {
        type: Boolean,
        default: false
    },
},{ collection: 'media' });

module.exports = mongoose.model('MediaModel', mediaSchema);
