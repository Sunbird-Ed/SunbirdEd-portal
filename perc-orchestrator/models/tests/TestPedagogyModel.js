/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for Pedagogy Model Schema
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

		PedagogyModel = mongoose.model('PedagogyModel');
		console.log('Running PedagogyModel insert test');
		var pedagogy = new PedagogyModel();
		pedagogy.description = "Test pedagogy Model";
		pedagogy.name = "Default Pedagogy";
		pedagogy.identifier = "ped_1";
		pedagogy.rootNodeSet = "ped_nodeset_1";
		pedagogy.nodeSets.push("ped_nodeset_1");
		pedagogy.nodeSets.push("ped_nodeset_2");
		pedagogy.nodeSets.push("ped_nodeset_3");
		pedagogy.relations.push({relationName: "hasConstituent", relationLabel: "Contains"});
		pedagogy.relations.push({relationName: "isAssociatedTo", relationLabel: "Is Associated To"});

		pedagogy.save(function(err, object) {
			var success = true;
			if (err) {
				success = false;
			} else {
				//console.log("Pedagogy:", object);
				test.equal(object.identifier,"ped_1","Identifier not matching");
				PedagogyModel.findByIdAndRemove({_id:object._id}, function(err) {

				});
			}
			test.equal(success,true,"Insert was not successfull");
			test.done();
		});
	}
};
