/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learning Object Elements Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy, pedagogy nodeset and course_draft models*/

var learningObjectElementsSchema = new mongoose.Schema({
	name : String, // Learning Object Title or Name
	courseId: String, // Refer to the course id
	lobId : {
		type : String,
		required : true,
		unique : true
	},
	elements: [ {
		name: String,
		elementId: String, // LR, LA or Collection ID
		elementType: String, // LR, LA or Collection
		isMandatory: Boolean // Whether the element is mandatory or optional
	}],
	concepts: [{ // Concepts covered in this LOB
		conceptTitle: String,
		conceptIdentifier: String
	}],
	sequence:[], /* Sequence of all Learning elements and collections identifiers */
	supplementary_content: [{
		name: String,
		identifier: String,
		conceptId: String, // The concept identifier linked to the identifier in the ConceptModel
		conceptTitle: String, // The concept title
		contentGroup: String, // 101, Pre-requisite, Related, Reference etc
		contentId: String, // Identifier of the content object
		mediaURL: String, // URL of the media object attached to the content
		mediaType: String, // Media type - URL, Video, Audio, PDF, PPT, Slideshare etc
		mimeType: String, // Mime type of the media content
		metadata: mongoose.Schema.Types.Mixed
	}],
	exercisesCollection: { // Lesson end exercises
		elementId: String, // Collection Id - Refers to a collection
		elementType: String // ExercisesCollection - So that studio knows not to add LRs into it
	}
},{ collection: 'learning_object_elements' });
learningObjectElementsSchema.set('versionKey', false);
module.exports = mongoose.model('LearningObjectElementsModel', learningObjectElementsSchema);