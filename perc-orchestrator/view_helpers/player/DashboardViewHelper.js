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
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var TypographySetUtil = require('./TypographySetUtil');
var fs = require('fs');
var pumpUtil = require('../../coaching/util/PumpIOUtil');

exports.getStudentDashboard = function(req, res) {
	LoggerUtil.setOperationName('getStudentDashboard');
	var dashboard = {};
	var studentId = req.user.identifier;
	var enrolledCourseIds = [];
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('StudentModel', {identifier: studentId}, function(err, student) {
			if(err) {
				deferred.reject(err);
			} else {
				dashboard.student = student;
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('EnrolledCoursesModel', {student_id: studentId}).toArray(function(err, courses) {
			if (err) {
				errorModule.handleError(err, "ERROR_FINDING_COURSE", req, res);
				deferred.reject(err);
			} else {
				deferred.resolve(courses);
			}
		});
		return deferred.promise;
	})
	.then(function(courses) {
		var deferred = promise_lib.defer();
		var promises = [];
		courses.forEach(function(course) {
			enrolledCourseIds.push(course.course_id);
			promises.push(getCourse(course));
		});
		promise_lib.all(promises).then(function(value) {
		    deferred.resolve(value);
		});
		return deferred.promise;
	})
	.then(function(courses) {
		var deferreds = [];
		courses.forEach(function(course) {
			deferreds.push(getCourseProgress(course, studentId));
		});
		return promise_lib.all(deferreds);
	})
	.then(function(courses) {
		dashboard.enrolledCourses = courses;
	})
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('CourseModel',{$and:[{'identifier':{$nin:enrolledCourseIds}}, {$or:[{status : {$exists: false}}, {status : {$ne: 'upcoming'}}]}]}).toArray(function (err, recoCourses) {
			if(err) {
				console.log('Error in upcoming courses query');
				deferred.reject(err);
			} else {
				dashboard.suggestedCourses = [];
				recoCourses.forEach(function(course) {
					var suggestedCourse = {};
					suggestedCourse.course_id = PlayerUtil.removeFedoraPrefix(course.identifier + "");
					suggestedCourse.name = course.name;
					suggestedCourse.image = course.image;
					suggestedCourse.description = course.description;
					suggestedCourse.faculty = course.faculty;
					suggestedCourse.tutors = course.tutors;
					dashboard.suggestedCourses.push(suggestedCourse);
				});
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error - ', err);
	})
	.done(function(courses) {
		res.send(JSON.stringify(dashboard));
	});
}

exports.getUpcomingEvents = function(req, res) {
	var studentId = req.user.identifier;
	var courseIds = req.body.courseIds;
	var events = [];
	if (!courseIds || courseIds.length <= 0) {
		res.send(JSON.stringify(events));
	} else {
		promise_lib.resolve()
		.then(function() {
			var currDate = new Date();
			// currDate.setHours(0,0,0,0);
			var deferred = promise_lib.defer();
			MongoHelper.find('EventModel', {courseId: {$in: courseIds}, invited: studentId, 
				declined: {$nin: [studentId]}, startDate: {$gt: currDate}}, {}, 
				{$orderby: { startDate : 1 }}).toArray(function(err, objects) {
				if (objects && objects.length > 0) {
					for (var i=0; i<objects.length; i++) {
						events.push(objects[i]);
					}
				}
				deferred.resolve();
			});
			return deferred.promise;
		}).then(function() {
			if (events && events.length > 0) {
				for (var i=0; i<events.length; i++) {
					var eventObj = events[i];
					var actions = eventObj.actions;
					var startDate = Date.parse(eventObj.startDate);
					if(eventObj.endDate){
			            var endDate = Date.parse(eventObj.endDate);
						var duration = (endDate - startDate)/1000;
			            eventObj.duration = duration;
			        }
					if (actions && actions.length > 0) {
						for (var j=0; j<actions.length; j++) {
							if (actions[j].userId == studentId) {
								eventObj.action = actions[j].action;
								eventObj.actionDate = actions[j].actionDate;
								break;
							}
						}
					}
				}
			}
		}).catch(function(err) {
			console.log('Error - ', err);
		}).done(function() {
			res.send(JSON.stringify(events));
		});
	}
}

exports.getUserDetails = function(req, res) {
	LoggerUtil.setOperationName('getUserDetails');
	var user = JSON.parse(JSON.stringify(req.user));
	delete user.local;
	res.send(user);
}

exports.getAdminDashboard = function(req, res) {
	console.log('Get admin dashboard');
	LoggerUtil.setOperationName('getAdminDashboard');
	var allCourses = undefined;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('CourseModel', {}, {name:1, identifier: 1, inboxEmailId: 1, community: 1}).toArray(function(err, courses) {
			allCourses = courses;
			deferred.resolve();
		});
		return deferred.promise;
	})
	.then(function() {
		var promises = [];
		if(allCourses) {
			allCourses.forEach(function(course) {
				promises.push(getCourseMetaInfo(course));
			});
		}
		return promise_lib.all(promises);
	})
	.then(function() {
		res.json(allCourses);
	})
	.catch(function(err) {
		res.status(500).send('Error - ' + err);
	}).done();
}

function getCourseMetaInfo(course) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.count('LearnerStateModel', {courseId: course.identifier, roles: {$nin:['tutor', 'faculty']}}, function(err, count) {
			course.studentCount = count;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.count('InstructorCoursesModel', {courseId: course.identifier, role: 'faculty'}, function(err, count) {
			course.facultyCount = count;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.count('InstructorCoursesModel', {courseId: course.identifier, role: {$ne: 'faculty'}}, function(err, count) {
			course.coachCount = count;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		deferred.resolve();
	})
	.catch(function(err) {
		deferred.reject(err);
	}).done()
	return deferred.promise;
}

exports.getTutorDetails = function(req, res) {
	LoggerUtil.setOperationName('getTutorDetails');
	var user = JSON.parse(JSON.stringify(req.user));
	delete user.local;
}

exports.updateUserProfile = function(req, res) {
	LoggerUtil.setOperationName('updateProfile');
	var profile = req.body.profile;
	UserModel = mongoose.model('UserModel');
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		UserModel.findOne({identifier: profile.studentId}).exec(function(err, user) {
			if(err) {
				errorModule.handleError(err, "ERROR_FINDING_USER", req, res);
				deferred.reject(err);
			} else {
				user.name.givenName = profile.givenName;
				user.name.middleName = profile.middleName;
				user.name.familyName = profile.familyName;
				user.email = profile.email;

				if(!user.social_info) user.social_info = {};
            	user.social_info.linkedin = profile.linkedin;
            	user.social_info.facebook = profile.facebook;
            	user.social_info.googleplus = profile.googleplus;
            	user.social_info.twitter = profile.twitter;
            	user.social_info.github = profile.github;
            	user.markModified('social_info');

				user.save(function(err) {
					if(err) {
						errorModule.handleError(err, "ERROR_SAVING_USER", req, res);
						deferred.reject(err);
					} else {
						req.user = user;
						deferred.resolve();
					}
				});
			}
		});
		return deferred.promise;
	})
	.then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{identifier: profile.studentId}]))
	.then(function(returnedUser){
		req.session.passport.user = JSON.stringify(returnedUser);
	})
	.catch(function(err) {
		console.log('Error updating profile', err);
	})
	.done(function() {
		res.send('OK');
	});
}

