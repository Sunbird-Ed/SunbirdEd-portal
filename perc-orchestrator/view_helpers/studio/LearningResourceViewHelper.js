/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Learning Resources
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');
var errorModule = require('../ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
LearningResourceModel = mongoose.model('LearningResourceModel');
var ViewHelperConstants = require('../ViewHelperConstants');
var courseMWHelper = require('./CourseMWViewHelper');

exports.getLearningResource = function(req, res) {
	var error = {};
	var id = req.params.id || req.body.elementId;
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: id}]))
    .then(function(element) {
    	var deferred = promise_lib.defer();
    	MediaContentModel = mongoose.model('MediaContentModel');
    	MediaContentModel.findOne({identifier: element.contentIdentifier}).exec(function(err, content) {
    		var elementObj = element.toObject();
    		if(content && content.media) {
    			elementObj['media'] = content.media;
    		}
    		deferred.resolve(elementObj);
    	});
    	return deferred.promise;
    })
	.catch(ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_FETCHING_LEARNING_RESOURCE", req, res));
}

exports.addLearningResources = function(req, res) {
	req.body.lrs.forEach(function(lr) {
		IDCacheUtil.getId(function(id) {
			PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
			LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
			var error = {};
			promise_lib.resolve()
		    .then(ViewHelperUtil.promisifyWithArgs(PedagogyNodeSetModel.findOne, PedagogyNodeSetModel, [{identifier: lr.nodeSetId}]))
			.then(ViewHelperUtil.buildTaxonomyFunction(lr))
			.then(function() {
				var deferred = promise_lib.defer();
				var learningResource = new LearningResourceModel();
				for(k in lr) {
					learningResource[k] = lr[k];
				}
				learningResource.save(ViewHelperUtil.buildCreateFunction(deferred));
				return deferred.promise;
			})
			.then(function() {
				if(lr.lobId) {
					var lobViewHelper = require('./LearningObjectViewHelper');
			    	lobViewHelper.addElement({name: lr.name, elementId: id, elementType: 'LearningResource'}, lr.lobId);
				} else {
					var collViewHelper = require('./LearningCollectionViewHelper');
			    	collViewHelper.addElement({name: lr.name, elementId: id, elementType: 'LearningResource'}, lr.collId);
				}
			})
			.catch (ViewHelperUtil.buildCatchFunction(error, id))
			.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_LEARNING_RESOURCE", req, res));
		});
	});
}

exports.updateMetadata = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "metadata"]))
	.then(function(learningResource) {
		var deferred = promise_lib.defer();
		if(typeof learningResource === 'undefined')  {
			deferred.reject('No learning resource found for the matching id');
		} else {
			for(var k in req.body.metadata) learningResource.metadata[k] = req.body.metadata[k];
			learningResource.markModified('metadata');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_LEARNING_RESOURCE_METADATA", req, res));
}

exports.updateLearningResource = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.id}]))
	.then(function(learningResource) {
		var deferred = promise_lib.defer();
		if(typeof learningResource === 'undefined')  {
			deferred.reject('No learning resource found for the matching id');
		} else {
			for(var k in req.body.lr) learningResource[k] = req.body.lr[k];
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
			var lobViewHelper = require('./LearningObjectViewHelper');
			lobViewHelper.updateElementMandatory(learningResource.lobId, req.body.id, learningResource.isMandatory);
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_LEARNING_RESOURCE", req, res));
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
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "concepts"]))
	.then(function(learningResource) {
		var deferred = promise_lib.defer();
		if(typeof learningResource === 'undefined')  {
			deferred.reject('No learning resource found for the matching id');
		} else {
			learningResource.concepts.push({conceptTitle: req.body.conceptTitle, conceptId: req.body.conceptId});
			learningResource.markModified('concepts');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_CONCEPT", req, res));
}

exports.addPreCondition = function(req, res) {
	IDCacheUtil.getId(function(id) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "preConditions"]))
		.then(function(learningResource) {
			var deferred = promise_lib.defer();
			if(typeof learningResource === 'undefined')  {
				deferred.reject('No Collection found for the matching id');
			} else {
				learningResource.preConditions.push(req.body.preCondition);
				learningResource.markModified('preConditions');
				learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
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
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "preConditions"]))
	.then(function(learningResource){
		var deferred = promise_lib.defer();
		if(typeof learningResource.preConditions === 'undefined')  {
			deferred.reject('No pre-conditions found for the matching learning resource');
		} else {
			var preCondition;
			learningResource.preConditions.forEach(function(preCond) {
				if(preCond._id == req.body.condId) {
					preCondition = preCond;
				}
			});
			for(k in req.body.preCondition) preCondition[k] = req.body.preCondition[k];
			learningResource.markModified('preConditions');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_PRE_CONDITION", req, res));
}

exports.deletePreCondition = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "preConditions"]))
	.then(function(learningResource){
		var deferred = promise_lib.defer();
		if(typeof learningResource.preConditions === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			learningResource.preConditions.forEach(function(ref) {
				if(ref._id == req.body.condId) {
					ref.remove();
				}
			});
			learningResource.markModified('preConditions');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_REFERENCE", req, res));
}

exports.addInterception = function(req, res) {
	IDCacheUtil.getId(function(id) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "interceptions"]))
		.then(function(learningResource) {
			var deferred = promise_lib.defer();
			if(typeof learningResource === 'undefined')  {
				deferred.reject('No Collection found for the matching id');
			} else {
				learningResource.interceptions.push(req.body.interception);
				learningResource.markModified('interceptions');
				learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
			}
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_PRE_CONDITION", req, res));
	});
}

