/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Course Dashboard
 *
 * @author rayulu
 */

var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');

exports.exportCourseDashboardData = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = decodeURIComponent(req.params.studentId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var result = {};
    result.courseName = "";
    result.studentName = "";
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        CourseModel = mongoose.model('CourseModel');
        CourseModel.findOne({identifier: courseId}).lean().exec(function(err, course) {
            if (err || typeof course === 'undefined' || course == null) {
               defer.reject('Course Not found.');
            } else {
                result.courseName = course.name;
                defer.resolve();
            }
        });
        return defer.promise;
    })
    .then(function() {
        var defer = promise_lib.defer();
        UserModel = mongoose.model('UserModel');
        UserModel.findOne({identifier: studentId}).lean().exec(function(err, student) {
            if (err || typeof student === 'undefined' || student == null) {
               defer.resolve();
            } else {
                result.studentName = student.displayName;
                defer.resolve();
            }
        });
        return defer.promise;
    })
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    mwReq.STUDENT_ID = studentId;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetStudentWeeklyReport", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetStudentWeeklyReport: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetStudentWeeklyReport: " + JSON.stringify(mwData));
             	defer.resolve(mwData.responseValueObjects.DASHBOARD_DATA.valueObjectList);   
            }
        });
	    return defer.promise;
	}).then(function(list) {
		serializeCourseDashboardData(list);
		var headerContent = "";
		headerContent += "Student Name,"+result.studentName+"\n";
        headerContent += "Course,"+result.courseName+"\n";
        headerContent += "Exported by,"+req.user.displayName+"\n";
        headerContent += "Exported on,"+new Date()+"\n";
        exportCSV(list, headerContent, res);
	}).catch(function(err) {
		console.log("Error: ",err);
		res.send(JSON.stringify([]));
	});
}

function serializeCourseDashboardData(list) {
    list.forEach(function(item) {
        if(item['recentExams'] && item['recentExams'].length > 0) {
            var recentExamsList = item['recentExams'];
            var recentExams = "";
            recentExamsList.forEach(function(exam) {
                if(recentExams.length > 0) recentExams +="|";
                recentExams +="exams"+":"+exam.grade;
            });
            item['recentExams'] = recentExams;
        }

        if(item['practiceTests'] && item['practiceTests'].length > 0) {
            var practiceTestsList = item['practiceTests'];
            var practiceTests = "";
            practiceTestsList.forEach(function(test) {
                if(practiceTests.length > 0) practiceTests +="|";
                practiceTests +="practiceTests"+":"+test.grade;
            });
            item['practiceTests'] = practiceTests;
        }

        if(item['tickets'] && item['tickets'].length > 0) {
            var ticketsList = item['tickets'];
            var tickets = "";
            ticketsList.forEach(function(ticket) {
                if(tickets.length > 0) tickets +="|";
                tickets += ticket.elementType;
            });
            item['tickets'] = tickets;
        }

        if(item['timeSpent']) {
            var timeSpent = "";
            for(k in item['timeSpent']) {
                if(timeSpent.length > 0) timeSpent +="|";
                timeSpent += k+":"+item['timeSpent'][k];
            }
            item['timeSpent'] = timeSpent;
        }
        delete item['studentDTO'];
        delete item['studentId'];
        delete item['studentName'];
    });
}

function exportCSV(json, headerContent, res, errors) {
    var jsonCSV = require('json-csv');
    var jsonArray = json;

    var headerFields = ['offsetIndex'];
    json.forEach(function(item) {
        for(k in item) {
            if(headerFields.indexOf(k) == -1) headerFields.push(k);
        }
    });
    
    var jsonFields = [];
    for(k in headerFields) {
        jsonFields.push({name: headerFields[k], label: headerFields[k]});
    }
    var args = {
        data: jsonArray,
        fields: jsonFields
    }
    jsonCSV.toCSV(args, function(err, csv) {
        res.setHeader('Content-disposition', 'attachment; filename=student_dashboard_'+ Date.parse(new Date())+'.csv');
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Type', 'text/plain');
        if(headerContent) csv = headerContent+"\n\n"+csv;
        res.write(csv);
        if(errors) {
            res.write(JSON.stringify(errors));
        }
        res.end();
    });
}

