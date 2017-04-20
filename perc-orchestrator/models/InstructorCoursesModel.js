/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Courses coaches/faculties are enrolled into
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var instructorSchema = new mongoose.Schema({
	identifier: String,
    courseId: String,
    nodeId: String,
    courseName: String,
    learnerCount: Number,
    maxCapacity: Number,
    allStudentsList: String,
    learners: [],
    lastGroupIndex: Number,
    batches: [{
        batchId: Number,
        batchGroupId: String,
        groupName: String,
        groupCount: Number,
        learners: []
    }],
    role: String
},{ collection: 'instructor_courses' });
instructorSchema.set('versionKey', false);
module.exports = mongoose.model('InstructorCoursesModel', instructorSchema);