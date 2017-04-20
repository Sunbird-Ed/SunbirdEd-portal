/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for saving course strucure, lob structure, content and media into MW. This view helper
 * handles the integration between MW and Orchestrator
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');
var db = require('../../models');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var uriPrefix = "http://perceptronnetwork.com/ontologies/#";
var ViewHelperConstants = require('../ViewHelperConstants');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var rdfGraphUtil = require('../../commons/RDFGraphUtil');

function getRDFNode(nodeType, pedagogyId, nodeSet, identifier, metadata) {
	var deferred = promise_lib.defer();
	var rdfNode = {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            "value": "http://perceptronnetwork.com/ontologies/domainRelation/" + pedagogyId + "/setType#" + nodeSet,
            "type": "uri"
        }, {
            "value": nodeSet,
            "type": "literal"
        }]
    };
    addProperty(rdfNode, "node_type", nodeType);
    addProperty(rdfNode, "object_uri", identifier);
    addProperty(rdfNode, "setType", nodeSet);
    addProperty(rdfNode, "pedagogyId", pedagogyId);
    if(typeof metadata != 'undefined') {
    	for(k in metadata) {
	    	addProperty(rdfNode, k, metadata[k]);
	    }
    }
    return rdfNode;
}

function addProperty(rdfNode, propName, propValue, propType) {
	if(typeof propValue == 'undefined' || propValue == null) {
		return;
	}
	propType = propType || 'literal';
	rdfNode[uriPrefix + propName] = [];
    rdfNode[uriPrefix + propName][0] = {
    	"value": propValue,
    	"type": propType
    }
}

function addRelationRDF(rdf, nodeId, parentNodeId, relationLabel, index, props) {
	var relationId = parentNodeId + "/relation" + index;
    var relationRDF = {};
    addProperty(relationRDF, "id", index);
    addProperty(relationRDF, "relationEnd", nodeId, 'uri');
    addProperty(relationRDF, "relationStart", parentNodeId, 'uri');
    addProperty(relationRDF, "relation_label", relationLabel);
    if(props) {
    	for(k in props) {
    		addProperty(relationRDF, k, props[k]);
    	}
    }
    rdf[relationId] = relationRDF;
}

