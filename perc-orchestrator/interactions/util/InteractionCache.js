exports.interactionActions = {};
exports.commentActions = {};
exports.inboxes = {};

exports.initialize = function() {
	var gmailHelper = require('../wrappers/gmail/gmailHelpers');
	gmailHelper.getAllInboxes().then(function(data) {
		data.forEach(function(inbox) {
			exports.inboxes[inbox.email_id] = {tokens: inbox.tokens};
		});
		console.log('Inboxes cached...', data.length);
	})
}

exports.getLabelId = function(emailId, labelName) {
	return exports.inboxes[emailId].labelIds[labelName];
}

exports.getLabelName = function(emailId, labelId) {
	return exports.inboxes[emailId].labelNames[labelId];
}

exports.getAccessToken = function(emailId) {
	return exports.inboxes[emailId].tokens;
}

exports.setAccessToken = function(emailId, tokens) {
	console.log('Setting access token - ', tokens);
	if(!exports.inboxes[emailId]) {
		exports.inboxes[emailId] = {tokens: tokens, labelIds: {}, labelNames: {}};
	} else {
		for(k in tokens) {
			exports.inboxes[emailId].tokens[k] = tokens[k];
		}
	}
	console.log('Access token after save - ', exports.inboxes[emailId].tokens);
}