/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Learner Enrollment
 *
 * @author rayulu
 */

var MWServiceProvider = require('../../commons/MWServiceProvider');
var mongoose = require('mongoose'), errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
require("date-format-lite");

exports.enrollCourse = function(req, res) {
	var userType = "student";
	createStudentLearningPath(true, req, res, userType);
}

exports.checkEnrollment = function(req, res, next) {
	var courseId = req.params.courseId || req.body.courseId;
	exports.userEnrolled(req, res, next, courseId);
}

exports.userEnrolled = function(req, res, next, courseId) {
	courseId = PlayerUtil.addFedoraPrefix(courseId);
	MongoHelper.count('LearnerStateModel', {courseId: courseId, student_id: req.user.identifier}, function(err, count) {
		if(count > 0) {
			next();
		} else {
			res.status(500).send({error: 'You are not enrolled to the course'});
		}
	});
}

exports.updateLearnerPath = function(req, res) {
	var studentId = req.user.identifier;
	var courseId = decodeURIComponent(req.params.courseId);
	var courseObj;
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('CourseModel', {identifier: courseId}, function(err, course) {
			if(err || !course) {
				defer.reject(err);
			} else {
				defer.resolve(course);
			}
		});
		return defer.promise;
	}).then(function(course) {
		courseObj = course;
		var defer = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, state) {
			if(err || !state) {
				defer.reject(err);
			} else {
				defer.resolve(state);
			}
		});
		return defer.promise;
	}).then(function(state) {
		var isUpdate = true;
		if(typeof state.lastUpdated === 'string') state.lastUpdated = new Date(Date.parse(state.lastUpdated));
		if (state.lastUpdated && courseObj.lastUpdated) {
			if (state.lastUpdated.getTime() >= courseObj.lastUpdated.getTime()) {
				isUpdate = false;
			}
		}
		if (isUpdate || !state.groups || !state.targets) {
			var userType = "student";
			if(req.user.roles.indexOf('tutor') > -1 || req.user.roles.indexOf('faculty') > -1) {
				userType = "tutor";
			}
			console.log('updating learner Path');
			createStudentLearningPath(false, req, res, userType);
		} else {
			res.send(JSON.stringify('Learner Path is already up-to-date'));
		}
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR", req, res);
	}).done();
}

function createStudentLearningPath(isNew, req, res, userType) {
	var studentId = req.user.identifier;
	var courseId = req.params.courseId;
	var packageId = req.params.packageId;
	exports.createLearnerPath(isNew, studentId, courseId, packageId, userType, res);
}

exports.createLearnerPath = function(isNew, userId, courseId, packageId, userType, res) {
	promise_lib.resolve()
	.then(function() {
		return exports.enrollLearnerToCourse(isNew, userId, courseId, packageId, userType);
	})
	.then(function() {
		res.send(JSON.stringify('OK'));
	})
	.catch(function(err) {
		var req = new Object();
		errorModule.handleError(err, "ERROR", req, res);
	}).done();
};

