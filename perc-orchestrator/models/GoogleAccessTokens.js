/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Data model to store google access tokens. This should be cached in node cache.
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

var gmailAccessTokenSchema = new mongoose.Schema({
	email_id: {
		type: String,
		required: true,
		unique: true
	}, // Email id for course inbox and google id from user login
	tokens: {
		access_token: String,
		token_type: String,
		id_token: String,
		refresh_token: String,
		expiry_date: Number
	},
	labels: [{
		id: String,
		name: String
	}],
	type: String // 'userLogin' or 'inbox'
}, {collection: 'google_access_tokens'});
gmailAccessTokenSchema.set('versionKey', false);
module.exports = mongoose.model('GoogleAccessToken', gmailAccessTokenSchema);
