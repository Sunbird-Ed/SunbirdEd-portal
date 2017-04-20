/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Students Data Model
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var studentSchema = new mongoose.Schema({
	identifier : {
		type : String,
		required: true
	},
	educationQualification: String,
	jobTitle: String,
	companyName: String,
	contactNumber: String,
	website: String,
	profile: {
		name: String,
		outcome: String,
		learnerLevel: String
	},
	is_deleted: {
        type: Boolean,
        default: false
    },
},{ collection: 'students' });

module.exports = mongoose.model('StudentModel', studentSchema);