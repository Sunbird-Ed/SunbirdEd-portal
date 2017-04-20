/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for PedagogyModel
 *
 * @author Santhosh
 */
var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var rdfGraphUtil = require('../../commons/RDFGraphUtil');
var taxonomyViewHelper = require('./TaxonomyViewHelper');
var promise_lib = require('when');

var pedagogyCache = [];
function loadPedagogyCache(){
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	PedagogyNodeSetModel.find().lean().exec(function(err, nodeSets) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			nodeSets.forEach(function(nodeSet) {
				pedagogyCache[nodeSet.identifier] = nodeSet;
			});
		}
	});
}
loadPedagogyCache();

exports.findAll = function(req, res) {
	PedagogyModel = mongoose.model('PedagogyModel');
	PedagogyModel.find().lean().exec(function(err, pedagogyModels) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			res.send(JSON.stringify(pedagogyModels));
		}
	});
};

exports.findAllNodeSets = function(req, res) {
	PedagogyModel = mongoose.model('PedagogyModel');
	PedagogyModel.findOne({
		identifier : req.params.id
	}, "nodeSets").exec(function(err, pedagogy) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
			PedagogyNodeSetModel.find().where('identifier').in(pedagogy.nodeSets).exec(function(err, nodeSets) {
				if (err) {
					errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
				} else {
					res.send(JSON.stringify(nodeSets));
				}
			});
		}
	});
};

exports.getRootNode = function(req, res) {
	PedagogyModel = mongoose.model('PedagogyModel');
	PedagogyModel.findOne({
		identifier : req.params.id
	}, "rootNodeSet").exec(function(err, pedagogy) {
		if (err || null == pedagogy) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
			PedagogyNodeSetModel.findOne({
				identifier : pedagogy.rootNodeSet
			}).exec(function(err, nodeSet) {
				if (err) {
					errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
				} else {
					res.send(JSON.stringify(nodeSet));
				}
			});
		}
	});
};

exports.findById = function(req, res) {
	PedagogyModel = mongoose.model('PedagogyModel');
	PedagogyModel.findOne({
		identifier : req.params.id
	}).exec(function(err, metadata) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			res.send(JSON.stringify(metadata));
		}
	});
};

exports.findNodeSetById = function(req, res) {
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	PedagogyNodeSetModel.findOne({
		identifier : req.params.id
	}).exec(function(err, nodeSet) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
		} else {
			res.json(nodeSet);
			res.end();
		}
	});
};

exports.findNodeSet = function(pedagogyId, nodeSetName, callback) {
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	PedagogyNodeSetModel.findOne({
		$and: [
		       {pedagogyId : pedagogyId},
		       {nodeSetName : nodeSetName}
		]
	}).exec(function(err, nodeSet) {
		callback(err, nodeSet)
	});
};

exports.getRootNodeSet = function(pedagogyId, callback) {
	PedagogyModel = mongoose.model('PedagogyModel');
	PedagogyModel.findOne({
		identifier : pedagogyId
	}, "rootNodeSet").exec(function(err, pedagogy) {
		if (err || null == pedagogy) {
			callback({});
		} else {
			PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
			PedagogyNodeSetModel.findOne({
				identifier : pedagogy.rootNodeSet
			}).exec(function(err, nodeSet) {
				if (err) {
					callback({});
				} else {
					callback(nodeSet);
				}
			});
		}
	});
}

exports.getNodeSet = function(nodeSetId, callback) {
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	PedagogyNodeSetModel.findOne({
		identifier : nodeSetId
	}).exec(function(err, nodeSet) {
		if (err) {
			console.log('err', err);
			callback({});
		} else {
			callback(nodeSet);
		}
	});
}

exports.getNodeSetById = function(nodeSetId) {
	return pedagogyCache[nodeSetId];
}

function transformAndSave(rdfJSON) {
	PedagogyModel = mongoose.model('PedagogyModel');
	var pedagogy = new PedagogyModel();
	// Transformation Logic
	// Delete any existing pedagogy with the same id
	// Save the Pedagogy
	// Delete existing pedagogy nodesets
	// Save the pedagogy nodesets
}