exports.enrollLearnerToCourse = function(isNew, userId, courseId, packageId, userType, batch) {

	LoggerUtil.setOperationName('EnrollCourse:enrollLearnerToCourse');
	var studentId = userId;
	var courseId = decodeURIComponent(courseId);
	var packageId = (decodeURIComponent(packageId) == "none")?"":decodeURIComponent(packageId);

	var currentUser;
	var course;
	var student = {profile: {
		"name" : "",
		"outcome" : "default",
		"learnerLevel" : ""
	}};
	var lobs = {};
	var learnerPath;
	var state = {};
	state.userType = userType;
	var lobMap = {};
	var elementMap = {};
	var prevElementMap = {};

	UserModel = mongoose.model('UserModel');
	StudentModel = mongoose.model('StudentModel');
	EnrolledCoursesModel = mongoose.model('EnrolledCoursesModel');
	LearnerStateModel = mongoose.model('LearnerStateModel');
	CourseModel = mongoose.model('CourseModel');
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function(std) {
		var deferred = promise_lib.defer();
		CourseModel.findOne({identifier: courseId}).lean().exec(function(err, obj) {
			if (err) {
				deferred.reject(err);
			} else {
				if (obj) {
					deferred.resolve(obj);
				} else {
					deferred.reject('ERROR');
				}
			}
		});
		return deferred.promise;
	}).then(function(obj) {
		course = obj;
		var deferred = promise_lib.defer();
		EnrolledCoursesModel.findOne({student_id: studentId, course_id: courseId})
			.exec(function(err, enroll) {
			if (enroll) {
				deferred.resolve(enroll);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).then(function(enroll) {
		var deferred = promise_lib.defer();
		if (!enroll) {
			enroll = new EnrolledCoursesModel();
			enroll.student_id = studentId;
			enroll.course_id = courseId;
			enroll.identifier = studentId + "_" + courseId;
		}
		if(batch) enroll.batch = batch;
		enroll.package_id = packageId;
		enroll.save(function(err, object) {
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
		LearnerStateModel.findOne({student_id: studentId, courseId: courseId}).exec(function(err, learnerState) {
			if (learnerState) {
				deferred.resolve(learnerState);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.then(function(learnerState) {
		if (learnerState) {
			learnerPath = learnerState;
			if (learnerState.profile) {
				state.profile = learnerState.profile;
			} else {
				state.profile = student.profile;
			}
			if(learnerState.packageId) {
				course.packages.forEach(function(package) {
					if(package.identifier == learnerState.packageId) {
						state.package = package;
					}
				});
			}
			prevElementMap = PlayerUtil.getMap(learnerPath.elements);
		} else {
			var now = new Date();
			learnerPath = new LearnerStateModel();
			learnerPath.student_id = studentId;
			learnerPath.courseId = courseId;
			if(userType == "student") {
				learnerPath.profile = student.profile;
			}
			learnerPath.roles = [userType];
			learnerPath.enrolled_date = now.format("DD MMMM YYYY");
			learnerPath.learning_objects = [];
			learnerPath.elements = [];
		}
		if (typeof course.timeUnit == 'string' && course.timeUnit != '') {
			learnerPath.timeUnit = course.timeUnit;
		} else {
			learnerPath.timeUnit = 'Week';
		}
		if(batch) learnerPath.batch = batch;
		lobMap = PlayerUtil.getMap(learnerPath.learning_objects);
		elementMap = PlayerUtil.getMap(learnerPath.elements);
		var deferred = promise_lib.defer();
		LearningObjectModel.find({courseId: courseId}).lean().exec(function(err, list) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(list);
			}
		});
		return deferred.promise;
	}).then(function(list) {
		var deferreds = [];
		var courseLobMap = PlayerUtil.getMap(list);
		list.forEach(function(lob) {
			var lobAdded = false;
			if (!lobMap[lob.identifier]) {
				if (checkProfileOutcome(state, lob)) {
					var obj = {};
					obj.identifier = lob.identifier;
					obj.elementType = lob.lobType;
					obj.mediaType = lob.lobType;
					obj.name = lob.name;
					obj.sequence = lob.sequence;
					obj.additional_material = [];
					obj.offset = lob.offset;
					lobMap[lob.identifier] = obj;
					lobAdded = true;
				}
			} else {
				var instructionUsage = lob.metadata.instructionUsage;
				if (instructionUsage && instructionUsage.toLowerCase() == 'coaching') {
					var obj = lobMap[lob.identifier];
					obj.name = lob.name;
					obj.sequence = lob.sequence;
					obj.offset = lob.offset;
					obj.mediaType = lob.lobType;
					lobAdded = true;
				} else {
					if (checkProfileOutcome(state, lob)) {
						var obj = lobMap[lob.identifier];
						obj.name = lob.name;
						var newSeq = lob.sequence;
						var lobSequence = [];
						var prevLength = newSeq.length;
						newSeq.forEach(function(seqId) {
							if (courseLobMap[seqId].lobType == ViewHelperConstants.BINDER) {
								if (lobMap[seqId]) {
									lobSequence.push(seqId);
								}
							} else {
								lobSequence.push(seqId);
							}
						});
						var newLength = lobSequence.length;
						if (newLength != prevLength) {
							console.log(lob.identifier + ' : ' + prevLength + ' - ' + newLength);
						}
						obj.sequence = lobSequence;
						obj.offset = lob.offset;
						obj.mediaType = lob.lobType;
						lobAdded = true;
					} else {
						deleteLob(lobMap, elementMap, lob.identifier);
					}
				}
			}
			if (lobAdded) {
				var deferred = promise_lib.defer();
				deferreds.push(deferred.promise);
				LearningObjectElementsModel.findOne({courseId: courseId, lobId: lob.identifier}).lean()
						.exec(function(err, lobElements) {
					deferred.resolve(lobElements);
				});
			}
		});
		return promise_lib.all(deferreds);
	}).then(function(values) {
		var deferreds = [];
		if(!values) {
			return;
		}
		values.forEach(function(lobElements) {
			if (lobElements && lobElements.elements) {
				lobMap[lobElements.lobId].sequence2 = lobElements.sequence;
				lobMap[lobElements.lobId].eleMap = [];
				lobElements.elements.forEach(function(ele) {
					if (ele.elementType == ViewHelperConstants.LEARNING_ACTIVITY || ele.elementType == ViewHelperConstants.LEARNING_RESOURCE || ele.elementType == ViewHelperConstants.CONTENT) {
						var deferred = promise_lib.defer();
						deferreds.push(deferred.promise);
						addElementToPath(ele, elementMap, lobMap, lobElements.lobId, deferred, state);
						//deferred.resolve();
					} else if (ele.elementType == ViewHelperConstants.COLLECTION) {
						deferreds.push(getCollectionElements(courseId, ele, lobElements.lobId, lobMap, elementMap, state));
					}
				});
			}
		});
		return promise_lib.all(deferreds);
	}).then(function(values) {
		var deferreds = [];
		for (var lobId in lobMap) {
			var deferred = promise_lib.defer();
			deferreds.push(deferred.promise);
			var lob = lobMap[lobId];
			if(lob.sequence2) {
				lob.sequence2.forEach(function(seqId) {
					if (lob.eleMap.indexOf(seqId) > -1) {
						lob.sequence.push(seqId);
					}
				});
			}
			if(lob.additional_material) {
				lob.additional_material.forEach(function(supplContent) {
					lob.sequence.push(supplContent);
				});
			}
			deferred.resolve();
		}
		return promise_lib.all(deferreds);
	}).then(function() {
		learnerPath.learning_objects = [];
		learnerPath.elements = [];
		for (var lobId in lobMap) {
			var lob = lobMap[lobId];
			var seq = lob.sequence;
			var newSeq = [];
			var binderSeq = [];
			if (seq && seq.length > 0) {
				seq.forEach(function(seqId) {
					if (lobMap[seqId] || elementMap[seqId]) {
						if (lobMap[seqId] && lobMap[seqId].elementType == ViewHelperConstants.BINDER) {
							binderSeq.push(seqId);
						} else {
							newSeq.push(seqId);
						}
					}
				});
			}
			newSeq.push.apply(newSeq, binderSeq);
			lob.sequence = newSeq;
			var counts = getElementsCount(lobMap, elementMap, lob);
			lob.elements_count = [];
			for(k in counts) {
				var countObj = new Object();
				countObj.elementType = k;
				countObj.total = counts[k].total;
				lob.elements_count.push(countObj);
			}
			var lobCounts = getLOBsCount(lobMap, lob);
			lob.lobs_count = [];
			for(k in lobCounts) {
				lob.lobs_count.push({'elementType': k, 'total': lobCounts[k].total});
			}
			lob.learningTime = getLearningTime(lobMap, elementMap, lob);
			learnerPath.learning_objects.push(lob);
		}
		for (var elementId in elementMap) {
			learnerPath.elements.push(elementMap[elementId]);
		}
		if(!isCurrentElementExist(learnerPath)) {
			learnerPath.currentElementId = "";
		}
		var arrays = exports.createLists(learnerPath);
		learnerPath.packageId = packageId;
		learnerPath.groups = arrays;
		learnerPath.lastUpdated = new Date();
		learnerPath.markModified('learning_objects');
		learnerPath.markModified('elements');
		learnerPath.markModified('groups');
		learnerPath.markModified('targets');
		var deferred = promise_lib.defer();
		learnerPath.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve('Success');
			}
		});
		return deferred.promise;
	}).then(function() {
	    var req = new Object();
	    req.LEARNER_ID = studentId;
	    req.COURSE_ID = courseId;
	    req.BATCH_ID = batch || '';
	    var deferred = promise_lib.defer();
	    if(userType == "student") {
	    	var mwCommand = "UpdateLearnerPath";
		    if (isNew) {
		    	mwCommand = "CreateLearnerState";
		    }
		    MWServiceProvider.callServiceStandard("learnerService", mwCommand, req, function(err, data, response) {
		        if (err) {
		            deferred.reject("Error in Response from MW " + mwCommand);
		        } else {
		            deferred.resolve();
		        }
		    });
	    } else {
	    	deferred.resolve();
	    }
	    return deferred.promise;
	}).then(function() {
		defer.resolve('OK');
	}).catch(function(err) {
		defer.reject(err);
	}).done();
	return defer.promise;
};

function getDefaultLearnerPath(courseId) {

	LoggerUtil.setOperationName('EnrollCourse:enrollLearnerToCourse');
	var packageId = '';
	var course;
	var lobs = {};
	var learnerPath = {};
	var state = {};
	var lobMap = {};
	var elementMap = {};
	var prevElementMap = {};

	UserModel = mongoose.model('UserModel');
	StudentModel = mongoose.model('StudentModel');
	LearnerStateModel = mongoose.model('LearnerStateModel');
	CourseModel = mongoose.model('CourseModel');
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function(std) {
		var deferred = promise_lib.defer();
		CourseModel.findOne({identifier: courseId}).lean().exec(function(err, obj) {
			if (err) {
				deferred.reject(err);
			} else {
				if (obj) {
					deferred.resolve(obj);
				} else {
					deferred.reject('ERROR');
				}
			}
		});
		return deferred.promise;
	}).then(function(obj) {
		course = obj;
		var now = new Date();
		learnerPath.courseId = courseId;
		learnerPath.enrolled_date = now.format("DD MMMM YYYY");
		learnerPath.learning_objects = [];
		learnerPath.elements = [];
		if (typeof course.timeUnit == 'string' && course.timeUnit != '') {
			learnerPath.timeUnit = course.timeUnit;
		} else {
			learnerPath.timeUnit = 'Week';
		}
		lobMap = PlayerUtil.getMap(learnerPath.learning_objects);
		elementMap = PlayerUtil.getMap(learnerPath.elements);
		var deferred = promise_lib.defer();
		LearningObjectModel.find({courseId: courseId}).lean().exec(function(err, list) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(list);
			}
		});
		return deferred.promise;
	}).then(function(list) {
		var deferreds = [];
		var courseLobMap = PlayerUtil.getMap(list);
		list.forEach(function(lob) {
			var lobAdded = false;
			if (!lobMap[lob.identifier]) {
				if (checkProfileOutcome(state, lob)) {
					var obj = {};
					obj.identifier = lob.identifier;
					obj.elementType = lob.lobType;
					obj.name = lob.name;
					obj.sequence = lob.sequence;
					obj.additional_material = [];
					obj.offset = lob.offset;
					lobMap[lob.identifier] = obj;
					lobAdded = true;
				}
			} else {
				var instructionUsage = lob.metadata.instructionUsage;
				if (instructionUsage && instructionUsage.toLowerCase() == 'coaching') {
					var obj = lobMap[lob.identifier];
					obj.name = lob.name;
					obj.sequence = lob.sequence;
					obj.offset = lob.offset;
					lobAdded = true;
				} else {
					if (checkProfileOutcome(state, lob)) {
						var obj = lobMap[lob.identifier];
						obj.name = lob.name;
						var newSeq = lob.sequence;
						var lobSequence = [];
						var prevLength = newSeq.length;
						newSeq.forEach(function(seqId) {
							if (courseLobMap[seqId].lobType == ViewHelperConstants.BINDER) {
								if (lobMap[seqId]) {
									lobSequence.push(seqId);
								}
							} else {
								lobSequence.push(seqId);
							}
						});
						var newLength = lobSequence.length;
						if (newLength != prevLength) {
							console.log(lob.identifier + ' : ' + prevLength + ' - ' + newLength);
						}
						obj.sequence = lobSequence;
						obj.offset = lob.offset;
						lobAdded = true;
					} else {
						deleteLob(lobMap, elementMap, lob.identifier);
					}
				}
			}
			if (lobAdded) {
				var deferred = promise_lib.defer();
				deferreds.push(deferred.promise);
				LearningObjectElementsModel.findOne({courseId: courseId, lobId: lob.identifier}).lean()
						.exec(function(err, lobElements) {
					deferred.resolve(lobElements);
				});
			}
		});
		return promise_lib.all(deferreds);
	}).then(function(values) {
		var deferreds = [];
		if(!values) {
			return;
		}
		values.forEach(function(lobElements) {
			if (lobElements && lobElements.elements) {
				lobMap[lobElements.lobId].sequence2 = lobElements.sequence;
				lobMap[lobElements.lobId].eleMap = [];
				lobElements.elements.forEach(function(ele) {
					if (ele.elementType == ViewHelperConstants.LEARNING_ACTIVITY || ele.elementType == ViewHelperConstants.LEARNING_RESOURCE || ele.elementType == ViewHelperConstants.CONTENT) {
						var deferred = promise_lib.defer();
						deferreds.push(deferred.promise);
						addElementToPath(ele, elementMap, lobMap, lobElements.lobId, deferred, state);
					} else if (ele.elementType == ViewHelperConstants.COLLECTION) {
						deferreds.push(getCollectionElements(courseId, ele, lobElements.lobId, lobMap, elementMap, state));
					}
				});
			}
		});
		return promise_lib.all(deferreds);
	}).then(function(values) {
		var deferreds = [];
		for (var lobId in lobMap) {
			var deferred = promise_lib.defer();
			deferreds.push(deferred.promise);
			var lob = lobMap[lobId];
			if(lob.sequence2) {
				lob.sequence2.forEach(function(seqId) {
					if (lob.eleMap.indexOf(seqId) > -1) {
						lob.sequence.push(seqId);
					}
				});
			}
			if(lob.additional_material) {
				lob.additional_material.forEach(function(supplContent) {
					lob.sequence.push(supplContent);
				});
			}
			deferred.resolve();
		}
		return promise_lib.all(deferreds);
	}).then(function() {
		learnerPath.learning_objects = [];
		learnerPath.elements = [];
		for (var lobId in lobMap) {
			var lob = lobMap[lobId];
			var seq = lob.sequence;
			var newSeq = [];
			if (seq && seq.length > 0) {
				seq.forEach(function(seqId) {
					if (lobMap[seqId] || elementMap[seqId]) {
						newSeq.push(seqId);
					}
				});
			}
			lob.sequence = newSeq;
			var counts = getElementsCount(lobMap, elementMap, lob);
			lob.elements_count = [];
			for(k in counts) {
				var countObj = new Object();
				countObj.elementType = k;
				countObj.total = counts[k].total;
				lob.elements_count.push(countObj);
			}
			var lobCounts = getLOBsCount(lobMap, lob);
			lob.lobs_count = [];
			for(k in lobCounts) {
				lob.lobs_count.push({'elementType': k, 'total': lobCounts[k].total});
			}
			lob.learningTime = getLearningTime(lobMap, elementMap, lob);
			learnerPath.learning_objects.push(lob);
		}
		for (var elementId in elementMap) {
			learnerPath.elements.push(elementMap[elementId]);
		}
		if(!isCurrentElementExist(learnerPath)) {
			learnerPath.currentElementId = "";
		}
		var arrays = exports.createLists(learnerPath);
		learnerPath.groups = arrays;
		learnerPath.lastUpdated = new Date();
		defer.resolve(learnerPath);
	}).catch(function(err) {
		console.log('LearnerEnrollmentHelper:getDefaultLearnerPath(). Error - ', err);
		defer.reject(err);
	}).done();
	return defer.promise;
}

exports.enrollLearnersToCourse = function(courseId, learners, logger) {

	var enrolledUsers = [], usersToEnroll = [];
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - Find new learners to be enrolled.');
		var learnerIds = [];
		learners.forEach(function(learner) {
			learnerIds.push(learner.learnerId);
		});
		var deferred = promise_lib.defer();
		MongoHelper.find('LearnerStateModel', {courseId: courseId, student_id: {$in:learnerIds}}, {student_id: 1}).toArray(function(err, enrolledStudents) {
			if(enrolledStudents && enrolledStudents.length > 0) {
				enrolledStudents.forEach(function(lstate) {
					enrolledUsers.push(lstate.student_id);
				});
			}
			deferred.resolve();
		});
		return deferred.promise;
	})
	.then(function() {
		logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - Already enrolled users - ' + enrolledUsers.length);
		learners.forEach(function(learner) {
			if(enrolledUsers.indexOf(learner.learnerId) == -1) {
				usersToEnroll.push(learner);
			}
		});
		logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - New Users to enroll - ' + usersToEnroll.length);
		var enrolledCoursesArr = [];
		usersToEnroll.forEach(function(user) {
			enrolledCoursesArr.push({
				student_id: user.learnerId,
				course_id: courseId,
				identifier: user.learnerId + "_" + courseId,
				batch: user.batch,
				package_id: ''
			});
		});
		if(enrolledCoursesArr.length > 0) {
			var deferred = promise_lib.defer();
			MongoHelper.insert('EnrolledCoursesModel', enrolledCoursesArr, function(err, result) {
				if(result) {
					logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - New records ingested into EnrolledCoursesModel - ' + result.length);
				}
				deferred.resolve();
			})
			return deferred.promise;
		}
	})
	.then(function() {
		logger.info('LearnerEnrollmentHelper:getDefaultLearnerPath() - Getting the default learner path');
		if(usersToEnroll.length > 0) {
			return getDefaultLearnerPath(courseId);
		}
	})
	.then(function(learnerPath) {
		logger.info('LearnerEnrollmentHelper:getDefaultLearnerPath() - Fetched default learner path' + JSON.stringify(learnerPath));
		if(usersToEnroll.length > 0) {
			var newLearnerPaths = [];
			var promises = [];
			var idx = 1;
			usersToEnroll.forEach(function(user) {
				var lp = JSON.parse(JSON.stringify(learnerPath));
				// SV - 09/04/15 - Convert string to date again, since stringify serializes a date to string
				lp.lastUpdated = new Date(lp.lastUpdated);
				lp.packageId = '';
				lp.student_id = user.learnerId;
				lp.batch = user.batch;
				lp.roles = [user.type];
				if(idx % 500 == 0) {
					promises.push(saveLearnerPaths(newLearnerPaths, logger));
					newLearnerPaths = [];
				}
				newLearnerPaths.push(lp);
				idx++;
			});
			promises.push(saveLearnerPaths(newLearnerPaths, logger));
			return promise_lib.all(promises);
		}
	}).then(function() {
		if(usersToEnroll.length > 0) {
			var req = new Object();
		    req.ENROLLMENT = {
		    	courseId: courseId,
		    	learners: []
		    }
		    usersToEnroll.forEach(function(learner) {
		    	req.ENROLLMENT.learners.push({learnerId: learner.learnerId, batchId: learner.batch});
		    });
		    logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - Sending request to MW - ' + JSON.stringify(req));
		    var deferred = promise_lib.defer();
		    MWServiceProvider.callServiceStandard("learnerService", "EnrollUsers", req, function(err, data, response) {
		    	logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - Response from to MW Commad "EnrollUsers" - ' + JSON.stringify(data));
		        if (err) {
		            deferred.reject("Error in Response from MW command EnrollUsers");
		        } else {
		            deferred.resolve();
		        }
		    });
		    return deferred.promise;
		}
	}).then(function() {
		defer.resolve('OK');
	}).catch(function(err) {
		defer.reject(err);
	}).done();
	return defer.promise;
};

