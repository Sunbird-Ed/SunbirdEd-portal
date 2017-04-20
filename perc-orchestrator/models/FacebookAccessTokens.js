/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Data model to store facebook access tokens. This should be cached in node cache.
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

var fbAccessTokenSchema = new mongoose.Schema({
	facebook_id: {
		type: String,
		required: true,
		unique: true
	},
	access_token: String,
	refresh_token: String
}, {collection: 'fb_access_tokens'});
fbAccessTokenSchema.set('versionKey', false);
module.exports = mongoose.model('FacebookAccessToken', fbAccessTokenSchema);
