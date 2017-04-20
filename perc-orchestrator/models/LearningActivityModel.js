/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learning Activity Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy, pedagogy nodeset and course_draft models*/

var learningActivitySchema = new mongoose.Schema({
	name : String,
	lobId: String,
	courseId: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	nodeSet : String,
	nodeSetId : String,
	taxonomyId : String,
	learningObjectives:[],
	metadata : mongoose.Schema.Types.Mixed,
	contentIdentifier: String,
	isMandatory: Boolean,
	minProficiency: Number,
	learningTime : Number,
	preConditions: [{
		parentId: String, // Context Id - will be lesson or module id
		elementId: String, // Resource identifier
		elementType: String, // LR, LA, LOB, Collection
		isMandatory: String // Mandatory or Optional
	}],
	completionCriteria:[{ // Store the completion criteria conditions
		attribute: String, // Learning State attribute
		operand: String, // Equals, LessThan etc
		value: String, // Literal to be compared against
		condType: String // AND or OR condition
	}],
	completionCriteriaExpr: String, // Completion criteria expression to evaluated by player
	// Conditions to be evaluated when this element is played. Can be used for analytics
	conditions:[{
		name: String,
		identifier: String,
		criteria:[{
			attribute: String, // Learning State attribute
			operand: String, // Equals, LessThan etc
			value: String, // Literal to be compared against
			condType: String // AND or OR condition
		}],
		expression: String
	}],
	concepts: [{ // Concepts covered in this learning activity
		conceptTitle: String,
		conceptIdentifier: String
	}],
	supplementary_content: [{
		name: String,
		conceptId: String, // The concept identifier linked to the identifier in the ConceptModel
		conceptTitle: String, // The concept title
		contentGroup: String, // 101, Pre-requisite, Related, Reference etc
		contentId: String, // Identifier of the content object
		mediaURL: String, // URL of the media object attached to the content
		mediaType: String, // Media type - URL, Video, Audio, PDF, PPT, Slideshare etc
		mimeType: String, // Mime type of the media content
		metadata: mongoose.Schema.Types.Mixed
	}],
	summaries: {
		qaCount: Number
	},
	is_deleted: {
        type: Boolean,
        default: false
    },
    startDate: Date,
	endDate: Date,
	createdBy: String,
    createdDate: Date,
	offset: Number
},{ collection: 'learning_activities' });

module.exports = mongoose.model('LearningActivityModel', learningActivitySchema);
