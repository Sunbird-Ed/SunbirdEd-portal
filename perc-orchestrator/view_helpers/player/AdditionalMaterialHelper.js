/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Student Dashboard
 *
 * @author rayulu
 */

var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var promise_lib = require('when');
var PlayerUtil = require('./PlayerUtil');
var LearnerEnrollmentHelper = require('./LearnerEnrollmentHelper');
var ViewHelperConstants = require('../ViewHelperConstants');

exports.addAdditionalMaterial = function(req, res) {
	LoggerUtil.setOperationName('addAdditionalMaterial');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var category = decodeURIComponent(req.params.category);
	var lobId = decodeURIComponent(req.params.lobId);
	if (lobId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		lobId = PlayerUtil.addFedoraPrefix(lobId);
	}
	var contentId = decodeURIComponent(req.params.contentId);
	contentId = PlayerUtil.addFedoraPrefix(contentId);
	var userType = "student";
	if(req.user.roles.indexOf('tutor') > -1 || req.user.roles.indexOf('faculty') > -1) {
		userType = "tutor";
	}
	var learnerState;
	var contentObj;
	var element = {};
	var elementAlreadyHas = false;
	promise_lib.resolve()
	.then(function() {
		return getLearnerState(studentId, courseId);
	}).then(function(lobState) {
		learnerState = lobState;
		return getMediaContent(contentId);
	}).then(function(content) {
		contentObj = content;
		var elementMap = PlayerUtil.getMap(learnerState.elements);
		var lobMap = PlayerUtil.getMap(learnerState.learning_objects);
		var lob = lobMap[lobId];
		var deferred = promise_lib.defer();
		if (!elementMap[contentId]) {
			element.identifier = contentId;
			element.elementType = ViewHelperConstants.CONTENT;
			element.elementSubType = "explanation";
			element.isMandatory = false;
			element.category = category;
			element.name = content.name;
			element.learningTime = content.metadata.learningTime;
			lob.sequence.push(contentId);
			lob.additional_material.push(contentId);
			learnerState.elements.push(element);
			var groups = LearnerEnrollmentHelper.createLists(learnerState);
			learnerState.groups = groups;
			learnerState.markModified('learning_objects');
			learnerState.markModified('elements');
			learnerState.markModified('groups');
			learnerState.markModified('targets');
			learnerState.save(function(err, object) {
				if(err) {
					deferred.reject(err);
				} else {
					deferred.resolve('Success');
				}
			});
		} else {
			elementAlreadyHas = true;
			deferred.resolve();
		}
		return deferred.promise;
	}).then(function() {
		var parentLOBs = {};
		var defer = promise_lib.defer();
		PlayerUtil.getAllParentLOBs(learnerState, contentId, parentLOBs, defer);
		return defer.promise;
	}).then(function(parentLOBs) {
		return updateParents(learnerState, element.elementType, element.learningTime, parentLOBs, 1);
	}).then(function() {
		var response = {};
		if (!elementAlreadyHas) {
			response.status = 'success';
			response.elementType = ViewHelperConstants.CONTENT;
			response.nodeSet = ViewHelperConstants.CONTENT;
			response.identifier = PlayerUtil.removeFedoraPrefix(contentId);
			response.name = contentObj.name;
			response.description = contentObj.metadata.shortDescription;
			response.concepts = contentObj.concepts;
			response.status = '';
			response.parentId = PlayerUtil.removeFedoraPrefix(lobId + '');
			response.category = category;
			response.progress = 0;
			response.element = element;
			if(userType == "student") {
				var MWServiceProvider = require('../../commons/MWServiceProvider');
				var req = new Object();
		    	req.LEARNER_ID = studentId;
		    	req.COURSE_ID = courseId;
		    	MWServiceProvider.callServiceStandard("learnerService", "UpdateLearnerPath", req, function(err, data, response) {
		        	console.log("Request:",JSON.stringify(req));
		        	if (err) {
		            		console.log("Error in Response from MW UpdateLearnerPath: " + err);
		        	} else {
		            		console.log("Response from MW UpdateLearnerPath: " + JSON.stringify(data, null, 4));
		        	}
		    	});
			}
		} else {
			response.status = 'error';
			response.errorMsg = 'Element already in learning path';
		}
		res.send(JSON.stringify(response));	
	}).catch(function(err) {
		console.log("Error: " + err);
		res.send(err);
	}).done();
};