function saveLearnerPaths(newLearnerPaths, logger) {
	var deferred = promise_lib.defer();
	MongoHelper.insert('LearnerStateModel', newLearnerPaths, function(err, result) {
		if(result) {
			logger.info('LearnerEnrollmentHelper:enrollLearnersToCourse() - New records ingested into LearnerStateModel - ' + result.length);
		}
		deferred.resolve();
	})
	return deferred.promise;
}

exports.createLists = function(learnerPath) {
	var lobMap = PlayerUtil.getMap(learnerPath.learning_objects);
	var elementMap = PlayerUtil.getMap(learnerPath.elements);
	var courseId = learnerPath.courseId;
	var lists = [];
	var course = lobMap[courseId];
	addToLists(course, lists, lobMap, elementMap);
	setOffsetValues(learnerPath, lists, lobMap, elementMap, learnerPath.courseId);
	var arrays = [];
	var array = [];
	lists.forEach(function(id) {
		array = createSubArray(id, array, arrays);
	});
	if (array && array.length > 0) {
		arrays.push(array);	
	}
	return arrays;
}

function setOffsetValues(learnerPath, lists, lobMap, elementMap, courseId) {
	var currentOffset = 1;
	var targets = [];
	lists.forEach(function(id) {
		if (id != 'END') {
			currentOffset = setElementOffsetValue(id, elementMap, lobMap, courseId, targets, currentOffset);
		}
	});
	learnerPath.targets = targets;
}

