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
var client = new Client();
var errorModule = require('./ErrorModule');

// TODO handling client error events
client.on('error', function(err) {
    console.error('Something went wrong on the client', err);
});


exports.callServiceStandard = function(req, res) {
    var url = req.query.url;
    var data = req.body;
    console.log ("Middleware Req Url:"+url);
    // console.log ("Middleware Req Data:"+JSON.stringify(data));
//     console.log ("User:"+JSON.stringify(req.user));
    if (url.indexOf("&userId=") > -1 || url.indexOf("?userId=") > -1) {
        errorModule.handleError("userId specified in client request.", "ERROR_ROUTING_REQ", req, res);
        return;
    }
    /*if (req.user.uniqueId) {
        if (url.indexOf("?") > -1) {
            url += "&userId=" + req.user.uniqueId;
            // TODO set roles as well      
        } else {
            url += "?userId=" + req.user.uniqueId;
        }
    } else*/ {
        if (url.indexOf("?") > -1) {
            url += "&userId=" + req.user.identifier;
            // TODO set roles as well      
        } else {
            url += "?userId=" + req.user.identifier;
        }
    }
   if (req.user.roles) {
        url += "&userRole=" + req.user.roles;
    }
    
    // console.log ("Middleware Req:"+JSON.stringify(req.params));
    callServiceInternal(url, data, function(err, result) {
        if (err) {
           // console.log ("Middleware Resp Data:"+JSON.stringify(err));
            res.send(err);      
        } else {
           // console.log ("Middleware Resp Data:"+JSON.stringify(result));
            res.send(result);
        }
    });
};

/**
 * Calls middleware service command for the service specified with the provided request data
 * Callback is invoked when response is received
 *
 * @param url
 * @param requestData
 * @param callback
 * @param errCallback
 */
callServiceInternal = function(url, requestData, callback) {
    args = {}
    args.headers = {
        "Content-Type": "application/json"
    };
    if (!requestData) {
        requestData = {};
    }
    args.data = requestData;
    var startTime = (new Date()).getTime();
    // console.log ("Middleware Req Data:"+JSON.stringify(requestData));
    
    var startTime = (new Date()).getTime();
    client.patch(url, args, function(data, response) {
        var endTime = (new Date()).getTime();
        // LoggerUtil.logMw(process.domain, startTime, endTime, commandName);
        // LoggerUtil.log(LogLevel.DEBUG, {type: 'Response from MW', command: commandName, data: data});
        if (!data || data == null || data == '') {
            callback('Invalid response from MW', null);
        } else if(typeof data == 'string') {
            var isError = false;
            try {
                data = JSON.parse(data);
            } catch(e) {
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
        // LoggerUtil.logMw(process.domain, startTime, endTime, commandName);
        callback(err);
    });
};
