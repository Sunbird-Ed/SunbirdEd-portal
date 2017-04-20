/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Course Draft Data Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var courseSchema = new mongoose.Schema({
	name : String,
	description: String,
	image: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	nodeId: String,
	inboxEmailId: String, // Email account for interactions
	pedagogyId: String, // The pedagogy selected for creating the course
	introduction: { // The introduction video for the course
		text: String,
		videoURL: String,
		videoMimeType: String
	},
	homeDescription: String,
	weeksDuration: Number,
	hoursPerWeek: Number,
	hoursOfVideo: Number,
	order: {type: Number, default: 1},
	featuredCourse: Boolean,
	showOnHomePage: Number,
	isDraft: Boolean,
	status: String,
	lastUpdated: Date,
	faculty: { // Faculty information
		name: String,
		identifier: String,
		description: String,
		image: String
	},
	tutors: [{ // Tutors information
		name: String,
		identifier: String,
		description: String,
		image: String
	}],
	packages: [{
		identifier: String,
		name: String,
		outcome: String,
		price: String,
		totalLearningTime: String,
		tutoringHours: String,
		metadata : mongoose.Schema.Types.Mixed
	}],
	packageSequenceId: String, //Fedora ID for the sequence
	packageSequence: [],
	outcomeSequence:[],
	timeUnit: String,
	is_deleted: {
        type: Boolean,
        default: false
    },
    community: {
    	announcementGroup: String,
    	userId: String,
    	lastUpdated: Date,
    	coachGroup: {
    		groupId: String,
    		groupMembers: []
    	},
    	facultyGroup: {
    		groupId: String,
    		groupMembers: []
    	}
    }
},{ collection: 'course' });
courseSchema.set('versionKey', false);
module.exports = mongoose.model('CourseModel', courseSchema);