exports.updateProfileImage = function(req, res) {
	LoggerUtil.setOperationName('updateProfileImage');
	promise_lib.resolve()
	.then(function() {
		return createStudentFolder(req.user.identifier);
	})
	.then(function(studentFolder) {
		var deferred = promise_lib.defer();
		var file = req.files.file;
		fs.readFile(file.path, function (err, data) {
		  	fs.writeFile('public' + studentFolder + file.name, data, function (err) {
		  		if(err) {
		  			deferred.reject(err);
		  		} else {
		  			UserModel = mongoose.model('UserModel');
					UserModel.findOne({identifier: req.user.identifier}).exec(function(err, user) {
						if(!err) {
							user.image = studentFolder + file.name;
							user.metadata.image = studentFolder + file.name;
							user.markModified('metadata');
							user.save(function(err, obj) {
								if(obj) {
									req.user = user;
									req.session.passport.user = JSON.stringify(user);
								}
							});
							deferred.resolve(user);
						} else {
							deferred.reject(err);
						}
					});
		  		}
		  	});
		});
		return deferred.promise;
	})
	.then(function(userModel) {
		var deferred = promise_lib.defer();
		pumpUtil.updateUserProfile(userModel.identifier, userModel.displayName, userModel.metadata.image, function(err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(userModel.metadata.image);
            }
        });
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error - ', err);
		res.send({error: true, errorMessage: 'Unable to upload image - ' + err})
	})
	.done(function(imagePath) {
		res.send({url: imagePath});
	})
}

function createStudentFolder(studentId) {
	var deferred = promise_lib.defer();
	var studentFolder = "public/uploads/student/";
	if (!fs.existsSync(studentFolder)) {
		fs.mkdirSync(studentFolder);
	}
	if (!fs.existsSync(studentFolder + studentId)) {
		fs.mkdirSync(studentFolder + studentId);
	}
	deferred.resolve('/uploads/student/' + studentId + "/");
	return deferred.promise;
}

function getCourseProgress(course, studentId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
        var req = new Object();
        req.LEARNER_ID = studentId;
        req.LEARNING_ELEMENT_ID = course.course_id;

        MWServiceProvider.callServiceStandard("learnerService", "GetLearnerState", req, function(err, data, response) {
            console.log("Request:",JSON.stringify(req));
            if (err) {
                console.log("Error in Response from MW GetLearnerState: " + err);
                defer.resolve();
            } else {
                console.log("Response from MW GetLearnerState: " + JSON.stringify(data, null, 4));
                if (data.responseValueObjects.METADATA_LIST) {
                	var map = data.responseValueObjects.METADATA_LIST.baseValueMap;
                	defer.resolve(map);
                } else {
                	defer.resolve();
                }
            }
        });
        return defer.promise;
	}).then(function(map) {
		if (!map) {
			map = {};
		}
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: course.course_id}, function(err, state) {
			if (state) {
				var currentElementId = PlayerUtil.addFedoraPrefix(state.currentElementId);
				var courseLOB;
				var currentElement = null;
				for (var i=0; i<state.learning_objects.length; i++) {
					var lob = state.learning_objects[i];
					if (lob.identifier == course.course_id) {
						courseLOB = lob;
					}
					if(currentElementId && currentElementId ==  lob.identifier) {
						currentElement = lob;
					}
				}
				if(!currentElement && currentElementId) {
					for (var i=0; i<state.elements.length; i++) {
						if(currentElementId == state.elements[i].identifier) {
							currentElement = state.elements[i];
						}
					}
				}
				if(!currentElement && courseLOB) {
					var firstModuleId = courseLOB.sequence[0];
					for (var i=0; i<state.learning_objects.length; i++) {
						if(firstModuleId ==  state.learning_objects[i].identifier) {
							currentElement = state.learning_objects[i];
						}
					}
				}
				course.currentElement = currentElement;
				course.packageId = (state.packageId)? state.packageId : "";
				if (courseLOB) {
					setLearnerStateFromMW(map, courseLOB);
					var progress = getProgressPercent(courseLOB);
					course.progress = progress;
					course.lob = courseLOB;
				}
				deferred.resolve(course);
			} else {
				deferred.resolve();
			}
		});
	}).catch(function(msg) {
		deferred.resolve();
	});
	return deferred.promise;
}

function setCourseStateFromMW(mwCourseState, learnerState) {
	if (learnerState) {
		if (learnerState.learning_objects && learnerState.learning_objects.length > 0) {
			learnerState.learning_objects.forEach(function(lob) {
				setLearnerStateFromMW(mwCourseState[lob.identifier], lob);
			});
		}
		if (learnerState.elements && learnerState.elements.length > 0) {
			learnerState.elements.forEach(function(element) {
				setLearnerStateFromMW(mwCourseState[element.identifier], element);
			});
		}
	}
}

function setLearnerStateFromMW(mwState, lob) {
	var proficiency = 0;
	var status = '';
	var is_complete = false;
	var attempt_count = 0;
	if (mwState) {
		if (mwState['proficiency'] && !isNaN(mwState['proficiency'])) {
			proficiency = parseFloat(mwState['proficiency']);
		}
		if (mwState['attempt_count'] && !isNaN(mwState['attempt_count'])) {
			attempt_count = parseInt(mwState['attempt_count']);
		}
		if (mwState['is_complete']) {
			is_complete = (mwState['is_complete'].toLowerCase() == 'true') ? true : false;
		}
		if (mwState['status']) {
			status = mwState['status'].toLowerCase();
		}
		if (lob.elements_count && lob.elements_count.length > 0) {
			lob.elements_count.forEach(function(elementCount) {
				if (mwState[elementCount.elementType] && !isNaN(mwState[elementCount.elementType])) {
					elementCount.complete = parseInt(mwState[elementCount.elementType]);
				} else {
					elementCount.complete = 0;
				}
			});
		}
	}
	lob.proficiency = proficiency;
	lob.status = status;
	lob.is_complete = is_complete;
	lob.attempt_count = attempt_count;
}

function getCourse(enrolledCourse) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('CourseModel', {identifier: enrolledCourse.course_id}, function(err, course) {
		if(err) {
			deferred.reject(err);
		} else {
			enrolledCourse.nodeId = course.nodeId;
			enrolledCourse.name = course.name;
			enrolledCourse.image = course.image;
			enrolledCourse.description = course.description;
			enrolledCourse.faculty = course.faculty;
			enrolledCourse.tutors = course.tutors;
			deferred.resolve(enrolledCourse);
		}
	});
	return deferred.promise;
}

