/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Coaching functionality
 *
 * @author rayulu
 */

var mongoose = require('mongoose'),
errorModule = require('../../view_helpers/ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var promise_lib = require('when');
var PlayerUtil = require('../../view_helpers/player/PlayerUtil');
var ViewHelperConstants = require('../../view_helpers/ViewHelperConstants');
LearnerStateModel = mongoose.model('LearnerStateModel');
EventModel = mongoose.model('EventModel');
var pumpUtil = require('../util/PumpIOUtil');
var pumpHelper = require('../util/PumpHelper');
var pumpConfig = require('../config/pumpConfig.json');
var IDCacheUtil = require('../../commons/IDCacheUtil');
var LearnerEnrollmentHelper = require('../../view_helpers/player/LearnerEnrollmentHelper');
var enrollmentHelper = require('../../view_helpers/EnrollmentImportHelper');
var instructorVH = require('../../view_helpers/InstructorViewHelper');
var importer = require('../../view_helpers/studio/CourseImportHelper.js');
var MWServiceProvider = require('../../commons/MWServiceProvider');
require('date-format-lite');


function addClassroomSessionToPath(courseId, classroom, learnerIds, eventId) {
	var deferred = promise_lib.defer();
	var classroomId = classroom.identifier;
	promise_lib.resolve()
	.then(function(obj) {
		var deferred = promise_lib.defer();
		LearnerStateModel.find({courseId: courseId, student_id: {$in: learnerIds}}).exec(function(err, docs) {
			if(err || !docs || docs.length <= 0) {
				deferred.reject(err);
			} else {
				deferred.resolve(docs);
			}
		});
		return deferred.promise;
	}).then(function(docs) {
		var deferreds = [];
		var invitedDate = new Date();
		docs.forEach(function(state) {
			var defer = promise_lib.defer();
			deferreds.push(defer);
			updateLearnerState(state, classroomId, classroom, eventId, invitedDate, defer);
		});
		return promise_lib.all(deferreds);
	}).catch (function(err) {
        deferred.reject(err);
    }).done(function() {
    	deferred.resolve();
    });
    return deferred.promise;
}

function updateLearnerState(state, classroomId, classroom, eventId, invitedDate, defer) {
	var lobMap = PlayerUtil.getMap(state.learning_objects);
	var elementMap = PlayerUtil.getMap(state.elements);
	if (lobMap[classroom.lobId] && !elementMap[classroomId]) {
		var lob = lobMap[classroom.lobId];
		if (!lob.sequence) {
			lob.sequence = [];
		}
		lob.sequence.push(classroomId);
		var subType = classroom.metadata.elementType;
		setElementCount(lob, subType);
		updateParentElementsCount(lobMap, classroom.lobId, subType, 1);
		var element = {};
		element.identifier = classroomId;
		element.elementType = classroom.metadata.elementType;
		element.isMandatory = classroom.isMandatory;
		element.name = classroom.name;
		element.offset = classroom.offset;
		element.elementSubType = classroom.metadata.instructionUsage;
		if(classroom.metadata.learningTime) {
			element.learningTime = classroom.metadata.learningTime;
		} else {
			element.learningTime = 0;
		}
		element.proficiencyWeightage = (classroom.metadata.proficiencyWeightage)? classroom.metadata.proficiencyWeightage : 1;
		element.minProficiency = (classroom.metadata.minProficiency)? classroom.metadata.minProficiency : 0;
		element.duration = classroom.metadata.duration;
		element.parentId = classroom.lobId;
		element.assessmentId = classroom.metadata.usageId;
		element.mediaType = classroom.objectType;
		var event = {};
		event.eventId = eventId;
		event.action = ViewHelperConstants.STATUS_INVITED;
		event.lastUpdated = invitedDate;
		element.event = event;
		state.elements.push(element);
		var groups = LearnerEnrollmentHelper.createLists(state);
		state.groups = groups;
		state.markModified('learning_objects');
		state.markModified('elements');
		state.markModified('groups');
		state.markModified('targets');
		state.save(function(err, object) {
			if(err) {
				defer.reject(err);
			} else {
				updateMWLearnerPath(state);
				defer.resolve();
			}
		});
	} else if (lobMap[classroom.lobId] && elementMap[classroomId]) {
		var element = elementMap[classroomId];
		var event = {};
		event.eventId = eventId;
		event.action = ViewHelperConstants.STATUS_INVITED;
		event.lastUpdated = invitedDate;
		element.event = event;
		state.save(function(err, object) {
			if(err) {
				defer.reject(err);
			} else {
				defer.resolve();
			}
		});
	} else {
		defer.resolve();
	}
}

function updateMWLearnerPath(state) {
	var req = new Object();
	req.LEARNER_ID = state.student_id;
	req.COURSE_ID = state.courseId;
	req.BATCH_ID = state.batch || '';
	MWServiceProvider.callServiceStandard("learnerService", 'UpdateLearnerPath', req, function(err, data, response) {
        if (err) {
            console.log("Error in Response from MW UpdateLearnerPath");
        } else {
            console.log("MW UpdateLearnerPath updated");
        }
    });
}

function updateParentElementsCount(lobMap, lobId, subType, incrValue) {
	if (!incrValue) {
		incrValue = 1;
	}
	for (var id in lobMap) {
		var parent = lobMap[id];
		if (parent.sequence && parent.sequence.indexOf(lobId) > -1) {
			setElementCount(parent, subType, incrValue);
			updateParentElementsCount(lobMap, parent.identifier, subType, incrValue);
		}
	}
}

function setElementCount(parent, subType, incrValue) {
	if (!incrValue) {
		incrValue = 1;
	}
	if (!parent.elements_count) {
		parent.elements_count = [];
	}
	var total = -1;
	for (var i=0; i<parent.elements_count.length; i++) {
		var count = parent.elements_count[i];
		if (count.elementType == subType) {
			count.total = count.total + incrValue;
			total = count.total;
		}
	}
	if (total == -1) {
		var countObj = new Object();
		countObj.elementType = subType;
		countObj.total = incrValue;
		parent.elements_count.push(countObj);
	}
}

exports.addBinder = function(req, res) {
	var courseId = req.body.courseId;
	var binderId = req.body.binderId;
	var learnerIds = req.body.learnerIds;
	if (typeof courseId == 'undefined' || typeof binderId == 'undefined' 
		|| typeof learnerIds == 'undefined' || learnerIds.length <= 0) {
		res.send('Invalid input');
	} else {
		promise_lib.resolve()
		.then(function() {
			var defer = promise_lib.defer();
			MongoHelper.findOne('LearningObjectModel', {identifier: binderId}, function(err, obj) {
		        if (err || !obj) {
		            defer.reject('Object not found');
		        } else {
		            defer.resolve(obj);
		        }
		    });
		    return defer.promise;
		}).then(function(obj) {
			return addBinderToPath(courseId, obj, learnerIds);
		})
		.then(function() {
			res.send('Binder added to Learner Path');
		})
		.catch(function(err) {
			res.send("Error: " + err);
		}).done();
	}
}

function addBinderToPath(courseId, binder, learnerIds) {
	var deferred = promise_lib.defer();
	var binderElements;
	var lobId = binder.parentId;
	var binderId = binder.identifier;
	var contentMap = {};
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('LearningObjectElementsModel', {
	        lobId: binderId
	    }, function(err, elements) {
	        if (err || !elements || !elements.elements || elements.elements.length <= 0) {
	            defer.reject('Cannot release study material with no content items');
	        } else {
	            defer.resolve(elements);
	        }
	    });
		return defer.promise;
	}).then(function(elements) {
		var deferreds = [];
		binderElements = elements;
		binderElements.elements.forEach(function(ele) {
			var defer = promise_lib.defer();
			deferreds.push(defer);
			getElement(ele, contentMap, binderId, defer);
		});
		return promise_lib.all(deferreds);
	}).then(function() {
		var deferred = promise_lib.defer();
		LearnerStateModel.find({courseId: courseId, student_id: {$in: learnerIds}}).exec(function(err, docs) {
			if(err || !docs || docs.length <= 0) {
				deferred.reject(err);
			} else {
				deferred.resolve(docs);
			}
		});
		return deferred.promise;
	}).then(function(docs) {
		console.log('docs returned ' + docs.length);
		var deferreds = [];
		docs.forEach(function(state) {
			var defer = promise_lib.defer();
			deferreds.push(defer);
			addBinderToLearnerState(state, lobId, binderId, binder, contentMap, defer);
		});
		return promise_lib.all(deferreds);
	}).catch (function(err) {
        deferred.reject(err);
    }).done(function() {
    	deferred.resolve();
    });
    return deferred.promise;
}

