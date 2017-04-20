/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Learner Search Data Model
 *
 * @author Shreekant
 */
var mongoose = require('mongoose');

/* This module has no dependencies on the pedagogy and pedagogy nodeset*/

var learnerSearchSchema = new mongoose.Schema({
		name : String,
		description : String,
		roles : [],
		default_params : [{
			name : String,
			fieldName : String,
			value : String,
			operator : String
		}],
		applicable_to : [],
		custom_params : [{
			name : String,
			label : String,
			fieldName : String,
			placeholder : String,
			required : {
				type : Boolean,
				default : false
			},
			requiredSymbol : String,
			defaultValue : String,
			type : String,
			_value : String,
			values : [{
				name : String,
				value : String
			}],
			operator : String
		}]
},{ collection: 'pre_defined_searches' });

module.exports = mongoose.model('LearnerSearchModel', learnerSearchSchema);