function exportToMW(rdf, identifier, fullPath) {
	fullPath = fullPath || false;
	var req = new Object();
    req.LEARNING_OBJECT = JSON.stringify(rdf);
    req.LEARNING_OBJECT_ID = "";
    req.SAVE_RECURSIVE = fullPath;
    var deferred = promise_lib.defer();
    MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
        if (err) {
            console.log("Error in Response from MW saveLearningObject: " + JSON.stringify(err, null, 4));
            dererred.reject(err);
        } else {
            console.log("Response from MW saveLearningObject: " + JSON.stringify(data, null, 4));
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

function getConceptRDF(rdf, relIndex, id) {
	ConceptModel = mongoose.model('ConceptModel');
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(ConceptModel.findOne, ConceptModel, [{identifier: id}]))
	.then(function(concept) {
		var rdfNode = getRDFNode('NODE', rdf.pedagogyId, ViewHelperConstants.CONCEPT, id, concept.metadata);
		addProperty(rdfNode, "name", concept.title);
		addProperty(rdfNode, "description", concept.description);
		rdf[id] = rdfNode;
		if(concept.relatedConcepts) {
			concept.relatedConcepts.forEach(function(concpt) {
				addRelationRDF(rdf, concpt.conceptId, id, 'associatedTo', relIndex++, {'relationType': 'relatedconcepts'});
			});
		}
		if(concept.subConcepts) {
			concept.subConcepts.forEach(function(concpt) {
				addRelationRDF(rdf, concpt.conceptId, id, 'associatedTo', relIndex++, {'relationType': 'subconcepts'});
			});
		}
		return rdf;
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	.done(function(rdf) {
		deferred.resolve(rdf);
	});
	return deferred.promise;
}

function getMediaRDF(rdf, relIndex, id) {
	MediaModel = mongoose.model('MediaModel');
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(MediaModel.findOne, MediaModel, [{identifier: id}]))
	.then(function(media) {
		var rdfNode = getRDFNode('NODE', rdf.pedagogyId, ViewHelperConstants.MEDIA, id, media.metadata);
		addProperty(rdfNode, "name", media.title);
		addProperty(rdfNode, "mediaURL", media.url);
		addProperty(rdfNode, "mediaType", media.mediaType);
		addProperty(rdfNode, "mimeType", media.mimeType);
		if(media.posterImages && media.posterImages.length > 0) {
			addProperty(rdfNode, "posterImages", JSON.stringify(content.posterImages));
		}
		if(media.thumbnails && media.thumbnails.length > 0) {
			addProperty(rdfNode, "thumbnails", JSON.stringify(content.thumbnails));
		}
		rdf[id] = rdfNode;
		return rdf;
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	.done(function(rdf) {
		deferred.resolve(rdf);
	});
	return deferred.promise;
}

exports.exportContentToMW = function(contentId) {

	var rdf = {};
	ContentModel = mongoose.model('MediaContentModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(ContentModel.findOne, ContentModel, [{identifier: contentId}]))
	.then(function(content) {
		rdf['pedagogyId'] = content.pedagogyId;
		return getContentRDF(rdf, 1, content);
	})
	.then(function() {
		delete rdf['pedagogyId'];
		var req = new Object();
	    req.LEARNING_OBJECT = JSON.stringify(rdf);
	    req.LEARNING_OBJECT_ID = '';
	    req.SAVE_RECURSIVE = false;
	    var deferred = promise_lib.defer();
	    MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
	        if (err) {
	            console.log("Error in Response from MW saveLearningObject: " + JSON.stringify(err, null, 4));
	            dererred.reject(err);
	        } else {
	            console.log("Response from MW saveLearningObject: " + JSON.stringify(data, null, 4));
	            deferred.resolve(data);
	        }
	    });
	    return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error updating content in MW - ', err);
	})
	.done();
}

function getContentRDF(rdf, relIndex, content) {
	var id = content.identifier;
	var rdfNode = getRDFNode('NODE', rdf.pedagogyId, ViewHelperConstants.CONTENT, id, content.metadata);
	addProperty(rdfNode, "name", content.name);
	addProperty(rdfNode, "contentType", content.contentType);
	addProperty(rdfNode, "contentSubType", content.contentSubType);
	if(content.interceptions && content.interceptions.length > 0) {
		addProperty(rdfNode, "interceptions", JSON.stringify(content.interceptions));
	}
	rdf[id] = rdfNode;
	if(content.media) {
		content.media.forEach(function(media) {
			addRelationRDF(rdf, media.mediaId, id, 'associatedTo', relIndex++, {'relationType': 'main', 'isMain': media.isMain});
		});
	}
	if(content.transcripts) {
		content.transcripts.forEach(function(media) {
			addRelationRDF(rdf, media.mediaId, id, 'associatedTo', relIndex++, {'relationType': 'transcripts'});
		});
	}
	if(content.subtitles) {
		content.subtitles.forEach(function(media) {
			addRelationRDF(rdf, media.mediaId, id, 'associatedTo', relIndex++, {'relationType': 'subtitles'});
		});
	}
	if(content.concepts) {
		content.concepts.forEach(function(concept) {
			addRelationRDF(rdf, concept.conceptIdentifier, id, 'associatedTo', relIndex++, {'relationType': 'concept'});
		});
	}
}

exports.exportLearningResourceToMW = function(elementId) {

	var rdf = {};
	LearningResourceModel = mongoose.model('LearningResourceModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: elementId}]))
	.then(function(element) {
		rdf['pedagogyId'] = element.pedagogyId;
		return getLearningResourceRDF(rdf, 1, element);
	})
	.then(function() {
		delete rdf['pedagogyId'];
		var req = new Object();
	    req.LEARNING_OBJECT = JSON.stringify(rdf);
	    req.LEARNING_OBJECT_ID = '';
	    req.SAVE_RECURSIVE = false;
	    var deferred = promise_lib.defer();
	    MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
	        if (err) {
	            console.log("Error in Response from MW exportLearningResourceToMW: " + JSON.stringify(err, null, 4));
	            dererred.reject(err);
	        } else {
	            console.log("Response from MW exportLearningResourceToMW: " + JSON.stringify(data, null, 4));
	            deferred.resolve(data);
	        }
	    });
	    return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error updating learning resource in MW - ', err);
	})
	.done();
}

function getLearningResourceRDF(rdf, relIndex, element) {
	var id = element.identifier;
	var rdfNode = getRDFNode('NODE', rdf.pedagogyId, element.nodeSet, id, element.metadata);
	addProperty(rdfNode, "name", element.name);
	addProperty(rdfNode, "isMandatory", element.isMandatory);
	addProperty(rdfNode, "contentStartMarker", element.isMandatory);
	addProperty(rdfNode, "contentEndMarker", element.isMandatory);
	addProperty(rdfNode, "completionCriteriaExpr", element.completionCriteriaExpr);

	if(element.preConditions && element.preConditions.length > 0) {
		addProperty(rdfNode, "preConditions", JSON.stringify(element.preConditions));
	}
	if(element.completionCriteria && element.completionCriteria.length > 0) {
		addProperty(rdfNode, "completionCriteria", JSON.stringify(element.completionCriteria));
	}
	if(element.conditions && element.conditions.length > 0) {
		addProperty(rdfNode, "conditions", JSON.stringify(element.conditions));
	}
	rdf[id] = rdfNode;

	addRelationRDF(rdf, element.contentIdentifier, id, 'associatedTo', relIndex++, {'relationType': 'main'});
	if(element.supplementary_content) {
		element.supplementary_content.forEach(function(content) {
			addRelationRDF(rdf, content.contentId, id, 'associatedTo', relIndex++, {'relationType': content.contentGroup});
		});
	}
	if(element.concepts) {
		element.concepts.forEach(function(concept) {
			addRelationRDF(rdf, concept.conceptIdentifier, id, 'associatedTo', relIndex++, {'relationType': 'concept'});
		});
	}
}

exports.exportLearningActivityToMW = function(elementId) {

	var rdf = {};
	LearningActivityModel = mongoose.model('LearningActivityModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: elementId}]))
	.then(function(element) {
		rdf['pedagogyId'] = element.pedagogyId;
		return getLearningActivityRDF(rdf, 1, element);
	})
	.then(function() {
		delete rdf['pedagogyId'];
		var req = new Object();
	    req.LEARNING_OBJECT = JSON.stringify(rdf);
	    req.LEARNING_OBJECT_ID = '';
	    req.SAVE_RECURSIVE = false;
	    var deferred = promise_lib.defer();
	    MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
	        if (err) {
	            console.log("Error in Response from MW exportLearningActivityToMW: " + JSON.stringify(err, null, 4));
	            dererred.reject(err);
	        } else {
	            console.log("Response from MW exportLearningActivityToMW: " + JSON.stringify(data, null, 4));
	            deferred.resolve(data);
	        }
	    });
	    return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error updating learning activity in MW - ', err);
	})
	.done();
}

function getLearningActivityRDF(rdf, relIndex, element) {
	var id = element.identifier;
	var rdfNode = getRDFNode('NODE', rdf.pedagogyId, element.nodeSet, id, element.metadata);
	addProperty(rdfNode, "name", element.name);
	addProperty(rdfNode, "isMandatory", element.isMandatory);
	addProperty(rdfNode, "completionCriteriaExpr", element.completionCriteriaExpr);

	if(element.preConditions && element.preConditions.length > 0) {
		addProperty(rdfNode, "preConditions", JSON.stringify(element.preConditions));
	}
	if(element.completionCriteria && element.completionCriteria.length > 0) {
		addProperty(rdfNode, "completionCriteria", JSON.stringify(element.completionCriteria));
	}
	if(element.conditions && element.conditions.length > 0) {
		addProperty(rdfNode, "conditions", JSON.stringify(element.conditions));
	}
	rdf[id] = rdfNode;

	addRelationRDF(rdf, element.contentIdentifier, id, 'associatedTo', relIndex++, {'relationType': 'main'});
	if(element.supplementary_content) {
		element.supplementary_content.forEach(function(content) {
			addRelationRDF(rdf, content.contentId, id, 'associatedTo', relIndex++, {'relationType': content.contentGroup});
		});
	}
	if(element.concepts) {
		element.concepts.forEach(function(concept) {
			addRelationRDF(rdf, concept.conceptIdentifier, id, 'associatedTo', relIndex++, {'relationType': 'concept'});
		});
	}
}

exports.exportLearningCollectionToMW = function(elementId) {

	var rdf = {};
	LearningCollectionModel = mongoose.model('LearningCollectionModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: elementId}]))
	.then(function(element) {
		rdf['pedagogyId'] = element.pedagogyId;
		return getLearningCollectionRDF(rdf, 1, element);
	})
	.then(function() {
		delete rdf['pedagogyId'];
		var req = new Object();
	    req.LEARNING_OBJECT = JSON.stringify(rdf);
	    req.LEARNING_OBJECT_ID = '';
	    req.SAVE_RECURSIVE = false;
	    var deferred = promise_lib.defer();
	    MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
	        if (err) {
	            console.log("Error in Response from MW exportLearningCollectionToMW: " + JSON.stringify(err, null, 4));
	            dererred.reject(err);
	        } else {
	            console.log("Response from MW exportLearningCollectionToMW: " + JSON.stringify(data, null, 4));
	            deferred.resolve(data);
	        }
	    });
	    return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error updating learning collection in MW - ', err);
	})
	.done();
}

