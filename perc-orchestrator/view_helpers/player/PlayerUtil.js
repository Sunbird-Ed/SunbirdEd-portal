/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Player
 *
 * @author rayulu
 */

 var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');

var fedoraPrefix = "info:fedora/";
exports.fedoraPrefix = fedoraPrefix;

exports.removeFedoraPrefix = function(identifier) {
	if (identifier.indexOf(exports.fedoraPrefix) == 0) {
		return identifier.substring(exports.fedoraPrefix.length);
	} else {
		return identifier;
	}
};

exports.addFedoraPrefix = function(identifier) {
	if (identifier.indexOf(exports.fedoraPrefix) == 0) {
		return identifier;
	} else {
		return exports.fedoraPrefix + identifier;
	}
};

exports.getMap = function(list, idField) {
	if (!idField) {
		idField = 'identifier';
	}
	var lobs = {};
	if (list && list.length > 0) {
		for (var i=0; i<list.length; i++) {
			var obj = {};
			lobs[list[i][idField]] = list[i];
		}
	}
	return lobs;
};

exports.getLearningObjectPromises = function(courseId, lobId, elementMap, lobMap) {
	var deferred = promise_lib.defer();
	var element = elementMap[lobId];
	if (typeof element == 'undefined' || !element) {
		if (lobMap) {
			element = lobMap[lobId];
		}
	}
	if (!element) {
		deferred.reject('Element not found');
	}
	if (element.elementType == ViewHelperConstants.LESSON || element.elementType == ViewHelperConstants.MODULE || element.elementType == ViewHelperConstants.BINDER) {
		MongoHelper.findOne('LearningObjectModel', {courseId: courseId, identifier: lobId}, function(err, lob) {
			if (err) {
				deferred.reject(err);
			} else {
				lob.status = element.status;
				lob.elementType = element.elementType;
				deferred.resolve(lob);
			}
		});
	} else if (element.elementType == ViewHelperConstants.LEARNING_RESOURCE || element.elementType == ViewHelperConstants.CLASSROOM) {
		MongoHelper.findOne('LearningResourceModel', {courseId: courseId, identifier: lobId}, function(err, lr) {
			if (err) {
				deferred.reject(err);
			} else {
				lr.status = element.status;
				lr.elementType = element.elementType;
				deferred.resolve(lr);
			}
		});
	} else if (element.elementType == ViewHelperConstants.LEARNING_ACTIVITY || element.elementType == ViewHelperConstants.EXAM || element.elementType == ViewHelperConstants.PRACTICE_TEST) {
		MongoHelper.findOne('LearningActivityModel', {courseId: courseId, identifier: lobId}, function(err, la) {
			if (err) {
				deferred.reject(err);
			} else {
				la.status = element.status;
				la.elementType = ViewHelperConstants.LEARNING_ACTIVITY;
				deferred.resolve(la);
			}
		});
	}  else if (element.elementType == ViewHelperConstants.CONTENT) {
		MongoHelper.findOne('MediaContentModel', {identifier: lobId}, function(err, content) {
			if (err) {
				deferred.reject(err);
			} else {
				if (content) {
					content.status = element.status;
					content.elementType = ViewHelperConstants.CONTENT;
					deferred.resolve(content);
				} else {
					deferred.reject("Content Object " + contentId + " not found");
				}
			}
		});
	} else {
		deferred.reject('Invalid element type');
	}
	return deferred.promise;
};

exports.getMediaContentPromises = function(contentId) {
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
};

exports.getLearningResource = function(courseId, lrId, defer) {
	if (!defer) {
		defer = promise_lib.defer();
	}
	MongoHelper.findOne('LearningResourceModel', {courseId: courseId, identifier: lrId}, function(err, lr) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(lr);
		}
	});
	return defer.promise;
};

exports.getLearningActivity = function(courseId, lrId, defer) {
	if (!defer) {
		defer = promise_lib.defer();
	}
	MongoHelper.findOne('LearningActivityModel', {courseId: courseId, identifier: lrId}, function(err, lr) {
		if (err) {
			defer.reject(err);
		} else {
			defer.resolve(lr);
		}
	});
	return defer.promise;
};

exports.getObjectTypesPromise = function(lobType) {
	var deferred = promise_lib.defer();
	ObjectTypesModel = mongoose.model('ObjectTypesModel');
	MongoHelper.findOne('ObjectTypesModel', {identifier: lobType}, function(err, objectType) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(objectType);
		}
	});
	return deferred.promise;
};

exports.getCategoryTypesPromise = function() {
	var deferred = promise_lib.defer();
	MongoHelper.find('CategoryTypesModel', {}).toArray(function(err, categories) {
		if (err) {
			deferred.reject(err);
		} else {
			var categoryMap = exports.getMap(categories);
			deferred.resolve(categoryMap);
		}
	});
	return deferred.promise;
}

exports.getAllParentLOBs = function(course, elementId, parentLOBs, defer) {
	if (!defer) {
		defer = promise_lib.defer();
	}
	var parentLOB;
	course.learning_objects.forEach(function(lob) {
		lob.sequence.forEach(function(lobElement) {
			if (lobElement == elementId) {
				parentLOB = lob;
			}
		});
	});
	if (parentLOB) {
		parentLOBs[parentLOB.identifier] = parentLOB;
		exports.getAllParentLOBs(course, parentLOB.identifier, parentLOBs, defer);
	} else {
		defer.resolve(parentLOBs);
	}
	return defer.promise;
}

exports.addTags = function(lob, currentObject) {
	if(lob.metadata.instructionUsage && lob.metadata.instructionUsage.toLowerCase() == "tutoring") {
		currentObject.tags.push("tutoring");
	}
	if(lob.categories) {
		currentObject.tags.push("supplementary_content");
		currentObject.supplementaryTypes = lob.categories;
	}
	if(lob.metadata.outcome && lob.metadata.outcome.toLowerCase() != "default") {
		currentObject.tags.push("outcome");
		currentObject.outcomeTagValue = lob.metadata.outcome;
	}
/*	if(lob.nodeSet) {
		currentObject.tags.push(lob.nodeSet);
	}*/
}