exports.loadPedagogies = function(req, res) {
	MWServiceProvider.callServiceStandard("DummyService", "GetPedagogyModels", {}, function(err, data, response) {
		console.log("GetPedagogyModels data:", data);
		var mwData = data; //eval('(' + data + ')');
		var rdf = mwData.responseValueObjects.PEDAGOGY.id;
		if (!rdf) {
			errorModule.handleError(null, "SAMPLE_MODEL_NOT_FOUND", req, res);
		}
		//res.send("Please wait while the system parses the RDF and creates the pedagogies");
		rdfGraphUtil.getGraphFromRDF(rdf, function(result) {
			var digraph = result.graph;
			processGraph(digraph);
		});
		//res.send("Please wait while the system parses the RDF and creates the pedagogies");
	});
}

exports.registerMWCommands = function(req, res) {
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MWServiceProvider.registerMWCommands({}, function(err, data, response) {
			if (err) {
				deferred.reject();
			} else {
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	}).then(function(data) {
		res.send(JSON.stringify(data));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR", req, res);
	}).done();
}

exports.loadPOCData = function(req, res) {
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MWServiceProvider.callServiceStandard("DummyService", "LoadPOCPedagogy", {}, function(err, data, response) {
			if (err) {
				deferred.reject();
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).then(function() {
		taxonomyViewHelper.loadTaxonomies(req, res);
		exports.loadPedagogies(req, res);
		res.send("Please wait while the system parses the RDF and creates taxonomies & pedagogies");
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR", req, res);
	}).done();
}

function processGraph(digraph) {
	PedagogyModel = mongoose.model('PedagogyModel');
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	var result = {pedagogy: new PedagogyModel(), nodeSets: []};
	digraph.eachNode(function(u, value) {
		processNode(u, value, result, digraph);
	});
	PedagogyModel.findOneAndRemove({identifier: result.pedagogy.identifier}, function(err) {
		if(!err) {
			result.pedagogy.save(function(err, ped) {
				//console.log('Pedagogy Saved', ped);
			})
		}
	});
	result.nodeSets.forEach(function(nodeSet) {
		PedagogyNodeSetModel.findOneAndRemove({identifier: nodeSet.identifier}, function(err) {
			if(!err) {
				nodeSet.save(function(err, nodeset) {
					//console.log('Pedagogy Nodeset Saved', nodeset);
				})
			}
		});
	});
}

function processNode(id, node, result, digraph) {
	if(getNodeProperty(node, "system_node_name") == 'PedagogyModel') {
		result.pedagogy.identifier = id;
		result.pedagogy.name = 'Dynamic Learning Pedagogy';
	} else {
		if(getNodeProperty(node, "system_node_name") == 'Course') {
			result.pedagogy.rootNodeSet = id;
			result.pedagogy.rootNodeTaxonomy = getNodeProperty(node, 'taxonomyId');
		}
		PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
		var pedagogyNodeSet = new PedagogyNodeSetModel();
		pedagogyNodeSet.identifier = id;
		pedagogyNodeSet.nodeSetName = getNodeProperty(node, 'setType');
		pedagogyNodeSet.nodeSetClass = getNodeProperty(node, 'class');
		pedagogyNodeSet.pedagogyId = getNodeProperty(node, 'domainRelationId');
		pedagogyNodeSet.taxonomyId = getNodeProperty(node, 'taxonomyId');
		var edges = digraph.outEdges(id);
		edges.forEach(function(edgeId) {
			var relation = {};
			var edge = digraph.edge(edgeId);
			var endNodeId = getNodeProperty(edge, 'relationEnd');
			var endNode = digraph.node(endNodeId);
			relation.toNodeSet = getNodeProperty(endNode, 'setType');
			relation.toNodeSetId = endNodeId;
			relation.nodeSetClass = getNodeProperty(endNode, 'class');
			relation.taxonomyId = getNodeProperty(endNode, 'taxonomyId');
			relation.relationName = getNodeProperty(edge, 'relationName');
			pedagogyNodeSet.relations.push(relation);
		})
		result.nodeSets.push(pedagogyNodeSet);
		result.pedagogy.nodeSets.push(id);
	}
}

function getNodeProperty(node, propertyName) {
	var uri = 'http://perceptronnetwork.com/ontologies/#';
	var rdfURI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
	if(node[uri + propertyName]) {
		return node[uri + propertyName][0].value;
	} else if(node[rdfURI + propertyName]) {
		return node[rdfURI + propertyName][0].value;
	}
	return '';
}
