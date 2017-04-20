/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Learning Collections
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');
var errorModule = require('../ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
LearningCollectionModel = mongoose.model('LearningCollectionModel');
var ViewHelperConstants = require('../ViewHelperConstants');
var courseMWHelper = require('./CourseMWViewHelper');

exports.getLearningCollection = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: req.params.id}]))
	.catch (buildCatchFunction(error))
	.done(buildDoneFunction(error, "ERROR_FETCHING_LEARNING_COLLECTION", req, res));
}

exports.addLearningCollection = function(req, res) {
	IDCacheUtil.getId(function(id) {
		PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
		LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(PedagogyNodeSetModel.findOne, PedagogyNodeSetModel, [{identifier: collection.nodeSetId}]))
		.then(ViewHelperUtil.buildTaxonomyFunction(collection))
		.then(function() {
			var deferred = promise_lib.defer();
			var collection = new LearningCollectionModel();
			for(k in collection) {
				collection[k] = collection[k];
			}
			collection.save(function(err, object) {
			    if(err) {
			      	deferred.reject(err);
			    } else {
			    	var lobViewHelper = require('./LearningObjectViewHelper');
			    	lobViewHelper.addElement({name: collection.name, elementId: id, elementType: 'Collection'}, collection.lobId);
			      	deferred.resolve(object);
			    }
			});
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error, id))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_COLLECTION", req, res));
	});
}

exports.deleteLearningCollection = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOneAndRemove, LearningCollectionModel, [{identifier: req.body.collectionId}]))
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_COLLECTION", req, res));
}

exports.addElement = function(element, collId) {
	LearningCollectionModel.findOne({identifier: collId}).exec(function(err, collection) {
		if (err) {
			console.log('Error adding elements to Collection');
		} else {
			collection.elements.push(element);
			collection.sequence.push(element.identifier);
			collection.markModified('elements');
			collection.markModified('sequence');
			collection.save();
		}
	});
}

exports.updateMetadata = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: req.body.collectionId}, "metadata"]))
	.then(function(collection) {
		var deferred = promise_lib.defer();
		if(typeof collection === 'undefined')  {
			deferred.reject('No learning resource found for the matching id');
		} else {
			for(var k in req.body.metadata) collection.metadata[k] = req.body.metadata[k];
			collection.markModified('metadata');
			collection.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_LEARNING_COLLECTION_METADATA", req, res));
}

exports.updateSequence = function(req, res) {
	LearningCollectionModel.findOne({identifier: req.body.collectionId}).exec(function(err, collection) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_COLLECTION", req, res);
		} else {
			collection.sequence = req.body.sequence;
			collection.markModified('sequence');
			collection.save(function(err) {
				if(err) {
					errorModule.handleError(err, "ERROR_UPDATING_COLLECTION_SEQUENCE", req, res);
				} else {
					res.send(JSON.stringify({status: "OK"}));
				}
			});
		}
	});
};

exports.addPreCondition = function(req, res) {
	IDCacheUtil.getId(function(id) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: req.body.collectionId}, "preConditions"]))
		.then(function(collection) {
			var deferred = promise_lib.defer();
			if(typeof collection === 'undefined')  {
				deferred.reject('No Collection found for the matching id');
			} else {
				collection.preConditions.push(req.body.preCondition);
				collection.markModified('preConditions');
				collection.save(ViewHelperUtil.buildUpdateFunction(deferred));
			}
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_PRE_CONDITION", req, res));
	});
}

