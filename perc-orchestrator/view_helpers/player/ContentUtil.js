/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Content Utility Helper
 *
 * @author rayulu
 */
 var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var PlayerUtil = require('./PlayerUtil');

var Client = require('node-rest-client').Client;
var client = new Client();
client.on('error', function(err) {
    console.error('Something went wrong on the client', err);
});

exports.getInterceptionContent = function(req, res) {
	LoggerUtil.setOperationName('getInterceptionContent');
	var contentId = decodeURIComponent(req.params.contentId);
	if (contentId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
		contentId = PlayerUtil.addFedoraPrefix(contentId);
	}
	var mediaContent;
	var interception = {};
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('MediaContentModel', {identifier: contentId}, function(err, content) {
			if (err) {
				defer.reject(err);
			} else {
				if (content && content.media && content.media.length > 0) {
					defer.resolve(content);
				} else {
					defer.reject('Content object not found');
				}
			}
		});
		return defer.promise;
	}).then(function(content) {
		var defer = promise_lib.defer();
		mediaContent = content;
		interception.contentType = mediaContent.contentType;
		interception.contentSubType = mediaContent.contentSubType;
		interception.metadata = mediaContent.metadata;
		if (interception.contentSubType == 'program') {
			interception.programAnswer = mediaContent.metadata.programAnswer;
			interception.programTemplate = mediaContent.metadata.programTemplate;
		}
		var mediaObj;
		for (var i=0; i<mediaContent.media.length; i++) {
			var obj = mediaContent.media[i];
			if (obj.isMain && obj.isMain == true) {
				mediaObj = obj;
			}
		}
		if (mediaObj) {
			interception.mediaType = mediaObj.mediaType;
			interception.mediaUrl = mediaObj.mediaUrl;
			interception.mimeType = mediaObj.mimeType;
// 			if (interception.mediaType == 'mcq') {
// 				var args = {};
// 				client.get(interception.mediaUrl, args, function(data, response) {
// 					data = data.replace(/\n/g,'').replace(/\t/g,'').replace(/\r/g,'');
// 					interception.quiz = data;
// 			    	defer.resolve(interception);
// 			    }).on('error', function(err) {
// 			    	defer.reject(err);
// 			    });
// 			} else 
			if (interception.mediaType == 'text') {
				var args = {};
				client.get(interception.mediaUrl, args, function(data, response) {
					interception.textData = data;
			    	defer.resolve(interception);
			    }).on('error', function(err) {
			    	defer.reject(err);
			    });
			} else {
				defer.resolve(interception);
			}
		} else {
			defer.reject('Media not found');
		}
		return defer.promise;
	}).then(function() {
		res.send(JSON.stringify(interception));
	}).catch(function(err) {
		console.log("Error: " + err);
		res.send("");
	}).done();
};


exports.streamURL = function(req, res) {
	LoggerUtil.setOperationName('streamURL');
 	var url = decodeURIComponent(req.params.url);
 	var args = {};
	client.get(url, args, function(data, response) {
		res.send(JSON.stringify(data));
    }).on('error', function(err) {
    	res.send('error');
    });
 };
