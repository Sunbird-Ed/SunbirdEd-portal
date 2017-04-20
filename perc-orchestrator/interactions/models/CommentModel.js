/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Comments data model.
 *
 * @author abhinav
 */
var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	commentId: String,
	interacitonId: String, //The parent interaction
	messageId : String,
	type: String, //question, discussion, answer
	commentedBy: String, //User who commented,
	commentedOn: Date, //Date when commented,
	status: String,
	comments:[], //Ids of the comments
	moderatorActions:[],
	rating: Number,
	upvotes: Number,
	downvotes: Number,
	tags: [{
		tag: String,
		action: String,
		actedBy: String,
		createdOn: Date
	}],
	tagCounts:[{
		tag: String,
		count: Number 
	}],
	content: mongoose.Schema.Types.Mixed,
	metadata: mongoose.Schema.Types.Mixed
},{collection: 'comments'});
commentSchema.set('versionKey', false);
module.exports = mongoose.model('CommentModel', commentSchema);