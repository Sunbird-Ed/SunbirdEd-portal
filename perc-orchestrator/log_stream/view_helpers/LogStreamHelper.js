/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for LogStream capturing
 *
 * @author rayulu
 */

var promise_lib = require('when');
var logStreamDB = require('../models/logStreamDB');
var PlayerUtil = require('../../view_helpers/player/PlayerUtil');
var MWServiceProvider = require('../../commons/MWServiceProvider');

var skipURLs = ['/private/v1/interactions/actionsMetadata'];

/**
*   Get the log stream from UI and call MW API
*/
exports.saveLogStream = function(req, res) {
    var body = req.body;
    var user = req.user;
    var sessionID = req.sessionID;
    var ipAddress = req.ip;  
    var timestamp = req.query.timestamp;  
    if (body && body.length && body.length > 0 && user) {
        var logEvents = [];
        body.forEach(function(value) {
            if (value && value != null) {
                var logEvent = {};
                logEvent.sessionId = sessionID;
                logEvent.timestamp = value.timestamp;
                logEvent.userId = user.identifier;
                logEvent.role = user.roles[0];
                logEvent.environment = value.environment;
                logEvent.action = value.action;
                var objectId = value.objectId;
                if (objectId && objectId != null) {
                  objectId = decodeURIComponent(objectId);
                  if (objectId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
                      if (value.environment == 'Course' || value.environment == 'Explore') {
                          objectId = PlayerUtil.addFedoraPrefix(objectId);
                      }
                  }
                  logEvent.objectId = objectId;
                }
                logEvent.ipAddress = ipAddress;
                logEvent.external = value.external;  
                logEvent.courseId = value.courseId;
                logEvents.push(logEvent);
            }
        });
        if (logEvents.length > 0) {
            var mwReq = new Object();
            mwReq.TIMESTAMP = {"id": timestamp};
            mwReq.LOG_STREAM_EVENTS = {"valueObjectList": logEvents};
            MWServiceProvider.callServiceStandard("dashboardService", "AddLogStreamEvents", mwReq, function(err, mwData, mwRes) {
                console.log("Request:",JSON.stringify(mwReq));
                if (err) {
                    console.log("Error in Response from MW AddLogStreamEvents: " + err);
                } else {
                    console.log("Response from MW AddLogStreamEvents: " + JSON.stringify(mwData));
                }
            });
        }
    }
    var reply = {status: 'OK'};
    res.send(JSON.stringify(reply));
}

exports.flushLogStream = function(logEvents) {
    if (logEvents && logEvents.length > 0) {
        var timestamp = (new Date()).getTime();
        var mwReq = new Object();
        mwReq.TIMESTAMP = {"id": timestamp};
        mwReq.LOG_STREAM_EVENTS = {"valueObjectList": logEvents};
        MWServiceProvider.callServiceStandard("dashboardService", "AddLogStreamEvents", mwReq, function(err, mwData, mwRes) {
            console.log("flushLogStream Request:",JSON.stringify(mwReq));
            if (err) {
                console.log("Error in Response from MW AddLogStreamEvents: " + err);
            } else {
                console.log("Response from MW AddLogStreamEvents: " + JSON.stringify(mwData));
            }
        });
    }
}
