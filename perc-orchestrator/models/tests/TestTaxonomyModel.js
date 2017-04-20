/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for Taxonomy Model Schema
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

		TaxonomyModel = mongoose.model('TaxonomyModel');
		console.log('Running Taxonomy Model insert test');
		var taxonomy = new TaxonomyModel();
		taxonomy.description = "Test Description";
		taxonomy.identifier = "taxonomy_test";
		taxonomy.criteria = [];
		taxonomy.criteria.push({});
		taxonomy.criteria[0].propertyName = "class";
		taxonomy.criteria[0].propertyValue = "LearningObject";
		taxonomy.criteria.push({});
		taxonomy.criteria[1].propertyName = "type";
		taxonomy.criteria[1].propertyValue = "Course";
		taxonomy.metadata = [];
		taxonomy.metadata.push({});
		taxonomy.metadata[0].propertyName = "name";
		taxonomy.metadata[0].label = "Name";
		taxonomy.metadata[0].dataType = "String";
		taxonomy.metadata[0].required = true;
		taxonomy.metadata[0].maxLength = 50;
		taxonomy.metadata[0].occurence = 1;
		taxonomy.metadata[0].showInUI = true;

		taxonomy.save(function(err, object) {
			var success = true;
			if (err) {
				success = false;
			} else {
				test.equal(object.identifier,"taxonomy_test","Identifier not matching");
				TaxonomyModel.findByIdAndRemove({_id:object._id}, function(err) {
				});
			}
			test.equal(success,true,"Insert was not successfull");
			test.done();
		});
	}
};