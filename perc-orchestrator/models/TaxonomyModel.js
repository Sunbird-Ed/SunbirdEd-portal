/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Taxonomy Model. This model is associated with a pedagogy.
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var taxonomyModelSchema = new mongoose.Schema({
	name : String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	criteria : [{
		_id:false,
		propertyName : String,
		propertyValue : String
	}],
	lom_metadata: mongoose.Schema.Types.Mixed,
	metadata: [{
		propertyName: String,
		lobCategory: String, // LOM General, LOM Lifecycle etc
		lobCategoryType: String, // Descriptive or Pedagogic
		label: String,
		dataType: String,
		required: Boolean,
		maxLength: Number,
		occurence: Number,
		range: String,
		autoAssigned: String,
		enrichEnabled: Boolean, // Property which specifies whether the metadata can be a enriched by a relation. For ex: A metadata property on a content can be enriched by Learning Resource
		editable: Boolean
	}]
},{ collection: 'taxonomy_models' });

module.exports = mongoose.model('TaxonomyModel', taxonomyModelSchema);
