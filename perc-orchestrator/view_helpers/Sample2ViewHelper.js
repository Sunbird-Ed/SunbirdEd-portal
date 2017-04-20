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
var rdfGraphUtil = require('../commons/RDFGraphUtil');
var MWServiceProvider = require('../commons/MWServiceProvider');


exports.findById = function(req, res) {
	console.log("Inside Sample2ViewHelper.findById");
	SampleModel2 = mongoose.model('SampleModel2');

	SampleModel2.find({
		url : req.params.id
	}).exec(function(err, samplemodels) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_SAMPLE_MODEL", req, res);
		} else {
			if (samplemodels && samplemodels.length > 0) {
				console.log("Response: " + samplemodels + " ");

				res.send(JSON.stringify(samplemodels));
			} else {
				MWServiceProvider.callService("DummyService", "cmd1", null, function(data, response) {
		          	 
		          	 data = eval('(' + data + ')');
					console.log("Response from middleware: " + JSON.stringify(data.responseValueObjects.RDF.id));
					// for(var k in data) {console.log(k + " " + data[k]);}
					var rdf = data.responseValueObjects.RDF.id;
					if (!rdf) {
						errorModule.handleError(null, "SAMPLE_MODEL_NOT_FOUND", req, res);	
					}
					rdfGraphUtil.getGraphFromRDF(rdf, function(rdfGraph) {
						console.log("RDFGraph:"+ JSON.stringify(rdfGraph));
						// Create model to be saved to MongoDB
						var sampleModel = new SampleModel2();
						sampleModel.url = rdfGraph.rootNodeUrl;

						// Get the rood node RDf Troples
						var rdfNode = rdfGraph.graph.node(rdfGraph.rootNodeUrl);

						// Convert the triples for the Node into relavent schema properties
						rdfGraphUtil.setProperties(rdfNode, sampleModel, {name:"http://canopusconsulting.com/test#name"
							, description:"http://canopusconsulting.com/test#description"})
						sampleModel.children = [];

						var successors = rdfGraph.graph.successors(rdfGraph.rootNodeUrl);
						for (var i in successors) {
							sampleModel.children.push({childUrl:successors[i]});
						}

						console.log('ModelObject:' + JSON.stringify(sampleModel));


						// for(var k in rdfGraph) sampleModel[k]=rdfGraph[k];
						sampleModel.save(function(err, object) {
							if (err) {
								errorModule.handleError(err, "ERROR_ADDING_SAMPLE_MODEL", req, res);
							} else {

								res.send(JSON.stringify(rdfGraph));
							}
						});
					});

		        }, function(err) {
					errorModule.handleError(null, "ERROR_FINDING_SAMPLE_MODEL", req, res);
		        });

			}
		}
	});
};

exports.add = function(req, res) {
	SampleModel2 = mongoose.model('SampleModel');
	var sampleModel = new SampleModel2();
	var body = req.body;

	// Create model to be saved to MongoDB
	for(var k in body) sampleModel[k]=body[k];

	sampleModel.save(function(err, object) {
		if (err) {
			errorModule.handleError(err, "ERROR_ADDING_SAMPLE_MODEL", req, res);
		} else {
			console.log("Response: " + object + " ");

			res.send("" + object);
		}
	});
};