exports.updatePreCondition = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: req.body.collectionId}, "preConditions"]))
	.then(function(collection){
		var deferred = promise_lib.defer();
		if(typeof collection.preConditions === 'undefined')  {
			deferred.reject('No pre-conditions found for the matching learning resource');
		} else {
			var preCondition;
			collection.preConditions.forEach(function(preCond) {
				if(preCond._id == req.body.condId) {
					preCondition = preCond;
				}
			});
			for(k in req.body.preCondition) preCondition[k] = req.body.preCondition[k];
			collection.markModified('preConditions');
			collection.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_PRE_CONDITION", req, res));
}

exports.deletePreCondition = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: req.body.collectionId}, "preConditions"]))
	.then(function(collection){
		var deferred = promise_lib.defer();
		if(typeof collection.preConditions === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			collection.preConditions.forEach(function(ref) {
				if(ref._id == req.body.condId) {
					ref.remove();
				}
			});
			collection.markModified('preConditions');
			collection.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_PRE_CONDITION", req, res));
}

exports.updateEntryCriteria = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: req.body.collectionId}, "entryCriteria"]))
	.then(function(collection){
		var deferred = promise_lib.defer();
		if(typeof collection === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			collection.entryCriteria = [];
			req.body.criteria.forEach(function(criteria) {
				collection.entryCriteria.push(criteria);
			});
			collection.entryCriteriaExpr = ViewHelperUtil.buildExpression(req.body.criteria);
			collection.markModified('entryCriteria');
			collection.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_REFERENCE", req, res));
}

exports.importLearningCollection = function(node, graph, courseId) {
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);
	var isNew = false;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: id}]))
	.then(function(element) {
		var deferred = promise_lib.defer();
		if(typeof element == 'undefined' || element == null) {
			element = new LearningResourceModel();
			element.identifier = id;
			element.courseId = courseId;
			isNew = true;
		}
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'lobId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'courseId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'nodeSet', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'nodeSetId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'taxonomyId', element);

		ViewHelperUtil.setJSONObject(node, 'preConditions', element);
		ViewHelperUtil.setJSONObject(node, 'entryCriteria', element);
		ViewHelperUtil.setJSONObject(node, 'entryCriteriaExpr', element);
		ViewHelperUtil.setJSONObject(node, 'conditions', element);
		var required = ViewHelperUtil.getNodeProperty(node, 'isMandatory');
		element.isMandatory = (required == 'false' ? false : true);

		var sequence = ViewHelperUtil.getSequence(id, graph);
		ViewHelperUtil.setSequence(sequence, graph, element, 'Collection');
		if(typeof element.metadata == 'undefined' || element.metadata == null) element.metadata = {};
		for(k in metadata) {
			element.metadata[k] = metadata[k];
		}
		element.is_deleted = false;
		element.markModified('metadata');
		element.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				if(typeof object.nodeSetId === 'undefined' || object.nodeSetId == null) {
					PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
					PedagogyNodeSetModel.findOne({nodeSetClass: object.nodeSet, pedagogyId: ViewHelperUtil.getNodeProperty(node, 'pedagogyId')}).exec(function(err, nodeSet) {
						if(!err) {
							object.nodeSetId = nodeSet.identifier;
							object.taxonomyId = nodeSet.taxonomyId;
							object.save(function(err) {
								if(err) {
									console.log('Error importing LOB Collection - ', err);
								}
							});
						}
					});
				}
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.done(function(element) {
		var saveType = (isNew) ? ViewHelperConstants.INSERT : ViewHelperConstants.UPDATE;
		var resolveObject = {
            'saveType': saveType,
            'object': JSON.stringify(element)
        };
     // console.log("resolveObject:",resolveObject);
		defer.resolve(resolveObject);
	});
	return defer.promise;
}

exports.importRelation = function(edge, node, childNode) {
	var relation = ViewHelperUtil.getNodeProperty(edge, 'relation_label');
	var relationType = ViewHelperUtil.getNodeProperty(edge, 'relationType');
	var childNodeType = ViewHelperUtil.getNodeProperty(childNode, 'setType');
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.findOne, LearningCollectionModel, [{identifier: ViewHelperUtil.getNodeProperty(node, 'identifier')}]))
	.then(function(element) {
		if(childNodeType == ViewHelperConstants.LEARNING_RESOURCE || childNodeType == ViewHelperConstants.LEARNING_ACTIVITY
			|| childNodeType == ViewHelperConstants.COLLECTION) {
			upsertElement(element, childNode, childNodeType);
		}
	})
	.done(function() {
		defer.resolve();
	});
	return defer.promise;
}

function upsertElement(learningElement, node, elementType) {
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var matched;
	if(learningElement.elements) {
		learningElement.elements.forEach(function(element) {
			if(element.elementId == nodeId && element.elementType == elementType) {
				matched = element;
			}
		});
	}
	if(!matched) {
		var element = {
			name: ViewHelperUtil.getNodeProperty(node, 'name'),
			elementId: nodeId,
			elementType: elementType
		};
		element.isMandatory = (ViewHelperUtil.getNodeProperty(node, 'isMandatory') == 'false' ? false : true);
		learningElement.elements.push(element);
	} else {
		matched.isMandatory = (ViewHelperUtil.getNodeProperty(node, 'isMandatory') == 'false' ? false : true);
	}
	learningElement.markModified('elements');
	learningElement.save(function(err) {
		if(err) console.log('Error upserting collection elements on import - ', err);
	});
}