exports.removeAdditionalMaterial = function(req, res) {
	LoggerUtil.setOperationName('removeAdditionalMaterial');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var lobId = decodeURIComponent(req.params.lobId);
	if (lobId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		lobId = PlayerUtil.addFedoraPrefix(lobId);
	}
	var contentId = decodeURIComponent(req.params.contentId);
	contentId = PlayerUtil.addFedoraPrefix(contentId);
	var learnerState;
	var elementLearningTime;
	var elementSubType = "explanation";
	var hasInAdditionalMaterial = false;
	var userType = "student";
	if(req.user.roles.indexOf('tutor') > -1 || req.user.roles.indexOf('faculty') > -1) {
		userType = "tutor";
	}

	promise_lib.resolve()
	.then(function() {
		return getLearnerState(studentId, courseId);
	}).then(function(lobState) {
		learnerState = lobState;
		return getMediaContent(contentId);
	}).then(function(content) {
		if(content.metadata.learningTime) {
			elementLearningTime = content.metadata.learningTime*-1;
		} else {
			elementLearningTime = 0;
		}
	}).then(function() {
		var defer = promise_lib.defer();
		learnerState.learning_objects.forEach(function(lob) {
			if(lob.identifier == lobId) {
				if(lob.additional_material) {
					lob.additional_material.forEach(function(materialId) {
						if(contentId == materialId) {
							hasInAdditionalMaterial = true;
							defer.resolve();
						}
					});	
				}
			}
		});
		if(!hasInAdditionalMaterial) {
			defer.reject('Element not there in learning path.');
		}
		return defer.promise;
	}).then(function() {
		var parentLOBs = {};
		var defer = promise_lib.defer();
		PlayerUtil.getAllParentLOBs(learnerState, contentId, parentLOBs, defer);
		return defer.promise;
	}).then(function(parentLOBs) {
		return updateParents(learnerState, ViewHelperConstants.CONTENT, elementLearningTime, parentLOBs, -1);
	}).then(function() {
		var defer = promise_lib.defer();
		var elementMap = PlayerUtil.getMap(learnerState.elements);
		var lobMap = PlayerUtil.getMap(learnerState.learning_objects);
		var lob = lobMap[lobId];
		var element = elementMap[contentId];
		learnerState.elements.splice(learnerState.elements.indexOf(element),1);
		lob.sequence.splice(lob.sequence.indexOf(contentId),1);
		lob.additional_material.splice(lob.additional_material.indexOf(contentId),1);
		var groups = LearnerEnrollmentHelper.createLists(learnerState);
		learnerState.groups = groups;
		learnerState.markModified('elements');
		learnerState.markModified('learning_objects');
		learnerState.markModified('groups');
		learnerState.markModified('targets');
		learnerState.save(function(err, obj) {
		 	if (err) {
		 		console.log('Learner State update failed: ' + err);
		 		defer.reject('Learner State update failed');
		 	} else {
		 		console.log("Element removed successfully.");
				defer.resolve('Success');
			}
		 });
		return defer.promise;

	}).then(function() {
		var response = {};
		if(!hasInAdditionalMaterial) {
			response.status = 'error';
			response.errorMsg = 'Element not there in learning path.';
		} else {
			response.status = 'success';
			if(userType == "student") {
				var MWServiceProvider = require('../../commons/MWServiceProvider');
				var req = new Object();
		    	req.LEARNER_ID = studentId;
		    	req.COURSE_ID = courseId;
		    	MWServiceProvider.callServiceStandard("learnerService", "UpdateLearnerPath", req, function(err, data, response) {
		        	console.log("Request:",JSON.stringify(req));
		        	if (err) {
		            		console.log("Error in Response from MW UpdateLearnerPath: " + err);
		        	} else {
		            		console.log("Response from MW UpdateLearnerPath: " + JSON.stringify(data, null, 4));
		        	}
		    	});
			}
		}
		res.send(JSON.stringify(response));
	})
	.catch(function(err) {
		console.log("Error: " + err);
		res.send(err);
	})
	.done();

};

