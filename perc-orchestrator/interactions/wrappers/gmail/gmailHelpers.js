/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Gmail OAuth API wrappers for ilimi
 * @author abhinav
 */
var mongoose = require('mongoose');
var promise_lib = require('when');
var gmail = require('./gmailWrapper');
var interactionService = require('../../services/InteractionService.js');

exports.saveTokens = function(email, tokens){
	GoogleAccessToken = mongoose.model('GoogleAccessToken');
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MongoHelper.findOne('GoogleAccessToken', {email_id: email}, function(err, existingTokens) {
			defer.resolve(existingTokens);
		});
		return defer.promise;
	})
	.then(function(exisTokens) {
		var defer = promise_lib.defer();
		if(exisTokens) {
			if(!tokens.refresh_token) {
				tokens.refresh_token = exisTokens.tokens.refresh_token;
			}
			MongoHelper.update('GoogleAccessToken', {email_id: email}, {$set: {tokens: tokens}}, function(err, count) {
				console.log('GoogleAccessToken updated records - ', count);
				if(err) {
					defer.reject(err);
				} else {
					defer.resolve();
				}
			});
		} else {
			var accessToken = new GoogleAccessToken();
			accessToken.email_id = email;
			accessToken.tokens = tokens;
			accessToken.save(function(err, obj) {
				if(err) {
					defer.reject(err);
				} else {
					defer.resolve();
				}
			});
		}
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		interactionService.saveTokens(email, tokens).then(function(response){
			console.log(response);
			defer.resolve();
		}).catch(function(e){
			console.log(e);
			defer.reject(e);
		});
		return defer.promise;
	})
	.catch(function(err) {
		console.log('Error saving tokens', err);
	}).done();
};

exports.getAllInboxes = function() {
	GoogleAccessToken = mongoose.model('GoogleAccessToken');
	return promise_lib(GoogleAccessToken.find({type: {$exists: false}}).exec());
}

exports.getTokens = function(email){
	GoogleAccessToken = mongoose.model('GoogleAccessToken');
	return promise_lib(GoogleAccessToken.findOne({'email_id': email}, 'tokens').exec());
}

exports.getLabel = function(email, labelName){
	GoogleAccessToken = mongoose.model('GoogleAccessToken');
	return promise_lib(GoogleAccessToken.findOne({'email_id': email, labels: {$elemMatch: {name: labelName}}}, {'labels.$':1}).exec());
}

exports.fetchLabels = function(email) {
	gmail.listLabels(email)
	.then(function(data) {
		GoogleAccessToken.findOneAndUpdate({'email_id': email}, {'labels': data.labels}, function(err, doc){
			if(err)
				console.log(err);
		});
	})
	.catch(function(err) {LoggerUtil.log(LogLevel.ERROR, err)}).done();
}