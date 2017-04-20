/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learning Objective Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

var learningObjectiveSchema = new mongoose.Schema({
	name : String,
	shortDescription: String,
	description: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	image: String,
	courseId: String,
	metadata : mongoose.Schema.Types.Mixed
},{ collection: 'learning_objectives' });
learningObjectiveSchema.set('versionKey', false);
module.exports = mongoose.model('LearningObjectiveModel', learningObjectiveSchema);