exports.updateInterception = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "interceptions"]))
	.then(function(learningResource){
		var deferred = promise_lib.defer();
		if(typeof learningResource.interceptions === 'undefined')  {
			deferred.reject('No pre-conditions found for the matching learning resource');
		} else {
			var interception;
			learningResource.interceptions.forEach(function(intsep) {
				if(intsep._id == req.body.interceptionId) {
					interception = intsep;
				}
			});
			for(k in req.body.interception) interception[k] = req.body.interception[k];
			learningResource.markModified('interceptions');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_PRE_CONDITION", req, res));
}

exports.deleteInterception = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "interceptions"]))
	.then(function(learningResource){
		var deferred = promise_lib.defer();
		if(typeof learningResource.interceptions === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			learningResource.interceptions.forEach(function(ref) {
				if(ref._id == req.body.interceptionId) {
					ref.remove();
				}
			});
			learningResource.markModified('interceptions');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_REFERENCE", req, res));
}

exports.updateCompletionCriteria = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.lrId}, "completionCriteria"]))
	.then(function(learningResource){
		var deferred = promise_lib.defer();
		if(typeof learningResource === 'undefined')  {
			deferred.reject('No reference found for the matching learning resource');
		} else {
			learningResource.completionCriteria = [];
			req.body.criteria.forEach(function(criteria) {
				learningResource.completionCriteria.push(criteria);
			});
			learningResource.completionCriteriaExpr = ViewHelperUtil.buildExpression(req.body.criteria);
			learningResource.markModified('completionCriteria');
			learningResource.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_REFERENCE", req, res));
}

exports.addSupplementaryContent = function(req, res) {
	req.body.supplementaryContent.forEach(function(content) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.id}, "supplementary_content"]))
		.then(function(learningElement) {
			var deferred = promise_lib.defer();
			if(typeof learningElement === 'undefined')  {
				deferred.reject('No learning resource found for the matching id');
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
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.id}, "supplementary_content"]))
	.then(function(learningElement){
		var deferred = promise_lib.defer();
		if(typeof learningElement.supplementary_content === 'undefined')  {
			deferred.reject('No supplementary content found for the learning resource');
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
    .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: req.body.id}, "supplementary_content"]))
	.then(function(learningElement){
		var deferred = promise_lib.defer();
		if(typeof learningElement.supplementary_content === 'undefined')  {
			deferred.reject('No supplementary content found for the learning resource');
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

exports.importLearningResource = function(node, courseId) {
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);
	var isNew = false;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: id}]))
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

		ViewHelperUtil.setJSONObject(node, 'interceptions', element);
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
					PedagogyNodeSetModel.findOne({nodeSetClass: object.nodeSet, pedagogyId: ViewHelperUtil.getNodeProperty(node, 'pedagogyId')}).exec(function(err, nodeSet) {
						if(!err) {
							object.nodeSetId = nodeSet.identifier;
							object.taxonomyId = nodeSet.taxonomyId;
							object.save(function(err) {
								if(err) {
									console.log('Error importing learning resource - ', err);
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
	.then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{identifier: ViewHelperUtil.getNodeProperty(node, 'identifier')}]))
	.then(function(element) {
		if(childNodeType == ViewHelperConstants.CONTENT) {
			upsertContent(element, childNode, relationType);
			MediaContentModel = mongoose.model('MediaContentModel');
			MediaContentModel.findOne({identifier: ViewHelperUtil.getNodeProperty(childNode, 'identifier')}).exec(function(err, content) {
				if(!err) {
					content.contentType = 'lecture';
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
			if(err) console.log('LR Error upserting concept on import - ', err);
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
					if(err) console.log('LR - Error saving supplementary_content on import - ', err);
				});
			}
		});
	}
}

exports.deleteLearningResource = function(object) {
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
		LearningResourceModel.findOne({identifier: object.nodeId}).exec(function(err, lrObject) {
			if(err) {
				deferred.reject(err);
			} else if(!lrObject) {
				extId = object.nodeId;
				deferred.reject('element does not exist.');
			} else {
				extId = lrObject.metadata.nodeId;
				courseId = lrObject.courseId;
				if(!isRecursive && lrObject.contentIdentifier) {
					deferred.reject(lrObject.metadata.nodeId+' have children. please select recursive.');
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
			deleteLRRelation(object.parentNodeId, object.nodeId, object.parentNodeType.toLowerCase())
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
			// Delete all content relations with LOB/LR/LA/Content objects
			deleteLRRelations(object.nodeId).then(function() {
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
				LearningResourceModel.findOneAndRemove({identifier: object.nodeId}).exec(function(err, deletedObject) {
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
				LearningResourceModel.findOneAndUpdate({identifier: object.nodeId}, {'is_deleted' : true}).exec(function(err, deletedObject) {
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
					parentNodeType: ViewHelperConstants.LEARNING_RESOURCE,
					recursive: 'true',
					isRemove: object.isRemove
				}));
			if(deletedObject.supplementary_content) {
				deletedObject.supplementary_content.forEach(function(content) {
					promises.push(contentViewHelper.deleteContent({
						nodeId: content.contentId,
						parentNodeId: deletedObject.identifier,
						parentNodeType: ViewHelperConstants.LEARNING_RESOURCE,
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
		console.log('Error deleting learning resource - ', err);
		if(err) errors.push(err);
	})
	.done(function() {
		if(errors.length > 0) {
			errors.forEach(function(err) {
				message+=err;
			});
		}
		console.log("Length: ", deleted.length);
		console.log("LR DELETED: ", deleted);
		defer.resolve({'message': message, 'extId': extId, 'deletedList': deleted, 'courseId': courseId});
	});
	return defer.promise;
}

function deleteLRRelations(elementId) {
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
					promises.push(deleteLRRelation(lob.lobId, elementId, ViewHelperConstants.LEARNING_OBJECT));
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
					promises.push(deleteLRRelation(lob.identifier, elementId, ViewHelperConstants.COLLECTION));
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

function deleteLRRelation(parentId, elementId, nodeType) {
	var deferred = promise_lib.defer();

	switch(nodeType) {
		case ViewHelperConstants.LEARNING_OBJECT:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
				LearningObjectElementsModel.update({lobId: parentId},{$pull: { elements: {'elementId': elementId}}}).exec(function(err, pulledObj) {
					if(err) console.log('Unable to delete LOB - LR relation - ', err);
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
					if(err) console.log('Unable to delete Collection - LR relation - ', err);
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
