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
LearningObjectiveModel = mongoose.model('LearningObjectiveModel');
var ViewHelperConstants = require('../ViewHelperConstants');

exports.importLearningObjective = function(node, graph, courseId) {
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);
	var isNew = false;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectiveModel.findOne, LearningObjectiveModel, [{identifier: id}]))
	.then(function(element) {
		var deferred = promise_lib.defer();
		if(typeof element == 'undefined' || element == null) {
			element = new LearningObjectiveModel();
			element.identifier = id;
			element.courseId = courseId;
			isNew = true;
		}
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'description', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'shortDescription', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'image', element);

		if(typeof element.metadata == 'undefined' || element.metadata == null) element.metadata = {};
		for(k in metadata) {
			element.metadata[k] = metadata[k];
		}
		element.markModified('metadata');
		element.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('lob import err', err);
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

exports.getAll = function(req, res) {
	var learningObjectives = null;
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectiveModel.find, LearningObjectiveModel,[{}]))
	.then(function(elements) {
		learningObjectives = elements;
	})
	.catch(function(err) {
		console.log('lob import err', err);
	})
	.done(function(elements) {
		res.send(learningObjectives);
	});
}
