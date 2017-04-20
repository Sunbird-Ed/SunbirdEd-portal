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
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');

exports.completeElement = function(req, res) {
	LoggerUtil.setOperationName('completeElement');
	var elementId = decodeURIComponent(req.params.elementId);
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
	var studentId = req.user.identifier;
	var timeSpent = req.params.timeSpent;
	if (!req.params.timeSpent || isNaN(timeSpent)) {
		timeSpent = 0;
	}
	var userType = "student";
	if(req.user.roles.indexOf('tutor') > -1 || req.user.roles.indexOf('faculty') > -1) {
		userType = "tutor";
	}
	var course;
	var currentElement;
	var mwUpdated = false;
	LearnerStateModel = mongoose.model('LearnerStateModel');
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var req = new Object();
	    req.LEARNER_ID = studentId;
	    req.COURSE_ID = courseId;
	    req.LEARNING_ELEMENT_ID = elementId;
	    var attempt = {};
	    attempt.timeSpent = parseInt(timeSpent);
	    req.ATTEMPT = attempt;
	    if(userType == "student") {
	    	MWServiceProvider.callServiceStandard("learnerService", "CompleteAttempt", req, function(err, data, response) {
		        console.log("Request:",JSON.stringify(req));
		        if (err) {
		            console.log("Error in Response from MW CompleteAttempt: " + err);
		        } else {
		            console.log("Response from MW CompleteAttempt: " + JSON.stringify(data, null, 4));
		        }
		    });
		    defer.resolve(true);
	    } else {
	    	defer.resolve(true);
	    }
		return defer.promise;
	}).then(function(status) {
		mwUpdated = status;
		var defer = promise_lib.defer();
	    MongoHelper.findOne('LearnerStateModel', {
	        student_id: studentId,
	        courseId: courseId
	    }, function(err, learnerState) {
	        if (err) {
	            defer.reject(err);
	        } else {
	            if (learnerState) {
	                defer.resolve(learnerState);
	            } else {
	                defer.reject('Learning Object not found in learner path');
	            }
	        }
	    });
	    return defer.promise;
	}).then(function(learnerState) {
		var elementMap = PlayerUtil.getMap(learnerState.elements);
		var learnerStateElement = elementMap[elementId];
		var defer = promise_lib.defer();
		if (mwUpdated && (!learnerStateElement.state || learnerStateElement.state != 2)) {
			MongoHelper.update('LearnerStateModel', {student_id: studentId, courseId: courseId, "elements.identifier": elementId}, 
                {$set: {"elements.$.state" : 2}}, function(err, obj) {
                if (err) {
                    console.log("Error updating learning element state: " + err);
                    defer.reject(err);
                } else {
                    console.log("Learning Element State updated");
                    defer.resolve();
                }
            });
		} else {
			defer.resolve();
		}
		return defer.promise;
	}).catch(function(err) {
		console.log("Error: ",err);
		mwUpdated = false;
	}).done(function() {
		var response = {};
		response.status = mwUpdated;
		res.send(JSON.stringify(response));
	});
};


exports.setCurrentElementId = function(req, res) {
	LoggerUtil.setOperationName('setCurrentElementId');
	var studentId = req.user.identifier;
	var courseId = req.params.courseId;
	var elementId = req.params.elementId;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.update('LearnerStateModel', {student_id: studentId, courseId: courseId}, {$set:{currentElementId: elementId}}, function(err, obj) {
		 	if (err) {
		 		console.log('Learner State update failed: ' + err);
		 		deferred.reject('Learner State update failed');
		 	} else {
				deferred.resolve('Success');
			}
		});
		return deferred.promise;
	}).catch(function(err) {
		console.log("Error: ",err);
		res.send(elementId);
	}).done(function() {
		res.send(elementId);
	});
}

exports.getCurrentElementId = function(req, res) {
	LoggerUtil.setOperationName('getCurrentElementId');
	var studentId = req.user.identifier;
	var courseId = req.params.courseId;
	var elementId = "";
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', { student_id: studentId, courseId: courseId}, function(err, learnerState) {
			if (learnerState) {
				elementId = learnerState.currentElementId;
				deferred.resolve(learnerState);
			} else {
				deferred.reject('Learner Path not found');
			}
		});
		return deferred.promise;
	}).catch(function(err) {
		console.log("Error: ",err);
		res.send(elementId);
	}).done(function() {
		res.send(elementId);
	});
}

exports.getStudentCoursePackage = function(req, res) {
	LoggerUtil.setOperationName('getStudentCoursePackage');
	var studentId = req.user.identifier;
	var courseId = req.params.courseId;
	var _package = {};
	LearnerStateModel = mongoose.model('LearnerStateModel');
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearnerStateModel.findOne({student_id: studentId, courseId: courseId}).exec(function(err, learnerState) {
			if (learnerState) {
				_package.status = "ENROLLED";
				_package.packageId = learnerState.packageId;
				deferred.resolve();
			} else {
				_package.status = "NOT_ENROLLED";
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).catch(function(err) {
		console.log("Error: ",err);
		res.send(_package);
	}).done(function() {
		res.send(_package);
	});
}


