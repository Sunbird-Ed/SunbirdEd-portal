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

var orgSchema = new mongoose.Schema({
	name : String,
	description: String,
	image: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	}
},{ collection: 'organizations' });
orgSchema.set('versionKey', false);
module.exports = mongoose.model('Organization', orgSchema);