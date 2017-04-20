/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for Media Content Model Schema
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
		// expecting 3 assertions to be run
		test.expect(2);

		MediaContentModel = mongoose.model('MediaContentModel');
		console.log('Running MediaContentModel insert test');
		var mediaContent = new MediaContentModel();
		mediaContent.description = "Inserting media content";
		mediaContent.identifier = "media_content_2";
		mediaContent.name = "Example Video 1";
		mediaContent.pedagogyId = "ped_1";
		mediaContent.linkedCourses.push("test_course_101");
		mediaContent.linkedCourses.push("test_course_102");
		mediaContent.textNotes.push({textHTML:"<p>My transcript</p>", textType: "Transcript", language: "English"});
		mediaContent.metadata = {};
		mediaContent.metadata.mediaType = "Video";
		mediaContent.metadata.mediaURL = "http://youtube.com/YA7162";
		mediaContent.metadata.mediaMimeType = "video/mp4";

		mediaContent.save(function(err, object) {
			var success = true;
			if (err) {
				success = false;
			} else {
				//console.log('Media Content Object', object);
				test.equal(object.identifier,"media_content_2","Identifier not matching");
				MediaContentModel.findByIdAndRemove({_id:object._id}, function(err) {
				});
			}
			test.equal(success,true,"Insert was not successfull");
			test.done();
		});
	}
};