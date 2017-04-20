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

		console.log('Running PedagogyNodeSetModel Insert test');
		PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
		var pedagogyNodeSet = new PedagogyNodeSetModel();

		pedagogyNodeSet.description = "Test Description";
		pedagogyNodeSet.identifier = "ped_nodeset_test_1";
		pedagogyNodeSet.nodeSetName = "Course";
		pedagogyNodeSet.nodeSetClass = "LearningObject";
		pedagogyNodeSet.pedagogyId = "ped_1";
		pedagogyNodeSet.taxonomyId = "taxonomy_1";
		pedagogyNodeSet.isFinest = false;
		pedagogyNodeSet.levelInHeirarchy = 1;
		pedagogyNodeSet.relations.push(
		{
			toNodeSet: "Module",
			toNodeSetId: "ped_nodeset_2",
			relationName: "hasConstituent",
			relationLabel: "Contains",
		});
		pedagogyNodeSet.relations.push(
		{
			toNodeSet: "Exercise",
			toNodeSetId: "ped_nodeset_3",
			relationName: "hasConstituent",
			relationLabel: "Contains",
		});

		pedagogyNodeSet.save(function(err, object) {
			var success = true;
			if (err) {
				success = false;
			} else {
				test.equal(object.identifier,"ped_nodeset_test_1","Identifier not matching");
				PedagogyNodeSetModel.findByIdAndRemove({_id:object._id}, function(err) {
				});
			}
			test.equal(success,true,"Insert was not successfull");
			test.done();
		});
	}
};

function createPedagogyNodeSet() {
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	var pedagogyNodeSet = new PedagogyNodeSetModel();

	pedagogyNodeSet.description = "Test Description";
	pedagogyNodeSet.identifier = "ped_nodeset_1";
	pedagogyNodeSet.nodeSetName = "Course";
	pedagogyNodeSet.nodeSetClass = "LearningObject";
	pedagogyNodeSet.pedagogyId = "ped_1";
	pedagogyNodeSet.taxonomyId = "taxonomy_1";
	pedagogyNodeSet.isFinest = false;
	pedagogyNodeSet.levelInHeirarchy = 1;
	pedagogyNodeSet.relations.push(
	{
		toNodeSet: "Module",
		toNodeSetId: "ped_nodeset_2",
		relationName: "hasConstituent",
		relationLabel: "Contains",
	});
	pedagogyNodeSet.relations.push(
	{
		toNodeSet: "Exercise",
		toNodeSetId: "ped_nodeset_3",
		relationName: "hasConstituent",
		relationLabel: "Contains",
	});

	pedagogyNodeSet.save(function(err, object) {
		var success = true;
		if (err) {
			console.log(err);
			success = false;
		} else {
		}
	});

	pedagogyNodeSet = new PedagogyNodeSetModel();

	pedagogyNodeSet.description = "Test Description";
	pedagogyNodeSet.identifier = "ped_nodeset_2";
	pedagogyNodeSet.nodeSetName = "Course";
	pedagogyNodeSet.nodeSetClass = "LearningObject";
	pedagogyNodeSet.pedagogyId = "ped_1";
	pedagogyNodeSet.taxonomyId = "taxonomy_1";
	pedagogyNodeSet.isFinest = false;
	pedagogyNodeSet.levelInHeirarchy = 1;
	pedagogyNodeSet.relations.push(
	{
		toNodeSet: "Exercise",
		toNodeSetId: "ped_nodeset_3",
		relationName: "hasConstituent",
		relationLabel: "Contains",
	});

	pedagogyNodeSet.save(function(err, object) {
		var success = true;
		if (err) {
			console.log(err);
			success = false;
		} else {
		}
	});

	pedagogyNodeSet = new PedagogyNodeSetModel();

	pedagogyNodeSet.description = "Test Description";
	pedagogyNodeSet.identifier = "ped_nodeset_3";
	pedagogyNodeSet.nodeSetName = "Course";
	pedagogyNodeSet.nodeSetClass = "LearningObject";
	pedagogyNodeSet.pedagogyId = "ped_1";
	pedagogyNodeSet.taxonomyId = "taxonomy_1";
	pedagogyNodeSet.isFinest = false;
	pedagogyNodeSet.levelInHeirarchy = 1;

	pedagogyNodeSet.save(function(err, object) {
		var success = true;
		if (err) {
			console.log(err);
			success = false;
		} else {
		}
	});
}