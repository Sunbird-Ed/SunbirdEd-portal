/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Pedagogy Nodeset Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var pedagogyNodeSetSchema = new mongoose.Schema({
	description : String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	nodeSetName: String,
	nodeSetClass: String,
	pedagogyId: String,
	taxonomyId: String,
	isFinest: Boolean,
	levelInHeirarchy: Number,
	relations : [{
		toNodeSet : String,
		toNodeSetId : String,
		taxonomyId : String,
		nodeSetClass : String,
		relationName: String
	}]
},{ collection: 'pedagogy_nodeset' });

module.exports = mongoose.model('PedagogyNodeSetModel', pedagogyNodeSetSchema);