function getLearningCollectionRDF(rdf, relIndex, element) {
	var id = element.identifier;
	var rdfNode = getRDFNode('NODE', rdf.pedagogyId, element.nodeSet, id, element.metadata);
	addProperty(rdfNode, "name", element.name);
	addProperty(rdfNode, "isMandatory", element.isMandatory);
	addProperty(rdfNode, "entryCriteriaExpr", element.completionCriteriaExpr);

	if(element.preConditions && element.preConditions.length > 0) {
		addProperty(rdfNode, "preConditions", JSON.stringify(element.preConditions));
	}
	if(element.entryCriteria && element.entryCriteria.length > 0) {
		addProperty(rdfNode, "entryCriteria", JSON.stringify(element.entryCriteria));
	}
	if(element.conditions && element.conditions.length > 0) {
		addProperty(rdfNode, "conditions", JSON.stringify(element.conditions));
	}
	rdf[id] = rdfNode;
	addRelationRDF(rdf, element.sequenceId, id, 'hasSequence', relIndex++);
	if(element.elements) {
		element.elements.forEach(function(elem) {
			addRelationRDF(rdf, elem.identifier, id, 'hasConstituent', relIndex++);
		});
	}
	if(element.sequence) {
		var idx = 1;
		element.sequence.forEach(function(elementId) {
			addRelationRDF(rdf, elementId, element.sequenceId, 'hasCollectionMember', relIndex++, {'sequence_index':idx++});
		});
	}
}