function addBinderToLearnerState(state, lobId, binderId, binder, contentMap, defer) {
	var lobMap = PlayerUtil.getMap(state.learning_objects);
	var elementMap = PlayerUtil.getMap(state.elements);
	if (lobMap[binderId] || elementMap[binderId]) {
		defer.resolve();
	}
	if (lobMap[lobId]) {
		var lob = lobMap[lobId];
		var sequence = lob.sequence;
		if (!lob.sequence) {
			lob.sequence = [];
		}
		if (lob.sequence.indexOf(binderId) == -1) {
			lob.sequence.push(binderId);
			var subType = binder.lobType;
			setLobsCount(lob, subType, 1);
			updateParentLobsCount(lobMap, lobId, subType, 1);
			var newLob = {};
			newLob.sequence = [];
			for (var contentId in contentMap) {
				elementMap[contentId] = contentMap[contentId];
				state.elements.push(contentMap[contentId]);
				newLob.sequence.push(contentId);
			}
			setElementCount(lob, ViewHelperConstants.CONTENT, newLob.sequence.length);
			updateParentElementsCount(lobMap, lobId, ViewHelperConstants.CONTENT, newLob.sequence.length);

			newLob.identifier = binder.identifier;
			newLob.elementType = binder.lobType;
			newLob.mediaType = binder.lobType;
			newLob.name = binder.name;
			newLob.offset = binder.offset;
			var eleCountObj = new Object();
			eleCountObj.elementType = ViewHelperConstants.CONTENT;
			eleCountObj.total = newLob.sequence.length;
			newLob.elements_count = [];
			newLob.elements_count.push(eleCountObj);
			newLob.learningTime = getLearningTime(elementMap, newLob);
			newLob.additional_material = [];
			state.learning_objects.push(newLob);
			var groups = LearnerEnrollmentHelper.createLists(state);
			state.groups = groups;
			state.markModified('learning_objects');
			state.markModified('elements');
			state.markModified('groups');
			state.markModified('targets');
			state.save(function(err, object) {
				if(err) {
					defer.reject(err);
				} else {
					defer.resolve();
				}
			});
		} else {
			defer.resolve();
		}
	} else {
		defer.reject('Learning Object not found in learner path');
	}
}

function updateParentLobsCount(lobMap, lobId, subType, incrValue) {
	if (!incrValue) {
		incrValue = 1;
	}
	for (var id in lobMap) {
		var parent = lobMap[id];
		if (parent.sequence && parent.sequence.indexOf(lobId) > -1) {
			setLobsCount(parent, subType, incrValue);
			updateParentLobsCount(lobMap, parent.identifier, subType, incrValue);
		}
	}
}

function setLobsCount(lob, subType, incrValue) {
	if (!incrValue) {
		incrValue = 1;
	}
	if (!lob.lobs_count) {
		lob.lobs_count = [];
	}
	var total = -1;
	for (var i=0; i<lob.lobs_count.length; i++) {
		var count = lob.lobs_count[i];
		if (count.elementType == subType) {
			count.total = count.total + incrValue;
			total = count.total;
		}
	}
	if (total == -1) {
		var countObj = new Object();
		countObj.elementType = subType;
		countObj.total = incrValue;
		lob.lobs_count.push(countObj);
	}
}

function getElement(ele, contentMap, binderId, defer) {
	var element = {};
	element.identifier = ele.elementId;
	element.elementType = ViewHelperConstants.CONTENT;
	element.isMandatory = ele.isMandatory;
	element.parentId = binderId;
	MediaContentModel = mongoose.model('MediaContentModel');
	MediaContentModel.findOne({identifier: ele.elementId}).lean().exec(function(err,content) {
		if(err || !content) {
			defer.reject(err);
		} else {
			element.name = content.name;
			element.elementSubType = ViewHelperConstants.LECTURE;
			if(content.metadata.learningTime){
				element.learningTime = content.metadata.learningTime;
			} else {
				element.learningTime = 0;
			}
			element.proficiencyWeightage = (content.metadata.proficiencyWeightage)? content.metadata.proficiencyWeightage : 1;
			element.minProficiency = (content.metadata.minProficiency)? content.metadata.minProficiency : 0;
			if (content.media && content.media.length > 0) {
				var mediaList = content.media;
				for (var i=0; i<mediaList.length; i++) {
					var mediaObj = mediaList[i];
					if (mediaObj.isMain) {
						element.mediaType = mediaObj.mediaType;
					}
				}
			}
			contentMap[ele.elementId] = element;
			defer.resolve();
		}
	});
}