exports.getLearningObject = function(req, res) {
	LoggerUtil.setOperationName('getLearningObject');
	req.session.playPath = [];
	var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));;
	var studentId = req.user.identifier;
	var lobId = decodeURIComponent(req.params.lobId);
	lobId = PlayerUtil.addFedoraPrefix(lobId);
	var course;
	var currentLOB;
	var learnerState;
	var currentObject = {};
	var elementMap;
	var lobMap;

	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('CourseModel', {identifier: courseId}, function(err, data) {
			if(err) {
				deferred.reject(err);
			} else {
				course = data;
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	}).then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningObjectModel', {courseId: courseId, identifier: lobId}, function(err, lob) {
			if (err) {
				deferred.reject(err);
			} else {
				currentLOB = lob;
				deferred.resolve(lob);
			}
		});
		return deferred.promise;
	}).then(function() {
		var deferred = promise_lib.defer();
		var ids = [];
		for (var i = 0; i < currentLOB.concepts.length; i++) {
			var concept = currentLOB.concepts[i];
			ids.push(concept.conceptIdentifier);
		}
		MongoHelper.find('ConceptModel', {identifier : {$in: ids}}).toArray(function(err, concepts) {
			if(err) {
				deferred.reject(err);
			} else {
				currentObject.concepts = concepts;
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).then(function(lob) {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				deferred.resolve(lobState);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).then(function(lobState) {
		learnerState = lobState;
		lobMap = PlayerUtil.getMap(learnerState.learning_objects);
		elementMap = PlayerUtil.getMap(learnerState.elements);
		var lob = lobMap[lobId];
		var deferreds = [];
		if (lob) {
			currentObject.identifier = PlayerUtil.removeFedoraPrefix(currentLOB.identifier);
			currentObject.nodeSet = currentLOB.nodeSet;
			currentObject.name = currentLOB.name;
			currentObject.description = currentLOB.description;
			currentObject.lobType = currentLOB.lobType;
			currentObject.summaries = currentLOB.summaries;
			// currentObject.concepts = currentLOB.concepts;

			currentObject.faculty = course.faculty;
			currentObject.faculty.identifier = PlayerUtil.removeFedoraPrefix(currentObject.faculty.identifier);
			currentObject.tutors = course.tutors;
			currentObject.tutors.forEach(function(tutor) {
				tutor.identifier = PlayerUtil.removeFedoraPrefix(tutor.identifier);
			});
			currentObject.tags = [];
			PlayerUtil.addTags(currentLOB, currentObject);
			setLearnerStateValues(lob, currentObject);

			for(var key in currentObject.elements_count) {
				var count = currentObject.elements_count[key];
				if(count.total > 1 && count.elementLabel) count.elementLabel += 's'; 
			}

			setMetadata(currentLOB, currentObject);
			var isSupplementaryContent = false;
			if(lob.category) {
				isSupplementaryContent = true;
			}
			currentObject.typographySet = TypographySetUtil.getTypographySet(currentLOB, isSupplementaryContent);
			var proficiency = lobState.proficiency;
			if (proficiency && proficiency != '') {
				currentObject.proficiency = lob.proficiency;
			}
			var sequence = lob.sequence;
			sequence.forEach(function(seqId) {
				deferreds.push(PlayerUtil.getLearningObjectPromises(courseId, seqId, elementMap, lobMap));
			});
		} else {
			var deferred = promise_lib.defer();
			deferreds.push(deferred);
			deferred.reject('Learning Object not found');
		}
		return promise_lib.all(deferreds);
	}).then(function(values) {
		currentObject.modules = [];
		currentObject.lessons = [];
		currentObject.binders = [];
		currentObject.lectures = [];
		currentObject.classrooms = [];
		currentObject.addedbyme = [];
		currentObject.exercises = [];
		values.forEach(function(value) {
			populateChildren(currentObject, value, lobMap, elementMap);
		});
		res.send(JSON.stringify(currentObject));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_LOB", req, res);
	}).done();
};

function populateChildren(currentObject, value, lobMap, elementMap) {
	var child = {};
	var element;
	if (elementMap[value.identifier]) {
		element = elementMap[value.identifier];
	} else if (lobMap[value.identifier]) {
		element = lobMap[value.identifier];
	}
	setLearnerStateValues(element, child);
	child.parentId = currentObject.identifier;
	child.identifier = PlayerUtil.removeFedoraPrefix(value.identifier);
	child.name = value.name;
	if (value.metadata) {
		if (value.metadata.shortDescription && value.metadata.shortDescription != '') {
			child.description = value.metadata.shortDescription;
		} else if (value.metadata.description && value.metadata.description != '') {
			child.description = value.metadata.description;
		}
	}
	if (!child.description || child.description == '') {
		child.description = value.description;
	}
	child.nodeSet = value.nodeSet;
	child.elementType = element.elementType;
	if (value.metadata.instructionUsage && value.metadata.instructionUsage != '') {
		var instructionUsage = value.metadata.instructionUsage;
		if (tutoringValues.indexOf(instructionUsage) >= 0) {
			child.elementType = 'Tutoring';
		}
	}
	child.concepts = value.concepts;
	child.status = value.status;
	child.showSubChildren = false;
	if (element.learningTime && element.learningTime > 0) {
		child.learningTime = getLearningTime(element.learningTime);
	}
	var sequence = element.sequence;
	if (sequence && sequence.length > 0) {
		var subChildren = [];
		sequence.forEach(function(seqId) {
			var subChild;
			if (elementMap[seqId]) {
				subChild = elementMap[seqId];
			} else if (lobMap[seqId]) {
				subChild = lobMap[seqId];
			}
			if (subChild) {
				subChild.identifier = PlayerUtil.removeFedoraPrefix(subChild.identifier);
				if (subChild.learningTime && subChild.learningTime > 0) {
					subChild.duration = getLearningTime(subChild.learningTime);
				}
				if (subChild.elementSubType && subChild.elementSubType != '') {
					var instructionUsage = subChild.elementSubType;
					if (tutoringValues.indexOf(instructionUsage) >= 0) {
						subChild.elementType = 'Tutoring';
					}
				}
				subChildren.push(subChild);
			}
		});
		child.subChildren = subChildren;
	}
	if (element.elementType == ViewHelperConstants.MODULE) {
		currentObject.modules.push(child);
	} else if (element.elementType == ViewHelperConstants.LESSON) {
		currentObject.lessons.push(child);
	} else if (element.elementType == ViewHelperConstants.BINDER) {
		currentObject.binders.push(child);
	} else if (element.elementType == ViewHelperConstants.LEARNING_RESOURCE || element.elementType == ViewHelperConstants.CONTENT) {
		if(child.category) {
			currentObject.addedbyme.push(child);
		} else {
			currentObject.lectures.push(child);
		}
	} else if (element.elementType == ViewHelperConstants.CLASSROOM) {
		currentObject.classrooms.push(child);
	} else if (element.elementType == ViewHelperConstants.LEARNING_ACTIVITY || element.elementType == ViewHelperConstants.EXAM || element.elementType == ViewHelperConstants.PRACTICE_TEST) {
		currentObject.exercises.push(child);
	}
}

var tutoringValues = ['tutoring'];
var lectureValues = [ViewHelperConstants.LEARNING_RESOURCE, ViewHelperConstants.CONTENT];
var exerciseValues = [ViewHelperConstants.LEARNING_ACTIVITY, ViewHelperConstants.EXAM, ViewHelperConstants.PRACTICE_TEST];
var assignmentValues = [];
var addedbymeValues = ['explanation'];

function setLearnerStateValues(element, child) {
	if (element) {
		child.category = element.category;
		child.status = element.status;
		var progress = getProgressPercent(element);
		child.progress = progress;

		if(element.lobs_count) {
			element.lobs_count.forEach(function(count) {
				if(count.elementType == 'lesson') count.elementLabel = 'Lesson';
				if(count.elementType == 'binder') count.elementLabel = 'Binder';
			});
			child.elements_count = element.lobs_count;
		} else {
			child.elements_count = [];
		}
		if(element.elements_count && element.elements_count.length > 0) {
			var aggEleCounts = {};
			aggEleCounts['Lectures'] = { 'elementType': 'Lectures', 'total' : 0, 'elementLabel':'Lecture'};
			aggEleCounts['Exercises'] = { 'elementType': 'Exercises', 'total' : 0, 'elementLabel': 'Exercise'};
			aggEleCounts['Tutoring'] = { 'elementType': 'Tutor Videos', 'total' : 0, 'elementLabel': 'Tutor Video'};
			aggEleCounts['Classroom'] = { 'elementType': 'Coaching Session', 'total' : 0, 'elementLabel': 'Coaching Session'};
			child['addedbyme_count'] = { 'elementType': 'Added By Me', 'total' : 0, 'elementLabel': 'Added By Me'};

			element.elements_count.forEach(function(eleCount) {
				if (lectureValues.indexOf(eleCount.elementType) >= 0) {
					aggEleCounts['Lectures']['total'] +=  eleCount.total;
				} else if (exerciseValues.indexOf(eleCount.elementType) >= 0) {
					aggEleCounts['Exercises']['total'] +=  eleCount.total;
				} else if (tutoringValues.indexOf(eleCount.elementType) >= 0) {
					aggEleCounts['Tutoring']['total'] +=  eleCount.total;
				} else if(addedbymeValues.indexOf(eleCount.elementType) >= 0) {
					child.addedbyme_count.total +=  eleCount.total;
				} else if (eleCount.elementType == ViewHelperConstants.CLASSROOM) {
					aggEleCounts['Classroom']['total'] +=  eleCount.total;
				}
			});
			element.elements_count = aggEleCounts;
			for(var key in element.elements_count) {
				if(element.elements_count[key].total > 0) {
					child.elements_count.push(element.elements_count[key]);
				}
			}
		}
		if (element.learningTime && element.learningTime > 0) {
			child.learningTime = getLearningTime(element.learningTime);
		}
	}
}

function setMetadata(modelObject, object) {
	if(modelObject) {
		object.difficultyLevel = modelObject.metadata.difficultyLevel;
		if(modelObject.metadata.author) {
			object.author = modelObject.metadata.author;
		}
		if(modelObject.metadata.owner) {
			object.owner = modelObject.metadata.owner;
		}
		if (modelObject.metadata.learningTime && modelObject.metadata.learningTime > 0) {
			object.learningTime = getLearningTime(modelObject.metadata.learningTime);
		}
		if (modelObject.metadata.currentStatus) {
            object.currentStatus = modelObject.metadata.currentStatus;
        }
	}
}

function getLearningTime(totalSec) {
	var hours = parseInt( totalSec / 3600 ) % 24;
	var minutes = parseInt( totalSec / 60 ) % 60;
	var learningTime = "";
	if(hours > 0) {
		learningTime = learningTime + hours + ' <span>hr</span> ';
	}
	if(minutes > 0) {
		learningTime = learningTime + minutes + ' <span>min</span> ';
	}
	return learningTime;
}

exports.getCourseTOC = function(req, res) {
	LoggerUtil.setOperationName('getCourseTOC');
	req.session.playPath = [];
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = req.user.identifier;
	var courseTOC = {};
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('CourseModel', {identifier: courseId}, function(err, course) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(course);
			}
		});
		return deferred.promise;
	}).then(function(course) {
		courseTOC.name = course.name;
		courseTOC.lobType = 'course';
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, state) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(state);
			}
		});
		return deferred.promise;
	}).then(function(state) {
		getCourseTOC(courseTOC, state, courseId);
		courseTOC.enrolled_date = state.enrolled_date;
		courseTOC.proficiency = state.proficiency;
		courseTOC.total_elements = state.total_elements;
		courseTOC.complete_count = state.complete_count;
		courseTOC.profile = state.profile;
		courseTOC.discoverContent = state.discoverContent;
		courseTOC.lobId = PlayerUtil.removeFedoraPrefix(courseTOC.identifier + "");
		res.send(JSON.stringify(courseTOC));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_COURSE_TOC", req, res);
	}).done();
};