function setElementOffsetValue(id, elementMap, lobMap, courseId, targets, currentOffset) {
	var element = elementMap[id];
	var offset = element.offset;
	if (!offset || offset == null) {
		offset = getOffset(id, lobMap, courseId);
	}
	if (offset < currentOffset) {
		offset = currentOffset;
	} else {
		currentOffset = offset;
	}
	element.offset = offset;
	setOffsetTargets(targets, element, offset);
	return currentOffset;
}

function setOffsetTargets(targets, element, offset) {
	var offsetTarget;
	for (var i=0; i<targets.length; i++) {
		if (targets[i].offset == offset) {
			offsetTarget = targets[i];
			break;
		}
	}
	if (!offsetTarget || offsetTarget == null) {
		offsetTarget = {};
		offsetTarget.offset = offset;
		offsetTarget.elements_count = [];
		targets.push(offsetTarget);
	}
	var eleTypeCount;
	for(var j=0; j<offsetTarget.elements_count.length; j++) {
		if (offsetTarget.elements_count[j].elementType == element.elementType) {
			eleTypeCount = offsetTarget.elements_count[j];
			break;
		}
	}
	if (!eleTypeCount || eleTypeCount == null) {
		eleTypeCount = {};
		eleTypeCount.elementType = element.elementType;
		eleTypeCount.total = 1;
		offsetTarget.elements_count.push(eleTypeCount);
	} else {
		eleTypeCount.total = eleTypeCount.total + 1;
	}
}

