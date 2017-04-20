/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Gmail API wrappers for ilimi
 * @author abhinav
 */

var oauth = require('./gmailOAuthWrappers.js');
var google = require('googleapis');
var gmail = google.gmail('v1');
var oauth2 = google.oauth2('v1');
var promise_lib = require('when');
var nodefn = require('when/node');
var http = require('http');
var uuid = require('node-uuid');
var helper = require('./gmailHelpers.js');
var request = require('request');
var partly = require('partly');

var authclient = new google.auth.OAuth2(appConfig.GMAIL_CLIENT_ID, appConfig.GMAIL_CLIENT_SECRET, appConfig.GMAIL_REDIRECT_URI);
var mongoose = require('mongoose');
var logModel = mongoose.model('logModel');



/**
 * Generic function to invoke a gmail API
 * @param  {String} inboxId mailbox id
 * @param  {Function} gmailFn Gmail api function
 * @param  {Object} params  Parameters for the api
 * @return {Object}         Result object
 */
function executeAPI(inboxId, gmailFn, params) {
	var defer = promise_lib.defer();
    authclient.setCredentials(InteractionCache.getAccessToken(inboxId));
	params.auth = authclient;
    var beforeToken = authclient.credentials.access_token;
	nodefn.lift(gmailFn)(params)
	.catch(function(e) {
        defer.reject(e);
    })
    .done(function(result) {
        console.log('Before token:', beforeToken, 'afterToken:', authclient.credentials.access_token, 'ExpiryDate', authclient.credentials.expiry_date);
    	var data = null;
    	if(result && result[0]) {
    		data = result[0];
    	}
        defer.resolve(data);
    });
	return defer.promise;
}

/**
 * Function to get a single message id from gmail
 * @param  {String} inboxId   Email address
 * @param  {String} messageId Message id
 * @return {String}           Message JSON
 */
exports.getUserInfo = function(inboxId) {

    var params = {userId: inboxId};
    var defer = promise_lib.defer();
    executeAPI(inboxId, oauth2.userinfo.get, params)
    .then(function(data) {
        if(data != null && data.email == inboxId) {
            defer.resolve()
        } else {
            defer.reject('Tokens are not valid');
        }
    })
    .catch(function(err) {defer.reject(err)}).done();
    return defer.promise;
}

/**
 * Function to get a single message id from gmail
 * @param  {String} inboxId   Email address
 * @param  {String} messageId Message id
 * @return {String}           Message JSON
 */
exports.getMessage = function(inboxId, messageId) {

	var params = {userId: inboxId, id: messageId, fields: 'id,payload(body/data)'};
	var defer = promise_lib.defer();
	executeAPI(inboxId, gmail.users.messages.get, params)
    .then(function(data) {
    	var retData = null;
    	if(data != null) {
    		retData = {messageId: data.id, data:authclient.decodeBase64(data.payload.body.data)};
    	}
        defer.resolve(retData);
    })
    .catch(function(err) {defer.reject(err)}).done();
    return defer.promise;
}

/**
 * List all Messages that satisfy the query
 * query 	{object}
 * return  map
 */
exports.getMessageIds = function(inboxId, query, labelIds, maxResults, pageToken) {

	var params = {userId: inboxId};
	if(query)
		params.q = query;
	if(labelIds)
		params.labelIds = labelIds;
	if(labelIds)
		params.maxResults = maxResults;
	if(pageToken)
		params.pageToken = pageToken;

    var defer = promise_lib.defer();
    executeAPI(inboxId, gmail.users.messages.list, params)
    .then(function(data) {
        defer.resolve(data);
    })
    .catch(function(err) {defer.reject(err)}).done();
    return defer.promise;
}




/**
 * Set a label on a message
 * messageId String
 * return  void
 */
exports.setLabel = function(inboxId, messageId, label) {
	var defer = promise_lib.defer();
    var params = {userId: 'me', id: messageId, resource:{addLabelIds:[label]}};
    var defer = promise_lib.defer();
    executeAPI(inboxId, gmail.users.messages.modify, params)
    .then(function(data) {
        defer.resolve(data);
    })
    .catch(function(err) {defer.reject(err)}).done();
    return defer.promise;
}

exports.listLabels = function(inboxId) {
    var defer = promise_lib.defer();
    var params = {userId: 'me'};
    var defer = promise_lib.defer();
    executeAPI(inboxId, gmail.users.labels.list, params)
    .then(function(data) {
        defer.resolve(data);
    })
    .catch(function(err) {defer.reject(err)}).done();
    return defer.promise;
}

/**
 * Get the thread in which a message belongs
 * messageId String
 * return  object
 */