function getLearningTime(elementMap, lob) {
	var sequence = lob.sequence;
	var learningTime = 0;
	if(sequence) {
		for (var i = 0; i < sequence.length; i++) {
			var seqId = sequence[i];
			if(elementMap[seqId]) {
				var element = elementMap[seqId];
				learningTime += element.learningTime;
			}
		}
	}
	return learningTime;
}

/**
 * Request sample:
 * {
 * 	  to: {
 * 	  	list:"<id>",
 * 	  	learners:[<learner ids>]
 * 	  },
 * 	  classroom:"<id>",
 * 	  courseId:"<course id>"
 * }
 */
exports.postClasroomSession = function(req, res) {

	var to = req.body.to;
	var learners = req.body.to.learners || [];
	var classroom = req.body.classroom;
	var courseId = req.body.courseId;
	promise_lib.resolve()
	.then(function() {
		if(to.list && to.list.length > 0) {
			var promises = [];
			to.list.forEach(function(listId) {
				promises.push(getListMembers(req.user.identifier, listId));
			})
			return promise_lib.all(promises);
		}
	})
	.then(function(allLearners) {
		if(allLearners && allLearners.length > 0) {
			allLearners.forEach(function(learnerId) {
				learners.push(learnerId);
			});
		}
		var deferred = promise_lib.defer();
		if(learners.length == 0) {
			deferred.reject('No learners found to add classroom');
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function() {
		return addClassroomSessionToPath(courseId, classroom, learners);
	})
	.then(function() {
		console.log('Classroom added to path......');
		var deferred = promise_lib.defer();
		MongoHelper.findOne('LearningResourceModel', {identifier: classroom}, function(err, lr) {
			if(err || lr == null || typeof lr == 'undefined') {
				deferred.reject(err);
			} else {
				deferred.resolve(lr);
			}
		});
		return deferred.promise;
	})
	.then(function(lr) {
		console.log('Send classroom post to learners', lr.name);
		var context = {
			"objectType": "event",
		    "startDate": lr.startDate,
		    "endDate": lr.endDate,
		    "duration": lr.metadata.duration,
		    "classsroomId": classroom,
		    "courseId": courseId,
		    "coachId": req.user.identifier
		}
		var senders = [];
		if(to.list && to.list.length > 0) {
			to.list.forEach(function(listId) {
				senders.push({id: listId, type: 'list'});
			});
		}
		if(to.learners && to.learners.length > 0) {
			to.learners.forEach(function(learnerId) {
				senders.push({id: learnerId, type: 'learner'});
			});
		}
		var deferred = promise_lib.defer();
		pumpUtil.postMessage(req.user.identifier, lr.name, lr.metadata.description, context, senders, 'classroom', function(err, data) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.then(function() {
		res.send('Classroom added to learner paths and sent a post of learners');
	})
	.catch(function(err) {
		console.log('Error', err);
		res.json({error: err});
	})
	.done();
}

function getListMembers(userId, listId) {
	var deferred = promise_lib.defer();
	pumpUtil.getListMembers(userId, listId, function(err, data) {
		var learners = [];
		if(data && data.items) {
			data.items.forEach(function(item) {
				learners.push(getLearnerId(item.id));
			});
		}
		deferred.resolve(learners);
	});
	return deferred.promise;
}

function getLearnerId(profileId) {
	var path = profileId.replace(appConfig.PUMP_BASE_URL, '');
	var params = path.split('/');
	return params[2];
}

/**
 * Request sample:
 * {
 * 	  to: {
 * 	  	list:"<id>",
 * 	  	learners:[<learner ids>]
 * 	  },
 * 	  binder:"<id>",
 * 	  lobId:"<learning object id>",
 * 	  courseId:"<course id>"
 * }
 */
exports.postBinder = function(post, senders, cc, req, res) {

	var learners = [];
	var binder = post.objectId.id;
	var courseId = post.courseId;

	promise_lib.resolve()
	.then(function() {
		if(senders && senders.length > 0) {
			var promises = [];
			senders.forEach(function(sender) {
				if(sender.type == 'list') {
					promises.push(getListMembers(req.user.identifier, sender.id));
				} else {
					learners.push(sender.id);
				}
			})
			return promise_lib.all(promises);
		}
	})
	.then(function(allLearners) {
		if(allLearners && allLearners.length > 0) {
			allLearners.forEach(function(learnerArr) {
				learnerArr.forEach(function(learnerId) {
					learners.push(learnerId);
				})
			});
		}
		if(cc && cc.length > 0) {
			cc.forEach(function(member) {
				learners.push(member.id);
			});
		}
		var deferred = promise_lib.defer();
		if(learners.length == 0) {
			deferred.reject('No learners found to add binder');
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('LearningObjectModel', {identifier: binder}, function(err, binderObj) {
	        if (err || !binderObj) {
	            defer.reject('Object not found');
	        } else {
	            defer.resolve(binderObj);
	        }
	    });
		return defer.promise;
	})
	.then(function(binderObj) {
		console.log('Adding binder to path');
		return addBinderToPath(courseId, binderObj, learners);
	})
	.then(function() {
		console.log('Binder added to learner path');
		var context = {
			"objectType": "context",
		    "objectId": binder,
		    "courseId": courseId,
		    "coachId": req.user.identifier
		}
		var deferred = promise_lib.defer();
		console.log('Posting binder');
		pumpUtil.postMessage(req.user.identifier, post.title, post.content, context, senders, cc, 'binder', function(err, data) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	})
	.then(function(data) {
		res.send(JSON.stringify(data));
	})
	.catch(function(err) {
		console.log('err', err);
		res.json({err: true, errorMsg: err});
	})
	.done();
}

exports.getMyStudents = function(req, res) {

	var courseId = req.params.courseId;
	var list = [];
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('InstructorCoursesModel', {identifier: req.user.identifier, courseId: courseId}, {learners: 1}, function(err, coach) {
			if(null == coach) {
				deferred.reject();
			} else {
				deferred.resolve(coach);
			}
		});
		return deferred.promise;
	})
	.then(function(coach) {
		var deferred = promise_lib.defer();
		MongoHelper.find('UserModel', {identifier: {$in: coach.learners}}, {identifier: 1, displayName: 1}).toArray(function(err, users) {
			deferred.resolve(users);
		});
		return deferred.promise;
	})
	.then(function(users) {
		users.forEach(function(user) {
			list.push({id: user.identifier, name: user.displayName, type: 'learner', group: 'Students'});
		});
		res.send(JSON.stringify(list));
	})
	.catch(function(err) {
		res.json([]);
	})
	.done();
}

exports.getObject = function(req, res) {

	var courseId = req.body.courseId;
	var type = req.body.type;
	var objectId = PlayerUtil.addFedoraPrefix(req.body.objectId);

	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		var model = '';
		var query = {
			'identifier': objectId,
			//'courseId': courseId,
			'createdBy': req.user.identifier,
			'metadata.instructionUsage': 'coaching'
		}
		var key = 'metadata.elementType';
		if(type == 'exam') {
			model = 'LearningActivityModel';
			query['metadata.elementType'] = ViewHelperConstants.EXAM;
		} else if(type == 'coachingSession') {
			model = 'LearningResourceModel';
			query['metadata.elementType'] = ViewHelperConstants.CLASSROOM;
		} else if(type == 'binder') {
			model = 'LearningObjectModel';
			query['lobType'] = ViewHelperConstants.BINDER;
		} else if(type == 'practiceTest') {
			model = 'LearningActivityModel';
			query['metadata.elementType'] = ViewHelperConstants.PRACTICE_TEST;
		}
		MongoHelper.findOne(model, query, {'identifier': 1, 'name': 1, 'metadata.description': 1}, function(err, object) {
			if(err || object == null) {
				deferred.reject({error: 'Object not found'});
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.then(function(object) {
		var result = {id: object.identifier, name: object.name, description: object.metadata.description};
		res.json(result);
	})
	.catch(function(err) {
		res.send(err);
	}).done();
}

exports.getObjects = function(req, res) {
	var courseId = req.body.courseId;
	var type = req.body.type;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		var model = '';
		var query = {
			'courseId': courseId,
			'createdBy': req.user.identifier,
			'metadata.instructionUsage': 'coaching'
		}
		var key = 'metadata.elementType';
		if(type == 'exam') {
			model = 'LearningActivityModel';
			query['metadata.elementType'] = ViewHelperConstants.EXAM;
		} else if(type == 'coachingSession') {
			model = 'LearningResourceModel';
			query['metadata.elementType'] = ViewHelperConstants.CLASSROOM;
		} else if(type == 'binder') {
			model = 'LearningObjectModel';
			query['lobType'] = ViewHelperConstants.BINDER;
		} else if(type == 'practiceTest') {
			model = 'LearningActivityModel';
			query['metadata.elementType'] = ViewHelperConstants.PRACTICE_TEST;
		}
		MongoHelper.find(
			model,
			query, {
				'identifier': 1,
				'name': 1,
				'metadata.description': 1
			}).toArray(function(err, objects) {
				deferred.resolve(objects);
			}
		);
		return deferred.promise;
	})
	.then(function(objects) {
		var list = [];
		objects.forEach(function(object) {
			list.push({id: object.identifier, name: object.name, description: object.metadata.description});
		});
		res.json(list);
	})
	.catch(function(err) {
		res.send(err);
	}).done();
}

function getCurrentUserSenders() {

}

exports.postActivity = function(req, res) {
	var post = req.body;
	var userId = req.user.identifier;
	var to = undefined;
	var cc = undefined;
	var courseAdminId = post.courseAdminId;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		if(post.to) {
			to = [];
			var adminGroups = [];
			post.to.forEach(function(sender) {
				if(['faculty', 'coaches'].indexOf(sender.type) != -1) {
					adminGroups.push(sender.id);
				} else if(sender.id != userId) {
					to.push({id: sender.id, type: sender.type});
				}
			});
			console.log('adminGroups', adminGroups);
			if(adminGroups.length > 0) {
				cc = [];
				var promises = [];
				adminGroups.forEach(function(groupId) {
					promises.push(getListMembers(courseAdminId, groupId));
				})
				promise_lib.all(promises).then(function(memberArray) {
					console.log('memberArray', memberArray);
					memberArray.forEach(function(members) {
						members.forEach(function(memberId) {
							if(memberId != userId) {
								if(req.user.roles.indexOf('student') != -1) {
									to.push({id: memberId, type: 'learner'});
								} else {
									cc.push({id: memberId, type: 'learner'});
								}
							}
						});
					});
					deferred.resolve();
				});
			} else {
				deferred.resolve();
			}
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function() {
		if(to && to.length == 0) to = undefined;
		if(cc && cc.length == 0) cc = undefined;
		console.log('To list', to);
		console.log('CC list', cc);
		if(post.type.value == 'note' || post.type.value == 'notification' && req.user.roles.indexOf('student') !== -1) {
			console.log('Posting message:' + post.type.value);
			pumpUtil.postMessage(req.user.identifier, post.title, post.content, undefined, to, cc, post.type.value, function(err, data) {
				res.send(JSON.stringify(data));
			});
		} else if(post.type.value == 'announcement' && req.user.roles.indexOf('student') == -1) {
			console.log('Posting announcement....');
			pumpUtil.postMessage(post.courseUser, post.title, post.content, undefined, undefined, undefined, post.type.value, function(err, data) {
				res.send(JSON.stringify(data));
			});
		} else if(post.type.value == 'binder' && req.user.roles.indexOf('student') == -1) {
			exports.postBinder(post, to, cc, req, res);
		} else if(['coachingSession', 'exam', 'practiceTest'].indexOf(post.type.value) != -1  && req.user.roles.indexOf('student') == -1) {
			var objectType = '';
			if(post.type.value == 'exam') {
				objectType = ViewHelperConstants.EXAM;
			} else if(post.type.value == 'coachingSession') {
				objectType = ViewHelperConstants.CLASSROOM;
			} else if(post.type.value == 'practiceTest') {
				objectType = ViewHelperConstants.PRACTICE_TEST;
			}
			//setDates(post);
			promise_lib.resolve()
			.then(function() {
				console.log('Creating event');
				return exports.createEvent(post.courseId, userId, post.objectId.id, objectType, post.startDate,
					post.endDate, post.location, to, cc, post.title, post.content);
			})
			.then(function(eventId) {
				console.log('Event added to learner path:', eventId);
				var context = {
					"objectType": "context",
				    "objectId": post.objectId.id,
				    "courseId": post.courseId,
				    "eventId": eventId,
				    "coachId": req.user.identifier,
				    "scheduledDate": post.scheduledDate,
				    "startTime": post.startTime,
				    "endTime": post.endTime,
				    "eventActiveTime": post.startDate
				}
				var deferred = promise_lib.defer();
				console.log('Posting Event');
				pumpUtil.postMessage(req.user.identifier, post.title, post.content, context, to, cc, post.type.value,
					function(err, data) {
						if(err) {
							deferred.reject(err);
						} else {
							deferred.resolve(data);
						}
					}
				);
				return deferred.promise;
			})
			.then(function(data) {
				res.send(JSON.stringify(data));
			})
			.catch(function(err) {
				res.json({err: true, errorMsg: err});
			}).done();
		}
	})
	.catch(function(err) {
		console.log('Error Posting acitvity', err);
		res.json({err: true, errorMsg: err});
	}).done();
}

function setDates(post) {

	console.log('post.scheduledDate', post.scheduledDate);
	var tempDate = post.scheduledDate.date();
	console.log('tempDate', tempDate);
	var scheduledDate = tempDate.format('DD/MM/YYYY');
	console.log('scheduledDate', scheduledDate);
	post.startDate = (scheduledDate + ' ' + post.startTime).date();
	console.log('post.startDate', post.startDate);
	post.endDate = (scheduledDate + ' ' + post.endTime).date();
	console.log('post.endDate', post.endDate);
	post.scheduledDate = post.startDate.format('DDDD, MMMM DD');
	console.log('post.scheduledDate', post.scheduledDate);
}

/**
 * to will be in the format
 * [{
 * 		id: '',
 * 		type: 'list/learner'
 * }]
 */
exports.createEvent = function(courseId, instructorId, objectId, objectType, startDate, endDate, location, to, cc, name, message) {
	var deferred = promise_lib.defer();
	var object;
	var learnerIds = [];
	var eventId;
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		if (objectType == ViewHelperConstants.CLASSROOM) {
			MongoHelper.findOne('LearningResourceModel', {identifier: objectId}, function(err, lr) {
				if(err || !lr) {
					defer.reject('Object not found');
				} else {
					lr.objectType = objectType;
					defer.resolve(lr);
				}
			});
		} else if (objectType == ViewHelperConstants.EXAM || objectType == ViewHelperConstants.PRACTICE_TEST) {
			MongoHelper.findOne('LearningActivityModel', {identifier: objectId}, function(err, la) {
				if(err || !la) {
					defer.reject('Object not found');
				} else {
					la.objectType = objectType;
					defer.resolve(la);
				}
			});
		} else if (objectType == ViewHelperConstants.BINDER) {
			MongoHelper.findOne('LearningObjectModel', {identifier: objectId}, function(err, obj) {
		        if (err || !obj) {
		            defer.reject('Object not found');
		        } else {
		        	obj.objectType = objectType;
		            defer.resolve(obj);
		        }
		    });
		} else {
			defer.reject('Invalid object type');
		}
		return defer.promise;
	})
    .then(function(element){
    	console.log('Getting invite list....');
    	object = element;
    	return getInviteList(courseId, instructorId, to);
    })
    .then(function(ids){
    	console.log('Invitees fetched....');
    	learnerIds = ids;
    	if(cc && cc.length > 0) {
			cc.forEach(function(member) {
				learnerIds.push(member.id);
			});
		}
    	return IDCacheUtil.getIdentifier();
    })
    .then(function(identifier){
    	console.log('Creating event.....');
    	var defer = promise_lib.defer();
    	var eventObj = new EventModel();
    	eventObj.identifier = identifier;
    	eventObj.courseId = courseId;
    	eventObj.objectId = objectId;
    	eventObj.objectType = objectType;
    	if (name && name != '') {
    		eventObj.name = name;
    	} else {
    		eventObj.name = object.name;
    	}
    	eventObj.releasedBy = instructorId;
    	eventObj.releasedDate = new Date();
    	if (message && message != '') {
    		eventObj.releaseMsg = message;
    	} else {
    		eventObj.releaseMsg = object.metadata.description;
    	}
    	eventObj.invited = learnerIds;
    	eventObj.accepted = [];
    	eventObj.declined = [];
    	if (startDate && startDate != null) {
    		eventObj.startDate = startDate;	
    	} else {
    		eventObj.startDate = eventObj.releasedDate;	
    	}
    	eventObj.endDate = endDate;
    	eventObj.location = location;
    	eventObj.invites = to;
    	eventObj.actions = [];
    	eventObj.save(function(err) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(eventObj.identifier);
            }
        });
    	return defer.promise;
    }).then(function(id) {
    	console.log('Add event to students path....');
    	eventId = id;
    	if (objectType == ViewHelperConstants.BINDER) {
    		return addBinderToPath(courseId, object, learnerIds);	
    	} else {
    		return addClassroomSessionToPath(courseId, object, learnerIds, eventId);
    	}
    }).catch(function(err) {
    	console.log('Error:', err);
        deferred.reject(err);
    }).done(function() {
    	deferred.resolve(eventId);
    });
	return deferred.promise;
}

function getInviteList(courseId, instructorId, to) {
	var deferred = promise_lib.defer();
	if (!to || to.length <= 0) {
		deferred.reject('Event cannot be created with no learners');
	} else {
		var instructor;
		var learnerIds = [];
		promise_lib.resolve()
		.then(function(obj) {
			instructor = obj;
			var deferreds = [];
			for (var i=0; i<to.length; i++) {
				var invitee = to[i];
				getLearnerIds(courseId, instructorId, invitee, learnerIds, deferreds);
			}
			return promise_lib.all(deferreds);
		}).then(function() {
			console.log('LearnerIds', learnerIds);
			if (learnerIds.length > 0) {
				deferred.resolve(learnerIds);
			} else {
				deferred.reject('Event cannot be created with no learners');
			}
		}).catch(function(err) {
	        deferred.reject(err);
	    });
	}
	return deferred.promise;
}

function getLearnerIds(courseId, instructorId, invitee, learnerIds, deferreds) {
	if (invitee.type == 'list') {
		var defer = promise_lib.defer();
		deferreds.push(defer.promise);
		getListMembers(instructorId, invitee.id).then(function(memberIds) {
			if (memberIds && memberIds.length > 0) {
				memberIds.forEach(function(memberId) {
					if (learnerIds.indexOf(memberId) < 0) {
						learnerIds.push(memberId);
					}
				});
			}
			defer.resolve();
		});
	} else if (invitee.type == 'learner') {
		var defer = promise_lib.defer();
		deferreds.push(defer.promise);
		getLearner(courseId, invitee.id, learnerIds, defer)
	}
}

function getGroupLearners(courseId, groupId, groups, learnerIds, defer) {
	for (var i=0; i<groups.length; i++) {
		var group = groups[i];
		if (group.courseId == courseId && group.groupId == groupId) {
			if (group.learners && group.learners.length > 0) {
				group.learners.forEach(function(memberId) {
					if (learnerIds.indexOf(memberId) < 0) {
						learnerIds.push(memberId);
					}
				});
			}
			break;
		}
	}
	defer.resolve();
}

function getLearner(courseId, learnerId, learnerIds, defer) {
	MongoHelper.findOne('LearnerStateModel', {student_id: learnerId, courseId: courseId}, function(err, obj) {
		if(err || !obj) {
			defer.resolve();
		} else {
			if (learnerIds.indexOf(learnerId) < 0) {
				learnerIds.push(learnerId);
			}
			defer.resolve();
		}
	});
}

function getLearnerState(courseId, learnerId) {
	var defer = promise_lib.defer();
	LearnerStateModel.findOne({student_id: learnerId, courseId: courseId}).exec(function(err, learnerState) {
		if (learnerState) {
			defer.resolve(learnerState);
		} else {
			defer.reject('Learner path not found');
		}
	});
	return defer.promise;
}

function updateLearnerPathEvent(learnerState, objectId, updatedDate, status) {
	var defer = promise_lib.defer();
	var elementMap = PlayerUtil.getMap(learnerState.elements);
	if (elementMap[objectId]) {
		var element = elementMap[objectId];
		var eventObj = element.event;
		if (eventObj) {
			if (eventObj.action == status) {
				defer.resolve(eventObj.eventId);
			} else {
				eventObj.action = status;
				eventObj.lastUpdated = updatedDate;
				learnerState.save(function(err, object) {
					if(err) {
						defer.reject(err);
					} else {
						defer.resolve(eventObj.eventId);
					}
				});
			}
		} else {
			defer.reject('Learner is not invited to the event');
		}
	} else {
		defer.reject('Object not found in learner path');
	}
	return defer.promise;
}

exports.acceptEvent = function(req, res) {
	var courseId = req.body.courseId;
	var objectId = req.body.objectId;
	var learnerId = req.user.identifier;
	var updatedDate = new Date();
	promise_lib.resolve()
	.then(function() {
		return getLearnerState(courseId, learnerId);
	}).then(function(learnerState) {
		return updateLearnerPathEvent(learnerState, objectId, updatedDate, ViewHelperConstants.STATUS_ACCEPTED);
	}).then(function(eventId) {
		return updateEventDetails(eventId, learnerId, ViewHelperConstants.STATUS_ACCEPTED);
	}).then(function() {
		res.send(JSON.stringify({status: ViewHelperConstants.STATUS_ACCEPTED, lastUpdated: updatedDate}));
	}).catch(function(err) {
        res.send(JSON.stringify({error: err}));
    }).done();
}

exports.declineEvent = function(req, res) {
	var courseId = req.body.courseId;
	var objectId = req.body.objectId;
	var learnerId = req.user.identifier;
	var updatedDate = new Date();
	promise_lib.resolve()
	.then(function() {
		return getLearnerState(courseId, learnerId);
	}).then(function(learnerState) {
		return updateLearnerPathEvent(learnerState, objectId, updatedDate, ViewHelperConstants.STATUS_DECLINED);
	}).then(function(eventId) {
		return updateEventDetails(eventId, learnerId, ViewHelperConstants.STATUS_DECLINED);
	}).then(function() {
		res.send(JSON.stringify({status: ViewHelperConstants.STATUS_DECLINED, lastUpdated: updatedDate}));
	}).catch(function(err) {
        res.send(JSON.stringify({error: err}));
    }).done();
}

function updateEventDetails(eventId, learnerId, status) {
	var defer = promise_lib.defer();
	EventModel.findOne({identifier: eventId}).exec(function(err, event) {
		if (event) {
			if (!event.accepted) {
				event.accepted = [];
			}
			if (!event.declined) {
				event.declined = [];
			}
			if (!event.actions) {
				event.actions = [];
			}
			var isUpdate = false;
			console.log(event.accepted + ' - ' + learnerId);
			if (status == ViewHelperConstants.STATUS_ACCEPTED && event.accepted.indexOf(learnerId) < 0) {
				event.accepted.push(learnerId);
				isUpdate = true;
			}
			if (status == ViewHelperConstants.STATUS_DECLINED && event.declined.indexOf(learnerId) < 0) {
				event.declined.push(learnerId);
				isUpdate = true;
			}
			if (isUpdate) {
				var action = {};
				action.action = status;
				action.userId = learnerId;
				action.actionDate = new Date();
				event.actions.push(action);
				event.markModified('actions');
				event.markModified('accepted');
				event.markModified('declined');
				event.save(function(err, object) {
					if(err) {
						defer.reject(err);
					} else {
						defer.resolve();
					}
				});
			} else {
				defer.reject('Event is already ' + status + ' by the learner');
			}
		} else {
			defer.reject('Event not found');
		}
	});
	return defer.promise;
}

exports.getEventDetails = function(req, res) {
	var courseId = req.body.courseId;
	var eventId = req.body.eventId;
	var userId = req.user.identifier;
	var response = {};
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('EventModel', {identifier: eventId}, function(err, obj) {
			if(err || !obj) {
				defer.reject('Event not found');
			} else {
				defer.resolve(obj);
			}
		});
		return defer.promise;
	}).then(function(eventObj) {
		var defer = promise_lib.defer();
		if (eventObj.releasedBy == userId) {
			getEventResponse(eventObj, response);
			response.invited = eventObj.invited ? eventObj.invited.length : 0;
			response.accepted = eventObj.accepted ? eventObj.accepted.length : 0;
			response.declined = eventObj.declined ? eventObj.declined.length : 0;
			defer.resolve();
		} else {
			MongoHelper.findOne('LearnerStateModel', {student_id: userId, courseId: courseId}, function(err, state) {
				if(err || !state) {
					defer.reject('Learner Path not found');
				} else {
					var elementMap = PlayerUtil.getMap(state.elements);
					if (elementMap[eventObj.objectId]) {
						var element = elementMap[eventObj.objectId];
						if (element.event) {
							getEventResponse(eventObj, response);
							response.status = element.event.action;
							response.lastUpdated = element.event.lastUpdated;
							response.isMandatory = element.isMandatory;
							defer.resolve();
						} else {
							defer.reject('User is not part of the event');
						}
					} else {
						defer.reject('User is not part of the event');
					}
				}
			});
		}
		return defer.promise;
	})
	.then(function() {
		res.send(JSON.stringify(response));
	})
	.catch(function(err) {
        res.send(JSON.stringify({error: err}));
    }).done();
}

