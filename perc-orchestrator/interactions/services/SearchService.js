/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Search related service
 * @author abhinav
 */

var queryUtils = require('../util/QueryUtil.js');
var mongoose = require('mongoose');
var gmail = require('../wrappers/gmail/gmailWrapper.js');

/**
 * Get all interactions matching the metadata (Context)
 * @param  {object} args - arguments for the request
 * @param  {object} args.inboxId - Email of the course or tutor inbox
 * @param  {object} args.metadata - Context of the invocation
 * @param  {Function} callback [description]
* @param  {callback} callback - The callback that handles the response.
 */
exports.getInteractions = function(args, callback){
	var query = queryUtils.getMetadataQuery(args.metadata);
	LoggerUtil.log(LogLevel.DEBUG, 'Query:' + query);
	gmail.listThreads(args.inboxId, query).then(function(messages) {
		messages.forEach(function(msg) {
			msg.labels = [];
			msg.labelIds.forEach(function(labelId) {
				msg.labels.push(InteractionCache.getLabelName(args.inboxId, labelId));
			});
			delete msg.labelIds;
		})
	    callback(null, messages)
	}).catch(function(err) {
	    callback(err, null);
	}).done();
}

/**
 * Search for interactions.
 * args 	{
				//@TBD
			}
	return  interactions[]

 */
exports.searchInteractions = function(args, callback) {
	var metadataQry = queryUtils.getMetadataQuery(args.metadata);
 	var query = args.query;
 	if(metadataQry) {
 		query += ' (' + queryUtils.getMetadataQuery(args.metadata) + ')';
 	}
 	LoggerUtil.log(LogLevel.DEBUG, 'Query:' + query);
    gmail.getMessages(args.inboxId, query).then(function(messages) {
    	messages.forEach(function(msg) {
			msg.labels = [];
			msg.labelIds.forEach(function(labelId) {
				msg.labels.push(InteractionCache.getLabelName(args.inboxId, labelId));
			});
			delete msg.labelIds;
		})
	    callback(null, messages)
	}).catch(function(err) {
	    callback(err, null);
	}).done();
}
