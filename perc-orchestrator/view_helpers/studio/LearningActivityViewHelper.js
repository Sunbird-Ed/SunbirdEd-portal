/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Learning Object Resources
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');
var errorModule = require('../ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
LearningActivityModel = mongoose.model('LearningActivityModel');
var ViewHelperConstants = require('../ViewHelperConstants');
var courseMWHelper = require('./CourseMWViewHelper');
var importer = require('./CourseImportHelper.js');

exports.getLearningActivity = function(req, res) {
	var error = {};
	var id = req.params.id || req.boyd.elementId;
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: id}]))
    .then(function(element) {
    	var deferred = promise_lib.defer();
    	MediaContentModel = mongoose.model('MediaContentModel');
    	MediaContentModel.findOne({identifier: element.contentIdentifier}).exec(function(err, content) {
    		var elementObj = element.toObject();
    		elementObj['media'] = content.media;
    		deferred.resolve(elementObj);
    	});
    	return deferred.promise;
    })
	.catch (buildCatchFunction(error))
	.done(buildDoneFunction(error, "ERROR_FETCHING_LEARNING_ACTIVITY", req, res));
}

exports.addLearningActivities = function(req, res) {

	req.body.las.forEach(function(la) {
		IDCacheUtil.getId(function(id) {
			PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
			LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
			var error = {};
			promise_lib.resolve()
		    .then(ViewHelperUtil.promisifyWithArgs(PedagogyNodeSetModel.findOne, PedagogyNodeSetModel, [{identifier: la.nodeSetId}]))
			.then(ViewHelperUtil.buildTaxonomyFunction(la))
			.then(function() {
				var deferred = promise_lib.defer();
				var learningActivity = new LearningActivityModel();
				for(k in la) {
					learningActivity[k] = la[k];
				}
				learningActivity.save(buildCreateFunction(deferred));
				return deferred.promise;
			})
			.then(function() {
				if(la.lobId) {
					var lobViewHelper = require('./LearningObjectViewHelper');
			    	lobViewHelper.addElement({name: la.name, elementId: id, elementType: 'LearningResource'}, la.lobId);
				} else {
					var collViewHelper = require('./LearningCollectionViewHelper');
			    	collViewHelper.addElement({name: la.name, elementId: id, elementType: 'LearningResource'}, la.collId);
				}
			})
			.catch (ViewHelperUtil.buildCatchFunction(error, id))
			.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_LEARNING_ACTIVITY", req, res));
		});
	});
}

exports.updateLearningActivity = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.id}]))
	.then(function(learningActivity) {
		var deferred = promise_lib.defer();
		if(typeof learningActivity === 'undefined')  {
			deferred.reject('No learning activity found for the matching id');
		} else {
			for(var k in req.body.la) learningActivity[k] = req.body.la[k];
			learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
			var lobViewHelper = require('./LearningObjectViewHelper');
			lobViewHelper.updateElementMandatory(learningActivity.lobId, req.body.id, learningActivity.isMandatory);
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_LEARNING_RESOURCE", req, res));
}

exports.updateMetadata = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.laId}, "metadata"]))
	.then(function(learningActivity) {
		var deferred = promise_lib.defer();
		if(typeof learningActivity === 'undefined')  {
			deferred.reject('No learning activity found for the matching id');
		} else {
			for(var k in req.body.metadata) learningActivity.metadata[k] = req.body.metadata[k];
			learningActivity.markModified('metadata');
			learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_LEARNING_ACTIVITY_METADATA", req, res));
}

exports.addPreCondition = function(req, res) {
	IDCacheUtil.getId(function(id) {
		LearningActivityModel = mongoose.model('LearningActivityModel');
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.laId}, "preConditions"]))
		.then(function(learningActivity) {
			var deferred = promise_lib.defer();
			if(typeof learningActivity === 'undefined')  {
				deferred.reject('No learning activity found for the matching id');
			} else {
				learningActivity.preConditions.push(req.body.preCondition);
				learningActivity.markModified('preConditions');
				learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
			}
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_PRE_CONDITION", req, res));
	});
}