function getLearnerState(studentId, courseId) {
	var deferred = promise_lib.defer();
	var LearnerStateModel = mongoose.model('LearnerStateModel');
	LearnerStateModel.findOne({student_id: studentId, courseId: courseId}).exec(function(err, lobState) {
		if (lobState) {
			// marge data here path + state


			deferred.resolve(lobState);
		} else {
			deferred.reject('Learner Path not found');
		}
	});
	return deferred.promise;
}

function getMediaContent(contentId) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('MediaContentModel', {identifier: contentId}, function(err, content) {
		if (err) {
			deferred.reject(err);
		} else {
			if (content) {
				deferred.resolve(content);
			} else {
				deferred.reject("Content Object " + contentId + " not found");
			}
		}
	});
	return deferred.promise;
}

function updateElementCount(elements_count, elementCountType, incCountWith) {
	var hasElementCountType = false;
	elements_count.forEach(function(count) {
		if(count['elementType'] == elementCountType) {
			count.total += incCountWith;
			hasElementCountType = true;
		}
	});
	if(!hasElementCountType) {
		elements_count.push({"elementType": elementCountType, total:incCountWith, complete:0});
	}
}

function updateParents(course, elementCountType, elementLearningTime, parentLOBs, incCountWith) {
	var defer = promise_lib.defer();
	course.learning_objects.forEach(function(lob) {
		if(parentLOBs[lob.identifier]) {
			updateElementCount(lob.elements_count, elementCountType, incCountWith);
			lob.learningTime += elementLearningTime;
		}
	});
	course.markModified('learning_objects');
	course.save(function(err, obj) {
	 	if (err) {
	 		console.log('Learner State update failed: ' + err);
	 		defer.reject('Learner State update failed');
	 	} else {
			defer.resolve('Success');
		}
	 });
	return defer.promise;
}

exports.getElementSupplementaryContent = function(req, res) {
	LoggerUtil.setOperationName('getElementSupplementaryContent');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var elementId = decodeURIComponent(req.params.elementId);
	if (elementId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		elementId = PlayerUtil.addFedoraPrefix(elementId);
	}
	var cacheItem = NodeCacheUtil.get('AddVH:SuppContent', elementId);
	if(cacheItem && cacheItem != null && cacheItem != 'undefined') {
		console.log('Returning from cache...');
		res.send(cacheItem);
		return;
	}
	var elementMap;
	var categoryMap = {};
	promise_lib.resolve()
	.then(function() {
		return getLearnerState(studentId, courseId);
	}).then(function(learnerState) {
		elementMap = PlayerUtil.getMap(learnerState.elements);
		var currentElement = elementMap[elementId];
		var type = currentElement.elementType;
		var defer = promise_lib.defer();
		if (type == ViewHelperConstants.LEARNING_RESOURCE || type == ViewHelperConstants.CLASSROOM) {
			return getLearningResourcePromise(courseId, elementId);
		} else if (type == ViewHelperConstants.LEARNING_ACTIVITY || type == ViewHelperConstants.EXAM || type == ViewHelperConstants.PRACTICE_TEST) {
			return getLearningActivityPromise(courseId, elementId);
		} else if (type == ViewHelperConstants.CONTENT) {
			return getMediaContentPromise(elementId);
		} else {
			defer.resolve();
		}
		return defer.promise;
	}).then(function(element) {
		addSupplementaryContentToMap(element, categoryMap, elementMap);
		return PlayerUtil.getCategoryTypesPromise();
	}).then(function(map) {
		var categories = [];
		var totalCnt = 0;
		for (var cat in categoryMap) {
			var cnt = addToCategories(cat, map, categoryMap, categories);
			totalCnt += cnt;
		}
		var result = {};
		result.total = totalCnt;
		result.categories = categories;
		var resultStr = JSON.stringify(result);
		NodeCacheUtil.set('AddVH:SuppContent', elementId, resultStr, courseId);
		res.send(resultStr);
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_ADDITIONAL_MATERIAL", req, res);
	}).done();
}

