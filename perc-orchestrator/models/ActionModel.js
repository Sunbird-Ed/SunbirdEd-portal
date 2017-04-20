/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Actions Model
 *
 * @author Mahesh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var actionSchema = new mongoose.Schema({
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	description: String
},{ collection: 'actions' });
actionSchema.set('versionKey', false);
module.exports = mongoose.model('ActionModel', actionSchema);