exports.updatePreCondition = function(req, res) {
	LearningActivityModel = mongoose.model('LearningActivityModel');
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.laId}, "preConditions"]))
	.then(function(learningActivity){
		var deferred = promise_lib.defer();
		if(typeof learningActivity.preConditions === 'undefined')  {
			deferred.reject('No pre-conditions found for the matching learning resource');
		} else {
			var preCondition;
			learningActivity.preConditions.forEach(function(preCond) {
				if(preCond._id == req.body.condId) {
					preCondition = preCond;
				}
			});
			for(k in req.body.preCondition) preCondition[k] = req.body.preCondition[k];
			learningActivity.markModified('preConditions');
			learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_PRE_CONDITION", req, res));
}

exports.deletePreCondition = function(req, res) {
	LearningActivityModel = mongoose.model('LearningActivityModel');
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.laId}, "preConditions"]))
	.then(function(learningActivity){
		var deferred = promise_lib.defer();
		if(typeof learningActivity.preConditions === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			learningActivity.preConditions.forEach(function(ref) {
				if(ref._id == req.body.condId) {
					ref.remove();
				}
			});
			learningActivity.markModified('preConditions');
			learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_PRE_CONDITION", req, res));
}


exports.addConcept = function(req, res) {
	var error = {};
	promise_lib.resolve().then(function() {
		var deferred = promise_lib.defer();
		if((typeof req.body.conceptId == undefined) || null == req.body.conceptId) {
			var conceptViewHelper = require('./ConceptViewHelper');
			conceptViewHelper.addConcept(req.body.conceptTitle).then(function(id) {
				req.body.conceptId = id;
				deferred.resolve();
			})
		}
		return deferred.promise;
	})
	.then(function() {
		if(req.body.linkedConcept) {
			var conceptViewHelper = require('./ConceptViewHelper');
			conceptViewHelper.addParent(req.body.conceptId, req.body.linkedConcept);
		}
	})
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.laId}, "concepts"]))
	.then(function(learningActivity) {
		var deferred = promise_lib.defer();
		if(typeof learningActivity === 'undefined')  {
			deferred.reject('No learning resource found for the matching id');
		} else {
			learningActivity.concepts.push({conceptTitle: req.body.conceptTitle, conceptId: req.body.conceptId});
			learningActivity.markModified('concepts');
			learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_CONCEPT", req, res));
}

exports.updateCompletionCriteria = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.laId}, "completionCriteria"]))
	.then(function(learningActivity){
		var deferred = promise_lib.defer();
		if(typeof learningActivity === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			learningActivity.completionCriteria = [];
			req.body.criteria.forEach(function(criteria) {
				learningActivity.completionCriteria.push(criteria);
			});
			learningActivity.completionCriteriaExpr = ViewHelperUtil.buildExpression(req.body.criteria);
			learningActivity.markModified('completionCriteria');
			learningActivity.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_COMPLETION_CRITERIA", req, res));
}

exports.addSupplementaryContent = function(req, res) {
	req.body.supplementaryContent.forEach(function(content) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.id}, "supplementary_content"]))
		.then(function(learningElement) {
			var deferred = promise_lib.defer();
			if(typeof learningElement === 'undefined')  {
				deferred.reject('No learning activity found for the matching id');
			} else {
				learningElement.supplementary_content.push(content);
				learningElement.markModified('supplementary_content');
				learningElement.save(ViewHelperUtil.buildUpdateFunction(deferred));
			}
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_SUPPLEMENTARY_CONTENT", req, res));
	});
}

