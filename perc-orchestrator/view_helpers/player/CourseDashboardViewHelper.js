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

var searchFields = [
    { "name": "name", "label": "Name", "type": "text", "operator": "like", "order": 1},
    { "name": "enrolledDate", "label": "Enrollment Date (on or before)", "type": "date", "operator": "le", "order": 2},
    { "name": "batch", "label": "Batch", "type": "multiselect", "operator": "in",
        "values": [ 
            { "name": "Batch 1", "value": "1" },
            { "name": "Batch 2", "value": "2" },
            { "name": "Batch 3", "value": "3" }
        ],
        "order": 3
    },
    { "name": "college", "label": "College", "type": "text", "operator": "like", "order": 4},
    { "name": "stream", "label": "Engineering Branch", "type": "multiselect", "operator": "in",
        "values": [
            { "name": "Computer Science", "value": "Computer Science" },
            { "name": "CSE", "value": "CSE" },
            { "name": "CS", "value": "CS" },
            { "name": "IT", "value": "IT" },
            { "name": "IS", "value": "IS" },
            { "name": "EE", "value": "EE" },
            { "name": "Electronics", "value": "ECE" },
            { "name": "Electrical", "value": "EEE" }
        ],
        "order": 5
    },
    { "name": "programStream", "label": "Program Stream", "type": "multiselect", "operator": "in",
        "values": [
            { "name": "C", "value": "C" },
            { "name": "C++", "value": "C++" },
            { "name": "C#", "value": "C#" },
            { "name": "Java", "value": "Java" }
        ],
        "order": 6
    }
];

exports.getDashboardSearchFields = function(req, res) {
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
        MWServiceProvider.callServiceStandard("dashboardService", "GetDashboardSearchFields", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetDashboardSearchFields: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetDashboardSearchFields: " + JSON.stringify(mwData));
                defer.resolve(mwData);   
            }
        });
        return defer.promise;
    }).then(function(mwData) {
        if (mwData && mwData.responseValueObjects.SEARCH_FIELDS && mwData.responseValueObjects.SEARCH_FIELDS.valueObjectList) {
            res.send(JSON.stringify(mwData.responseValueObjects.SEARCH_FIELDS.valueObjectList));
        } else {
            res.send(JSON.stringify(searchFields));
        }
    }).catch(function(err) {
        console.log("Error: ",err);
        res.send(JSON.stringify(searchFields));
    });    
};

exports.exportCourseDashboardData = function(req, res) {
    var courseId = decodeURIComponent(req.params.courseId);
    if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var result = {};
    result.count = 0;
    result.courseName = "";
    result.list = [];
    var searchCriteria = req.body.searchCriteria;
    if (!searchCriteria) {
        searchCriteria = {};
    }
    if (req.user.roles.indexOf('tutor') > -1) {
        searchCriteria.coach = req.user.identifier;
    }
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
        var MWServiceProvider = require('../../commons/MWServiceProvider');
        var mwReq = new Object();
        mwReq.COURSE_ID = courseId;
        mwReq.SEARCH = searchCriteria;
        MWServiceProvider.callServiceStandard("dashboardService", "GetCourseDashboard", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetCourseDashboard: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetCourseDashboard: " + JSON.stringify(mwData));
                result.list = mwData.responseValueObjects.DASHBOARD_DATA.valueObjectList;
                result.count = mwData.responseValueObjects.COUNT.id;
                defer.resolve(result);   
            }
        });
        return defer.promise;
    }).then(function(list) {
        serializeCourseDashboardData(list.list);
        var headerContent = "";
        headerContent += "Course,"+list.courseName+"\n";
        headerContent += "Exported by,"+req.user.displayName+"\n";
        headerContent += "Exported on,"+new Date()+"\n";
        headerContent += "Total rows,"+list.count+"\n";
        exportCSV(list.list, headerContent, res);
    }).catch(function(err) {
        console.log("Error: ",err);
        res.send(JSON.stringify([]));
    });
}

exports.getCourseGradebookDetails = function(req, res) {
    var courseId = decodeURIComponent(req.params.courseId);
    if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var result = {};

    if (req.user.roles.indexOf('tutor') > -1) {
        searchCriteria.coach = req.user.identifier;
    }
    var user = req.user;
    promise_lib.resolve()
    .then(function() {
        return fetchCourseGradebookReports(courseId);
    })
    .then(function(reports) {
        if(reports && reports.length > 0) {
            return reports;
        } else {
            var report = { "name": "Gradebook report", "createdBy": user.identifier, "createdName": user.displayName};
            return generateCourseGradebook(courseId, report);
        }
    })
    .then(function(reports) {
        result.status = "SUCCESS";
        result.data = reports;
        res.send(JSON.stringify(result));
    }).catch(function(err) {
        console.log("Error: ",err);
        result.status = "ERROR";
        res.send(JSON.stringify(result));
    });
}

exports.generateCourseGradebook = function(req, res) {
    var courseId = decodeURIComponent(req.params.courseId);
    if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var result = {};
    var user = req.user;
    var report = { "name": "Gradebook report", "createdBy": user.identifier, "createdName": user.displayName};

    promise_lib.resolve()
    .then(function() {
       return generateCourseGradebook(courseId, report);
    })
    .then(function(data) {
        result.status = "SUCCESS";
        result.data = data;
        res.send(JSON.stringify(result));
    }).catch(function(err) {
        console.log("Error: ",err);
        result.status = "ERROR";
        res.send(JSON.stringify(result));
    });
}

