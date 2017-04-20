/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Pedagogy Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var pedagogySchema = new mongoose.Schema({
	description : String,
	name: String,
	identifier : {
		type : String,
		required : true,
		unique : true
	},
	levels: Number,
	rootNodeSet: String,
	rootNodeTaxonomy: String,
	nodeSets : [],
	relations:[{
		relationName: String,
		relationLabel: String,
		relationProperties: mongoose.Schema.Types.Mixed
	}]
},{ collection: 'pedagogy' });

module.exports = mongoose.model('PedagogyModel', pedagogySchema);