exports.updateSupplementaryContent = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.id}, "supplementary_content"]))
	.then(function(learningElement){
		var deferred = promise_lib.defer();
		if(typeof learningElement.supplementary_content === 'undefined')  {
			deferred.reject('No supplementary content found for the learning activity');
		} else {
			var suppContent;
			learningElement.supplementary_content.forEach(function(content) {
				if(content.contentId == req.body.contentId && content.contentGroup == req.body.contentGroup) {
					suppContent = content;
				}
			});
			for(k in req.body.content) suppContent[k] = req.body.content[k];
			learningElement.markModified('supplementary_content');
			learningElement.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_SUPPLEMENTARY_CONTENT", req, res));
}

exports.deleteSupplementaryContent = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: req.body.id}, "supplementary_content"]))
	.then(function(learningElement){
		var deferred = promise_lib.defer();
		if(typeof learningElement.supplementary_content === 'undefined')  {
			deferred.reject('No supplementary content found for the learning activity');
		} else {
			learningElement.supplementary_content.forEach(function(content) {
				if(content.contentId == req.body.contentId && content.contentGroup == req.body.contentGroup) {
					content.remove();
				}
			});
			learningElement.markModified('supplementary_content');
			learningElement.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_SUPPLEMENTARY_CONTENT", req, res));
}

exports.importLearningActivity = function(node, courseId) {
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);
	var isNew = false;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: id}]))
	.then(function(element) {
		var deferred = promise_lib.defer();
		if(typeof element == 'undefined' || element == null) {
			element = new LearningActivityModel();
			element.identifier = id;
			element.courseId = courseId;
			isNew = true;
		}
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'lobId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'courseId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'setType', element, 'nodeSet');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'nodeSetId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'taxonomyId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'isMandatory', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'minProficiency', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'learningTime', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'startDate', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'endDate', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'offset', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'createdBy', element);

		ViewHelperUtil.setJSONObject(node, 'preConditions', element);
		ViewHelperUtil.setJSONObject(node, 'completionCriteria', element);
		ViewHelperUtil.setJSONObject(node, 'completionCriteriaExpr', element);
		ViewHelperUtil.setJSONObject(node, 'conditions', element);

		if(metadata && typeof metadata['keyword'] != 'undefined' && metadata['keyword'] != '') {
			element.concepts = [];
			element.markModified('concepts');
		}

		if(typeof element.metadata == 'undefined' || element.metadata == null) element.metadata = {};
		for(k in metadata) {
			if(k!='isPartial')
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
					PedagogyNodeSetModel.findOne({nodeSetName: object.nodeSet, pedagogyId: ViewHelperUtil.getNodeProperty(node, 'pedagogyId')}).exec(function(err, nodeSet) {
						if(!err) {
							object.nodeSetId = nodeSet.identifier;
							object.taxonomyId = nodeSet.taxonomyId;
							object.save(function(err) {
								if(err) {
									console.log('Error importing learning activity - ', err);
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
	.catch(function(err) {
		console.log('Error saving Learning Activity');
		defer.reject(err);
	})
	.done(function(element) {

		//console.log("SAVED LEARNING ACTIVITY",element.metadata.nodeId);
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
	.then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.findOne, LearningActivityModel, [{identifier: ViewHelperUtil.getNodeProperty(node, 'identifier')}]))
	.then(function(element) {
		if(childNodeType == ViewHelperConstants.CONTENT) {
			upsertContent(element, childNode, relationType);
			MediaContentModel = mongoose.model('MediaContentModel');
			MediaContentModel.findOne({identifier: ViewHelperUtil.getNodeProperty(childNode, 'identifier')}).exec(function(err, content) {
				if(!err) {
					content.contentType = ViewHelperConstants.LEARNING_ACTIVITY;
					content.save();
				}
			});
		} else if(childNodeType == ViewHelperConstants.CONCEPT) {
			upsertConcept(element, childNode);
		}
	})
	.done(function() {
		defer.resolve();
	});
	return defer.promise;
}

function upsertConcept(element, node) {
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var matched;
	if(element.concepts) {
		element.concepts.forEach(function(concept) {
			if(concept.conceptIdentifier == nodeId) {
				matched = concept;
			}
		});
	}
	if(!matched) {
		element.concepts.push({
			conceptTitle: ViewHelperUtil.getNodeProperty(node, 'title'),
			conceptIdentifier: nodeId
		});
		element.markModified('concepts');
		element.save(function(err) {
			if(err) console.log('Error upserting concept on import - ', err);
		});
	}
}

function upsertContent(element, node, relationType) {
	if(relationType.trim().toLowerCase() == 'main' || relationType.trim() == '') {
		element.contentIdentifier = ViewHelperUtil.getNodeProperty(node, 'identifier');
		element.save(function(err) {
			if(err) console.log('Error saving content on import - ', err);
		});
	} else {
		var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
		if(relationType == '') {
			relationType = 'references';
		}
		relationType = ViewHelperConstants.getContentGroup(relationType.toLowerCase());
		ContentModel = mongoose.model('MediaContentModel');
		ContentModel.findOne({identifier: nodeId}).exec(function(err, content) {
			if(!err) {
				var matched;
				if(element.supplementary_content) {
					element.supplementary_content.forEach(function(object) {
						if(object.contentId == nodeId && object.contentGroup.toLowerCase() == relationType) {
							matched = object;
						}
					});
				}
				var media;
				content.media.forEach(function(med) {
					if(med.isMain) {
						media = med;
					}
				});
				if(!matched) {
					var obj = {
						name: content.name,
						mediaURL: media.mediaUrl,
						mimeType: media.mimeType,
						mediaType: media.mediaType,
						contentGroup: relationType,
						contentId: nodeId
					};
					element.supplementary_content.push(obj);
				} else {
					matched.name = content.name;
					matched.mediaURL = media.mediaUrl;
					matched.mimeType = media.mimeType;
					matched.mediaType = media.mediaType;
				}
				element.markModified('supplementary_content');
				element.save(function(err) {
					if(err) console.log('Error saving supplementary_content on import - ', err);
				});
			}
		});
	}
}

exports.deleteLearningActivity = function(object) {
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
		LearningActivityModel.findOne({identifier: object.nodeId}).exec(function(err, laObject) {
			if(err) {
				deferred.reject(err);
			} else if(!laObject) {
				extId = object.nodeId;
				deferred.reject('element does not exist.');
			} else {
				extId = laObject.metadata.nodeId;
				courseId = laObject.courseId;
				if(!isRecursive && (laObject)) {
					deferred.reject(laObject.metadata.nodeId+' has children. please select recursive.');
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
			console.log("first then");
			deleteLARelation(object.parentNodeId, object.nodeId, object.parentNodeType.toLowerCase())
			.then(function(msg) {
				message = msg;
				console.log("messgae after delete",msg);
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
			deleteLARelations(object.nodeId).then(function() {
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
				LearningActivityModel.findOneAndRemove({identifier: object.nodeId}).exec(function(err, deletedObject) {
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
				LearningActivityModel.findOneAndUpdate({identifier: object.nodeId}, {'is_deleted' : true}).exec(function(err, deletedObject) {
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
			var contentViewHelper = require('./ContentViewHelper');
			var promises = [];
			promises.push(contentViewHelper.deleteContent({
					nodeId: deletedObject.contentIdentifier,
					parentNodeId: deletedObject.identifier,
					parentNodeType: ViewHelperConstants.LEARNING_ACTIVITY,
					recursive: 'true',
					isRemove: object.isRemove
				}));
			if(deletedObject.supplementary_content) {
				deletedObject.supplementary_content.forEach(function(content) {
					promises.push(contentViewHelper.deleteContent({
						nodeId: content.contentId,
						parentNodeId: deletedObject.identifier,
						parentNodeType: ViewHelperConstants.LEARNING_ACTIVITY,
						recursive: 'true',
						isRemove: object.isRemove
					}));
				});
			}
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
		console.log('Error deleting learning activity - ', err);
		if(err) errors.push(err);
	})
	.done(function() {
		if(errors.length > 0) {
			errors.forEach(function(err) {
				message+=err;
			});
		}
		console.log("Length: ", deleted.length);
		console.log("LA DELETED: ", deleted);
		defer.resolve({'message': message, 'extId': extId, 'deletedList': deleted, 'courseId': courseId});
	});
	return defer.promise;
}

function deleteLARelations(elementId) {
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
				console.log("lobs fetched from mongo",lobs);
				lobs.forEach(function(lob) {
					promises.push(deleteLARelation(lob.lobId, elementId, ViewHelperConstants.LEARNING_OBJECT));
				})
				promise_lib.all(promises).then(function(value) {
					console.log("promises fulfilled", value);
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
					promises.push(deleteLARelation(lob.identifier, elementId, ViewHelperConstants.COLLECTION));
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

function deleteLARelation(parentId, elementId, nodeType) {
	var deferred = promise_lib.defer();
	console.log("nodetype while deleting relations",nodeType);
	switch(nodeType) {
		case ViewHelperConstants.LEARNING_OBJECT:
			console.log("inside node dlete",nodeType);
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
					if(err) console.log('Unable to delete LOB - LR relation - ', err);
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
				var parentModelName = 'LearningObjectModel';
				switch(nodeType) {
					case ViewHelperConstants.LEARNING_OBJECT: 
							parentModelName = 'LearningObjectModel';
							break;
					case ViewHelperConstants.COLLECTION:
							parentModelName = 'LearningCollectionModel';
							break;
				}
				courseMWHelper.updateSequenceInMW(parentId, parentModelName);
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
				var parentModelName = 'LearningObjectModel';
				switch(nodeType) {
					case ViewHelperConstants.LEARNING_OBJECT: 
							parentModelName = 'LearningObjectModel';
							break;
					case ViewHelperConstants.COLLECTION:
							parentModelName = 'LearningCollectionModel';
							break;
				}
				courseMWHelper.updateSequenceInMW(parentId, parentModelName);
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


exports.generateId = function(course) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.saveMedia = function(mediaList, contentNodeId) {
    if(mediaList === undefined)
        return promise_lib(null);
    var getMedia = function(media, contentNodeId) {
        console.log(contentNodeId);
        if (media.mediaId) {
            return mongoose.model('MediaModel').findOne({
                identifier: media.mediaId
            }).exec().then(function(doc) {
                doc.metadata.location = media.mediaUrl;
                doc.metadata.format = media.mimeType;
                doc.metadata.learningTime = media.learingTime;
                doc.metadata.contentGroup = (media.isMain) ? 'main' : media.mediaType;
                doc.metadata.title = media.title;
                doc.metadata.name = media.title;
                doc.metadata.duration = media.duration || 0;
                return doc.metadata;
            });
        } else {
            media.nodeId = exports.generateId();
            media.parentNodeId = contentNodeId;
            media.name = media.title;
            media.format = media.mimeType;
            media.learningTime = media.learningTime;
            media.location = media.mediaUrl;
            media.contentGroup = (media.isMain) ? 'main' : media.mediaType;
            return media;
        }
    }

    return promise_lib.all(mediaList.map(getMedia, contentNodeId)).then(function(media) {
        var items = [];
        media.forEach(function(item) {
            if (!item.mediaId) {
                item.parentNodeId = contentNodeId;
                item.contentId = contentNodeId;
                //TODO-Mahesh - For Test Media Identifier is prefetched. So, we need to write saperate saveMedia method.
            }
            item.nodeType = item.nodeClass = 'media';
            var data = {};
            data[item.nodeId] = item;
            items.push(data);
        });
        return items;
    });
}

exports.saveContent = function(content, media, lr) {
	console.log("saveContent with 3 params.");
    if(content === undefined)
        return null;
    if (!content.metadata.nodeId) {
        content.metadata.nodeId = exports.generateId();
    }
    content.metadata.parentNodeId = lr;
    var data = {};
    content.metadata.media = media;
    content.metadata.nodeClass = content.metadata.nodeType = 'content';
    data[content.metadata.nodeId] = content.metadata;
    return data;
}

exports.saveReferences = function(referenceIds, parent) {
    if(referenceIds === undefined || referenceIds.length == 0)
        return promise_lib(null);
    var getContent = function(referenceId, parent) {
            return mongoose.model('MediaContentModel').findOne({
                identifier: referenceId
            }).exec().then(function(doc) {
            	// console.log("doc:media:", doc.media);
            	var mainMedia = doc.media.filter(function(item) {
            		return item.isMain == true;
            	})[0];
            	if(mainMedia) {
            		doc.metadata.location = mainMedia.mediaUrl;
            		doc.metadata.format = mainMedia.mimeType;
            		doc.metadata.contentGroup = doc.metadata.category = doc.metadata.category || "references";
            		doc.metadata.name = doc.metadata.title = mainMedia.title;
            		doc.metadata.duration = mainMedia.duration || 0;
            		return doc.metadata;
            	} else {
            		return null;
            	}
            });
    }

    return promise_lib.all(referenceIds.map(getContent, parent)).then(function(media) {
        var items = [];
        media.forEach(function(item) {
        	if(item) {
        		item.parentNodeId = parent;
	            item.nodeType = item.nodeClass = 'content';
	            var data = {};
	            data[item.nodeId] = item;
	            items.push(data);
        	}
        });
        return items;
    });
}

exports.saveLearningActivity = function(req, res) {
	var mediaId = "";
	var learningActivityId = "";
	var getConcept = function(conceptTitle) {
        return mongoose.model('ConceptModel').findOne({
            title: conceptTitle
        }, {
            identifier: 1,
            title: 1
        }).exec().then(function(doc) {
            return doc;
        });
    }
	if (!req.body.metadata.nodeId) {
        req.body.metadata.parentNodeId = req.body.parentNodeId;
        req.body.metadata.nodeId = exports.generateId();
    }
    if(req.body.metadata.elementType == "Exam") {
    	req.body.metadata.elementType = ViewHelperConstants.EXAM;
    } else if(req.body.metadata.elementType == "Practice") {
    	req.body.metadata.elementType = ViewHelperConstants.PRACTICE_TEST;
    }
    // req.body.metadata.instructionUsage = ViewHelperConstants.COACHING;
    req.body.metadata.createdBy =  req.user.identifier;
    req.body.metadata.courseId = req.body.courseId;

    
    promise_lib.all(req.body.metadata.concepts.map(getConcept)).then(function(entries) {
    	var concepts = [];
    	entries.forEach(function(entry) {
    		if(entry) {
    			var concept = { "conceptIdentifier": entry.identifier, "conceptTitle": entry.title };
            	concepts.push(concept);
    		}
        });
        return concepts;

    }).then(function(concepts) {
    	req.body.metadata.concepts = concepts;
    	var deferred = promise_lib.defer();
    	IDCacheUtil.getIdentifierPromise(deferred);
    	return deferred.promise;
    })
    .then(function(mediaIdentifier) {
    	console.log("mediaIdentifier:",mediaIdentifier);
    	var deferred = promise_lib.defer();
    	mediaId = mediaIdentifier;
    	var mediaUrl = JSON.parse(req.body.media.mediaUrl);
    	console.log("mediaUrl:",mediaUrl);
    	req.body.metadata.usageId = mediaUrl.usageId;
    	req.body.metadata.questionPaperId = mediaUrl.questionPaperId;
    	req.body.metadata.mediaId = mediaIdentifier;
    	IDCacheUtil.getIdentifierPromise(deferred);
    	return deferred.promise;
    })
    .then(function(laIdentifier) {
    	learningActivityId = laIdentifier;
    	console.log("learningActivityId:", learningActivityId);
    	req.body.metadata.identifier = laIdentifier
    	var data = {};
        data[req.body.metadata.nodeId] = req.body.metadata;
		var _requests = [];
        _requests.push(data);
        if(req.body.content!== undefined){
            if (!req.body.content.metadata.nodeId) {
                req.body.content.metadata.nodeId = exports.generateId();
                req.body.content.metadata.parentNodeId = req.body.metadata.nodeId;
            }
            req.body.content.media.identifier = mediaId;
        }
        var contentData = exports.saveContent(req.body.content, req.body.media, req.body.metadata.nodeId);
        if(contentData !== null)
            _requests.push(contentData);

        exports.saveReferences(req.body.references, req.body.metadata.nodeId).then(function(_refs) {
        	if(_refs !== null)
                _requests.push.apply(_requests, _refs);
            var id = (req.body.content)? req.body.content.metadata.nodeId : undefined;
            req.body.media.identifier = mediaId;
	        exports.saveMedia([req.body.media], id).then(function(_media) {
	        	if(_media !== null) {
	        		_requests.push.apply(_requests, _media);
	        	}
	                
	            var nodeIds = [];
		        _requests.forEach(function(ob) {
		            Object.keys(ob).forEach(function(key) {
		                nodeIds.push(key);
		            });
		        });
		        var fin = {};
		        for (var i = 0; i < nodeIds.length; i++) {
		            fin[nodeIds[i]] = _requests[i][nodeIds[i]];
		        }
		        fin.nodeIds = nodeIds;
		        console.log("createGraphWithoutStats fin:", JSON.stringify(fin));
		        importer.createGraphWithoutStats(fin);
		        res.send({"status":"SUCCESS", "mediaId": mediaId, "learningActivityId": learningActivityId});
	        });
        });
    });

}

exports.updateLA = function(req, res) {
	var errors = [];
	var result = {};
	var body = req.body;
	var id = body.id;

	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.update({identifier: id}, {"name": body.name, "metadata.description": body.description}).exec(function(err) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.then(function() {
		var deferred = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.findOne({identifier: id}, {"courseId": true}).exec(function(err, obj) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(obj.courseId);
			}
		});
		return deferred.promise;

	})
	.then(function(courseId) {
		var deferred = promise_lib.defer();
		CourseModel = mongoose.model('CourseModel');
		var currentDate = new Date();
		CourseModel.update({"identifier": courseId}, {$set :{"lastUpdated": currentDate }}).exec(function(err) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		if(err) errors.push(err);
	})
	.done(function() {
		if(errors.length > 0) {
			result.status = "ERROR";
			result.errorMessage = errors.toString();
		} else {
			result.status = "SUCCESS";
		}
		res.send(result);
	})
}

exports.addLearningActivityToTOC = function(req, res) {
	var errors = [];
	var laId = req.body.laId;
	var courseId = req.body.courseId;
	var action = req.body.action;
	var instructionUsage = "";
	if(action == "ADD") {
		instructionUsage = "assignment";
	} else if(action == "REMOVE") {
		instructionUsage = ViewHelperConstants.COACHING;
	}
	console.log("courseId:", courseId);
	console.log("laId:", laId);
	console.log("req.body:",req.body);
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		if(instructionUsage && instructionUsage != "") {
			LearningActivityModel = mongoose.model('LearningActivityModel');
			LearningActivityModel.update({identifier:laId}, {$set:{"metadata.instructionUsage":instructionUsage}}).exec(function(err) {
				if(err) {
					deferred.reject(err);
				} else {
					console.log("LearningActivity:"+laId+" updated.");
					deferred.resolve();
				}
			});
		} else {
			deferred.reject("Invalid Action:"+action);
		}
		return deferred.promise;
	})
	.then(function() {
		var deferred = promise_lib.defer();
		CourseModel = mongoose.model('CourseModel');
		var currentDate = new Date();
		CourseModel.update({"identifier": courseId}, {$set :{"lastUpdated": currentDate }}).exec(function(err) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		if(err) {
			errors.push(err);
			console.log("Error while learningActivity updating:",err);
		}
	})
	.done(function() {
		if(errors.length > 0) {
			res.send({"status": "ERROR"});
		} else {
			res.send({"status": "SUCCUSS"});
		}
	});
}

exports.saveInterception = function(req, res) {
	
	promise_lib.resolve()
	.then(function() {
    	var deferred = promise_lib.defer();
    	IDCacheUtil.getIdentifierPromise(deferred);
    	return deferred.promise;
    }).then(function(mediaIdentifier) {
    	var deferred = promise_lib.defer();
    	if (!req.body.content.metadata.nodeId) {
            req.body.content.metadata.nodeId = exports.generateId();
        }
        req.body.content.media.identifier = mediaIdentifier;
        req.body.media.identifier = mediaIdentifier;
        IDCacheUtil.getIdentifierPromise(deferred);
    	return deferred.promise;
    }).then(function(contentIdentifier) {
    	var deferred = promise_lib.defer();
    	req.body.content.identifier = contentIdentifier;
    	req.body.content.metadata.identifier = contentIdentifier;
    	var _requests = [];
    	var contentData = exports.saveContent(req.body.content, req.body.media, "");
        if(contentData !== null)
            _requests.push(contentData);


        var id = (req.body.content)? req.body.content.metadata.nodeId : undefined;
        exports.saveMedia([req.body.media], id).then(function(_media) {
        	if(_media !== null) {
        		_requests.push.apply(_requests, _media);
        	}
                
            var nodeIds = [];
            console.log("_requests:",_requests);
	        _requests.forEach(function(ob) {
	            Object.keys(ob).forEach(function(key) {
	                nodeIds.push(key);
	            });
	        });
	        var fin = {};
	        for (var i = 0; i < nodeIds.length; i++) {
	            fin[nodeIds[i]] = _requests[i][nodeIds[i]];
	        }
	        fin.nodeIds = nodeIds;
	        console.log("createGraphWithoutStats fin:", JSON.stringify(fin));
	        importer.createGraphWithoutStats(fin);
	        deferred.resolve(contentIdentifier);
	        return deferred.promise;
	        
        })
        .then(function(contentIdentifier) {
        	var deferred = promise_lib.defer();
        	var interception = {};
        	interception.name = req.body.media.title;
        	interception.contentId = contentIdentifier;
        	interception.mediaId = req.body.mediaId;
        	interception.interceptionPoint = req.body.point;

        	MediaContentModel = mongoose.model('MediaContentModel');
        	MediaContentModel.update({identifier: req.body.contentId}, {$push: {"interceptions": interception }}).exec(function(err) {
				if(err) console.log('Content - Error adding interceptions on import - ', err);
        		deferred.resolve(interception);
			});
        	return deferred.promise;
        })
        .done(function(interception) {
        	res.send({success: true, "interception": interception});
        });


    })
}

exports.deleteInterception = function(req, res) {
	var contentId = req.body.contentId;
	var interceptionId = req.body.interceptionId;
	console.log("request:",req.body);
	MediaContentModel = mongoose.model('MediaContentModel');
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MediaContentModel.update({identifier: contentId}, {$pull:{interceptions:{'contentId':interceptionId}}}).exec(function(err) {
			console.log("Error while deleting interception point:",err);
			deferred.resolve();
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log("Error while deleting interception:", err)
	})
	.done(function() {
		res.send({success: true});
	});
}

exports.getTestLearningActivities = function(req, res) {
	var result = {};
	var pageNumber = req.body.pageNumber || 1;
	var courseId = req.body.courseId;
	var elementType = ViewHelperConstants.EXAM;
	if(req.body.testType == "Exam") {
		elementType = ViewHelperConstants.EXAM;	
	} else if(req.body.testType =="practice") {
		elementType = ViewHelperConstants.PRACTICE_TEST;	
	}
	
	LearningActivityModel = mongoose.model('LearningActivityModel');
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearningActivityModel.find({"metadata.laType": ViewHelperConstants.COACHING, "courseId": courseId, "metadata.elementType": elementType}).skip(pageNumber > 0 ? ((pageNumber-1)*appConfig.DEFAULT_RESULT_SIZE) : 0).limit(appConfig.DEFAULT_RESULT_SIZE).exec(function(err, tests) {
			deferred.resolve(tests);
		});
		return deferred.promise;
	})
	.then(function(tests) {
		result.data = tests;
		var deferred = promise_lib.defer();
		LearningActivityModel.count({"metadata.laType": ViewHelperConstants.COACHING, "courseId": courseId, "metadata.elementType": elementType}).exec(function (err, count){
			deferred.resolve(count);
		});
		return deferred.promise;
	})
	.done(function(count) {
		result.count = count;
		res.send(result);
	});
}

exports.getTestLearningActivity = function(req, res) {
	var errors = [];
	var result = {};
	var laId = req.body.laId;
	/*var mediaId = req.body.mediaId;*/
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearningActivityModel.findOne({identifier: laId}).exec(function(err, la) {
			console.log("la:", la);
			if(la) {
				deferred.resolve(la);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.then(function(la) {
		var deferred = promise_lib.defer();
		if(la) {
			result.learningactivity = la;
		} else {
			result.learningactivity = {};
		}
		/*MediaModel = mongoose.model('MediaModel');
		MediaModel.findOne({identifier:mediaId},{url:1}).exec(function(err, media) {
			if(media && media.url) {
				deferred.resolve(media.url);
			} else {
				deferred.resolve();
			}
		});*/
		deferred.resolve();
		return deferred.promise;
	})
	.done(function(url) {
		if(url) {
			var urlJson = eval("(" + url + ")");
			result.questionPaperId = urlJson.questionPaperId;	
		} else {
			result.questionPaperId = "";
		}
		res.send(result);
	});
}

exports.getLearningActivityEvents = function(req, res){
	var errors = [];
	var laId = req.params.laId;
	 promise_lib.resolve()
    .then(function(){
		var defer = promise_lib.defer();
        var EventModel = mongoose.model('EventModel');
        EventModel.find({objectId : laId}).exec(function(err, data) {
           if (err) {
                defer.reject(err);
            } else {
                defer.resolve(data);
            }
        });
        return defer.promise; 
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(data) {
        if(errors.length > 0) {
            console.log("Failed to retrive event for learningactivity : " + err);
            res.send("Failed to retrive event : " + err);
        } else {            
            res.send(data);
        }
    });    
}

exports.updateLAMetadataValues = function(req, res) {
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningActivityModel', {}).toArray(function(err, activities) {
			if (err || !activities || activities.length <= 0) {
				deferred.reject(err);
			} else {
				deferred.resolve(activities);
			}
		});
		return deferred.promise;
	})
	.then(function(activities) {
		var deferreds = [];
		activities.forEach(function(la) {
			deferreds.push(getLAMetadata(la));
		});
		return promise_lib.all(deferreds);
	})
	.then(function(values) {
		var deferreds = [];
		values.forEach(function(value) {
			deferreds.push(updateLAMetadata(value));
		});
		return promise_lib.all(deferreds);
	})
	.done(function(url) {
		res.send('OK');
	});
}

function getLAMetadata(la) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('MediaContentModel', {identifier: la.contentIdentifier}, function(err, content) {
		if (content && content.media && content.media.length == 1) {
			try {
                var examInfo = JSON.parse(content.media[0].mediaUrl);
                la.metadata.usageId = examInfo.usageId;
                la.metadata.mediaId = content.media[0].mediaId;
                la.metadata.questionPaperId = examInfo.questionPaperId;
                deferred.resolve(la);
            } catch(e) {
                deferred.resolve({update: false});
            }
		} else {
			deferred.resolve({update: false});
		}
	});
	return deferred.promise;
}

function updateLAMetadata(value) {
	var deferred = promise_lib.defer();
	if (value.identifier) {
		MongoHelper.update('LearningActivityModel', {identifier: value.identifier}, 
				{$set:{'metadata.usageId': value.metadata.usageId, 'metadata.mediaId': value.metadata.mediaId, 
				'metadata.questionPaperId': value.metadata.questionPaperId}}, 
	        function(err, obj) {
	            if (err) {
	                console.log('LearningActivity ' + value.identifier + ' update failed: ' + err);
	            } else {
	                console.log('LearningActivity ' + value.identifier + ' updated');
	            }
	            deferred.resolve();
	    	}
	    );
	} else {
		deferred.resolve();
	}
	return deferred.promise;
}

exports.getLearningActivitiesByQuestionPaper = function(req, res) {
	var errors = [];
	var questionPaperId = req.params.questionPaperId;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningActivityModel', {"metadata.questionPaperId": questionPaperId}, {"name":true, "metadata.description": true, "identifier":true, "lobId":true}).toArray(function(err, activities) {
			if (err || !activities) {
				deferred.reject(err);
			} else {
				deferred.resolve(activities);
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		if(err) {
			console.log("Error while fetching LA by questionPaperId:",err);
			errors.push(err);
		}
	})
	.done(function(activities) {
		var result = {};
		if(errors.length > 0) {
			result.status = "ERROR";
			result.errorMessage = errors.toString();
		} else {
			result.status = "SUCCESS";
			result.learningactivities = activities;
		}
		res.send(result);
	})
}

