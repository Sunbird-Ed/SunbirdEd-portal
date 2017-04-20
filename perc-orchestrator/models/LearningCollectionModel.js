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

var learningCollectionSchema = new mongoose.Schema({
	name : String,
	lobId: String,
	courseId: String,
	identifier : { type : String, required : true, unique : true },
	nodeSet: String,
	nodeSetId: String,
	taxonomyId: String,
	isMandatory: Boolean,
	metadata : mongoose.Schema.Types.Mixed,
	preConditions: [{
		parentId: String, // Parent Id - will be lesson or module id
		elementId: String, // Resource identifier
		elementType: String, // LR, LA, LOB or Collection
		isMandatory: Boolean // Whether the element is mandatory or optional
	}],
	entryCriteria:[{ // Store the entry criteria conditions
		attribute: String, // Learning State attribute
		operand: String, // Equals, LessThan etc
		value: String, // Literal to be compared against
		condType: String // AND or OR condition
	}],
	entryCriteriaExpr: String, // Entry criteria expression to be evaluated by player
	elements: [{
		name: String,
		elementId: String, // LR, LA or Collection id
		elementType: String, // LR, LA or Collection
		isMandatory: Boolean
	}],
	sequenceId: String, //Fedora ID for the sequence
	sequence: [], // Sequence of all elements within this collection
	is_deleted: {
        type: Boolean,
        default: false
    },
},{ collection: 'learning_collections' });

module.exports = mongoose.model('LearningCollectionModel', learningCollectionSchema);