exports.getLOBSupplementaryContent = function(req, res) {
	LoggerUtil.setOperationName('getLOBSupplementaryContent');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var lobId = decodeURIComponent(req.params.lobId);
	if (lobId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		lobId = PlayerUtil.addFedoraPrefix(lobId);
	}
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		courseId = PlayerUtil.addFedoraPrefix(courseId);
	}
	var learnerState;
	var lobMap;
	var elementMap;
	var categoryMap = {};
	promise_lib.resolve()
	.then(function() {
		return getLearnerState(studentId, courseId);
	}).then(function(state) {
		learnerState = state;
		lobMap = PlayerUtil.getMap(learnerState.learning_objects);
		elementMap = PlayerUtil.getMap(learnerState.elements);
		return getLearningObjectElementsPromise(courseId, lobId);
	}).then(function(lob) {
		if (lob && lob.supplementary_content) {
			addSupplementaryContentToMap(lob, categoryMap, elementMap);
		}
		var deferreds = [];
		var currentLOB = lobMap[lobId];
		if (currentLOB.sequence && currentLOB.sequence.length > 0) {
			currentLOB.sequence.forEach(function(seqId) {
				var element = getLearnerStateElement(seqId, lobMap, elementMap);
				if (element) {
					var type = element.elementType;
					if (type == ViewHelperConstants.LEARNING_RESOURCE || type == ViewHelperConstants.CLASSROOM) {
						deferreds.push(getLearningResourcePromise(courseId, seqId));
					} else if (type == ViewHelperConstants.LEARNING_ACTIVITY || type == ViewHelperConstants.EXAM || type == ViewHelperConstants.PRACTICE_TEST) {
						deferreds.push(getLearningActivityPromise(courseId, seqId));
					} else if (type == ViewHelperConstants.CONTENT) {
						deferreds.push(getMediaContentPromise(seqId));
					} else {
						deferreds.push(getLearningObjectElementsPromise(courseId, seqId));
					}
				}
			});
		}
		return promise_lib.all(deferreds);
	}).then(function(values) {
		values.forEach(function(value) {
			addSupplementaryContentToMap(value, categoryMap, elementMap);
		});
		return PlayerUtil.getCategoryTypesPromise();
	}).then(function(map) {
		var categories = [];
		var totalCnt = 0;
		for (var cat in categoryMap) {
			var cnt = addToCategories(cat, map, categoryMap, categories);
			totalCnt += cnt;
		}
		var result = {};
		result.total = totalCnt;
		result.categories = categories;
		res.send(JSON.stringify(result));	
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_ADDITIONAL_MATERIAL", req, res);
	}).done();
};

function addToCategories(cat, map, categoryMap, categories, totalCnt) {
	var categoryDef = map[cat];
	var category = {};
	category.identifier = cat;
	category.category = cat;
	if (categoryDef) {
		category.title = categoryDef.category_name;
		category.description = categoryDef.description;	
	} else {
		category.title = cat;
	}
	category.content = categoryMap[cat];
	categories.push(category);
	if (category.content && category.content.length > 0) {
		return category.content.length;
	} else {
		return 0;
	}
}

