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
 * @author Mahesh
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var instructorSchema = new mongoose.Schema({
	name: String,
	identifier: String,
	description: String,
	image: String, // TODO need to remove and use image from user for instructor pages and all other content pages.
	organization: String,
	organizationImage: String,
	interests: String,
	nodeId : String,
	is_deleted: {
        type: Boolean,
        default: false
    },
	courses: [{
        courseId: String,
        courseName: String,
        learnerCount: Number,
        allStudentsList: String,
        learners: [ {
            learnerId: String,
            learnerName: String
        }],
        lastGroupIndex: Number
    }],
    courseGroups: [{
        courseId: String,
        groupId: String,
        groupName: String,
        groupCount: Number,
        learners: []
    }],
    roles: []
},{ collection: 'instructors' });
instructorSchema.set('versionKey', false);
module.exports = mongoose.model('InstructorModel', instructorSchema);