function getOffset(elementId, lobMap, courseId) {
	for (var lobId in lobMap) {
		var lob = lobMap[lobId];
		if (lob.sequence && lob.sequence.indexOf(elementId) > -1 && lobId != courseId) {
			if (lob.offset && lob.offset != null) {
				return lob.offset;
			} else {
				return getOffset(lobId, lobMap, courseId);
			}
		} else if (lob.additional_material && lob.additional_material.indexOf(elementId) > -1 && lobId != courseId) {
			if (lob.offset && lob.offset != null) {
				return lob.offset;
			} else {
				return getOffset(lobId, lobMap, courseId);
			}
		}
	}
	return 0;
}

function createSubArray(id, array, arrays) {
	if (id == 'END') {
		if (array.length > 0) {
			arrays.push(array);
		}
		var newArr = [];
		return newArr;
	} else {
		array.push(id);
		return array;
	}
}

function addToLists(lob, lists, lobMap, elementMap) {
	if (lob.sequence && lob.sequence.length > 0) {
		lob.sequence.forEach(function(seqId) {
			if (lobMap[seqId]) {
				if (lists[lists.length-1] != 'END') {
					lists.push('END');
				}
				addToLists(lobMap[seqId], lists, lobMap, elementMap);
			} else if (elementMap[seqId]) {
				lists.push(seqId);
			}
		});
		if (lists[lists.length-1] != 'END') {
			lists.push('END');
		}
	}
}