function getLearnerStateElement(elementId, lobMap, elementMap) {
	var element;
	if (lobMap[elementId]) {
		element = lobMap[elementId];
	} else if (elementMap[elementId]) {
		element = elementMap[elementId];
	}
	return element;
}

function addSupplementaryContentToMap(lob, categoryMap, elementMap) {
	var deferreds = [];
	if (lob && lob.supplementary_content) {
		for (var i=0; i<lob.supplementary_content.length; i++) {
			var supplContent = lob.supplementary_content[i];
			var category = supplContent.contentGroup;
			var contentArr = categoryMap[category];
			if (typeof contentArr == 'undefined' || !contentArr) {
				contentArr = [];
			}

			if (contentArr.indexOf(supplContent) < 0) {
				deferreds.push(updateSupplementaryContent(supplContent));
				if (elementMap[supplContent.contentId]) {
					supplContent.isAdded = true;
				}
				supplContent.identifier = supplContent.contentId;
				supplContent.contentId = PlayerUtil.removeFedoraPrefix(supplContent.contentId);
				contentArr.push(supplContent);
				categoryMap[category] = contentArr;
			}
		}
	}
	return promise_lib.all(deferreds);
}

function updateSupplementaryContent(supplContent) {
	var defer = promise_lib.defer();
	MongoHelper.findOne('MediaContentModel', {identifier: supplContent.contentId}, function(err, mediaContent) {
		if (err) {
			defer.reject(err);
		} else {
			supplContent.description = mediaContent.metadata.description;
			supplContent.owner = mediaContent.metadata.owner;
			supplContent.author = mediaContent.metadata.author;
			supplContent.concepts = mediaContent.concepts;
			supplContent.mainConceptId = '';
			if(mediaContent.concepts.length > 0) {
				supplContent.mainConceptId = removeFedoraPrefix(mediaContent.concepts[0].conceptIdentifier)
				defer.resolve();
			} else {
				defer.resolve();
			}
			
		}
	});
	return defer.promise;
}

function removeFedoraPrefix(identifier) {
	fedoraPrefix = "info:fedora/";
    if (identifier.indexOf(fedoraPrefix) == 0) {
        return identifier.substring(fedoraPrefix.length);
    } else {
        return identifier;
    }
};

exports.getAdditionalMaterial = function(req, res) {
	LoggerUtil.setOperationName('getAdditionalMaterial');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var lobId = decodeURIComponent(req.params.lobId);
	if (lobId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		lobId = PlayerUtil.addFedoraPrefix(lobId);
	}
	var category = decodeURIComponent(req.params.category);
	promise_lib.resolve()
	.then(function() {
		return exports.getMaterial(studentId, courseId, lobId, category);
	}).then(function(content) {
		res.send(JSON.stringify(content));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_ADDITIONAL_MATERIAL", req, res);
	}).done();
};

// disable add button if already exists in learner path
exports.getMaterial = function(studentId, courseId, lobId, category) {
	LoggerUtil.setOperationName('getMaterial');
	var content = [];
	var material = {};
	var learnerState;
	var elementMap;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				deferred.resolve(lobState);	
			} else {
				deferred.reject('Learner Path not found');
			}
		});
		return deferred.promise;
	}).then(function(lobState) {
		learnerState = lobState;
		elementMap = PlayerUtil.getMap(learnerState.elements);
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningObjectElementsModel', {courseId: courseId, lobId: lobId}).lean().exec(function(err, lob) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(lob);
			}
		});
		return deferred.promise;
	}).then(function(lob) {
		var deferreds = [];
		if (lob && lob.supplementary_content) {
			addSupplementaryContent(material, lob, category, elementMap);
		}
		for (var i=0; i<lob.elements.length; i++) {
			var element = lob.elements[i];
			if (element.elementType == ViewHelperConstants.LEARNING_RESOURCE || element.elementType == ViewHelperConstants.CLASSROOM) {
				deferreds.push(getLearningResourcePromise(courseId, element.elementId));
			} else if (element.elementType == ViewHelperConstants.LEARNING_ACTIVITY || element.elementType == ViewHelperConstants.EXAM || element.elementType == ViewHelperConstants.PRACTICE_TEST) {
				deferreds.push(getLearningActivityPromise(courseId, element.elementId));
			} else if (element.elementType == ViewHelperConstants.CONTENT) {
				deferreds.push(getMediaContentPromise(element.elementId));
			}
		}
		return promise_lib.all(deferreds);
	}).then(function(values) {
		values.forEach(function(value) {
			addSupplementaryContent(material, value, category, elementMap);
		});
		for (contentId in material) {
			content.push(material[contentId]);
		}
		defer.resolve(content);
	}).catch(function(err) {
		defer.reject(err);
	}).done();
	return defer.promise;
};