exports.exportLOBToMW = function(elementId) {

	var rdf = {};
	var relIndex = 1;
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectModel.findOne, LearningObjectModel, [{identifier: elementId}]))
	.then(function(element) {
		rdf['pedagogyId'] = element.pedagogyId;
		return getLobRDF(rdf, relIndex, element);
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{lobId: elementId}]))
	.then(function(lobElement) {
		return getLobElementsRDF(rdf, relIndex, lobElement);
	})
	.then(function() {
		delete rdf['pedagogyId'];
		var req = new Object();
	    req.LEARNING_OBJECT = JSON.stringify(rdf);
	    req.LEARNING_OBJECT_ID = '';
	    req.SAVE_RECURSIVE = false;
	    var deferred = promise_lib.defer();
	    MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
	        if (err) {
	            console.log("Error in Response from MW exportLearningCollectionToMW: " + err);
	            deferred.reject(err);
	        } else {
	            console.log("Response from MW exportLearningCollectionToMW: " + data);
	            deferred.resolve(data);
	        }
	    });
	    return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error updating learning collection in MW - ', err);
	})
	.done();
}

function getLobElementsRDF(rdf, relIndex, lobElement) {
	var id = lobElement.lobId;
	if(lobElement.elements) {
		lobElement.elements.forEach(function(elem) {
			addRelationRDF(rdf, elem.elementId, id, 'hasConstituent', relIndex++);
		});
	}
	if(lobElement.supplementary_content) {
		lobElement.supplementary_content.forEach(function(content) {
			addRelationRDF(rdf, content.contentId, id, 'associatedTo', relIndex++, {'relationType': content.contentGroup});
		});
	}
}

