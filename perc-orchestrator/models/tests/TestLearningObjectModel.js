/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for Learning Object Lite Model Schema
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

		console.log('Running Learning Object Lite Model Insert test');
		LearningObjectModel = mongoose.model('LearningObjectModel');
		var lobLite = new LearningObjectModel();

		lobLite.description = "Test Description";
		lobLite.identifier = "lobLite_101";
		lobLite.name = "Object Oriented Programming in Java";
		lobLite.learningObjectives.push("Become a advanced java programmer");
		lobLite.learningObjectives.push("Become SunCertified Java programmer");
		lobLite.isDraft = true;
		lobLite.nodeSet = "Module";
		lobLite.nodeSetId = "ped_nodeset_2";
		lobLite.courseId = "course_101";
		lobLite.pedagogyId = "ped_1";
		lobLite.taxonomyId = "taxonomy_1";
		lobLite.learningObjectResourceId = "lob_complete_1"
		lobLite.metadata = {};
		lobLite.metadata.title = "Object Oriented Programming in Java";
		lobLite.metadata.concept = "concept 1";
		lobLite.sequence.push("lob_lite_3");
		lobLite.sequence.push("lob_lite_1");
		lobLite.children.push(
		{
			identifier: "lob_lite_3",
			nodeSet: "Lecture",
			nodeSetId: "ped_nodeset_3",
			relationName: "hasConstituent"
		});
		lobLite.children.push(
		{
			identifier: "lob_lite_1",
			nodeSet: "Lecture",
			nodeSetId: "ped_nodeset_3",
			relationName: "hasConstituent"
		});

		lobLite.save(function(err, object) {
			var success = true;
			if (err) {
				success = false;
			} else {
				//console.log("Learning Object Lite:", object);
				test.equal(object.identifier,"lobLite_101", "Identifier not matching");
				LearningObjectModel.findByIdAndRemove({_id:object._id}, function(err) {
				});
			}
			test.equal(success, true, "Insert was not successfull");
			test.done();
		});
	}
};