function addSupplementaryContent(material, lob, category, elementMap) {
	if (lob && lob.supplementary_content) {
		for (var i=0; i<lob.supplementary_content.length; i++) {
			var supplContent = lob.supplementary_content[i];
			if (supplContent.contentGroup == category) {
				supplContent.tutoring = true;
				if (!material[supplContent.contentId]) {
					if (elementMap[supplContent.contentId]) {
						supplContent.isAdded = true;
					}
					supplContent.contentId = PlayerUtil.removeFedoraPrefix(supplContent.contentId);
					material[supplContent.contentId] = supplContent;
				}
			}
		}
	}
}

exports.getLRAdditionalMaterial = function(req, res) {
	LoggerUtil.setOperationName('getLRAdditionalMaterial');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var lrId = decodeURIComponent(req.params.lrId);
	if (lrId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		lrId = PlayerUtil.addFedoraPrefix(lrId);
	}
	var category = decodeURIComponent(req.params.category);
	promise_lib.resolve()
	.then(function() {
		return exports.getLRMaterial(studentId, courseId, lrId, category);
	}).then(function(content) {
		res.send(JSON.stringify(content));	
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_ADDITIONAL_MATERIAL", req, res);
	}).done();
};

exports.getLRMaterial = function(studentId, courseId, lrId, category) {
	LoggerUtil.setOperationName('getLRMaterial');
	var content = [];
	var material = {};
	var learnerState;
	var elementMap;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				deferred.resolve(lobState);	
			} else {
				deferred.reject('Learner Path not found');
			}
		});
		return deferred.promise;
	}).then(function(lobState) {
		learnerState = lobState;
		elementMap = PlayerUtil.getMap(learnerState.elements);
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningResourceModel', {courseId: courseId, identifier: lrId}, function(err, lr) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(lr);
			}
		});
		return deferred.promise;
	}).then(function(lob) {
		addSupplementaryContent(material, lob, category, elementMap);
		for (contentId in material) {
			content.push(material[contentId]);
		}
		defer.resolve(content);
	}).catch(function(err) {
		defer.reject(err);
	}).done();
	return defer.promise;
};

exports.getLAAdditionalMaterial = function(req, res) {
	LoggerUtil.setOperationName('getLAAdditionalMaterial');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var laId = decodeURIComponent(req.params.laId);
	if (laId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		laId = PlayerUtil.addFedoraPrefix(laId);
	}
	var category = decodeURIComponent(req.params.category);
	promise_lib.resolve()
	.then(function() {
		return exports.getLAMaterial(studentId, courseId, laId, category);
	}).then(function(content) {
		res.send(JSON.stringify(content));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_ADDITIONAL_MATERIAL", req, res);
	}).done();
};