function saveAssessmentLearnerMapping(studentId, elementMap, prevElementMap) {
	var addedAssessments = [];
	var deletedAssessments = [];
	for (var elementId in elementMap) {
		var ele = elementMap[elementId];
		if (ele.elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
			if (!prevElementMap[ele.identifier]) {
				addedAssessments.push(ele.identifier);
			}
		}
	}
	for (var elementId in prevElementMap) {
		var ele = prevElementMap[elementId];
		if (ele.elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
			if (!elementMap[ele.identifier]) {
				deletedAssessments.push(ele.identifier);
			}
		}
	}
	promise_lib.resolve()
	.then(function() {
		var deferreds = [];
		for (var idx in addedAssessments) {
			deferreds.push(getAssessmentId(studentId, addedAssessments[idx], 100));
		}
		for (var idx in deletedAssessments) {
			deferreds.push(getAssessmentId(studentId, deletedAssessments[idx], 0));
		}
		return promise_lib.all(deferreds);
	}).then(function(values) {
		var items = [];
		values.forEach(function(item) {
			if (item && item.assessmentId && item.assessmentId != '') {
				items.push(item);
			}
		});
		if (items.length > 0) {
			var MWServiceProvider = require('../../commons/MWServiceProvider');
			var req = new Object();
			req.LEARNER_ASSESSMENTS = {"valueObjectList": items};
			MWServiceProvider.callServiceStandard("assessmentService", "saveLearnerAssessmentMapping", req, function(err, data, response) {
		        if (err) {
		            console.log("Error in Response from MW saveLearnerAssessmentMapping: " + err);
		        } else {
		            console.log("Response from MW saveLearnerAssessmentMapping: " + JSON.stringify(data, null, 4));
		        }
		    });
		}
	});
}

function getAssessmentId(studentId, laId, numAttempts) {
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningActivityModel', {identifier: laId}, function(err, la) {
			if(err || !la) {
				deferred.reject(err);
			} else {
				deferred.resolve(la.contentIdentifier);
			}
		});
		return deferred.promise;
	}).then(function(contentId) {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('MediaContentModel', {identifier: contentId}, function(err, content) {
			if(err) {
				deferred.reject(err);
			} else {
				var assessmentId;
				if (content && null != content && content.contentSubType == 'quiz') {
					if (content.media && content.media.length > 0) {
						content.media.forEach(function(mediaObj) {
							if (mediaObj.isMain) {
								assessmentId = mediaObj.mediaUrl;
							}
						});
						if (!assessmentId || assessmentId == null || assessmentId == '') {
							assessmentId = content.media[0].mediaUrl;
						}
					}
				}
				var item = {};
				if (assessmentId && assessmentId != null && assessmentId != '') {
					item.learnerId = studentId;
					item.numAttempts = numAttempts;
					item.assessmentId = assessmentId;
					deferred.resolve(item);
				} else {
					deferred.resolve(item);
				}
			}
		});
		return deferred.promise;
	}).done(function(item) {
		defer.resolve(item);
	});
	return defer.promise;
}

function isCurrentElementExist(learnerPath) {
	var isExist = false;
	var currentElementId = learnerPath.currentElementId;
	if(currentElementId) {
		currentElementId = PlayerUtil.addFedoraPrefix(currentElementId);
		if(learnerPath.elements) {
			learnerPath.elements.forEach(function(element) {
				if(element.identifier == currentElementId) {
					isExist = true;
				}
			});
		}
		if(!isExist) {
			if(learnerPath.learning_objects) {
				learnerPath.learning_objects.forEach(function(element) {
					if(element.identifier == currentElementId) {
						isExist = true;
					}
				});
			}
		}
	}
	return isExist;
}

function checkProfileOutcome(state, element) {
	if (state.userType == "tutor") return true;
	var instructionUsage = element.metadata.instructionUsage;
	if (instructionUsage && instructionUsage.toLowerCase() == 'coaching') {
		return false;
	}
	var elementOutcome = element.metadata.outcome;
	if (elementOutcome && elementOutcome.trim() != '' && state.package && state.package.outcome && state.package.outcome != '') {
		var elementOutcomes = elementOutcome.split(',');
		elementOutcomes.forEach(function(outcome) {
			outcome = outcome.trim();
		});
		var selectedOutcomes = state.package.outcome.split(',');
		var outcomeExists = false;
		selectedOutcomes.forEach(function(outcome) {
			if(elementOutcomes.indexOf(outcome.trim()) != -1) {
				outcomeExists = true;
			}
		});
		return outcomeExists;
	}
	return true;
}

function deleteLob(lobMap, elementMap, lobId) {
	var lob = lobMap[lobId];
	var seq = lob.sequence;
	if (seq && seq.length > 0) {
		seq.forEach(function(seqId) {
			if (lobMap[seqId]) {
				deleteLob(lobMap, elementMap, seqId);
			} else if (elementMap[seqId]) {
				delete elementMap[seqId];
			}
		});
		delete lobMap[lobId];
	}
}

