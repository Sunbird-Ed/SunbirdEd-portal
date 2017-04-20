/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Object types Master data 
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var categoryTypesSchema = new mongoose.Schema({
	identifier : String,
	category_name : String,
	description : String
},{ collection: 'category_types' });

module.exports = mongoose.model('CategoryTypesModel', categoryTypesSchema);