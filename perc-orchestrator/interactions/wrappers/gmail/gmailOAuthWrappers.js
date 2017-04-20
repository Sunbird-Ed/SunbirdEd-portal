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

var google = require('googleapis');
var gmail = google.gmail('v1');
var tokenHelpers = require('./gmailHelpers.js');
var client = new google.auth.OAuth2(appConfig.GMAIL_CLIENT_ID, appConfig.GMAIL_CLIENT_SECRET, appConfig.GMAIL_REDIRECT_URI);
var promise_lib = require('when');

exports.initiateAuthorization = function(emailId, additionalScopes) {
    var scopes = [
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://mail.google.com/'
    ];

    if (additionalScopes) {
        additionalScopes.forEach(function(scope) {
            scopes.push(scope);
        })
    }

    var url = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        user_id: emailId
    });
    return url;
};

exports.adminAuthorization = function(emailId) {
    return exports.initiateAuthorization(emailId, [
    	'https://apps-apis.google.com/a/feeds/domain/',
    	'https://www.googleapis.com/auth/admin.directory.user',
    	'https://apps-apis.google.com/a/feeds/emailsettings/2.0/'
    ]);
}


exports.saveAccessToken = function(code) {
    client.getToken(code, function(err, tokens) {
        console.log('Tokens', tokens);
        client.setCredentials(tokens);
        var email = undefined;
        var OAuth = google.oauth2('v1');
        OAuth.userinfo.get({
            userId: 'me',
            auth: client
        }, function(err, response) {
            if (!err) {
                email = response.email;
                tokenHelpers.saveTokens(email, tokens);
                InteractionCache.setAccessToken(email, tokens);
            }
        });
    });
};
/*
exports.refreshToken = function(email) {
    var creds = tokenHelpers.getTokens(email);
    client.setCredentials({
        'refresh_token': creds.refresh_token
    });
    client.refreshAccessToken(function(err, tokens) {
        tokenHelpers.saveTokens(email, tokens);
    });
};

exports.apiCall = function(args) {
    var creds = tokenHelpers.getTokens(email);
    client.setCredentials(creds);
    //@TODO: generate query using args and return response.
}

exports.getClient = function(email) {
    return tokenHelpers.getTokens(email).then(function(tokens) {
        client.setCredentials(tokens.tokens);
        return client;
    });
}
*/