function getCollectionElements(courseId, collElement, lobId, lobMap, elementMap, state) {

	var defer = promise_lib.defer();
	LearningCollectionModel = mongoose.model('LearningCollectionModel');
	LearningCollectionModel.findOne({courseId: courseId, identifier: collElement.elementId}).lean()
			.exec(function(err, collection) {
		if (collection) {
			if (checkProfileOutcome(state, collection)) {
				var collElements = collection.elements;
				lobMap[lobId].sequence2 = lobMap[lobId].sequence2.concat(collection.sequence);
				var deferreds = [];
				collElements.forEach(function(ele) {
					if (ele.elementType == ViewHelperConstants.LEARNING_ACTIVITY || ele.elementType == ViewHelperConstants.LEARNING_RESOURCE) {
						var childDefer = promise_lib.defer();
						addElementToPath(ele, elementMap, lobMap, lobId, childDefer, state);
						deferreds.push(childDefer);
					} else if (ele.elementType == ViewHelperConstants.COLLECTION) {
						// TODO: recursively get elements of collection
					}
				});
				defer.resolve(promise_lib.all(deferreds));
			} else {
				defer.resolve();
			}
		} else {
			defer.resolve();
		}
	});
	return defer.promise;
}

function addElementToPath(ele, elementMap, lobMap, lobId, defer, state) {
	var element = {};
	if (!elementMap[ele.elementId]) {
		element = {};
	} else {
		element = elementMap[ele.elementId];
	}
	var eleAdded = false;
	element.identifier = ele.elementId;
	element.elementType = ele.elementType;
	element.isMandatory = ele.isMandatory;
	element.parentId = lobId;
	if(ele.elementType == ViewHelperConstants.LEARNING_RESOURCE) {
		LearningResourceModel = mongoose.model('LearningResourceModel');
		LearningResourceModel.findOne({identifier: ele.elementId}).lean().exec(function(err, lr) {
			if(err || !lr) {
				defer.reject(err);
			} else {
				var instructionUsage = lr.metadata.instructionUsage;
				if (instructionUsage && instructionUsage.toLowerCase() == 'coaching') {
					if (elementMap[ele.elementId]) {
						if (lr.metadata.elementType && lr.metadata.elementType != '') {
							element.elementType = lr.metadata.elementType;
						}
						element.isMandatory = lr.metadata.isMandatory;
						lobMap[lobId].eleMap.push(ele.elementId);
					}
					defer.resolve();
				} else {
					if (checkProfileOutcome(state, lr)) {
						element.name = lr.name;
						if(!lr.metadata.instructionUsage || lr.metadata.instructionUsage == '') {
							element.elementSubType = ViewHelperConstants.LECTURE;
						} else {
							element.elementSubType = lr.metadata.instructionUsage;
							if (lr.metadata.instructionUsage.toLowerCase() == 'coaching' && lr.metadata.elementType && lr.metadata.elementType != '') {
								element.elementType = lr.metadata.elementType;
							}
						}
						if(lr.metadata.learningTime) {
							element.learningTime = lr.metadata.learningTime;
						} else {
							element.learningTime = 0;
						}
						element.isMandatory = lr.metadata.isMandatory;
						element.proficiencyWeightage = (lr.metadata.proficiencyWeightage)? lr.metadata.proficiencyWeightage : 1;
						element.minProficiency = (lr.metadata.minProficiency)? lr.metadata.minProficiency : 0;
						element.offset = lr.offset;
						elementMap[ele.elementId] = element;
						lobMap[lobId].eleMap.push(ele.elementId);
						setElementMediaType(element, lr.contentIdentifier, defer);
					} else {
						if (elementMap[ele.elementId]) {
							delete elementMap[ele.elementId];
						}
						defer.resolve();
					}
				}
			}
		});
	} else if(ele.elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.findOne({identifier: ele.elementId}).lean().exec(function(err,la) {
			if(err || !la) {
				defer.reject(err);
			} else {
				var instructionUsage = la.metadata.instructionUsage;
				if (instructionUsage && instructionUsage.toLowerCase() == 'coaching') {
					if (elementMap[ele.elementId]) {
						if (la.metadata.elementType && la.metadata.elementType != '') {
							element.elementType = la.metadata.elementType;
						}
						element.assessmentId = la.metadata.usageId;
						element.isMandatory = la.metadata.isMandatory;
						lobMap[lobId].eleMap.push(ele.elementId);
					}
				} else {
					if (checkProfileOutcome(state, la)) {
						element.name = la.name;
						if(!la.metadata.elementType || la.metadata.elementType == '') {
							element.elementSubType = ViewHelperConstants.PRACTICE_TEST;
							element.elementType = ViewHelperConstants.PRACTICE_TEST;
						} else {
							element.elementSubType = la.metadata.elementType;
							element.elementType = la.metadata.elementType;
						}
						if(la.metadata.learningTime) {
							element.learningTime = la.metadata.learningTime;
						} else {
							element.learningTime = 0;
						}
						element.mediaType = element.elementSubType;
						element.isMandatory = la.metadata.isMandatory;
						element.proficiencyWeightage = (la.metadata.proficiencyWeightage)? la.metadata.proficiencyWeightage : 1;
						element.minProficiency = (la.metadata.minProficiency)? la.metadata.minProficiency : 0;
						element.offset = la.offset;
						element.assessmentId = la.metadata.usageId;
						elementMap[ele.elementId] = element;
						lobMap[lobId].eleMap.push(ele.elementId);
					} else {
						if (elementMap[ele.elementId]) {
							delete elementMap[ele.elementId];
						}
					}
				}
				defer.resolve();
			}
		});
	} else if(ele.elementType == ViewHelperConstants.CONTENT) {
		MediaContentModel = mongoose.model('MediaContentModel');
		MediaContentModel.findOne({identifier: ele.elementId}).lean().exec(function(err,content) {
			if(err || !content) {
				defer.reject(err);
			} else {
				if (checkProfileOutcome(state, content)) {
					element.name = content.name;
					element.elementSubType = ViewHelperConstants.LECTURE;
					if(content.metadata.learningTime){
						element.learningTime = content.metadata.learningTime;
					} else {
						element.learningTime = 0;
					}
					element.isMandatory = content.metadata.isMandatory;
					element.proficiencyWeightage = (content.metadata.proficiencyWeightage)? content.metadata.proficiencyWeightage : 1;
					element.minProficiency = (content.metadata.minProficiency)? content.metadata.minProficiency : 0;
					if (content && content.media && content.media.length > 0) {
						var mediaList = content.media;
						for (var i=0; i<mediaList.length; i++) {
							var mediaObj = mediaList[i];
							if (mediaObj.isMain) {
								element.mediaType = mediaObj.mediaType;
							}
						}
					}
					elementMap[ele.elementId] = element;
					lobMap[lobId].eleMap.push(ele.elementId);
				} else {
					if (elementMap[ele.elementId]) {
						delete elementMap[ele.elementId];
					}
				}
				defer.resolve();
			}
		});
	} else {
		defer.resolve();
	}
}

