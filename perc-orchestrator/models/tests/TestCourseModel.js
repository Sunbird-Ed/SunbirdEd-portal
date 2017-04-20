/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for Course Model Schema
 *
 * @author Santhosh
 */

var mongoose = require('mongoose');
var db = require('../../models');

module.exports = {
	setUp : function(callback) {

		callback();
	},
	tearDown : function(callback) {
		// clean up
		callback();
	},
	testInsert : function(test) {
		// expecting 2 assertions to be run
		test.expect(2);

		console.log('Running Course Model Insert test');
		CourseModel = mongoose.model('CourseModel');
		var course = new CourseModel();

		course.description = "Test Description";
		course.identifier = "course_101";
		course.name = "Java advanced course";
		course.learningObjectives.push("Become a advanced java programmer");
		course.learningObjectives.push("Become SunCertified Java programmer");
		course.isDraft = true;
		course.pedagogyId = "ped_1";
		course.taxonomyId = "taxonomy_1";
		course.metadata = {};
		course.metadata.title = "Java Advanced Course";
		course.metadata.concept = "concept 1";
		course.sequence.push("lob_1");
		course.sequence.push("lob_2");
		course.faculty = {};
		course.faculty.name = "Santhosh";
		course.faculty.identifier = "faculty_1";
		course.faculty.properties = {};
		course.faculty.properties.institution = "IIT Mumbai";
		course.faculty.properties.image = "http://media.perceptron.com/faculty_1.img";
		course.tutors.push({
			name: "Rayulu",
			identifier: "tutor_1",
			properties: {institution: "IIT Mumbai", image: "http://media.perceptron.com/tutor_1.img"}
		});
		course.children.push(
		{
			identifier: "lob_2",
			nodeSet: "Module",
			nodeSetId: "ped_nodeset_2",
			relationName: "hasConstituent"
		});
		course.children.push(
		{
			identifier: "lob_1",
			nodeSet: "Module",
			nodeSetId: "ped_nodeset_2",
			relationName: "hasConstituent"
		});

		course.save(function(err, object) {
			var success = true;
			if (err) {
				success = false;
			} else {
				//console.log("Course Object:", object);
				test.equal(object.identifier,"course_101", "Identifier not matching");
				CourseModel.findByIdAndRemove({_id:object._id}, function(err) {
				});
			}
			test.equal(success, true, "Insert was not successfull");
			test.done();
		});
	}
};