function getLobRDF(rdf, relIndex, element) {
	LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
	var deferred = promise_lib.defer();
	var id = element.identifier;
	var rdfNode = getRDFNode('NODE', element.pedagogyId, element.nodeSet, id, element.metadata);
	addProperty(rdfNode, "name", element.name);
	rdf[id] = rdfNode;

	var seqNode = {};
    addProperty(seqNode, "id", element.sequenceId);
    addProperty(seqNode, "node_type", "ORDERED_LIST");
    addProperty(seqNode, "pedagogyId", element.pedagogyId);
    addProperty(seqNode, "setType", ViewHelperConstants.SEQUENCE);
    addProperty(seqNode, "title", "Sequence");
    rdf[element.sequenceId] = seqNode;

	addRelationRDF(rdf, element.sequenceId, id, 'hasSequence', relIndex++);
	if(element.children) {
		element.children.forEach(function(elem) {
			addRelationRDF(rdf, elem.identifier, id, elem.relationName, relIndex++);
		});
	}
	if(element.concepts) {
		element.concepts.forEach(function(concept) {
			addRelationRDF(rdf, concept.conceptIdentifier, id, 'associatedTo', relIndex++, {'relationType': 'concept'});
		});
	}
	var idx = 1;
	if(element.sequence) {
		element.sequence.forEach(function(elementId) {
			addRelationRDF(rdf, elementId, element.sequenceId, 'hasCollectionMember', relIndex++, {'sequence_index':idx++});
		});
	}
	LearningObjectElementsModel.findOne({lobId: id}, 'sequence').exec(function(err, lobElement) {
		if(lobElement && lobElement.sequence) {
			lobElement.sequence.forEach(function(elementId) {
				addRelationRDF(rdf, elementId, element.sequenceId, 'hasCollectionMember', relIndex++, {'sequence_index':idx++});
			});
		}
		deferred.resolve(rdf);
	});
	return deferred.promise;
}