exports.getCourseId = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	MongoHelper.findOne('LearningObjectModel', {$or: [{identifier: courseId}, {'metadata.nodeId': courseId}]}, {identifier:1, community: 1}, function(err, course) {
		if (err || null == course) {
			res.status(404).send('Course not found');
		} else {
			res.locals.courseId = course.identifier;
			MongoHelper.findOne('CourseModel', {identifier: course.identifier}, {community: 1}, function(err, courseObj) {
				if(courseObj.community) {
					res.locals.communityUserId = courseObj.community.userId;
				} else {
					res.locals.communityUserId = '';
				}
				res.render('course/courseBrowser.ejs');
			});
		}
	});
}

exports.getCourseInstance = function(req, res) {
	LoggerUtil.setOperationName('getCourseInstance');
	req.session.playPath = [];
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = req.user.identifier;
	req.session.courseId = courseId;
	var currentCourse;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
			MongoHelper.findOne('CourseModel', {$or: [{identifier: courseId}, {nodeId: courseId}]}, function(err, course) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(course);
				}
			});
		return deferred.promise;
	}).then(function(course) {
		currentCourse = course;
		var deferred = promise_lib.defer();
			MongoHelper.findOne('LearningObjectModel', {courseId: courseId, identifier: courseId}, function(err, courseLOB) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(courseLOB);
				}
			});
		return deferred.promise;
	}).then(function(courseLOB) {
		console.log('found course lob... getting learner state');
		currentCourse.learningObjectives = courseLOB.learningObjectives;
		currentCourse.children = courseLOB.children;
		currentCourse.metadata = courseLOB.metadata;
		currentCourse.lobType = courseLOB.lobType;
		currentCourse.rootConcept = courseLOB.concepts[0];
		if(currentCourse.rootConcept) {
			// Probably a worst hack.
			currentCourse.rootConcept.identifier = currentCourse.rootConcept.conceptIdentifier;
		}
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, state) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(state);
			}
		});
		return deferred.promise;
	}).then(function(state) {
		console.log('found learner state... getting toc');
		getTOC(currentCourse, state, courseId);
		console.log('fetched toc');
		currentCourse.tutor = state.tutor;
		currentCourse.enrolled_date = state.enrolled_date;
		currentCourse.proficiency = state.proficiency;
		currentCourse.total_elements = state.total_elements;
		currentCourse.complete_count = state.complete_count;
		currentCourse.profile = state.profile;
		currentCourse.discoverContent = state.discoverContent;
		currentCourse.lobId = PlayerUtil.removeFedoraPrefix(currentCourse.identifier + "");
		delete currentCourse.tutors;
		delete currentCourse.children;
		/* Commenting out below code. Content is not required while loading syllabus
		var deferreds = [];
		for (var moduleId in currentCourse.moduleMap) {
			var module = currentCourse.moduleMap[moduleId];
			if (module.type != ViewHelperConstants.MODULE && module.type != ViewHelperConstants.LESSON && module.type != ViewHelperConstants.BINDER) {
				deferreds.push(getContentObjectPromise(module));
			}
		}
		for (var lessonId in currentCourse.lessonMap) {
			var lesson = currentCourse.lessonMap[lessonId];
			if (lesson.type != ViewHelperConstants.MODULE && lesson.type != ViewHelperConstants.LESSON && module.type != ViewHelperConstants.BINDER) {
				deferreds.push(getContentObjectPromise(lesson));
			}
		}
		for (var lectureId in currentCourse.lectureMap) {
			var lecture = currentCourse.lectureMap[lectureId];
			if (lecture.type != ViewHelperConstants.MODULE && lecture.type != ViewHelperConstants.LESSON && module.type != ViewHelperConstants.BINDER) {
				deferreds.push(getContentObjectPromise(lecture));
			}
		}
		return promise_lib.all(deferreds);*/
	}).then(function(contentItems) {
		if (contentItems) {
			contentItems.forEach(function(content) {
				if (content) {
					var elementId = content.parentId;
					var element = getTOCObject(currentCourse, elementId);
					element.media = content.media;
				}
			});
		}
		res.send(JSON.stringify(currentCourse));
	}).catch(function(err) {
		errorModule.handleError(err, "ERROR_GETTING_COURSE", req, res);
	}).done();
};

