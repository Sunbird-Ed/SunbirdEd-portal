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

var conceptMapCacheSchema = new mongoose.Schema({
	courseId : {
		type : String,
		required : true,
		unique : true
	},
	rootConceptId: String,
	conceptMap: mongoose.Schema.Types.Mixed,
	conceptsTitleList : mongoose.Schema.Types.Mixed,
	conceptsList: []
},{ collection: 'concept_map_cache' });
conceptMapCacheSchema.set('versionKey', false);

module.exports = mongoose.model('ConceptMapCache', conceptMapCacheSchema);