exports.exportCourseToMW = function(courseId) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
	LearningResourceModel = mongoose.model('LearningResourceModel');
	LearningActivityModel = mongoose.model('LearningActivityModel');
	LearningCollectionModel = mongoose.model('LearningCollectionModel');
	var error = false;
	var rdf = {};
	var contentArray = [], mediaArray = [], conceptArray = [];
	var relIndex = 1;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectModel.findOne, LearningObjectModel, [{identifier: courseId}]))
	.then(function(course) {
		rdf['pedagogyId'] = course.pedagogyId;
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectModel.find, LearningObjectModel, [{courseId: courseId}]))
	.then(function(lobs) {
		var defer = promise_lib.defer();
		var promises = [];
		lobs.forEach(function(lob) {
			promises.push(getLobRDF(rdf, relIndex, lob));
		});
		promise_lib.all(promises).then(function(value) {
			console.log('LOB RDF exported');
		    defer.resolve();
		});
		return defer.promise;
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.find, LearningObjectElementsModel, [{courseId: courseId}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			getLobElementsRDF(rdf, relIndex, element);
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(obj) {
					if(contentArray.indexOf(obj.contentId) == -1)
						contentArray.push(obj.contentId);
				});
			}
			if(element.concepts) {
				element.concepts.forEach(function(obj) {
					if(conceptArray.indexOf(obj.conceptIdentifier) == -1)
						conceptArray.push(obj.conceptIdentifier);
				});
			}
		});
		console.log('LOB Elements RDF exported');
		return rdf;
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.find, LearningResourceModel, [{courseId: courseId}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			getLearningResourceRDF(rdf, relIndex, element);
			if(contentArray.indexOf(element.contentIdentifier) == -1)
				contentArray.push(element.contentIdentifier);
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(obj) {
					if(contentArray.indexOf(obj.contentId) == -1)
						contentArray.push(obj.contentId);
				});
			}
			if(element.concepts) {
				element.concepts.forEach(function(obj) {
					if(conceptArray.indexOf(obj.conceptIdentifier) == -1)
						conceptArray.push(obj.conceptIdentifier);
				});
			}
		});
		console.log('Learning Resources RDF exported');
		return rdf;
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.find, LearningActivityModel, [{courseId: courseId}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			getLearningActivityRDF(rdf, relIndex, element);
			if(contentArray.indexOf(element.contentIdentifier) == -1)
				contentArray.push(element.contentIdentifier);
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(obj) {
					if(contentArray.indexOf(obj.contentId) == -1)
						contentArray.push(obj.contentId);
				});
			}
			if(element.concepts) {
				element.concepts.forEach(function(obj) {
					if(conceptArray.indexOf(obj.conceptIdentifier) == -1)
						conceptArray.push(obj.conceptIdentifier);
				});
			}
		});
		console.log('Learning Activities RDF exported');
		return rdf;
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.find, LearningCollectionModel, [{courseId: courseId}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			getLearningCollectionRDF(rdf, relIndex, element);
		});
		console.log('Learning Collections RDF exported');
		return rdf;
	})
	.then(function() {
		// Create content RDF's and populate media content
		var defer = promise_lib.defer();
		ContentModel = mongoose.model('MediaContentModel');
		ContentModel.find().where('identifier').in(contentArray).exec(function (err, contents) {
			contents.forEach(function(content) {
				getContentRDF(rdf, relIndex, content);
				if(content.media) {
					content.media.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.transcripts) {
					content.transcripts.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.subtitles) {
					content.subtitles.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.concepts) {
					content.concepts.forEach(function(obj) {
						if(conceptArray.indexOf(obj.conceptIdentifier) == -1)
							conceptArray.push(obj.conceptIdentifier);
					});
				}
			});
			console.log('Contents RDF exported');
			defer.resolve(rdf);
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		var promises = [];
		mediaArray.forEach(function(mediaId) {
			promises.push(getMediaRDF(rdf, relIndex, mediaId));
		});
		promise_lib.all(promises).then(function(value) {
			console.log('Media RDF exported');
		    defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		var promises = [];
		conceptArray.forEach(function(conceptId) {
			promises.push(getConceptRDF(rdf, relIndex, conceptId));
		});
		promise_lib.all(promises).then(function(value) {
			console.log('Concepts RDF exported');
		    defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		console.log('Exporting the course to MW');
		delete rdf.pedagogyId;
		writeToFile(rdf);
		//return exportToMW(rdf, courseId, true);
	})
	.catch(function(err) {
		console.log('err', err);
		error = true;
		deferred.reject(err);
	})
	.done(function(data) {
		if(!error) {
			console.log('Export completed successfully');
			deferred.resolve(data);
		}
	});
	return deferred.promise;
}

function writeToFile(rdf) {
	var fs = require('fs');
	fs.writeFile('course_rdf_output.rdf', JSON.stringify(rdf), function (err) {
	  	if (err) {
	  		console.log('unable to save');
	  	} else {
	  		console.log('It\'s saved!');
	  	}
	});
}

exports.getCourseFromMW = function(courseId) {
	promise_lib.resolve()
	.then(function() {
		return importCourseFromMW(courseId);
	})
	.then(function(data) {
		var deferred = promise_lib.defer();
		var mwData = eval('(' + data + ')');
		var rdf = mwData.responseValueObjects.LEARNING_OBJECT.id;
		rdfGraphUtil.getGraphFromRDF(rdf, function(result) {
			deferred.resolve(result.graph);
		});
		return deferred.promise;
	})
	.done(function(graph) {
		courseImportHelper = require('./CourseImportHelper');
		courseImportHelper.saveIntoOrchestrator(graph);
	});
}

function importCourseFromMW(courseId) {
	var req = new Object();
    req.LEARNING_OBJECT_ID = courseId;
    var deferred = promise_lib.defer();
    MWServiceProvider.callServiceStandard("DummyService", "getLearningObject", req, function(err, data, response) {
        if (err) {
            console.log("Error in Response from MW getLearningObject: " + JSON.stringify(err, null, 4));
            dererred.reject(err);
        } else {
            //console.log("Response from MW getLearningObject: " + JSON.stringify(JSON.parse(data)));
            var mwData = eval('(' + data + ')');
			var rdf = mwData.responseValueObjects.LEARNING_OBJECT.id;
            var fs = require('fs');
            fs.writeFile('course_rdf_import.rdf', JSON.stringify(JSON.parse(rdf)), function (err) {
			  	if (err) {
			  		console.log('unable to save');
			  	} else {
			  		console.log('It\'s saved!');
			  	}
			});
            deferred.resolve(data);
        }
    });
    return deferred.promise;
}

exports.emptyObjectInMW = function(objectId) {
    var req = new Object();
    req.LEARNING_OBJECT_ID = objectId;
    MWServiceProvider.callServiceStandard("DummyService", "EmptyObject", req, function(err, data, response) {
        if (err) {
            console.log("Error in Response from MW emptyObject: " + JSON.stringify(err, null, 4));
        } else {
            console.log("Response from MW emptyObject: " + JSON.stringify(data, null, 4));
        }
    });
}

exports.setDeleteStatusInMW = function(objectId) {
    var req = new Object();
    req.LEARNING_OBJECT_ID = objectId;
    req.METADATA = {"valueObjectList":[{"propertyName":"deleteStatus","propertyValue":"true"}]};
    MWServiceProvider.callServiceStandard("DummyService", "SetMetadata", req, function(err, data, response) {
        if (err) {
            console.log("Error in Response from MW setDeleteStatusInMW: " + JSON.stringify(err, null, 4));
        } else {
            console.log("Response from MW setDeleteStatusInMW: " + JSON.stringify(data, null, 4));
        }
    });
}

exports.disconnectObjectInMW = function(parentId, objectId, relation) {
    var req = new Object();
    req.LEARNING_OBJECT_ID = parentId;
    req.CONNECTED_OBJECT = objectId;
    req.RELATION = relation;
    
    MWServiceProvider.callServiceStandard("DummyService", "DisconnectObject", req, function(err, data, response) {
        console.log("Request:",JSON.stringify(req));
        if (err) {
            console.log("Error in Response from MW disconnectObjectInMW: " + JSON.stringify(err, null, 4));
        } else {
            console.log("Response from MW disconnectObjectInMW: " + JSON.stringify(data, null, 4));
        }
    });
}


exports.updateSequenceInMW = function(parentId, objectType) {
    var errors = [];
    var MongoHelper = require('../../commons/MongoHelper');
    var sequenceId = null;
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MongoHelper.findOne('LearningObjectModel', {identifier: parentId}, function(err, object) {
            if(err) {
                deferred.reject(err);
            } else if(!object) {
                deferred.reject('parent not found from LearningObjectModel:'+parentId);
            } else {
                deferred.resolve(object);
            }
        });
        return deferred.promise;
    })
    .then(function(object) {
        var deferred = promise_lib.defer();
        if(object && object.sequence.length > 0) {
            var req = new Object();
            req.LEARNING_OBJECT_ID = object.identifier;
            req.SEQUENCE = object.sequenceId;
            var lobSequence = [];
            object.sequence.forEach(function(childLOBId) {
                lobSequence.push({"id":childLOBId});
            });
            req.LEARNING_OBJECT = {"valueObjectList": lobSequence};
            MWServiceProvider.callServiceStandard("DummyService", "UpdateSequence", req, function(err, data, response) {
                console.log("Request:",JSON.stringify(req));
                if (err) {
                    console.log("Error in Response from MW updateSequenceInMW: " + JSON.stringify(err, null, 4));
                } else {
                    console.log("Response from MW updateSequenceInMW: " + JSON.stringify(data, null, 4));
                }
            });
        } else {
            deferred.reject('sequence is empty on object '+parentId);
        }
        return deferred.promise;
    })
    .catch(function(err) {
        console.log("Error in updateSequenceInMW:", err);
    })
    .done(function() {

    });
}
//exports.exportCourseToMW('info:fedora/learning:10626');
//exports.getCourseFromMW('info:fedora/learning:10626');