function getContentObjectPromise(ele) {
	var defer = promise_lib.defer();
	if(ele.type == ViewHelperConstants.LEARNING_RESOURCE || ele.type == ViewHelperConstants.CLASSROOM) {
		var elementId = PlayerUtil.addFedoraPrefix(ele.id + '');
		promise_lib.resolve()
		.then(ViewHelperUtil.promisifyWithArgs(MongoHelper.findOne, MongoHelper, ['LearningResourceModel', {identifier: elementId}]))
		.then(function(lr) {
			var deferred = promise_lib.defer();
			if (lr) {
				getMediaContentAsync(lr.contentIdentifier, deferred, ele.id);
			} else {
				deferred.reject('Learning Activity not found');
			}
			return deferred.promise;
		}).then(function(content) {
			defer.resolve(content);
		}).catch(function(err) {
			defer.reject(err);
		}).done();
	} else if(ele.type == ViewHelperConstants.LEARNING_ACTIVITY || ele.type == ViewHelperConstants.EXAM || ele.type == ViewHelperConstants.PRACTICE_TEST) {
		var elementId = PlayerUtil.addFedoraPrefix(ele.id + '');
		LearningActivityModel = mongoose.model('LearningActivityModel');
		promise_lib.resolve()
		.then(ViewHelperUtil.promisifyWithArgs(MongoHelper.findOne, MongoHelper, ['LearningActivityModel', {identifier: elementId}]))
		.then(function(la) {
			var deferred = promise_lib.defer();
			if (la) {
				getMediaContentAsync(la.contentIdentifier, deferred, ele.id);
			} else {
				deferred.reject('Learning Activity not found');
			}
			return deferred.promise;
		}).then(function(content) {
			defer.resolve(content);
		}).catch(function(err) {
			defer.reject(err);
		}).done();
	} else if(ele.type == ViewHelperConstants.CONTENT) {
		var elementId = PlayerUtil.addFedoraPrefix(ele.id + '');
		promise_lib.resolve()
		.then(function() {
			var deferred = promise_lib.defer();
			getMediaContentAsync(elementId, deferred, ele.id);
			return deferred.promise;
		}).then(function(content) {
			defer.resolve(content);
		}).catch(function(err) {
			defer.reject(err);
		}).done();
	} else {
		defer.resolve();
	}
	return defer.promise;
}

function getMediaContentAsync(contentId, deferred, parentId) {
	if (contentId) {
		MediaContentModel = mongoose.model('MediaContentModel');
		MongoHelper.findOne('MediaContentModel', {identifier: contentId}, function(err,content) {
			if(err) {
				deferred.reject(err);
			} else {
				if (content) {
					content.parentId = parentId;
					deferred.resolve(content);
				} else {
					deferred.reject('Content not found');
				}
			}
		});
	} else {
		deferred.resolve();
	}
}

function getTOCObject(currentCourse, id) {
	var object;
	if (currentCourse.moduleMap[id]) {
		object = currentCourse.moduleMap[id];
	} else if (currentCourse.lessonMap[id]) {
		object = currentCourse.lessonMap[id];
	} else if (currentCourse.lectureMap[id]) {
		object = currentCourse.lectureMap[id];
	}
	return object;
}

function getProgressPercent(element) {
	var progress = 0;
	if (element.elements_count && element.elements_count.length > 0) {
		var total = 0;
		var complete = 0;
		element.elements_count.forEach(function(count) {
			if (count.total && !isNaN(count.total)) {
				total = total + count.total;
			}
			if (count.complete && !isNaN(count.complete)) {
				complete = complete + count.complete;
			}
		});
		if (total > 0) {
			progress = (complete*100)/total;
		}
	} else {
		var status = element.status;
		if (status && status != '') {
			if (status.toLowerCase() == 'complete') {
				progress = 100;
			} else if (status.toLowerCase() == 'in progress') {
				progress = 50;
			}
		}
	}
	return parseInt(progress);
}

function getCourseTOC(currentCourse, learnerState, courseId) {

	var lobMap = PlayerUtil.getMap(learnerState.learning_objects);
	var elementMap = PlayerUtil.getMap(learnerState.elements);
	var course = lobMap[courseId];

	currentCourse.modules = [];
	if (course.sequence && course.sequence.length > 0) {
		course.sequence.forEach(function(moduleId) {
			var module = getObject(moduleId, lobMap, elementMap, 0, courseId);
			if (module && module.id && module.id != '') {
				module.progress = getProgressPercent(module);
				module.lessons = [];
				if (module.sequence && module.sequence.length > 0) {
					module.sequence.forEach(function(lessonId) {
						var objId = PlayerUtil.addFedoraPrefix(lessonId + '');
						var lesson = getObject(objId, lobMap, elementMap, 1, moduleId);
						if (lesson && lesson.id && lesson.id != '') {
							lesson.progress = getProgressPercent(lesson);
							lesson.lectures = [];
							if (lesson.sequence && lesson.sequence.length > 0) {
								lesson.sequence.forEach(function(lectureId) {
									var objId = PlayerUtil.addFedoraPrefix(lectureId + '');
									var lecture = getObject(objId, lobMap, elementMap, 2, lessonId);
									if (lecture && lecture.id && lecture.id != '') {
										lecture.progress = getProgressPercent(lecture);
										lecture.moduleId = lesson.parentId;
										lesson.lectures.push(lecture);
									}
								});
							}
							module.lessons.push(lesson);
						}
					});
				}
				currentCourse.modules.push(module);
			}
		});
	}
}

