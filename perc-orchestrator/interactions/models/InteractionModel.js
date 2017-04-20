/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Interactions data model.
 *
 * @author abhinav
 */
var mongoose = require('mongoose');

var interactionSchema = new mongoose.Schema({
	interactionId: String,
	messageId: String, // Gmail message id
	title: String,
	sesMessageId : String, //SES message ID for In Reply To header
	metadata: {
		interation_type: String,
		le_id: String,
		le_type: String, // Course, Module, Lesson, LR, LA
		interception_point: String, //Time in video. Optional
		course_id: String,
		concepts: [], // Concept Ids
		is_moderated: Boolean,
		moderators: [], // User ids of moderators
		members: [], // Memners of the discussion
		access_type: String, //open, closed, public
		seed_user_id: String, //User who initiated/created the interaction
		seed_post: Boolean,
		created_date: Date
	},
	last_updated: Date,
	markedAsAnsweredOn: Date,
	topAnswer: String, //commentID - available for interations type QA
	status: String,
	moderationActions: [{
		type: String, //spam,inappropriate,frivolous,hateful,
		moderatorId: String,
		raisedBy: String, //user who raised this flag
		raisedOn: Date, //date when raised
		status: String //accepted, rejected, resolved
	}],
	rating: Number, //Rating of the interaction
	upvotes: Number, //Number of upvotes
	downvotes: Number, //Number of down votes
	tags: [{
		tag: String, //Tag value
		action: String, //Which action was perfomed? can be null/undefined
		actedBy: String, //User who performed the action can be null/undefined
		createdOn: Date //Date when the tag was created
	}],
	duplicates: [], // Interaction ids which are duplicate
	tagCounts: [{
		tag: String, //tag name (Interaction level)
		count: Number //Number of the above tags in this interaction
	}],
	comments: [], //List oc comment ids (first level) on this post.
	metadataExt: mongoose.Schema.Types.Mixed
},{ collection: 'interactions' });
interactionSchema.set('versionKey', false);
module.exports = mongoose.model('InteractionModel', interactionSchema);