exports.deleteCollection = function(object) {
	object.recursive = object.recursive.toLowerCase();
	var isRecursive = (object.recursive == 'true' || object.recursive == 'Y');
	var message = '';
	var errors = [];
	var deleted = [];
	var extId = null;
	var courseId;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearningCollectionModel.findOne({identifier: object.nodeId}).exec(function(err, lcObject) {
			if(err) {
				deferred.reject(err);
			} else if(!lcObject) {
				extId = object.nodeId;
				deferred.reject('element does not exist.');
			} else {
				extId = lcObject.metadata.nodeId;
				courseId = lcObject.courseId;
				if(!isRecursive && (lcObject.elements.length > 0)) {
					deferred.reject(lcObject.metadata.nodeId+' have children. please select recursive.');
				} else {
					deferred.resolve();
				}
			}
		});
		return deferred.promise;
	})
	.then(function() {
		var deferred = promise_lib.defer();
		if(object.parentNodeId != '') {
			//Delete the parent relation
			deleteCollectionRelation(object.parentNodeId, object.nodeId, object.parentNodeType.toLowerCase())
			.then(function(msg) {
				message = msg;
				deferred.resolve(true);
			});
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	})
	.then(function(checkForParent) {
		var deferred = promise_lib.defer();
		if(checkForParent) {
			isReferenced(object.nodeId).then(function(hasParent) {
				deferred.resolve(!hasParent);
			});
		} else {
			deferred.resolve(true);
		}
		return deferred.promise;
	})
	.then(function(deleteElement) {
		var deferred = promise_lib.defer();
		if(deleteElement) {
			deleteCollectionRelations(object.nodeId).then(function() {
				deferred.resolve(true);
			});
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	})
	.then(function(deleteElement) {
		var deferred = promise_lib.defer();
		if(deleteElement) {
			if(object.isRemove) {
				LearningCollectionModel.findOneAndRemove({identifier: object.nodeId}).exec(function(err, deletedObject) {
					if(err) {
						deferred.reject(err);
					} else {
						courseMWHelper.emptyObjectInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve(deletedObject);
					}
				});
			} else {
				LearningCollectionModel.findOneAndUpdate({identifier: object.nodeId}, {'is_deleted' : true}).exec(function(err, deletedObject) {
					if(err) {
						deferred.reject(err);
					} else {
						// TODO MW update is pending... removeRelation(parentNodeId), updateDeleteFlag.
						courseMWHelper.setDeleteStatusInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve(deletedObject);
					}
				});
			}
		} else {
			message += object.nodeId + ' is not deleted as it is referenced by another object';
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function(deletedObject) {
		if(deletedObject && isRecursive) {
			var lrViewHelper = require('./LearningResourceViewHelper');
			var laViewHelper = require('./LearningActivityViewHelper');
			var promises = [];
			deletedObject.elements.forEach(function(element) {
				if(element.elementType == ViewHelperConstants.LEARNING_RESOURCE) {
					promises.push(lrViewHelper.deleteLearningResource({
						nodeId: element.elementId,
						parentNodeId: deletedObject.identifier,
						parentNodeType: ViewHelperConstants.COLLECTION,
						recursive: 'true',
						isRemove: object.isRemove
					}));
				} else if(element.elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
					promises.push(laViewHelper.deleteLearningActivity({
						nodeId: element.elementId,
						parentNodeId: deletedObject.identifier,
						parentNodeType: ViewHelperConstants.COLLECTION,
						recursive: 'true',
						isRemove: object.isRemove
					}));
				} else if(element.elementType == ViewHelperConstants.COLLECTION) {
					promises.push(exports.deleteCollection({
						nodeId: element.elementId,
						parentNodeId: deletedObject.identifier,
						parentNodeType: ViewHelperConstants.COLLECTION,
						recursive: 'true',
						isRemove: object.isRemove
					}));
				}
			});
			return promise_lib.all(promises);
		}
	})
	.then(function(promises) {
		if(promises) {
			promises.forEach(function(promise) {
				promise.deletedList.forEach(function(deletedNodeId) {
					deleted.push(deletedNodeId);
				});
			});
		}
		
	})
	.catch(function(err) {
		console.log('Error deleting learning collection - ', err);
		if(err) errors.push(err);
	})
	.done(function() {
		if(errors.length > 0) {
			errors.forEach(function(err) {
				message+=err;
			});
		}
		console.log("Length: ", deleted.length);
		console.log("LC DELETED: ", deleted);
		defer.resolve({'message': message, 'extId': extId, 'deletedList': deleted, 'courseId': courseId});
	});
	return defer.promise;
}

function deleteCollectionRelations(elementId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
		LearningObjectElementsModel.find({'elements.elementId': elementId}).exec(function(err, lobs) {
			if(err) {
				defer.reject(err);
			} else if(lobs && lobs.length > 0) {
				var promises = [];
				lobs.forEach(function(lob) {
					promises.push(deleteCollectionRelation(lob.lobId, elementId, ViewHelperConstants.LEARNING_OBJECT));
				})
				promise_lib.all(promises).then(function(value) {
				    defer.resolve();
				});
			} else {
				defer.resolve();
			}
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningCollectionModel = mongoose.model('LearningCollectionModel');
		LearningCollectionModel.find({'elements.elementId': elementId}).exec(function(err, lobs) {
			if(err) {
				defer.reject(err);
			} else if(lobs && lobs.length > 0) {
				var promises = [];
				lobs.forEach(function(lob) {
					promises.push(deleteCollectionRelation(lob.identifier, elementId, ViewHelperConstants.COLLECTION));
				})
				promise_lib.all(promises).then(function(value) {
				    defer.resolve();
				});
			} else {
				defer.resolve();
			}
		});
		return defer.promise;
	})
	.done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}

function deleteCollectionRelation(parentId, elementId, nodeType) {
	var deferred = promise_lib.defer();

	switch(nodeType) {
		case ViewHelperConstants.LEARNING_OBJECT:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
				LearningObjectElementsModel.update({lobId: parentId},{$pull: { elements: {'elementId': elementId}}}).exec(function(err, pulledObj) {
					if(err) console.log('Unable to delete LOB - LA relation - ', err);
					defer.resolve();
				});
				defer.promise;
			})
			.then(function() {
				var defer = promise_lib.defer();
				LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
				LearningObjectElementsModel.update({lobId: parentId},{$pull: {'sequence': elementId}}).exec(function(err, pulledObj) {
					if(err) console.log('Unable to delete LOB - LA relation - ', err);
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				/*courseMWHelper.exportLOBToMW(parentId);*/
				courseMWHelper.disconnectObjectInMW(parentId, elementId, 'hasConstituent');
				courseMWHelper.updateSequenceInMW(parentId, 'LearningObjectModel');
				deferred.resolve('Relation between ' + parentId + ' and ' + elementId + ' is deleted.');
			});
			break;
		case ViewHelperConstants.COLLECTION:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningCollectionModel = mongoose.model('LearningCollectionModel');
				LearningCollectionModel.update({identifier: parentId},{$pull: { elements: {'elementId': elementId}}}).exec(function(err, pulledObj) {
					if(err) console.log('Unable to delete Collection - LA relation - ', err);
					defer.resolve();
				});
				defer.promise;
			})
			.then(function() {
				var defer = promise_lib.defer();
				LearningCollectionModel = mongoose.model('LearningCollectionModel');
				LearningCollectionModel.update({identifier: parentId},{$pull: {'sequence': elementId}}).exec(function(err, pulledObj) {
					if(err) console.log('Unable to delete LOB - LR relation - ', err);
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				/*courseMWHelper.exportLearningCollectionToMW(parentId);*/
				courseMWHelper.disconnectObjectInMW(parentId, elementId, 'hasConstituent');
				courseMWHelper.updateSequenceInMW(parentId, 'LearningObjectModel');
				deferred.resolve('Relation between ' + parentId + ' and ' + elementId + ' is deleted.');
			});
			break;
	}
	return deferred.promise;
}

function isReferenced(elementId) {
	var hasParent = false;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
		LearningObjectElementsModel.count({'elements.elementId': elementId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningCollectionModel = mongoose.model('LearningCollectionModel');
		LearningCollectionModel.count({'elements.elementId': elementId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.done(function() {
		deferred.resolve(hasParent);
	});
	return deferred.promise;
}