exports.getCourseDashboardData = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = decodeURIComponent(req.params.studentId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    mwReq.STUDENT_ID = studentId;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetStudentWeeklyReport", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetStudentWeeklyReport: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetStudentWeeklyReport: " + JSON.stringify(mwData));
             	defer.resolve(mwData.responseValueObjects.DASHBOARD_DATA.valueObjectList);   
            }
        });
	    return defer.promise;
	}).then(function(list) {
		res.send(JSON.stringify(list));
	}).catch(function(err) {
		console.log("Error: ",err);
		res.send(JSON.stringify([]));
	});
}

exports.getStudentGradeCard = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = decodeURIComponent(req.params.studentId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var response = {};
    var searchCriteria = {limit: 1};
    var studentIds = [];
    var userImgMap = {};
    promise_lib.resolve()
	.then(function() {
		return getMWCourseSummary(courseId, studentId);
	}).then(function(map) {
		response = map;
		studentIds.push(studentId);
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    mwReq.SEARCH = searchCriteria;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetTopStudents", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetTopStudents: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetTopStudents: " + JSON.stringify(mwData));
                try {
	            	var topStudents = mwData.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
	         		defer.resolve(topStudents);   	
	            } catch(e) {
	            	defer.reject(e);
	            }
            }
        });
	    return defer.promise;
	}).then(function(topStudents) {
		var deferred = promise_lib.defer();
		if (topStudents && topStudents.length > 0) {
			response.topStudent = topStudents[0];
			studentIds.push(topStudents[0].studentId);
		}
		MongoHelper.find('UserModel', {identifier: {$in: studentIds}}, {identifier: 1, 'metadata.image': 1, _id: 0})
			.toArray(function(err, users) {
			if (users && users.length > 0) {
				for (var idx in users) {
					if (users[idx].metadata && users[idx].metadata.image) {
						userImgMap[users[idx].identifier] = users[idx].metadata.image;
					}
				}
			}
			deferred.resolve(userImgMap);
		});	
		return deferred.promise;
	}).then(function() {
		if (response.student) {
			if (userImgMap[response.student.studentId]) {
				response.student.image = userImgMap[response.student.studentId];
			} else {
				response.student.image = '/img/default.png';
			}
		}
		if (response.topStudent) {
			var topStudentImg = userImgMap[response.topStudent.studentId];
			if (userImgMap[response.topStudent.studentId]) {
				response.topStudent.image = userImgMap[response.topStudent.studentId];
			} else {
				response.topStudent.image = '/img/default.png';
			}
		}
		res.send(JSON.stringify(response));
	}).catch(function(err) {
		console.log("Error: ",err);
		var map = {};
		res.send(JSON.stringify(map));
	});	
}

function getMWCourseSummary(courseId, studentId) {
	var defer = promise_lib.defer();
	var MWServiceProvider = require('../../commons/MWServiceProvider');
    var mwReq = new Object();
    mwReq.COURSE_ID = courseId;
    mwReq.STUDENT_ID = studentId;
    MWServiceProvider.callServiceStandard("dashboardService", "GetStudentCourseSummary", mwReq, function(err, mwData, mwRes) {
        console.log("Request:",JSON.stringify(mwReq));
        if (err) {
            console.log("Error in Response from MW GetStudentCourseSummary: " + err);
            defer.reject(err);
        } else {
            console.log("Response from MW GetStudentCourseSummary: " + JSON.stringify(mwData));
            try {
            	var map = mwData.responseValueObjects.COURSE_SUMMARY.baseValueMap;
         		defer.resolve(map);   	
            } catch(e) {
            	defer.reject(e);
            }
        }
    });
    return defer.promise;
}

exports.getCourseSummary = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = decodeURIComponent(req.params.studentId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    promise_lib.resolve()
	.then(function() {
		return getMWCourseSummary(courseId, studentId);
	}).then(function(map) {
		res.send(JSON.stringify(map));
	}).catch(function(err) {
		console.log("Error: ",err);
		var map = {complete: 0, expected: 0};
		res.send(JSON.stringify(map));
	});	
}

