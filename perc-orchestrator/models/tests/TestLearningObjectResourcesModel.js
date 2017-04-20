/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for Pedagogy NodeSet Model Schema
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

		console.log('Running Learning Object Nested Model Insert test');
		LearningObjectResourcesModel = mongoose.model('LearningObjectResourcesModel');
		var lobResources = new LearningObjectResourcesModel();

		lobResources.identifier = "lobResources_101";
		lobResources.name = "Object Oriented Programming in Java";
		lobResources.learningObjectId = "lob_1";
		lobResources.learningResources.push({
			identifier: "lr_1",
			lrType: "Normal",
			mediaIdentifier: "media123",
			mediaURL: "http://vimeo.com/12",
			mediaType: "video",
			mediaMimeType: "video/mp4",
			metadata: {
				studentProfile: "A"
			}
		});
		lobResources.learningResources[0].preRequisites.push({
			mediaIdentifier: "media124",
			mediaURL: "http://vimeo.com/123",
			mediaType: "video",
			mediaMimeType: "video/mp4",
			metadata: {
				name: "What is Object Oriented Programming"
			}
		});
		lobResources.learningResources[0].references.push({
			mediaIdentifier: "media125",
			mediaURL: "http://vimeo.com/124",
			mediaType: "video",
			mediaMimeType: "video/mp4",
			metadata: {
				name: "More about Object Oriented Programming"
			}
		});
		lobResources.learningResources[0].concepts.push({
			startTime: "00:00",
			endTime: "10:00",
			concept: "Concept 1"
		});
		lobResources.learningResources[0].mediaSequence.push("media124");
		lobResources.learningResources[0].mediaSequence.push("media123");
		lobResources.learningResources[0].mediaSequence.push("media125");

		lobResources.learningActivities.push({
			identifier: "la_1",
			lrType: "Normal",
			mediaIdentifier: "quiz1",
			mediaURL: "http://perceptron.com/quiz1",
			mediaType: "quiz",
			mediaMimeType: "text/html",
			metadata: {
				studentProfile: "A"
			},
			decisionNode: [{
				result: "profileA",
				learningResourceId: "lr_2"
			},
			{
				result: "profileB",
				learningResourceId: "lr_3"
			}]
		});

		lobResources.exercises.push({
			identifier: "la_2",
			lrType: "Normal",
			mediaIdentifier: "exercise1",
			mediaURL: "http://perceptron.com/exercise1",
			mediaType: "exercise",
			mediaMimeType: "application/json",
			metadata: {
				studentProfile: "A"
			}
		});
		lobResources.exercises[0].tutorExplanationVideos.push("lr_4");

		lobResources.save(function(err, object) {
			var success = true;
			if (err) {
				console.log(err);
				success = false;
			} else {
				//console.log("Learning Object Resources:", object);
				test.equal(object.identifier,"lobResources_101", "Identifier not matching");
				LearningObjectResourcesModel.findByIdAndRemove({_id:object._id}, function(err) {
				});
			}
			test.equal(success, true, "Insert was not successfull");
			test.done();
		});
	}
};