function getEventResponse(eventObj, response) {
	response.releasedBy = eventObj.releasedBy;
	response.releasedDate = eventObj.releasedDate;
	response.releaseMsg = eventObj.releaseMsg;
	response.objectId = eventObj.objectId;
	response.objectType = eventObj.objectType;
	response.startDate = eventObj.startDate;
	response.endDate = eventObj.endDate;
	response.location = eventObj.location;
}

function objectIdWithTimestamp(timestamp){
    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp.getTime()/1000).toString(16);
    // Create an ObjectId with that hex timestamp
    var constructedObjectId = mongoose.Types.ObjectId(hexSeconds + "0000000000000000");
    return constructedObjectId;
}

exports.createList = function(req, res) {

	var name = req.body.name;
	var desc = req.body.description;
	var userId = req.user.identifier;

	var context = {
        "objectType": "context",
        "groupName": name,
        "courseId": req.body.courseId,
        "listType": "user"
    }
    promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
        MongoHelper.findOne('LearningObjectModel', {identifier: req.body.courseId}, {'metadata.nodeId': 1}, function(err,course) {
        	if(err || !course) {
        		defer.reject('Course not found')
        	} else {
        		defer.resolve(course.metadata.nodeId);
        	}
        });
        return defer.promise;
	})
	.then(function(nodeId) {
		name = nodeId + ' ' + name;
		pumpUtil.createList(userId, name, desc, context, function(err, data) {
			if(err) {
				res.send(err);
			} else {
				res.send(data);
			}
		});
	})
	.catch(function(err) {
        res.send(err);
    }).done();
}

