/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Additional material data model.
 * This is for temporary usage and for testing purposes only. 
 * In actual implementation, request will be sent to middleware to get the additional material.  
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var additionalMaterialSchema = new mongoose.Schema({
	identifier : String,
	category : String,
	content : [{
		name : String,
		mediaURL : String,
		mediaType : String
	}]
},{ collection: 'additional_material' });

module.exports = mongoose.model('AdditionalMaterialModel', additionalMaterialSchema);