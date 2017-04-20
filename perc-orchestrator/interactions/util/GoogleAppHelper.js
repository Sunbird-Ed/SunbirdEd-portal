/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Google App Helper
 * Helper to create all required labels for course or tutor inbox
 *
 * @author Santhosh
 */
var promise_lib = require('when');
var mongoose = require('mongoose');
var googleAppService = require('../services/GoogleAppAdminService');
var interactionService = require('../services/InteractionService.js');

var getUserEmail = function(req){
	if(req.user.inboxEmailId)
		return req.user.inboxEmailId;
	else
		return req.user.identifier + "@perceptronnetwork.com";
}

exports.createMailboxForCourse = function(req, res) {

	var courseId = req.params.courseId;
	console.log('courseId', courseId);
	var data = {
		USER_EMAIL_ID: getUserEmail(req),
		COURSE: {
			courseName: '',
			environment: appConfig.ENVIRONMENT,
			courseId: courseId,
			inboxEmailId: '',
			concepts:[],
			learningElements: []
		}
	}
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		if(!appConfig.GOOGLE_APP_ACCOUNT_CREATE) {
			defer.reject('Cannot create inbox in this environment.');
		} else {
			defer.resolve();
		}
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		CourseModel = mongoose.model('CourseModel');
		CourseModel.findOne({identifier: courseId}, {'inboxEmailId':1, 'name':1}).lean().exec(function(err, course) {
			if(err || course.inboxEmailId == null || (typeof course.inboxEmailId == 'undefined')) {
				defer.reject('Course does not have an inbox configured');
			} else {
				data.COURSE.courseName = course.name;
				data.COURSE.inboxEmailId = course.inboxEmailId;
				defer.resolve();
			}
		});
		return defer.promise;
	})
	.then(function() {
		return getLabelFilterMappings(data, courseId);
	})
	.then(function() {
		var defer = promise_lib.defer();
		interactionService.publishCourse(data).then(function(data) {
			res.send(data);
			defer.resolve();
		}).catch(function(e){
			defer.reject(e);
		});
		return defer.promise;
	})
	.catch(function(err) {
		res.send(err);
	})
	.done(function() {
		console.log('Course published.');
	});
}

function getLabelFilterMappings(data, courseId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return populateConceptLabels(data, courseId);
	})
	.then(function() {
		return populateLearningElementLabels(data, courseId);
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	.done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}

function populateConceptLabels(data, courseId) {
	var deferred = promise_lib.defer();
	ConceptMapCache = mongoose.model('ConceptMapCache');
	ConceptMapCache.findOne({courseId: courseId}, 'conceptsList').lean().exec(function(err, cache) {
		if(err) {
			console.log('Concept cache not found');
		} else {
			cache.conceptsList.forEach(function(conceptId) {
				data.COURSE.concepts.push(conceptId);
			});
		}
		deferred.resolve();
	});
	return deferred.promise;
}

function populateLearningElementLabels(data, courseId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel = mongoose.model('LearningObjectModel');
		LearningObjectModel.find({courseId: courseId}, 'identifier').lean().exec(function(err, elements) {
			if(elements) {
				elements.forEach(function(element)  {
					data.COURSE.learningElements.push(element.identifier);
				});
			}
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningResourceModel = mongoose.model('LearningResourceModel');
		LearningResourceModel.find({courseId: courseId}, 'identifier').lean().exec(function(err, elements) {
			if(elements) {
				elements.forEach(function(element)  {
					data.COURSE.learningElements.push(element.identifier);
				});
			}
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.find({courseId: courseId}, 'identifier').lean().exec(function(err, elements) {
			if(elements) {
				elements.forEach(function(element)  {
					data.COURSE.learningElements.push(element.identifier);
				});
			}
			defer.resolve();
		});
		return defer.promise;
	})
	.catch(function(err) {
		console.log('Error populating LE labels - ', err);
	})
	.done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}