function fetchCourseGradebookReports(courseId) {
    var defer = promise_lib.defer();
    ReportModel = mongoose.model('ReportModel')
    ReportModel.find({"courseId": courseId, "type": "GRADE_BOOK"}).sort({createdDate: -1}).lean().exec(function(err, reports) {
        if(err) {
            defer.reject("Error while fetching report info:"+err);
        } else if(reports) {
            defer.resolve(reports);
        } else {
            defer.resolve();
        }
    });
    return defer.promise;
}

function generateCourseGradebook(courseId, report) {
    var defer = promise_lib.defer();
    ReportModel = mongoose.model('ReportModel')
    
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        var MWServiceProvider = require('../../commons/MWServiceProvider');
        var mwReq = new Object();
        mwReq.COURSE_ID = courseId;
        mwReq.REPORT = report;
        MWServiceProvider.callServiceStandard("dashboardService", "GenerateCourseGradebook", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GenerateCourseGradebook: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GenerateCourseGradebook: " + JSON.stringify(mwData));
                if(mwData.responseValueObjects.REPORT.id)
                    defer.resolve(mwData.responseValueObjects.REPORT.id);
                else 
                    defer.reject("Error while generating course gradebook");
            }
        });
        return defer.promise;
    })
    .then(function() {
        return fetchCourseGradebookReports(courseId);
    })
    .then(function(reports) {
        defer.resolve(reports);
    })
    .catch(function(err) {
        defer.reject(err);
    });
    return defer.promise;
}

function serializeCourseDashboardData(list) {
    list.forEach(function(item) {
        if(item['recentExams'] && item['recentExams'].length > 0) {
            var recentExamsList = item['recentExams'];
            var recentExams = "";
            recentExamsList.forEach(function(exam) {
                if(recentExams.length > 0) recentExams +="|";
                recentExams +=exam.elementType+":"+exam.grade;
            });
            item['recentExams'] = recentExams;
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

        if(item['studentDTO']) {
            var student = item['studentDTO'];
            item.email = student.email;
            item.degree = student.degree;
            item.stream = student.stream;
            item.college = student.college;
            item.yearOfGraduation = student.yearOfGraduation;
            item.programStream = student.programStream;
            item.registrationNumber = student.registrationNumber;
            delete item['studentDTO'];
        }
        delete item['practiceTests'];
    });
}

function exportCSV(json, headerContent, res, errors) {
    var jsonCSV = require('json-csv');
    var jsonArray = json;

    var headerFields = [];
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
        res.setHeader('Content-disposition', 'attachment; filename=dashboard_'+ Date.parse(new Date())+'.csv');
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
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var result = {};
    result.count = 0;
    result.list = [];
    var searchCriteria = req.body.searchCriteria;
    if (!searchCriteria) {
        searchCriteria = {};
    }
    if (req.user.roles.indexOf('tutor') > -1) {
        searchCriteria.coach = req.user.identifier;
    }
    promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
	    mwReq.SEARCH = searchCriteria;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetCourseDashboard", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetCourseDashboard: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetCourseDashboard: " + JSON.stringify(mwData));
                result.list = mwData.responseValueObjects.DASHBOARD_DATA.valueObjectList;
                result.count = mwData.responseValueObjects.COUNT.id;
             	defer.resolve(result);   
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

exports.getCourseSummaryData = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	if (courseId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        courseId = PlayerUtil.addFedoraPrefix(courseId);
    }
    var searchCriteria = req.body.searchCriteria;
    if (!searchCriteria) {
        searchCriteria = {};
    }
    if (req.user.roles.indexOf('tutor') > -1) {
        searchCriteria.coach = req.user.identifier;
    }
    promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		var MWServiceProvider = require('../../commons/MWServiceProvider');
	    var mwReq = new Object();
	    mwReq.COURSE_ID = courseId;
        mwReq.SEARCH = searchCriteria;
	    MWServiceProvider.callServiceStandard("dashboardService", "GetCourseSummaryGraphs", mwReq, function(err, mwData, mwRes) {
            console.log("Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW GetCourseSummaryGraphs: " + err);
                defer.reject(err);
            } else {
                console.log("Response from MW GetCourseSummaryGraphs: " + JSON.stringify(mwData));
             	defer.resolve(mwData.responseValueObjects.COURSE_GRAPHS.baseValueMap);   
            }
        });
	    return defer.promise;
	}).then(function(map) {
		var summary = {};
		summary['Attendance'] = [];
		summary['Attendance'].push(['Attendance', 'Students'])
		var attData = map.Attendance.baseValueMap;
		for (var key in attData) {
			summary['Attendance'].push([key, attData[key]]);
		}

		summary['Performance'] = [];
		summary['Performance'].push(['Grade', 'Students'])
		var attData = map.Performance.baseValueMap;
		for (var key in attData) {
			summary['Performance'].push([key, attData[key]]);
		}

		summary['Engagement'] = [];
		summary['Engagement'].push(['Engagement Index', 'Students'])
		var attData = map.Engagement.baseValueMap;
		for (var key in attData) {
			summary['Engagement'].push([key, attData[key]]);
		}
		res.send(JSON.stringify(summary));
	}).catch(function(err) {
		console.log("Error: ",err);
		res.send(JSON.stringify({}));
	});
}