function getTOC(currentCourse, learnerState, courseId) {
	var lobMap = PlayerUtil.getMap(learnerState.learning_objects);
	var elementMap = PlayerUtil.getMap(learnerState.elements);

	var moduleMap = {};
	var lessonMap = {};
	var lectureMap = {};
	console.log('getting toc - from lobMap');
	var course = lobMap[courseId];
	console.log('found course - from lobMap');
	if (course.sequence && course.sequence.length > 0) {
		course.sequence.forEach(function(moduleId) {
			var module = getObject(moduleId, lobMap, elementMap, 0, courseId);
			if (module && module.id && module.id != '') {
				module.progress = getProgressPercent(module);
				moduleMap[module.id] = module;
			}
		});
	}
	for (var moduleId in moduleMap) {
		var module = moduleMap[moduleId];
		if (module.sequence && module.sequence.length > 0) {
			module.sequence.forEach(function(lessonId) {
				var objId = PlayerUtil.addFedoraPrefix(lessonId + '');
				var lesson = getObject(objId, lobMap, elementMap, 1, moduleId);
				if (lesson && lesson.id && lesson.id != '') {
					lesson.progress = getProgressPercent(lesson);
					lessonMap[lesson.id] = lesson;
				}
			});
		}
	}
	for (var lessonId in lessonMap) {
		var lesson = lessonMap[lessonId];
		if (lesson.sequence && lesson.sequence.length > 0) {
			lesson.sequence.forEach(function(lectureId) {
				var objId = PlayerUtil.addFedoraPrefix(lectureId + '');
				var lecture = getObject(objId, lobMap, elementMap, 2, lessonId);
				if (lecture && lecture.id && lecture.id != '') {
					lecture.progress = getProgressPercent(lecture);
					lecture.moduleId = lesson.parentId;
					lectureMap[lecture.id] = lecture;
				}
			});
		}
	}
	currentCourse.moduleMap = moduleMap;
	currentCourse.lessonMap = lessonMap;
	currentCourse.lectureMap = lectureMap;
}

function getObject(moduleId, lobMap, elementMap, level, parentId) {
	var module;
	if (lobMap[moduleId]) {
		module = {};
		module.id = PlayerUtil.removeFedoraPrefix(moduleId + "");
		var lob = lobMap[moduleId];
		module.name = lob.name;
		module.type = lob.elementType;
		module.elements_count = lob.elements_count;
		module.status = lob.status;
		module.is_complete = lob.is_complete;
		module.sequence = [];
		if (lob.sequence && lob.sequence.length > 0) {
			for (var i=0; i<lob.sequence.length; i++) {
				module.sequence.push(PlayerUtil.removeFedoraPrefix(lob.sequence[i] + ""));
			}
		}
		module.level = level;
		if (parentId) {
			module.parentId = PlayerUtil.removeFedoraPrefix(parentId + "");
		}
	} else if (elementMap[moduleId]) {
		module = {};
		module.id = PlayerUtil.removeFedoraPrefix(moduleId + "");
		var element = elementMap[moduleId];
		if (!element.name) {
			element.name = 'Element Name';
		}
		module.name = element.name;
		module.status = element.status;
		module.is_complete = element.is_complete;
		module.type = element.elementType;
		if (element.elementSubType && element.elementSubType != '') {
			var instructionUsage = element.elementSubType;
			if (tutoringValues.indexOf(instructionUsage) >= 0) {
				module.type = 'Tutoring';
			}
		}
		module.category = element.category;
		module.level = level;
		if (parentId) {
			module.parentId = PlayerUtil.removeFedoraPrefix(parentId + "");
		}
	}
	return module;
}

exports.setLastDiscoverContent = function(req, res) {
	LoggerUtil.setOperationName('setLastDiscoverContent');
	var courseId = req.body.courseId;
	var studentId = req.user.identifier;
	LearnerStateModel = mongoose.model('LearnerStateModel');

	promise_lib.resolve()
	.then(function(state) {
		var deferred = promise_lib.defer();
		MongoHelper.update('LearnerStateModel', {student_id: studentId, courseId: courseId}, {
			$set: {
				'discoverContent.lastCategory': req.body.category,
				'discoverContent.lastConceptId': req.body.conceptId,
				'discoverContent.lastContentId': req.body.contentId
			}
		}, function(err) {
			if(err) {
				deferred.reject('Error updating state' + err);
			} else {
				deferred.resolve();
			}
		});
	})
	.catch(function(err) {
		console.log('error', err);
	})
	.done(function() {
		res.send('OK');
	});
}

exports.getProgrammingURL = function(req, res) {
	LoggerUtil.setOperationName('getProgrammingURL');
	reqParams = req.body.params;
	var user = JSON.parse(JSON.stringify(req.user));
	delete user.local;
	var userRole = "student"; // default set as student
	    if (user.roles.indexOf("tutor") > -1) {
	        userRole = "tutor";
	    }
    var url = appConfig.PROGRAMMING_ENVIRONMENT_BASE_URL + "?repourl=" + reqParams.mediaUrl + "&uname=" + user.identifier + "&urole=" + userRole + "&dName=" + user.displayName + "&resourceId=" + reqParams.resourceId + "&resourceName=" + reqParams.resourceName + "&codeName=" + reqParams.codeName;
    res.send(url);
}

