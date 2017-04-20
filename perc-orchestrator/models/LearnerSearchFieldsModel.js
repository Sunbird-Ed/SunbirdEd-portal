/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learner Search Config Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var actionSchema = new mongoose.Schema({
	name: String,
	label: String,
	type: String, //text/select/multiselect
	values: [{
		name: String,
		value: mongoose.Schema.Types.Mixed
	}],
	order: Number
},{ collection: 'learner_search_fields' });
actionSchema.set('versionKey', false);
module.exports = mongoose.model('LearnerSearchFieldsModel', actionSchema);