exports.deleteList = function(req, res) {

	var userId = req.user.identifier;
	var listId = req.params.listId;
	pumpUtil.deleteList(userId, listId, function(err, data) {
		if(err) {
			res.send(err);
		} else {
			res.send(data);
		}
	});
}

exports.addMemberToList = function(req, res) {

	var listId = req.body.listId;
	var memberId = req.body.memberId;
	var userId = req.user.identifier;
	exports.addMemberToGroup(userId, listId, memberId).then(function(data) {
		res.send(data);
	}).catch(function(err) {
		res.send(err);
	});
}

exports.addMemberToGroup = function(userId, listId, memberId) {
	var defer = promise_lib.defer();
	pumpUtil.addMemberToList(userId, listId, memberId, function(err, data) {
		if(err) {
			defer.reject(err);
		} else {
			defer.resolve(data);
		}
	});
	return defer.promise;
}

exports.removeMemberFromList = function(req, res) {
	var listId = req.body.listId;
	var memberId = req.body.memberId;
	var userId = req.user.identifier;
	pumpUtil.removeMemberFromList(userId, listId, memberId, function(err, data) {
		if(err) {
			res.send(err);
		} else {
			res.send(data);
		}
	});
}

exports.addMediaToEvent = function(req, res) {
	var eventId = req.body.eventId;
	var mediaList = req.body.media;
	promise_lib.resolve()
	.then(function() {
		var deferreds = [];
		if (mediaList && mediaList.length > 0) {
			for (var i=0; i<mediaList.length; i++) {
				var defer = promise_lib.defer();
				deferreds.push(defer);
				var mediaObj = mediaList[i];
				if (mediaObj.mediaId && mediaObj.mediaId != '') {
					defer.resolve();
				} else {
					promise_lib.resolve()
					.then(function() {
						return IDCacheUtil.getIdentifier();
					}).then(function(identifier) {
						mediaObj.mediaId = identifier;
						defer.resolve();
					}).catch (function(err) {
				        defer.reject(err);
				    })
				}
			}
		}
		return promise_lib.all(deferreds);
	}).then(function(values) {
		if (mediaList && mediaList.length > 0) {
			var _requests = [];
			for (var i=0; i<mediaList.length; i++) {
				getMediaJSON(mediaList[i], _requests);
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
            importer.createGraphWithoutStats(fin);
		}
		return true;
	}).then(function() {
		var defer = promise_lib.defer();
		EventModel.findOne({identifier: eventId}).exec(function(err, event) {
			if (event) {
				if (mediaList && mediaList.length > 0) {
					event.media = mediaList;
				} else {
					event.media = [];
				}
				event.markModified('media');
				event.save(function(err, object) {
					if(err) {
						defer.reject(err);
					} else {
						defer.resolve();
					}
				});
			} else {
				defer.reject('Event not found');
			}
		});
		return defer.promise;
	}).then(function() {
		if (!mediaList) {
			mediaList = [];
		}
		res.send(JSON.stringify(mediaList));
	}).catch (function(err) {
        console.log('Error: ' + err);
        res.send(JSON.stringify({error: true}));
    })
}

function getMediaJSON(media, _requests) {
	media.nodeId = media.mediaId;
    media.name = media.title;
    media.format = media.mimeType;
    media.location = media.mediaUrl;
    media.nodeType = ViewHelperConstants.MEDIA;
    media.nodeClass = ViewHelperConstants.MEDIA;
    media.identifier = media.mediaId;
    var data = {};
    data[media.nodeId] = media;
    _requests.push(data);
}

exports.rebalanceCoaches = function(req, res) {

	var courseId = req.body.courseId;
	var coaches = req.body.coaches;
	var learners = [], overLoaded = [], underLoaded = [];
	promise_lib.resolve()
	.then(function() {
		var promises = [];
		coaches.forEach(function(coach) {
            promises.push(updateCoachCapacity(courseId, coach));
        });
        return promise_lib.all(promises);
	})
	.then(function() {
		// Get all coaches in the course
		var deferred = promise_lib.defer();
	    MongoHelper.find('InstructorCoursesModel', {'courseId': courseId, role: {$ne: 'faculty'}}).toArray(function(err, coaches) {
	        deferred.resolve(coaches);
	    });
	    return deferred.promise;
	})
	.then(function(coaches) {
		// Get under loaded coaches and over loaded coaches
		coaches.forEach(function(coach) {
			if(coach.maxCapacity && coach.maxCapacity > coach.learnerCount) {
				underLoaded.push(coach);
			}
			if(coach.maxCapacity && coach.maxCapacity < coach.learnerCount) {
				overLoaded.push(coach);
			}
		});
		return rebalanceCoaches(overLoaded, underLoaded);
	})
	.then(function(learners) {
		console.log('Learners to be updated', learners);
		if(learners && learners.length > 0) {
			return reassignCoaches(courseId, learners, overLoaded);
		}
	})
	.then(function() {
		req.params.courseId = courseId;
		instructorVH.getInstructors(req, res);
	})
	.catch(function(err) {
		res.status(500).send('Error in rebalanceCoaches - ' + err);
	}).done();
}

function rebalanceCoaches(overLoaded, underLoaded) {

	var learners = [];
	if(overLoaded.length == 0) {
		console.log('No overloaded coaches found...');
		return learners;
	}
	underLoaded = sortCoaches(underLoaded);
	overLoaded.forEach(function(coach) {
		var diff = coach.learnerCount - coach.maxCapacity;
		var diffLearners = coach.learners.splice(0, diff);
		if(diffLearners && diffLearners.length > 0) {
			diffLearners.forEach(function(learnerId) {
				learners.push({learnerId: learnerId, oldCoach: coach.identifier, newCoach: undefined});
			});
			if(coach.batches && coach.batches.length > 0) {
				coach.batches.forEach(function(batch) {
					var lns = batch.learners.filter(function(el) {
  						return diffLearners.indexOf(el) < 0;
					});
					batch.learners = lns;
					batch.groupCount = lns.length;
				});
			}
			coach.learnerCount = coach.maxCapacity;
		}
	});
	learners.forEach(function(learner) {
		if(underLoaded.length > 0) {
			learner.newCoach = underLoaded[0].identifier; // Coach with least learner count
        	underLoaded[0].learnerCount++;
        	underLoaded = sortCoaches(underLoaded);
		}
	});
	return learners;
}

function sortCoaches(coaches) {
	var coachesWithCapacity = [];
	coaches.forEach(function(coach) {
		if(coach.learnerCount < coach.maxCapacity) {
			coachesWithCapacity.push(coach);
		}
	});
    coachesWithCapacity.sort(function(a, b){
        return a['learnerCount'] - b['learnerCount'];
    });
    return coachesWithCapacity;
}

function updateCoachCapacity(courseId, coach) {
	var deferred = promise_lib.defer();
	MongoHelper.update('InstructorCoursesModel', {courseId: courseId, identifier: coach.identifier}, {$set: {maxCapacity: coach.maxCapacity}},
        function(err, obj) {
            deferred.resolve();
        }
    );
	return deferred.promise;
}

function reassignCoaches(courseId, learners, overLoaded) {

	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var promises = [];
        learners.forEach(function(learner) {
            promises.push(updateCoach(courseId, learner));
        });
        return promise_lib.all(promises);
	})
	.then(function() {
		console.log('reassignCoaches(): Coach Update complete. Update coaches in mongo');
		var promises = [];
        overLoaded.forEach(function(coach) {
            promises.push(updateOverLoadedCoach(coach));
        });
        return promise_lib.all(promises);
	})
	.then(function() {
		console.log('reassignCoaches(): Updated coaches in mongo. Reset coach communities');
		return enrollmentHelper.resetCoachCommunities(courseId);
	})
	.then(function() {
		defer.resolve();
	})
	.catch(function(err) {
		defer.reject('Error in reassignCoaches - ', err);
	}).done();
	return defer.promise;
}