exports.getTOCByTimeUnit = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = req.user.identifier;
	var lobMap = {};
	var elementMap = {};
	var toc = {};

	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, state) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(state);
			}
		});
		return deferred.promise;
	}).then(function(state) {
		lobMap = PlayerUtil.getMap(state.learning_objects);
		elementMap = PlayerUtil.getMap(state.elements);
		var courseObj = lobMap[courseId];
		if (state.timeUnit) {
			toc.timeUnit = state.timeUnit;	
		} else {
			toc.timeUnit = 'Week';	
		}
		toc.currentElement = PlayerUtil.addFedoraPrefix(state.currentElementId);
		toc.identifier = courseObj.identifier;
		toc.elements_count = courseObj.elements_count;
		toc.learningTime = courseObj.learningTime;
		toc.units = {};
		toc.events = {};
		var groups = state.groups;
		var elements = [];
		for (var i=0; i<groups.length; i++) {
			var group = groups[i];
			for (var j=0; j<group.length; j++) {
				elements.push(group[j]);
			}
		}
		buildTimeBasedTOC(toc, courseId, lobMap, elementMap, elements);
		var units = toc.units;
		var targets = state.targets;
		for (var unitId in units) {
			var unit = units[unitId];
			createArray(unit);
			unit.elements_count = {};
			for (var i=0; i<targets.length; i++) {
				if (targets[i].offset == unitId) {
					for (var j=0; j<targets[i].elements_count.length; j++) {
						var offsetElementCount = targets[i].elements_count[j];
						unit.elements_count[offsetElementCount.elementType] = offsetElementCount.total;
					}
					break;
				}
			}
		}
		var eventIds = [];
		for (var eventId in toc.events) {
			eventIds.push(eventId);	
		}
		var deferred = promise_lib.defer();
		if (eventIds.length > 0) {
			MongoHelper.find('EventModel', {identifier: {$in: eventIds}}, {}, {$orderby: { startDate : 1 }}).toArray(function(err, events) {
				deferred.resolve(events);
			});	
		} else {
			deferred.resolve(eventIds);
		}
		return deferred.promise;
	}).then(function(events) {
		if (events && events.length > 0) {
			toc.currentEvents = [];
			toc.upComingEvents = [];
			toc.completedEvents = [];
			var currentDate = Date.parse(new Date());
			for(var i=0; i<events.length; i++) {
				var eventObj = events[i];
				var pathElement = toc.events[eventObj.identifier];
				pathElement.startDate = eventObj.startDate;
				pathElement.name = eventObj.name;
				var startDate = Date.parse(eventObj.startDate);
				if(eventObj.endDate){
		            var endDate = Date.parse(eventObj.endDate);
					var duration = (endDate - startDate)/1000;
		            pathElement.endDate = eventObj.endDate;
		            pathElement.duration = duration;
		        } else {
		            var endDate = Date.parse(eventObj.startDate);
		        }
				if(currentDate < startDate){
                	toc.upComingEvents.push(pathElement);	
	            } else if(currentDate > startDate && currentDate < endDate ){
	                toc.currentEvents.push(pathElement);
	            } else if(currentDate >= endDate){
	               toc.completedEvents.push(pathElement);
	            }
			}
		}
		delete toc.events;

	}).done(function() {
		res.send(JSON.stringify(toc));
	});	
}

exports.getExternalId = function(req, res) {
	var lobId = PlayerUtil.addFedoraPrefix(req.params.lobId);
	console.log("lobId:",lobId);
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningObjectModel', {identifier: lobId}, function(err, obj) {
			if(obj && obj.metadata && obj.metadata.nodeId) {
				deferred.resolve(obj.metadata.nodeId);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log("Error while fetching externalId:",err);
	})
	.done(function(nodeId) {
		if(nodeId) {
			res.send({"nodeId": nodeId});
		} else {
			res.send({});
		}
	});
}

exports.getUpcomingEventsByCourseId = function(req, res) {
	var studentId = req.user.identifier;
	var courseId = decodeURIComponent(req.params.id);
	var events = [];
	if (!courseId || courseId == '') {
		res.send(JSON.stringify(events));
	} else {
		promise_lib.resolve()
		.then(function() {
			var currDate = new Date();
			currDate.setHours(0,0,0,0);
			var deferred = promise_lib.defer();
			MongoHelper.find('EventModel', {courseId: courseId, invited: studentId, 
				declined: {$nin: [studentId]}, startDate: {$gt: currDate}}, {}, 
				{$orderby: { startDate : 1 }}).limit(3).toArray(function(err, objects) {
				if (objects && objects.length > 0) {
					for (var i=0; i<objects.length; i++) {
						events.push(objects[i]);
					}
				}
				deferred.resolve();
			});
			return deferred.promise;
		}).then(function() {
			if (events && events.length > 0) {
				for (var i=0; i<events.length; i++) {
					var eventObj = events[i];
					var actions = eventObj.actions;
					var startDate = Date.parse(eventObj.startDate);
					if(eventObj.endDate){
			            var endDate = Date.parse(eventObj.endDate);
						var duration = (endDate - startDate)/1000;
			            eventObj.duration = duration;
			        }
					if (actions && actions.length > 0) {
						for (var j=0; j<actions.length; j++) {
							if (actions[j].userId == studentId) {
								eventObj.action = actions[j].action;
								eventObj.actionDate = actions[j].actionDate;
								break;
							}
						}
					}
				}
			}			
		}).catch(function(err) {
			console.log('Error - ', err);
		}).done(function() {
			res.send(JSON.stringify(events));
		});
	}
}

