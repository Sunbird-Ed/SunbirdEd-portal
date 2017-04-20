/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

/**
 * Sample Model. Any model should export itself as Mongoose Model
 * 
 * @author ravitejagarlapati
 */

var mongoose = require('mongoose');

var SampleModelSchema = new mongoose.Schema({
	username : {
		type : String,
		required : true,
		unique : true
	},
	email : {
		type : String,
		required : false,
		unique : false
	},
	password : {
		type : String,
		required : true
	}
});

/* This return value is what will be injected when SampleModel is referenced */
var SampleModel = module.exports = mongoose.model('SampleModel',
		SampleModelSchema);
