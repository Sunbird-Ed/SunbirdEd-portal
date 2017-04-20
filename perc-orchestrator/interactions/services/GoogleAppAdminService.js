/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * GoogleAppAdminService
 * It contains the service APIs to
 * 		1) Manage User accounts - Get, Create and delete
 * 		2) Manage Labels - All crud operations
 * 		3) Manage filters - All crud operations
 *
 * @author Santhosh
 */

var google = require('googleapis');
var googleCreds = require('../config/gmail_client_keys_dev.json');
var OAuth2 = google.auth.OAuth2;
var client = new OAuth2(googleCreds.web.client_id, googleCreds.web.client_secret, googleCreds.web.redirect_uris[0]);
var admin = google.admin({version: 'directory_v1', auth: client});
var promise_lib = require('when');
var gmailHelper = require('../wrappers/gmail/gmailHelpers.js');

exports.createLabel = function(user, label, callback) {
	promise_lib.resolve()
	.then(setAcessTokens())
	.then(function() {
		var options = {};
		options.method = 'POST';
		options.url = 'https://apps-apis.google.com/a/feeds/emailsettings/2.0/app.ilimi.in/' + user + '/label';
		options.headers = {
			'Content-Type': 'application/atom+xml'
		};
		options.body = '<?xml version="1.0" encoding="utf-8"?>'
		+ '<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006">'
	    + '<apps:property name="label" value="' + label + '" />'
		+ '</atom:entry>';
		client.request(options, callback);
	})
	.catch(function(err) {
		console.log('Error in creating label - ', err);
	})
	.done();
}

exports.createFilter = function(user, query, actionLabel, callback) {
	promise_lib.resolve()
	.then(setAcessTokens())
	.then(function() {
		query = query.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
		var options = {};
		options.method = 'POST';
		options.url = 'https://apps-apis.google.com/a/feeds/emailsettings/2.0/app.ilimi.in/' + user + '/filter';
		options.headers = {
			'Content-Type': 'application/atom+xml'
		};
		options.body = '<?xml version="1.0" encoding="utf-8"?>'
			+ '<atom:entry xmlns:atom="http://www.w3.org/2005/Atom" xmlns:apps="http://schemas.google.com/apps/2006">'
		    + '<apps:property name="hasTheWord" value="' + query + '" />'
		    + '<apps:property name="label" value="' + actionLabel + '" />'
			+ '</atom:entry>';
		client.request(options, callback);
	})
	.catch(function(err) {
		console.log('Error in creating filter - ', err);
	})
	.done();
}

exports.createUser = function(givenName, familyName, emailId, password, callback) {
	promise_lib.resolve()
	.then(setAcessTokens())
	.then(function() {
		var params = {
			resource: {
				name: {
					familyName: givenName,
					givenName: familyName
				},
				password:password,
				primaryEmail:emailId
			}
		};
		admin.users.insert(params, callback);
	})
	.catch(function(err) {
		console.log('Error in getting user - ', err);
	})
	.done();
}

exports.getUser = function(emailId, callback) {
	var params = {userKey: emailId};
	promise_lib.resolve()
	.then(setAcessTokens())
	.then(function() {
		admin.users.get(params, callback)
	})
	.catch(function(err) {
		console.log('Error in getting user - ', err);
	})
	.done();
}

exports.userExists = function(emailId) {
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(setAcessTokens())
	.then(function() {
		var deferred = promise_lib.defer();
		exports.getUser(emailId, function(err, user) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(user);
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('User exists: false');
		//defer.reject(err);
	})
	.done(function(user) {
		if(user) {
			console.log('User exists: true', user);
			defer.resolve(true);
		} else {
			defer.resolve(false);
		}
	})
	return defer.promise;
}

function setAcessTokens() {
	return function() {
		if(client.credentials && !client.credentials.refresh_token) {
			var deferred = promise_lib.defer();
			gmailHelper.getTokens(appConfig.GOOGLE_APP_ADMIN_ACCOUNT_ID)
			.then(function(gatoken) {
				if(gatoken) {
					client.setCredentials(gatoken.tokens);
					deferred.resolve();
				} else {
					deferred.reject('Tokens not found');
				}
			});
			return deferred.promise;
		}
	}
}

function refreshAccessToken(old_tokens) {
	return function() {
		client.setCredentials(old_tokens);
		var deferred = promise_lib.defer();
		client.refreshAccessToken(function(err, tokens) {
			client.setCredentials(tokens);
			deferred.resolve();
		});
		return deferred.promise;
	}
}

//exports.userExists('dev_web301@app.ilimi.in');
// Examples
/*client.refreshAccessToken(function(err, tokens) {
	client.setCredentials(tokens);
	//exports.createLabel('admin', 'Concept:MySQL');
	//exports.createUser('Java Programming Course', 'Dev', 'dev_web301@app.ilimi.in', 'web301@ilimi.in');
	//exports.getUser('dev_web302@app.ilimi.in', function(err, response) {
	//exports.createLabel('dev_web301', 'Concept:MySQL');
	//exports.createFilter('dev_web301','&quot;concept_title&quot;:&quot;MySQL&quot;', 'Concept:MySQL');
	//	console.log('err', err, 'response', response);
	//});
});*/

exports.testCreateLabel = function(req, res) {
	exports.createFilter('dev_web301', '"discussion_type":"OPEN"', 'OPEN', function(err, response) {
		promise_lib.resolve()
		.then(exports.parseXMLResponse(response))
		.then(function() {res.send('API call success')})
		.catch(function(err) {res.send(err)})
		.done();
	});
}

exports.parseXMLResponse = function(response) {
	var parseString = require('xml2js').parseString;
	return function() {
		var deferred = promise_lib.defer();
		parseString(response, function (err, result) {
    		if(result['entry']) {
    			deferred.resolve();
    		} else {
    			deferred.reject('Error:' + JSON.stringify(result));
    			LoggerUtil.log(LogLevel.ERROR, result);
    		}
		});
		return deferred.promise;
	}
}

