/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for SampleModel
 * 
 * @author ravitejagarlapati
 */
var mongoose = require('mongoose')
, errorModule = require('./ErrorModule');

exports.findAll = function(req, res) {
	SampleModel = mongoose.model('SampleModel');

	SampleModel.find().exec(function(err, samplemodels) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_SAMPLE_MODEL", req, res);
		} else {
			console.log("Response: " + samplemodels + " ");

			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});

			res.write("" + samplemodels);
			res.end();
		}
	});
};

exports.findById = function(req, res) {
	SampleModel = mongoose.model('SampleModel');

	SampleModel.find({
		username : req.params.id
	}).exec(function(err, samplemodels) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_SAMPLE_MODEL", req, res);
		} else {
			console.log("Response: " + samplemodels + " ");

			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});

			res.write("" + samplemodels);
			res.end();
		}
	});
};

exports.add = function(req, res) {
	SampleModel = mongoose.model('SampleModel');
	var sampleModel = new SampleModel();
	var body = req.body;

	// Create model to be saved to MongoDB
	for(var k in body) sampleModel[k]=body[k];

	sampleModel.save(function(err, object) {
		if (err) {
			errorModule.handleError(err, "ERROR_ADDING_SAMPLE_MODEL", req, res);
		} else {
			console.log("Response: " + object + " ");

			res.writeHead(200, {
				'Content-Type' : 'text/plain'
			});

			res.write("" + object);
			res.end();
		}
	});
};
