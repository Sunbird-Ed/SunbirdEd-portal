/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Enrolled Courses Data Model
 *
 * @author rayulu
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var enrolledCoursesSchema = new mongoose.Schema({
	identifier: {
		type : String,
		required : true,
		unique : true
	},
	student_id : {
		type : String,
		required: true
	},
	course_id: {
		type : String,
		required: true
	},
	package_id: String,
	batch: Number
},{ collection: 'enrolled_courses' });

module.exports = mongoose.model('EnrolledCoursesModel', enrolledCoursesSchema);