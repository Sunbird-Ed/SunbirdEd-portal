/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Media Content Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var mediaContentSchema = new mongoose.Schema({
	description : String,
	name: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	pedagogyId: String,
	linkedCourses: [],
	contentType: String,
	contentSubType: String, // Quiz, Exercise or Program
	learningTime: Number,
	order: {type: Number, default: 0},
	media: [{
		title: String,
		mediaUrl: String,
		mediaType: String,
		mediaId: String,
		mimeType: String,
		state: String,
		isMain: Boolean
	}],
	categories: [],
	metadata : mongoose.Schema.Types.Mixed, /*name, description, summary, language, mediaType, mimeType, mediaId, creator */
	transcripts: [{
		name: String,
		language: String,
		mediaUrl: String,
		mimeType: String,
		mediaType: String,
		mediaIdentifier: String,
		identifer: String
	}],
	subtitles: [{
		name: String,
		language: String,
		mediaUrl: String,
		mimeType: String,
		mediaType: String,
		mediaIdentifier: String,
		identifer: String
	}],
	concepts: [{ // Concepts covered in this Content
		conceptTitle: String,
		conceptIdentifier: String
	}],
	mediaConcepts: [{
		mediaId: String,
		conceptIdentifier: String,
		startMarker: String, // If it is a video will be the start time of the concept for ex: 10:00
		endMarker: String
	}],
	interceptions: [{
		name: String, //TODO need to know what to populate.
		mediaId: String,
		interceptionPoint: String, // Will be time '00:00:10' if the element is video. If the element is text -  it can be marker or a complex json
		contentId: String,
		metadata: mongoose.Schema.Types.Mixed
	}],
	is_deleted: {
        type: Boolean,
        default: false
    },
},{ collection: 'media_content' });
mediaContentSchema.set('versionKey', false);
module.exports = mongoose.model('MediaContentModel', mediaContentSchema);