exports.getLeaderBoards = function(req, res) {
	var studentId = req.user.identifier;
	var courseId;
	if (req.params.courseId) {
		courseId = decodeURIComponent(req.params.courseId);	
		if (courseId && courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
     		courseId = PlayerUtil.addFedoraPrefix(courseId);
    	}
	}
	var searchCriteria = req.body.searchCriteria;
    if (!searchCriteria) {
        searchCriteria = {};
    }
    searchCriteria.offset = 0;
    searchCriteria.limit = 5;
	var leaderboardData;
	var userImgMap = {};
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.STUDENT_ID = studentId;
	    if (courseId) {
	    	mwReq.COURSE_ID = courseId;
	    }
	    mwReq.SEARCH = searchCriteria;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetLeaderBoards", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetLeaderBoards: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetLeaderBoards: " + JSON.stringify(mwData));
             	defer.resolve(mwData);   
            }
        });
	    return defer.promise;
	}).then(function(mwData){
		leaderboardData = mwData;
		var studentIds = [];
		if (leaderboardData && leaderboardData.responseValueObjects && leaderboardData.responseValueObjects.STUDENT_INFO_LIST) {
			var studentList = leaderboardData.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
			for (var i in studentList) {
				studentIds.push(studentList[i].studentId);
			}
		}
		var deferred = promise_lib.defer();
		if (studentIds.length > 0) {
			MongoHelper.find('UserModel', {identifier: {$in: studentIds}}, {identifier: 1, 'metadata.image': 1, _id: 0})
				.toArray(function(err, users) {
				if (users && users.length > 0) {
					for (var idx in users) {
						if (users[idx].metadata && users[idx].metadata.image) {
							userImgMap[users[idx].identifier] = users[idx].metadata.image;
						}
					}
				}
				deferred.resolve(userImgMap);
			});	
		} else {
			deferred.resolve(userImgMap);
		}
		return deferred.promise;
	}).then(function(userImgMap) {
		if (leaderboardData && leaderboardData.responseValueObjects && leaderboardData.responseValueObjects.STUDENT_INFO_LIST) {
			var studentList = leaderboardData.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
			for (var i in studentList) {
				if (userImgMap[studentList[i].studentId]) {
					studentList[i].image = userImgMap[studentList[i].studentId];
				} else {
					studentList[i].image = '/img/default.png';
				}
			}
		}
		res.send(JSON.stringify(leaderboardData));
	}).catch(function(err) {
		console.log("Error: ",err);
		var map = {};
		res.send(JSON.stringify(map));
	});	
}

exports.getTopStudents = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var searchCriteria = req.body.searchCriteria;
    if (!searchCriteria) {
        searchCriteria = {};
    }
    var leaderboardData;
	var userImgMap = {};
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    mwReq.SEARCH = searchCriteria;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetTopStudents", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetTopStudents: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetTopStudents: " + JSON.stringify(mwData));
             	defer.resolve(mwData);   
            }
        });
	    return defer.promise;
	}).then(function(mwData){
		leaderboardData = mwData;
		var studentIds = [];
		if (leaderboardData && leaderboardData.responseValueObjects && leaderboardData.responseValueObjects.STUDENT_INFO_LIST) {
			var studentList = leaderboardData.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
			for (var i in studentList) {
				studentIds.push(studentList[i].studentId);
			}
		}
		var deferred = promise_lib.defer();
		if (studentIds.length > 0) {
			MongoHelper.find('UserModel', {identifier: {$in: studentIds}}, {identifier: 1, 'metadata.image': 1, _id: 0})
				.toArray(function(err, users) {
				if (users && users.length > 0) {
					for (var idx in users) {
						if (users[idx].metadata && users[idx].metadata.image) {
							userImgMap[users[idx].identifier] = users[idx].metadata.image;
						}
					}
				}
				deferred.resolve(userImgMap);
			});	
		} else {
			deferred.resolve(userImgMap);
		}
		return deferred.promise;
	}).then(function(userImgMap) {
		if (leaderboardData && leaderboardData.responseValueObjects && leaderboardData.responseValueObjects.STUDENT_INFO_LIST) {
			var studentList = leaderboardData.responseValueObjects.STUDENT_INFO_LIST.valueObjectList;
			for (var i in studentList) {
				if (userImgMap[studentList[i].studentId]) {
					studentList[i].image = userImgMap[studentList[i].studentId];
				} else {
					studentList[i].image = '/img/default.png';
				}
			}
		}
		res.send(JSON.stringify(leaderboardData));
	}).catch(function(err) {
		console.log("Error: ",err);
		var map = {};
		res.send(JSON.stringify(map));
	});	
}

