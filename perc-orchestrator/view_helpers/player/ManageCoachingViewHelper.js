/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Manage Coaching
 *
 * @author shreekant
 */

var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var IDCacheUtil = require('../../commons/IDCacheUtil');

exports.getCoachingSession = function(req, res) {
    var errors = [];
    var coachingSessionList = [];
   // console.log("req params : ", req.params);
    promise_lib.resolve()
    .then(function(){
        var defer = promise_lib.defer();
        var LearningResourceModel = mongoose.model('LearningResourceModel');
        LearningResourceModel.find({"metadata.elementType" : ViewHelperConstants.CLASSROOM, 
            "metadata.instructionUsage" : "coaching", "createdBy" : req.user.identifier, "courseId":req.params.courseId}).sort({_id: -1}).exec(function(err, sessions) {
            console.log("Number of Coaching Sessions found : "+ sessions.length);
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(sessions);
            }
        });
        return defer.promise;   
    })
    .then(function(sessions) {
        var sessionIdsArray = [];
        sessions.forEach(function(sessionObj) {
            sessionIdsArray.push(sessionObj.identifier);
        });
        var defer = promise_lib.defer();
        var EventModel = mongoose.model('EventModel');
        EventModel.find({objectId : {$in : sessionIdsArray}}).exec(function(err, data) {
           console.log("Number of Coaching Sessions events found : "+ data.length);
           if (err) {
                defer.reject(err);
            } else {
                  sessions.forEach(function(sessionObj) {
                    var eventList = [];
                    data.forEach(function(element) {
                        if(element.objectId == sessionObj.identifier) {
                            eventList.push(element);
                        }
                    });

                    var item = {"sessions":sessionObj, "sessionEvents":eventList};
                    coachingSessionList.push(item);
                });
                defer.resolve(coachingSessionList);
            }
        });
        return defer.promise; 
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(coachingSessionList) {
        if(errors.length > 0) {
            console.log("Error cacheing coaching session list : " + err);
            res.send("Update cache failed : " + err);
        } else {
            res.send(coachingSessionList);
        }
    });
};

exports.getCoachingSessionDetails = function(req, res) {
    var errors = [];
    var sessionId = decodeURIComponent(req.params.sessionId);
    if (sessionId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        sessionId = PlayerUtil.addFedoraPrefix(sessionId);    
    }
    promise_lib.resolve()
    .then(function(){
        var defer = promise_lib.defer();
        var LearningResourceModel = mongoose.model('LearningResourceModel');
        LearningResourceModel.findOne({"identifier" : sessionId, "createdBy" : req.user.identifier}).exec(function(err, session) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(session);
            }
        });
        return defer.promise;   
    })
    .then(function(session) {
        var defer = promise_lib.defer();
        var EventModel = mongoose.model('EventModel');
        EventModel.find({objectId : session.identifier}).exec(function(err, data) {
           console.log("Number of Coaching Sessions events found : "+ data.length);
           if (err || !data) {
                defer.reject(err);
            } else {
                var item = {"sessions":session, "sessionEvents":data};
                defer.resolve(item);
            }
        });
        return defer.promise; 
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(item) {
        if(errors.length > 0) {
            console.log("Error cacheing coaching session list : " + err);
            res.send("Update cache failed : " + err);
        } else {            
            res.send(item);
        }
    });
}

exports.getEnvitedUserDetails = function(req, res) {
    var errors = [];
    console.log("params : ", req.body);
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        var UserModel = mongoose.model('UserModel');
        UserModel.find({identifier : {$in : req.body.param.userIdsArray}}, {identifier: 1, displayName: 1, _id:0}).exec(function(err, userData) {
           console.log("Number of Coaching Sessions event users found : "+ userData.length);
           if (err) {
                defer.reject(err);
            } else {
                defer.resolve(userData);
            }
        });
        return defer.promise;
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(userData) {
        if(errors.length > 0) {
            console.log("Error cacheing coaching session invited user list : " + err);
            res.send("Update cache failed : " + err);
        } else {
            res.send(userData);
        }
    });
};


exports.getAllEventsOfCoachingSession = function(req, res) {
    var errors = [];
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        var EventModel = mongoose.model('EventModel');
        EventModel.find({objectId : req.body.params.sessionId}).exec(function(err, data) {
            console.log("Number of Coaching Sessions events found : "+ data.length);
           if (err) {
                defer.reject(err);
            } else {
                defer.resolve(data);
            }
        });
        return defer.promise; 
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(data) {
        if(errors.length > 0) {
            console.log("Error cacheing coaching session events list : " + err);
            res.send("Update cache failed : " + err);
        } else {
            res.send(data);
        }
    });
};


exports.createCoachingSession = function(req, res) {

};


exports.addEventIntoCoachingSession = function(req, res) {

};