exports.getLAMaterial = function(studentId, courseId, laId, category) {
	LoggerUtil.setOperationName('getLAMaterial');
	var content = [];
	var material = {};
	var learnerState;
	var elementMap;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				deferred.resolve(lobState);
			} else {
				deferred.reject('Learner Path not found');
			}
		});
		return deferred.promise;
	}).then(function(lobState) {
		learnerState = lobState;
		elementMap = PlayerUtil.getMap(learnerState.elements);
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningActivityModel', {courseId: courseId, identifier: laId}, function(err, la) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(la);
			}
		});
		return deferred.promise;
	}).then(function(lob) {
		addSupplementaryContent(material, lob, category, elementMap);
		for (contentId in material) {
			content.push(material[contentId]);
		}
		defer.resolve(content);
	}).catch(function(err) {
		defer.reject(err);
	}).done();
	return defer.promise;
};

exports.getContentAdditionalMaterial = function(req, res) {
	LoggerUtil.setOperationName('getContentAdditionalMaterial');
	var studentId = req.user.identifier;
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var contentId = decodeURIComponent(req.params.contentId);
	if (contentId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		contentId = PlayerUtil.addFedoraPrefix(contentId);
	}
	var category = decodeURIComponent(req.params.category);
	promise_lib.resolve()
	.then(function() {
		return exports.getContentMaterial(studentId, courseId, contentId, category);
	}).then(function(content) {
		res.send(JSON.stringify(content));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_ADDITIONAL_MATERIAL", req, res);
	}).done();
};

exports.getContentMaterial = function(studentId, courseId, contentId, category) {
	LoggerUtil.setOperationName('playElement');
	var content = [];
	var material = {};
	var learnerState;
	var elementMap;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				deferred.resolve(lobState);
			} else {
				deferred.reject('Learner Path not found');
			}
		});
		return deferred.promise;
	}).then(function(lobState) {
		learnerState = lobState;
		elementMap = PlayerUtil.getMap(learnerState.elements);
		var deferred = promise_lib.defer();
		MongoHelper.findOne('MediaContentModel', {identifier: contentId}, function(err, mediaContent) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(mediaContent);
			}
		});
		return deferred.promise;
	}).then(function(lob) {
		addSupplementaryContent(material, lob, category, elementMap);
		for (contentId in material) {
			content.push(material[contentId]);
		}
		defer.resolve(content);
	}).catch(function(err) {
		defer.reject(err);
	}).done();
	return defer.promise;
};

function getLearningObjectElementsPromise(courseId, lobId) {
	var defer = promise_lib.defer();
	MongoHelper.findOne('LearningObjectElementsModel', {courseId: courseId, lobId: lobId}, function(err, lob) {
		if (err) {
			defer.reject(err);
		} else {
			if (lob) {
				defer.resolve(lob);
			} else {
				defer.reject('Learning object not found: ' + lobId);
			}
		}
	});
	return defer.promise;
}

function getLearningResourcePromise(courseId, elementId) {
	var defer = promise_lib.defer();
	MongoHelper.findOne('LearningResourceModel', {courseId: courseId, identifier: elementId}, function(err, lr) {
		if (err) {
			defer.reject(err);
		} else {
			if (lr) {
				defer.resolve(lr);
			} else {
				defer.reject('Learning Resource not found: ' + elementId);
			}
		}
	});
	return defer.promise;
}

function getLearningActivityPromise(courseId, elementId) {
	var defer = promise_lib.defer();
	MongoHelper.findOne('LearningActivityModel', {courseId: courseId, identifier: elementId}, function(err, la) {
		if (err) {
			defer.reject(err);
		} else {
			if (la) {
				defer.resolve(la);
			} else {
				defer.reject('Learning Activity not found: ' + elementId);
			}
		}
	});
	return defer.promise;
}

function getMediaContentPromise(elementId) {
	var defer = promise_lib.defer();
	MongoHelper.findOne('MediaContentModel', {identifier: elementId}, function(err, mediaContent) {
		if (err) {
			defer.reject(err);
		} else {
			if (mediaContent) {
				defer.resolve(mediaContent);
			} else {
				defer.reject('Media Content not found: ' + elementId);
			}
		}
	});
	return defer.promise;
}


