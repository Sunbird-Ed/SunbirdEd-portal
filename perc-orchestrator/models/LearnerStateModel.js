/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learner State Data Model
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

var learnerStateSchema = new mongoose.Schema({
	student_id : {
		type : String,
		required: true
	},
	courseId: {
		type : String,
		required: true
	},
	roles:[],
	packageId: String,
	profile: {
		name : String,
		outcome : String,
		learnerLevel: String
	},
	enrolled_date: String,
	lastUpdated: Date,
	tutor: String,
	batch: String,
	timeUnit: String,
	// total_elements: Number,
	// complete_count: Number,
	learning_objects: [{ // course, modules, lessons
		identifier: String,
		elementType: String,
		mediaType: String,
		name: String,
		learningTime: Number,
		elements_count: [{
			elementType: String, // "learningresource", "Exam", "practiceTes", "content", "coachingSession"
			total: Number
		}],
		lobs_count: [{
			elementType: String, // "lesson", "module", "binder"
			total: Number
		}],
		//elements_count: [],
		sequence: [],
		additional_material: [],
		offset: Number
	}],
	elements: [{
		identifier: String,
		elementType: String, // "learningresource", "Exam", "practiceTes", "content", "coachingSession"
		elementSubType: String, 
		mediaType: String,
		name: String,
		category: String,
		learningTime: Number,
		duration: String,
		isMandatory: Boolean, // Whether the element is mandatory or optional
		proficiencyWeightage: Number,
		minProficiency: Number,
		assessmentId: String,
		parentId: String,
		state: Number, // 0 - not started/not joined, 1 - started/joined, 2 - completed/attended
		conditions: [{
			name: String,
			value: String
		}],
		offset: Number,
		event: {
			eventId: String,
			action: String,
			lastUpdated: Date
		}
	}],
	currentElementId: String,
	discoverContent: {
		lastConceptId: String,
		lastContentId: String,
		lastCategory: String
	},
	groups : mongoose.Schema.Types.Mixed,
	targets : [{
		offset: Number,
		elements_count: [{
			elementType: String,
			total: Number
		}]
	}]
},{ collection: 'learner_state' });

module.exports = mongoose.model('LearnerStateModel', learnerStateSchema);