exports.getTopColleges = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetTopColleges", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetTopColleges: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetTopColleges: " + JSON.stringify(mwData));
                if (mwData && mwData.responseValueObjects && mwData.responseValueObjects.COLLEGES && mwData.responseValueObjects.COLLEGES.valueObjectList) {
                	defer.resolve(mwData.responseValueObjects.COLLEGES.valueObjectList);   	
                } else {
                	defer.reject('No Top Colleges found');
                }
             	
            }
        });
	    return defer.promise;
	}).then(function(colleges){
		res.send(JSON.stringify(colleges));
	}).catch(function(err) {
		console.log("Error: ",err);
		var map = [];
		res.send(JSON.stringify(map));
	});	
}

exports.getTopStreams = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetTopStreams", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetTopStreams: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetTopStreams: " + JSON.stringify(mwData));
                if (mwData && mwData.responseValueObjects && mwData.responseValueObjects.STREAMS && mwData.responseValueObjects.STREAMS.valueObjectList) {
                	defer.resolve(mwData.responseValueObjects.STREAMS.valueObjectList);   	
                } else {
                	defer.reject('No Top Streams found');
                }
            }
        });
	    return defer.promise;
	}).then(function(streams){
		res.send(JSON.stringify(streams));
	}).catch(function(err) {
		console.log("Error: ",err);
		var map = [];
		res.send(JSON.stringify(map));
	});	
}

exports.getGradebookData = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	var studentId = decodeURIComponent(req.params.studentId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var searchCriteria = req.body.searchCriteria;
    var elementMap = {};
    promise_lib.resolve()
    .then(function() {
    	var deferred = promise_lib.defer();
    	MongoHelper.findOne('LearnerStateModel', {student_id: studentId, courseId: courseId}, function(err, lobState) {
			if (lobState) {
				elementMap = PlayerUtil.getMap(lobState.elements);
				deferred.resolve();
			} else {
				deferred.reject('Leaner State not found');
			}
		});
		return deferred.promise;
    })
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    mwReq.STUDENT_ID = studentId;
	    mwReq.SEARCH = searchCriteria;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetStudentGradebook", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetStudentGradebook: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetStudentGradebook: " + JSON.stringify(mwData));
                var result = {count: 0, grade: 0, elements: []};
                if (mwData.responseValueObjects) {
                	if (mwData.responseValueObjects.COUNT.id) {
                		result.count = mwData.responseValueObjects.COUNT.id;
                		if (mwData.responseValueObjects.GRADE.id) {
                			result.grade = mwData.responseValueObjects.GRADE.id;
                		}
                		if (mwData.responseValueObjects.GRADEBOOK.valueObjectList) {
                			result.elements = mwData.responseValueObjects.GRADEBOOK.valueObjectList;
                		}
                	}
                }
                if (result.count && result.count > 0) {
                	defer.resolve(result);   	
                } else {
                	defer.reject('Gradebook not found');
                }
            }
        });
	    return defer.promise;
	}).then(function(result) {
		if (result.elements && result.elements.length > 0) {
			for (var i=0; i<result.elements.length; i++) {
				var element = result.elements[i];
				var pathElement = elementMap[element.id.elementId];
				element.activityId = element.id.elementId;
				if (pathElement) {
					element.activityName = pathElement.name;
				}
				if (element.elementType == 'Exam') {
					element.type = 'Exam';
					if (element.missed)
						element.tickets = 'Missed this Exam';
				} else {
					element.type = 'Practice';
					if (element.missed)
						element.tickets = 'Missed this Practice';
				}
			}
		}
		res.send(JSON.stringify(result));
	}).catch(function(err) {
		console.log("Error: ",err);
		var errResult = {count: 0, grade: 0, elements: []};
		res.send(JSON.stringify(errResult));
	});
}