exports.getThread = function(inboxId, threadId) {
    var defer = promise_lib.defer();
    var params = {userId: inboxId, id: threadId, fields: 'id, messages(id,payload/body/data)'};
    var defer = promise_lib.defer();
    executeAPI(inboxId, gmail.users.threads.get, params)
    .then(function(data) {
        var retData = null;
    	if(data != null) {
    		retData = {threadId: data.id};
    		retData.messages = [];
    		data.messages.forEach(function(msg) {
    			retData.messages.push({messageId: msg.id, data: authclient.decodeBase64(msg.payload.body.data)});
    		});
    	}
        defer.resolve(retData);
    })
    .catch(function(err) {defer.reject(err)}).done();
    return defer.promise;
}

exports.listMessagesFromHistory = function(inboxId, historyId, maxResults){
    var inboxId = 'riodeuno@gmail.com';
    var failcount  = 0;
    var successcount = 0;
    executeAPI(inboxId, gmail.users.history.list, {userId: 'me', startHistoryId: '1279999'})
    .catch(function(e){
        console.log(e);
    })
    .then(function(data){
        var body = [];
        var boundary = uuid.v4();
        //LoggerUtil.log(LogLevel.DEBUG, data);
        var messageIds = [];
        data.history.forEach(function(item){
            messageIds = messageIds.concat(item.messages.map(function(message){
                return message.id;
            }));
        });
        messageIds = messageIds.reduce(function(prev, next) {
            if (prev.indexOf(next) < 0) prev.push(next);
            return prev;
        }, []);
        console.log("Getting "+messageIds.length+" Messages");
        
        body.push.apply(body, messageIds.map(function(messageId){
            return getMessageBody(messageId, '--'+ boundary);
        }));

        body.push('--' + boundary + '--');
        //LoggerUtil.log(LogLevel.DEBUG, body);

        request(
            {
                method: 'POST',
                uri: 'https://www.googleapis.com/batch',
                headers: {
                    'Content-Type': 'multipart/mixed; boundary=' + boundary,
                    'Authorization': 'Bearer ' + authclient.credentials.access_token
                },
                body: body.join('\r\n')
            }, function(error, response, body) {
                //LoggerUtil.log(LogLevel.DEBUG, response);
                //LoggerUtil.log(LogLevel.DEBUG, body);
                if (response.statusCode == 201 || response.statusCode == 404 || response.statusCode == 401 || response.statusCode == 400) {
                    console.log("Failed :: "+ response.statusCode + " #"+ ++failcount);
                } else {
                    var respBoundary = body.split('\n')[0].trim();
                    respBoundary = respBoundary.substr(2, respBoundary.length);
                    var parts = partly.Multipart.decode(body, respBoundary);
                    var msgs = [];
                    parts.forEach(function(part) {
                        var data = eval('(' + part.Body.substr(part.Body.indexOf('{'), part.Body.length) + ')');
                        LoggerUtil.log(LogLevel.DEBUG, data);
                        //msgs.push({messageId: data.id, labelIds: data.labelIds, metadata : data.headers, data: authclient.decodeBase64(data.payload.body.data)});
                        console.log("Success :: "+ response.statusCode + " #"+ ++successcount);
                    });
                }
            }
        )
    })
}
/**
 * List all threads that satify the query
 * query 	{object}
 * return  map
 */
exports.listThreads = function(inboxId, query, labelIds, maxResults, pageToken) {
    var params = {userId : inboxId};
    params.q = (query)? query : undefined;
    params.labelIds = (labelIds)? labelIds : undefined;
    params.maxResults = (maxResults)? maxResults : undefined;
    params.pageToken = (pageToken)? pageToken : undefined;
    var totaltime = 0;
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function(){
        var time = Date.now();
        var defer = promise_lib.defer();
        executeAPI(inboxId, gmail.users.threads.list, params)
       .then(function(data) {
            time = Date.now() - time;
            totaltime += time;
            //logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'listTime' : time, 'statusList': 'success'}}).exec();
            defer.resolve(data.threads);
        })
        .catch(function(err) {
            defer.reject(err)
            //logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'statusList' : 'fail'}}).exec();
        })
        .done();
        return defer.promise;
    }).then(function(threads) {
        var defer = promise_lib.defer();
        var time = Date.now();
        var boundary = uuid.v4();
        var body = [];
        threads.forEach(function(msg) {
            body.push(getThreadRequestBody(msg.id, '--' + boundary));
        });
        body.push('--' + boundary + '--');
        request({
            method: 'POST',
            uri: 'https://www.googleapis.com/batch',
            headers: {
                'Content-Type': 'multipart/mixed; boundary=' + boundary,
                'Authorization': 'Bearer ' + authclient.credentials.access_token
            },
            body: body.join('\r\n')
        }, function(error, response, body) {
            if(error)
                //logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'statusMessage' : 'fail'}}).exec();

            time = Date.now() - time;
            totaltime += time;
            //logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'messageTime' : time, 'statusMessage': 'success'}}).exec();
            LoggerUtil.log(LogLevel.DEBUG, body);
            if (response.statusCode == 201) {
                defer.reject(body);
                //logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'statusMessage' : 'fail'}}).exec();
            } else {
                var respBoundary = body.split('\n')[0].trim();
                respBoundary = respBoundary.substr(2, respBoundary.length);
                console.log('respBoundary:', respBoundary);
                var parts = partly.Multipart.decode(body, respBoundary);
                var msgs = [];
                parts.forEach(function(part) {
                    var data = eval('(' + part.Body.substr(part.Body.indexOf('{'), part.Body.length) + ')');
                    data.messages.forEach(function(msg) {          
                        msgs.push({messageId: msg.id, labelIds: msg.labelIds, metadata: msg.payload.headers, data: authclient.decodeBase64(msg.payload.body.data)});
                    })
                    //msgs.push(eval('(' + authclient.decodeBase64(data.payload.body.data) + ')')); // This is to convert to JSON object
                });
                defer.resolve(msgs);
            }
        });
        return defer.promise;
    })
    .then(function(msgs) {
        deferred.resolve(msgs);
    })
    .catch(function(err) {
        //logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'statusMessage' : 'fail'}}).exec();
        deferred.reject(err);
    })
    .done(function(){
        logModel.findOneAndUpdate({'id' : 1}, {$addToSet : {'totalTime' : totaltime}}).exec();
    });
    return deferred.promise;
}

