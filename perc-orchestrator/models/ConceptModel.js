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

var conceptSchema = new mongoose.Schema({
	title : String,
	description: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	context: String,
	metadata : mongoose.Schema.Types.Mixed,
	associations: [{ // all associated concepts
		conceptTitle: String,
		conceptId: String,
		tag: String // related, subconcept, pre-requisite
	}],
	sameas: String, // main concept of the same concepts
	contentCategories:[],
	contentCount: Number,
	categoryCounts: [{
		name: String,
		count: Number
	}]
},{ collection: 'concepts' });
conceptSchema.index({title: 1, context: 1}, {unique: true});
conceptSchema.set('versionKey', false);
module.exports = mongoose.model('ConceptModel', conceptSchema);