exports.getCourseSummary = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = req.user.identifier;
	var response = {};
	var tutor = {};
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, state) {
			if (err) {
				deferred.reject(err);
			} else {
				tutor = state.tutor; 
				deferred.resolve(state);
			}
		});
		return deferred.promise;
	}).then(function(state) {
		lobMap = PlayerUtil.getMap(state.learning_objects);
		elementMap = PlayerUtil.getMap(state.elements);
		var courseObj = lobMap[courseId];
		var courseSummmaryArray = courseObj.elements_count;
		var courseSummmary = [];
		var totalLectures = 0, totalExercises = 0;
		for(key in courseSummmaryArray){
			if(courseSummmaryArray[key].elementType == ViewHelperConstants.LEARNING_RESOURCE ){
				totalLectures += courseSummmaryArray[key].total;
			}
			if(courseSummmaryArray[key].elementType == ViewHelperConstants.EXAM || courseSummmaryArray[key].elementType == ViewHelperConstants.LEARNING_ACTIVITY ){
				totalExercises += courseSummmaryArray[key].total;
			}	
			if(courseSummmaryArray[key].elementType == ViewHelperConstants.CLASSROOM){
				var coachingSessions = {'name' : 'Coaching Sessions', total : courseSummmaryArray[key].total};
			}
			if(courseSummmaryArray[key].elementType == ViewHelperConstants.PRACTICE_TEST){
				var practiceTests = {'name' : 'Practice Tests', total : courseSummmaryArray[key].total};
			}	
		}
		var lectures = {'name' : 'Lectures', total : totalLectures};
		var exercises = {'name' : 'Exams', total : totalExercises};
		if (lectures && lectures.total && lectures.total > 0)
			courseSummmary.push(lectures);
		if (exercises && exercises.total && exercises.total > 0)
			courseSummmary.push(exercises);
		if (coachingSessions && coachingSessions.total && coachingSessions.total > 0)
			courseSummmary.push(coachingSessions);
		if (practiceTests && practiceTests.total && practiceTests.total > 0)
			courseSummmary.push(practiceTests);
		response.courseSummmary = courseSummmary;
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningObjectModel', {identifier: courseId}, function(err, data) {
			if (err) {
				deferred.reject(err);
			} else {
				response.concepts = data.concepts;
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.count('LearnerStateModel', {courseId: courseId, roles: 'student'}, function(err, count) {
			if (err) {
				deferred.reject(err);
			} else {
				response.students = count;
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).then(function(){
		return getFaculties(courseId);
	}).then(function(faculties){
		if(faculties) response.faculties = faculties;
		var deferred = promise_lib.defer();
		MongoHelper.findOne('UserModel', {identifier: tutor}, function(err, user) {
			if (err) {
				deferred.reject(err);
			} else {
				if(user) {
					var coach = {"image": user.metadata.image, "description": user.metadata.description, "identifier": user.identifier, "name": user.displayName}
					response.Coach = coach;
				} else {
					response.Coach = null;	
				}
				deferred.resolve();
			}
		});
		return deferred.promise;
	}).done(function() {
		res.send(JSON.stringify(response));
	});	
}

function getFaculties(courseId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('InstructorCoursesModel', {courseId: courseId, role: 'faculty'},{identifier:1}).toArray(function(err, data) {
			if (err) {
				deferred.reject(err);
			} else {
				var instructorIds = [];
				if(data && data.length > 0) {
					data.forEach(function(instructor) {
						instructorIds.push(instructor.identifier);
					});
				}
				deferred.resolve(instructorIds);
			}
		});
		return deferred.promise;
	}).then(function(instructorIds) {
		var deferred = promise_lib.defer();
		if(instructorIds && instructorIds.length > 0) {
			MongoHelper.find('UserModel', {identifier: {$in: instructorIds}}).toArray(function(err, data) {
				if (err) {
					deferred.reject(err);
				} else {
					var faculties = [];
					if(data && data.length > 0) {
						data.forEach(function(user) {
							faculties.push({"image": user.metadata.image, "description": user.metadata.description, "identifier": user.identifier, "name": user.displayName});
						});
					}
					deferred.resolve(faculties);
				}
			});
		} else {
			deferred.resolve([]);
		}
		return deferred.promise;
	}).done(function(faculties) {
		deferred.resolve(faculties);
	});
	return deferred.promise;
}

function createArray(unit) {
	unit.children = [];
	unit.learningTime = 0;
	unit.elements_count = {};
	for (var elementId in unit.elements) {
		var element = unit.elements[elementId];
		unit.children.push(element);
		if (element.elements) {
			createArray(element);
		}
		unit.learningTime += element.learningTime;
	}
	delete unit.elements;
}

function buildTimeBasedTOC(toc, courseId, lobMap, elementMap, elements) {
	var currentOffset = 1;
	var offsetMap = {};
	for (var i=0; i<elements.length; i++) {
		var elementId = elements[i];
		if (elementMap[elementId].event) {
			toc.events[elementMap[elementId].event.eventId] = elementMap[elementId];
		} else {
			currentOffset = addElementToTOC(toc, elementId, lobMap, elementMap, courseId, currentOffset, offsetMap);
		}
	}
}

function addElementToTOC(toc, elementId, lobMap, elementMap, courseId, currentOffset, offsetMap) {
	var element = elementMap[elementId];
	var parents = [];
	getParents(lobMap, elementId, courseId, parents);
	var offset = element.offset;
	if (offset < currentOffset) {
		offset = currentOffset;
	} else {
		currentOffset = offset;
	}
	if (offset > 0) {
		if (!offsetMap[offset]) {
			offsetMap[offset] = [];
		}
		var tocArray = getTOCArray(toc, offset);
		for (var i=parents.length-1; i>=0; i--) {
			tocArray = buildTOCPath(parents[i], tocArray, offset, offsetMap);
		}
		if (offsetMap[offset].indexOf(elementId) < 0) {
			offsetMap[offset].push(elementId);
		}
		tocArray[elementId] = element;
	}
	return currentOffset;
}

function buildTOCPath(parent, tocArray, offset, offsetMap) {
	if (tocArray[parent.identifier]) {
		tocArray = tocArray[parent.identifier].elements;
	} else {
		if (offsetMap[offset].indexOf(parent.identifier) < 0) {
			offsetMap[offset].push(parent.identifier);
		}
		tocArray[parent.identifier] = JSON.parse(JSON.stringify(parent));
		if (checkOffset(offset, offsetMap, parent.identifier)) {
			tocArray[parent.identifier].name = tocArray[parent.identifier].name + ' (continued)';
		}
		tocArray[parent.identifier].elements = {};
		tocArray = tocArray[parent.identifier].elements;
	}
	return tocArray;
}

function checkOffset(offset, offsetMap, elementId) {
	for (var offsetId in offsetMap) {
		if (offsetId < offset && offsetMap[offsetId].indexOf(elementId) > -1) {
			return true;
		}
	}
	return false;
}

function getParents(lobMap, elementId, courseId, parents) {
	for (var lobId in lobMap) {
		var lob = lobMap[lobId];
		if (lob.sequence && lob.sequence.indexOf(elementId) > -1 && lobId != courseId) {
			parents.push(lob);
			getParents(lobMap, lobId, courseId, parents);
		} else if (lob.additional_material && lob.additional_material.indexOf(elementId) > -1 && lobId != courseId) {
			parents.push(lob);
			getParents(lobMap, lobId, courseId, parents);
		}
	}
}

function getTOCArray(toc, offset) {
	if (!toc['units'][offset]) {
		toc['units'][offset] = {};
		toc['units'][offset].elements = {};
	}
	return toc['units'][offset].elements;
}

exports.getCurrentCourseId = function(studentId) {
	console.log('Get CurrentCourse Id - ' + studentId);
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.STUDENT_ID = studentId;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetCurrentCourse", mwReq, function(err, mwData, mwRes) {
            if (err) {
                console.log("Error in Response from MW GetCurrentCourse: " + err);
                defer.resolve();
            } else {
                if (mwData && mwData.responseValueObjects && mwData.responseValueObjects.COURSE_ID && mwData.responseValueObjects.COURSE_ID.id) {
                	console.log('Middleware CurrentCourse Id - ' + mwData.responseValueObjects.COURSE_ID.id);
                	defer.resolve(mwData.responseValueObjects.COURSE_ID.id);
                } else {
                	defer.resolve();
                }
            }
        });
	    return defer.promise;
	}).then(function(courseId) {
		var defer = promise_lib.defer();
		if (courseId && courseId != '') {
			console.log('Course id found in middleware - ' + courseId);
			defer.resolve(courseId);
		} else {
			var LearnerStateModel = mongoose.model('LearnerStateModel');
	        LearnerStateModel.find({"student_id" : studentId}, {courseId: 1, _id: 0}).sort({enrolled_date: -1}).limit(1).lean().exec(function(err, courseIds) {
	            if (courseIds && courseIds.length > 0) {
	            	defer.resolve(courseIds[0].courseId);
	            } else {
	            	defer.reject('No Enrollment found for the student');
	            }
	        });
		}
		return defer.promise;
	}).then(function(courseId) {
		deferred.resolve(courseId);
	}).catch(function(err) {
		console.log("DVH:getCurrentCourseId() - Error: ", err);
		deferred.reject(err);
	});
	return deferred.promise;
}

exports.getCurrentCourse = function(req, res) {
	var studentId = req.user.identifier;
	if(req.user.roles.indexOf('admin') > -1) {
		res.send(JSON.stringify({error: true}));
	} else {
		exports.getCurrentCourseId(studentId)
		.then(function(courseId) {
			res.send({'courseId':courseId});
		}).catch(function(err) {
			console.log("Error: ",err);
			res.send(JSON.stringify({error: true}));
		});
	}
}



