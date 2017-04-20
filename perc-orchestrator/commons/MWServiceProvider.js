/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Used to provide Middleware Services.
 * This can perform middleware client side service routing function.
 *
 * @author ravitejagarlapati
 */
var Client = require('node-rest-client').Client;
var shortId = require('shortid');
var client = new Client();
var serviceBaseUrl = appConfig.ONTOLOGY_SERVICE + '/ont-mgr/';
var intServiceBaseUrl = appConfig.INTERACTIONS_SERVICE + '/int-mgr/';
var learnerServiceBaseUrl = appConfig.LEARNER_INFO_SERVICE + '/learner-info-mgr/';
var assessmentServiceBaseUrl = appConfig.ASSESSMENTS_SERVICE + '/assessment-service/';
var dashboardServiceBaseUrl = appConfig.DASHBOARD_SERVICE + '/dashboard-mgr/';
var commandBaseUrl = 'v1/cmd/exec/';

// TODO handling client error events
client.on('error', function(err) {
    console.error('Something went wrong on the client', err);
});

/**
 * Calls middleware service command for the service specified with the provided request data
 * Callback is invoked when response is received
 * This is deprecated. Use callServiceStandard
 *
 * @param serviceName
 * @param commandName
 * @param requestData
 * @param callback
 * @param errCallback
 */
exports.callService = function(serviceName, commandName, requestData, callback, errCallback) {
    args = {}
    args.headers = {
        "Content-Type": "application/json"
    };
    if (!requestData) {
        requestData = {};
    }
    args.data = requestData;
    var url = serviceBaseUrl + commandBaseUrl + commandName;
    console.log(url);
    var startTime = (new Date()).getTime();
    client.patch(url, args, function(data, response) {
        var endTime = (new Date()).getTime();
        LoggerUtil.logMw(process.domain, startTime, endTime, commandName);
        callback(data, response);
        console.log("Data:" + JSON.stringify(data));
    }).on('error', function(err) {
        process.domain.logObject.status = 'Error';
        var endTime = (new Date()).getTime();
        LoggerUtil.logMw(process.domain, startTime, endTime, commandName);
        if (!errCallback) {
            console.log('something went wrong on the request', err.request.options);
        } else {
            errCallback(err);
        }
    });
};

/**
 * Calls middleware service command for the service specified with the provided request data
 * Callback is invoked when response is received
 *
 * @param serviceName
 * @param commandName
 * @param requestData
 * @param callback
 * @param errCallback
 */
exports.callServiceStandard = function(serviceName, commandName, requestData, callback) {
    exports.callServiceStandardWithUser(serviceName, commandName, requestData, null, callback);
};

/**
 * Calls middleware service command for the service specified with the provided request data
 * Callback is invoked when response is received
 *
 * @param serviceName
 * @param commandName
 * @param requestData
 * @param callback
 * @param errCallback
 */
exports.callServiceStandardWithUser = function(serviceName, commandName, requestData, user, callback) {
    args = {}
    args.headers = {
        "Content-Type": "application/json"
    };
    if (!requestData) {
        requestData = {};
    }
    args.data = requestData;
    var url = serviceBaseUrl + commandBaseUrl + commandName;
    if (serviceName == 'interactionService') {
        url = intServiceBaseUrl + commandBaseUrl + commandName;
    } else if (serviceName == 'learnerService') {
        url = learnerServiceBaseUrl + commandBaseUrl + commandName;
    } else if (serviceName == 'assessmentService') {
        url = assessmentServiceBaseUrl + commandBaseUrl + commandName;
    } else if (serviceName == 'dashboardService') {
        url = dashboardServiceBaseUrl + commandBaseUrl + commandName;
    }

    // TODO - implement inter process authentication

    if (!user) {
        var user = {};
        user.local = {};
        user.local.email = "Orchestrator";
        user.identifier = "Orchestrator";
        user.uniqueId = "Orchestrator";
    }
    //console.log("user: " + JSON.stringify(user));
    if (user && user.uniqueId) {
        if (url.indexOf("?") > -1) {
            url += "&userId=" + user.uniqueId;
            // TODO set roles as well
        } else {
            url += "?userId=" + user.uniqueId;
        }
    } else if (user && user.identifier) {
        if (url.indexOf("?") > -1) {
            url += "&userId=" + user.identifier;
            // TODO set roles as well
        } else {
            url += "?userId=" + user.identifier;
        }
    }
    if (user.roles) {
        url += "&userRole=" + user.roles;
    }


    var transactionId = 'mw_req_' + shortId.generate();
    LoggerUtil.logMwReq(serviceName, commandName, requestData, transactionId);
    var startTime = (new Date()).getTime();
    client.patch(url, args, function(data, response) {
        var endTime = (new Date()).getTime();
        LoggerUtil.logMwRes(serviceName, commandName, data, transactionId, (endTime - startTime));
        if (!data || data == null || data == '') {
            callback('Invalid response from MW', null);
        } else if (typeof data == 'string') {
            var isError = false;
            try {
                data = JSON.parse(data);
            } catch (e) {
                isError = true;
            }
            if (isError) {
                callback(data, null);
            } else {
                callback(null, data);
            }
        } else {
            callback(null, data);
        }
    }).on('error', function(err) {
        process.domain.logObject.status = 'Error';
        var endTime = (new Date()).getTime();
        LoggerUtil.logMwErr(serviceName, commandName, err, transactionId, (endTime - startTime));
        callback(err);
    });
};

exports.registerMWCommands = function(requestData, callback) {
    args = {}
    args.headers = {
        "Content-Type": "application/json"
    };
    if (!requestData) {
        requestData = {};
    }
    args.data = requestData;
    var url = serviceBaseUrl + 'v1/cmd/registerAllCommands';
    client.patch(url, args, function(data, response) {
        callback(null, data, response);
    }).on('error', function(err) {
        callback(err);
    });
};