/**
 * List all Messages that satisfy the query
 * query 	{object}
 * return  map
 */
exports.getMessages = function(inboxId, query, labelIds, maxResults, pageToken) {

	var params = {userId: inboxId};
	if(query)
		params.q = query;
	if(labelIds)
		params.labelIds = labelIds;
	if(labelIds)
		params.maxResults = maxResults;
	if(pageToken)
		params.pageToken = pageToken;

    var deferred = promise_lib.defer();
    promise_lib.resolve()
        .then(function() {
            var defer = promise_lib.defer();
		    executeAPI(inboxId, gmail.users.messages.list, params)
		    .then(function(data) {
		        defer.resolve(data.messages);
		    })
		    .catch(function(err) {defer.reject(err)}).done();
		    return defer.promise;
        })
        .then(function(messages) {
        	//TODO: Refactor this part and make it generic for any query
            var defer = promise_lib.defer();
            var boundary = uuid.v4();
            var body = [];
            messages.forEach(function(msg) {
                body.push(getMessageBody(msg.id, '--' + boundary));
            });
            body.push('--' + boundary + '--');
            request({
                method: 'POST',
                uri: 'https://www.googleapis.com/batch',
                headers: {
                    'Content-Type': 'multipart/mixed; boundary=' + boundary,
                    'Authorization': 'Bearer ' + authclient.credentials.access_token
                },
                body: body.join('\r\n')
            }, function(error, response, body) {
            	LoggerUtil.log(LogLevel.DEBUG, body);
                if (response.statusCode == 201) {
                    defer.reject(body);
                } else {
                    var respBoundary = body.split('\n')[0].trim();
                    respBoundary = respBoundary.substr(2, respBoundary.length);
                    console.log('respBoundary:', respBoundary);
                    var parts = partly.Multipart.decode(body, respBoundary);
                    var msgs = [];
                    parts.forEach(function(part) {
                        var data = eval('(' + part.Body.substr(part.Body.indexOf('{'), part.Body.length) + ')');
                        msgs.push({messageId: data.id, labelIds: data.labelIds, metadata : data.headers, data: authclient.decodeBase64(data.payload.body.data)});
                        //msgs.push(eval('(' + authclient.decodeBase64(data.payload.body.data) + ')')); // This is to convert to JSON object
                    });
                    defer.resolve(msgs);
                }
            });
            return defer.promise;
        })
        .then(function(msgs) {
            deferred.resolve(msgs);
        })
        .catch(function(err) {
            deferred.reject(err);
        })
        .done();
    return deferred.promise;
}

function getMessageBody(messageId, boundary) {
    var payload = '\r\n' + boundary + '\r\n';
    payload += 'Content-Type: application/http\r\n';
    payload += 'Content-ID: ' + messageId + '\r\n\r\n';
    payload += 'GET /gmail/v1/users/me/messages/' + messageId + '?fields=id,labelIds,payload(headers,body/data) HTTP/1.1\r\n';
    payload += 'Host: www.googleapis.com\r\n';
    return payload;
}

function getThreadRequestBody(threadId, boundary){
    var payload = '\r\n' + boundary + '\r\n';
    payload += 'Content-Type: application/http\r\n';
    payload += 'Content-ID: ' + threadId + '\r\n\r\n';
    payload += 'GET /gmail/v1/users/me/threads/' + threadId + '?fields=messages(id,labelIds,payload) HTTP/1.1\r\n';
    payload += 'Host: www.googleapis.com\r\n';
    return payload;   
}