function setElementMediaType(element, contentId, defer) {
	if (contentId && contentId != '') {
		MediaContentModel = mongoose.model('MediaContentModel');
		MediaContentModel.findOne({identifier: contentId}).lean().exec(function(err,content) {
			if (content && content.media && content.media.length > 0) {
				var mediaList = content.media;
				for (var i=0; i<mediaList.length; i++) {
					var mediaObj = mediaList[i];
					if (mediaObj.isMain) {
						element.mediaType = mediaObj.mediaType;
					}
				}
				defer.resolve();
			} else {
				defer.resolve();		
			}
		});
	} else {
		defer.resolve();
	}
}

function getLOBsCount(lobMap, lob) {
	var sequence = lob.sequence;
	var counts = [];
	if(sequence) {
		for (var i = 0; i < sequence.length; i++) {
			var seqId = sequence[i];
			if(lobMap[seqId]) {
				var childLOB = lobMap[seqId];
				if(!counts.hasOwnProperty(childLOB.elementType)) {
					counts[childLOB.elementType] = {total: 0};
				}
				counts[childLOB.elementType].total++;
				var childCounts = getLOBsCount(lobMap, childLOB);
				for(k in childCounts) {
					if(!counts.hasOwnProperty(k)) {
						counts[k] = {total: 0};
					}
					counts[k].total = counts[k].total + childCounts[k].total;
				}
			}
		}
	}
	return counts;
}

function getElementsCount(lobMap, elementMap, lob) {
	var sequence = lob.sequence;
	var counts = [];
	if (sequence) {
		for (var i=0; i<sequence.length; i++) {
			var seqId = sequence[i];
			if (elementMap[seqId]) {
				var element = elementMap[seqId];
				var subType = element.elementType;
				if(!counts.hasOwnProperty(subType)) {
					counts[subType] = {total: 0};
				}
				counts[subType].total++;
				if(element.is_complete) counts[subType].complete++;
			} else if (lobMap[seqId]) {
				var lobCounts = getElementsCount(lobMap, elementMap, lobMap[seqId]);
				for(k in lobCounts) {
					if(!counts.hasOwnProperty(k)) {
						counts[k] = {total: 0};
					}
					counts[k].total = counts[k].total + lobCounts[k].total;
					counts[k].complete = counts[k].complete + lobCounts[k].complete;
				}
			}
		}
	}
	return counts;
}

function getLearningTime(lobMap, elementMap, lob) {
	var sequence = lob.sequence;
	var learningTime = 0;
	if(sequence) {
		for (var i = 0; i < sequence.length; i++) {
			var seqId = sequence[i];
			if(elementMap[seqId]) {
				var element = elementMap[seqId];
				learningTime += element.learningTime;
			} else if(lobMap[seqId]) {
				learningTime +=	getLearningTime(lobMap, elementMap, lobMap[seqId]);
			}
		}
	}
	return learningTime;
}

exports.assignCoaches = function(courseId, learnerCoaches) {
	var deferred = promise_lib.defer();
	var req = new Object();
    req.ASSIGN_COACH = {courseId : courseId, learnerCoachMapping: learnerCoaches};
	MWServiceProvider.callServiceStandard("learnerService", 'AssignTutors', req, function(err, data, response) {
        if (err) {
            deferred.reject("Error in Response from MW AssignTutor");
        } else {
            deferred.resolve();
        }
    });
	return deferred.promise;
}

exports.assignCoach = function(courseId, student) {
	var deferred = promise_lib.defer();
	var req = new Object();
    req.LEARNER_ID = student.student_id;
    req.COURSE_ID = courseId;
    req.TUTOR_ID = student.coach;
	MWServiceProvider.callServiceStandard("learnerService", 'AssignTutor', req, function(err, data, response) {
        if (err) {
            deferred.reject("Error in Response from MW AssignTutor");
        } else {
            deferred.resolve();
        }
    });
	return deferred.promise;
}

exports.updateAllLearnerCoachAssignments = function(req, res) {
	var courseId = req.body.courseId;
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.find(
	        'LearnerStateModel',
	        {'courseId': courseId, 'tutor': { $exists: true }},
	        {
	            student_id: 1,
	            tutor: 1
	        }).toArray(function(err, learners) {
	        	defer.resolve(learners);
	    	}
	    );
	    return defer.promise;
	})
	.then(function(learners) {
		console.log('leaners size:', learners.length);
		var promises = [];
		learners.forEach(function(learner) {
			promises.push(exports.assignCoach(courseId, {student_id: learner.student_id, coach: learner.tutor}));
		});
		return promise_lib.all(promises);
	})
	.then(function() {
		res.send('All learners assigned to coach in learner info manager');
	})
	.catch(function(err) {
		res.send('Error:' + err)
	}).done();
}