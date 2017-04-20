/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Actions related service
 * @author abhinav
 */

var mongoose = require('mongoose');
InteractionActionModel = mongoose.model('InteractionActionModel');
CommentActionModel = mongoose.model('CommentActionModel');
var gmail = require('../wrappers/gmail/gmailWrapper.js');
var gmailHelper = require('../wrappers/gmail/gmailHelpers.js');
var InteractionModel = mongoose.model('InteractionModel');
var CommentModel = mongoose.model('CommentModel');

var setInteractionTag = function(args){
	InteractionModel.findOneAndUpdate({'messageId' : args.messageId}, 
		{ $addToSet :
			{ 'tags' : 
				{ 
					'tag' : args.tag,
					'action' : args.action, 
					'actedBy' : args.userId, 
					'actedOn' : new Date() 
				}
			}
		}
	);
}

var setCommentTag = function(args){
	CommentModel.findOneAndUpdate({'messageId' : args.messageId}, 
		{ $addToSet :
			{ 'tags' : 
				{ 
					'tag' : args.tag,
					'action' : args.action, 
					'actedBy' : args.userId, 
					'actedOn' : new Date() 
				}
			}
		}
	);	
}

/**
 * Get all Actions available for an interaction type
 * args 	{
				interactionType
			}
	return  actions[]

 */
exports.getInteractionActions = function(callback) {
 	InteractionActionModel.find().lean().exec(callback);
}

/**
 * Get all Actions available for an comment type
 * args 	{
				commentType
			}
	return  actions[]

 */
exports.getCommentActions = function(callback) {
 	CommentActionModel.find().lean().exec(callback);
}

 /**
 * Invite users to an interaction
 * args 	{
				interactionId,
				userId
			}
	return  boolean

 */
 exports.inviteUserToInteraction = function(args, callback){

 }

 /**
 * Remove a user from an interaction
 * args 	{
				interactionId,
				userId
			}
	return  boolean

 */
 exports.removeUserFromInteraction = function(args, callback){

 }

 /**
 * Add an interaction to QA of the course
 * args 	{
				interactionId,
				courseId
			}
	return  boolean

 */
 exports.addInteractionToQA = function(args, callback){

 }

 /**
 * Move an interaction to Admin QA
 * args 	{
				interactionId
			}
	return  boolean

 */
 exports.moveInteractionToAdminQA = function(args, callback){

 }

 /**
 * Mark interaction as FAQ (tag FAQ)
 * args 	{
				interactionId
			}
	return  boolean

 */
 exports.markInteractionAsFAQ = function(args, callback) {
 	setInteractionTag({messageId : args.messageId, userId : args.userId, tag: 'FAQ', action : 'MarkAsFAQ'});
 	setLabel(args.inboxId, args.messageId, 'Faq', callback);
 }

/**
 * Update the status of interaction to answered (only available for Q&A type interaction)
 * args 	{
				interactionId
			}
	return  boolean

 */
 exports.markInteractionAsAnswered = function(args, callback){
 	setInteractionTag({messageId: args.messageId, userId : args.userId, tag: 'Answered', action : 'MarkAsAnswered'});
 	setLabel(args.inboxId, args.messageId, 'Answered', callback);

 }

 /**
 * Trigger a moderation Action on the interaction to mark as Frivolous
 * args 	{
				interactionId
			}
	return  boolean

 */
 exports.markInteractionAsFrivolous = function(args, callback){
 	setInteractionTag({messageId : args.messageId, userId : args.userId, tag: 'Frivolous', action: 'MarkAsFrivolous'});
 	setLabel(args.inboxId, args.messageId, 'Frivolous', callback);
 }

/**
 * Trigger a moderation Action on the interaction to mark as Spam
 * args 	{
				interactionId
			}
	return  boolean

 */
exports.markInteractionAsSpam = function(args, callback){
	setInteractionTag({messageId : args.messageId, userId: args.userId, tag: 'Spam', action: 'MarkAsSpam'});
 	setLabel(args.inboxId, args.messageId, 'MarkSpam', callback);
}

/**
 * Mark a Q&A as duplicate of another post
 * args 	{
				interactionId
			}
	return  boolean

 */
exports.markInteractionAsDuplicate = function(args, callback){
	//How do I get the duplicate interaction id?
	setLabel(args.inboxId, args.messageId, 'Duplicate', callback);
	//TODO: Update interaction or action model accordingly
}

 /**
 * Tag a Q&A interaction when another user has the same query/question/clarification
 * args 	{
				interactionId
			}
	return  boolean

 */
exports.markAsHavingSameQuestion = function(args, callback){

}

 /**
 * Rate an interaction
 * args 	{
				interactionId,
				rating
			}
	return  total_rating

 */
 exports.rateInteraction = function(args, callback){
 	/*UserActionModel.find({'userId': args.userId, 'interactionActions'}, { $addToSet : {'interactionActions': {
 		'interactionId'
 	}}})*/
 }

 /**
 * Add a comment to an interaction
 * args 	{
				interactionId,
				commentModel
			}
	return  boolean

 */
 exports.commentOnInteraction = function(args, callback){

 }

 /**
 * Add a second level comment to an interaction (comment a comment)
 * args 	{
				commentId,
				commentModel
			}
	return  boolean

 */
 exports.commentOnComment = function(args, callback){

 }

 /**
 * Rate a comment
 * args 	{
				commentId,
				rating
			}
	return  total_rating

 */
exports.rateComment = function(args, callback){

}

 /**
 * Trigger a moderation Action on the comment to mark as Spam
 * args 	{
				commentId
			}
	return  boolean

 */
exports.markCommentAsSpam = function(args, callback){
	setCommentTag.findOneAndUpdate({tag: 'Spam', messageId: args.messageId, userId : args.userId, action : 'MarkAsSpam' });
 	setLabel(args.inboxId, args.messageId, 'MarkSpam', callback);
}
 /**
 * Mark a comment of type "answer" as the answer to the Q&A interaction
 * args 	{
				commentId
			}
	return  boolean

 */
exports.markCommentAsAnswer = function(args, callback){
	//@TODO: combine into one find query
	CommentModel.findOneAndUpdate({'messageId': args.messageId}, { 'type' : 'answer'});
	setCommentTag.findOneAndUpdate({tag: 'Answer', messageId : args.messageId, userId : args.userId, action: 'MarkAsAnswer'});
	setLabel(args.inboxId, args.messageId, 'Answered', callback);
}
 /**
 * Mark a comment as useful
 * args 	{
				commentId
			}
	return  boolean

 */
exports.markCommentAsUseful = function(args, callback){
 	setCommentTag.findOneAndUpdate({tag: 'Useful', messageId : args.messageId, userId : args.userId, action: 'Mark as Useful'});
 	setLabel(args.inboxId, args.messageId, 'Useful', callback);
}

function setLabel(inboxId, messageId, label, callback) {

	var labelId = InteractionCache.getLabelId(inboxId, label);
	if(labelId == null || typeof labelId == 'undefined') {
		callback('Label not found', null);
		return;
	}
	gmail.setLabel(inboxId, messageId, labelId)
 	.then(function(data) {callback(null, data)})
 	.catch(function(err) {callback(err, null)})
 	.done();
}