function updateOverLoadedCoach(coach) {
	var defer = promise_lib.defer();
    MongoHelper.update(
        'InstructorCoursesModel',
        {identifier: coach.identifier, courseId: coach.courseId},
        {$set:{batches: coach.batches, learnerCount: coach.learnerCount}},
        function(err, obj) {
            defer.resolve();
        }
    );
    return defer.promise;
}

function updateCoach(courseId, learner) {
	var learnerId = learner.learnerId;
	var oldCoach = learner.oldCoach;
	var newCoach = learner.newCoach;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		// Update coach assignment in mongo
		var deferred = promise_lib.defer();
		MongoHelper.update('LearnerStateModel', {courseId: courseId, student_id: learnerId}, {$set: {tutor: newCoach}},
            function(err, obj) {
                //console.log('Updated records for updateCoach - ', obj, 'err', err);
                deferred.resolve();
            }
        );
		return deferred.promise;
	})
	.then(function() {
		// Update coach assignment in Learner Info
		var deferred = promise_lib.defer();
		var req = new Object();
	    req.LEARNER_ID = learnerId;
	    req.COURSE_ID = courseId;
	    req.TUTOR_ID = newCoach;
		MWServiceProvider.callServiceStandard("learnerService", 'AssignTutor', req, function(err, data, response) {
	        if (err) {
	            deferred.reject("Error in Response from MW AssignTutor");
	        } else {
	            deferred.resolve();
	        }
	    });
		return deferred.promise;
	})
	.then(function() {
		// Update coach assignment in Interactions
		var deferred = promise_lib.defer();
		var req = new Object();
	    req.USER_ID = learnerId;
	    req.COURSE_ID = courseId;
	    req.COACH_ID = newCoach;
		MWServiceProvider.callServiceStandard("interactionService", 'UpdateCoach', req, function(err, data, response) {
	        if (err) {
	            deferred.reject("Error in Response from MW UpdateCoach");
	        } else {
	            deferred.resolve();
	        }
	    });
		return deferred.promise;
	})
	.then(function() {
		// Remove the learner from coach all groups
		return pumpHelper.deleteLearnerFromGroups(oldCoach, learnerId);
	})
	.then(function() {
		// Follow the new coach
		var deferred = promise_lib.defer();
        pumpUtil.follow(newCoach, learnerId, function(err, data) {
            deferred.resolve();
        });
        return deferred.promise;
	})
	.then(function() {
		defer.resolve();
	})
	.catch(function(err) {
		defer.reject('Error in updateCoach - ', err);
	}).done();
	return defer.promise;
}