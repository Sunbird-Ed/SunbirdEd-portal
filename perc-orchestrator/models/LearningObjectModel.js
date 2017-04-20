/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learning Object Lite Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy, pedagogy nodeset and course_draft models*/

var learningObjectSchema = new mongoose.Schema({
	name : String,
	description: String,
	learningObjectives:[], // The learning objectives for this LOB
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	lobType: String, // Course, Module, Lesson or Binder
	nodeSet: String, // Pedagogy Nodeset Name
	nodeSetId: String, // Pedagogy Nodeset Id
	pedagogyId: String,
	taxonomyId: String,
	courseId: String,
	parentId: String,
	metadata : mongoose.Schema.Types.Mixed,
	entryCriteria:[{ // Store the entry criteria conditions
		attribute: String, // Learning State attribute
		operand: String, // Equals, LessThan etc
		value: String, // Literal to be compared against
		condType: String // AND or OR condition
	}],
	entryCriteriaExpr: String, // Entry criteria expression to be evaluated by player
	sequenceId: String, //Fedora ID for the sequence
	sequence:[], // Sequence of all the contained Learning Objects
	children:[{
		identifier: String,
		nodeSet: String,
		nodeSetId: String,
		relationName: String,
		relationProperties: mongoose.Schema.Types.Mixed
	}],
	concepts: [{ // Concepts covered in this learning object
		conceptTitle: String,
		conceptIdentifier: String
	}],
	summaries: {
		qaCount: Number
	},
	createdBy: String,
	createdDate: Date,
	lastUpdated: Date,
	offset: Number,
	startDate: Date,
	endDate: Date,
	is_deleted: {
        type: Boolean,
        default: false
    }
},{ collection: 'learning_object' });
learningObjectSchema.set('versionKey', false);
module.exports = mongoose.model('LearningObjectModel', learningObjectSchema);