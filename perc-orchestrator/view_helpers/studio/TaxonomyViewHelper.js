/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for TaxonomyModel
 *
 * @author Santhosh
 */
var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var fs = require('fs');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var rdfGraphUtil = require('../../commons/RDFGraphUtil');

exports.findAll = function(req, res) {
	TaxonomyModel = mongoose.model('TaxonomyModel');
	TaxonomyModel.find().lean().exec(function(err, taxonomyModels) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			res.json(taxonomyModels);
			res.end();
		}
	});
};

exports.findByCriteria = function(req, res) {
	TaxonomyModel = mongoose.model('TaxonomyModel');
	TaxonomyModel.find({
		"criteria.propertyName": req.body.key,
		"criteria.propertyValue": req.body.value
	}).exec(function(err, taxonomyModels) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			res.json(taxonomyModels);
			res.end();
		}
	});
};

exports.getMetadataById = function(req, res) {
	TaxonomyModel = mongoose.model('TaxonomyModel');
	TaxonomyModel.findOne({
		identifier : req.params.id
	}, 'lom_metadata', { lean: true }).exec(function(err, metadata) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			res.send(JSON.stringify(metadata));
		}
	});
};

exports.loadTaxonomies = function(req, res) {
	MWServiceProvider.callServiceStandard("DummyService", "GetAllTaxonomies", {}, function(err, data, response) {
		var mwData = data; //eval('(' + data + ')');
		console.log(mwData.responseValueObjects);
		var rdfList = mwData.responseValueObjects.TAXONOMY.valueObjectList;
		if (!rdfList) {
			errorModule.handleError(null, "SAMPLE_MODEL_NOT_FOUND", req, res);
		}
		rdfList.forEach(function(rdfObject) {
			parseAndSaveTaxonomy(rdfObject.id);
		});
		//res.send('Taxonomies loaded');
	});
}

function parseAndSaveTaxonomy(rdf) {
	TaxonomyModel = mongoose.model('TaxonomyModel');
	var taxonomyObject = new TaxonomyModel();
	rdfGraphUtil.getGraphFromRDF(rdf, function(result) {
		taxonomyObject.identifier = result.rootNodeUrl;
		TaxonomyModel.findOneAndRemove({identifier: result.rootNodeUrl}, function(err) {
			var graph = result.graph;
			var rootNode = graph.node(result.rootNodeUrl);
			taxonomyObject.name = rootNode['http://perceptronnetwork.com/ontologies/taxonomy/#taxonomyName'][0].value;
			taxonomyObject.lom_metadata = {};
			var metadataNodes = rootNode['http://perceptronnetwork.com/ontologies/taxonomy/#metadata'];
			metadataNodes.forEach(function(metadataNodeObj) {
				var metadataNode = graph.node(metadataNodeObj.value);
				addMetadata(taxonomyObject, metadataNode);
			});
			taxonomyObject.save(function(err, taxonomy) {
				if(err) {
					console.log(err);
				}
			});
		});
	});
}

function addMetadata(taxonomyObject, node) {

	var uriPrefix = 'http://perceptronnetwork.com/ontologies/taxonomy/#';
	var metadataObj = {};
	var lobCategory;

	if(node[uriPrefix+'category']) {
		lobCategory = node[uriPrefix+'category'][0].value;
		metadataObj.lobCategory = lobCategory;
	}
	if(!taxonomyObject.lom_metadata[lobCategory]) {
		taxonomyObject.lom_metadata[lobCategory] = [];
	}

	if(node[uriPrefix+'metadataName']) {
		metadataObj.propertyName = node[uriPrefix+'metadataName'][0].value;
	}

	if(node[uriPrefix+'categoryType']) {
		metadataObj.lobCategoryType = node[uriPrefix+'categoryType'][0].value;
	}
	if(node[uriPrefix+'label']) {
		metadataObj.label = node[uriPrefix+'label'][0].value;
	}
	if(node[uriPrefix+'dataType']) {
		metadataObj.dataType = node[uriPrefix+'dataType'][0].value;
	}
	if(node[uriPrefix+'required']) {
		metadataObj.required = node[uriPrefix+'required'][0].value;
	}
	if(node[uriPrefix+'maxLength']) {
		metadataObj.maxLength = node[uriPrefix+'maxLength'][0].value;
	}
	if(node[uriPrefix+'range']) {
		metadataObj.range = node[uriPrefix+'range'][0].value;
	}
	if(node[uriPrefix+'editable']) {
		metadataObj.editable = node[uriPrefix+'editable'][0].value;
	}
	if(node[uriPrefix+'enrichEnabled']) {
		metadataObj.enrichEnabled = node[uriPrefix+'enrichEnabled'][0].value;
	}
	taxonomyObject.lom_metadata[lobCategory].push(metadataObj);
}

exports.exportToJSON = function(req, res) {
	var data = {};
	data.taxonomyName = req.body.taxonomyName;
	data.metadataList = [];
	req.body.metadata.forEach(function(metaD) {
		var metaObj = {};
		metaObj.properties = [];
		for(k in metaD) {
			if(k == 'propertyName') {
				metaObj.metadataName = metaD.propertyName;
			} else {
				metaObj.properties.push({propertyName:k, propertyValue:metaD[k]});
			}
		}
		data.metadataList.push(metaObj);
	});
	fs.writeFile('public/json/taxonomy/' + req.body.taxonomyName + '_MW.json', JSON.stringify(data), function (err) {
	  	if (err) {
	  		res.send(JSON.stringify({error: 'Unable to save the JSON'}));
	  	} else {
	  		console.log('It\'s saved!');
	  		res.send(JSON.stringify({file: req.body.taxonomyName + '.json'}));
	  	}
	});
}