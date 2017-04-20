/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * ID Cache Model
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');

/* This module has no dependencies */

var idCacheSchema = new mongoose.Schema({
	identifier: {
		required: true,
		unique: true,
		type: String
	}
},{ collection: 'id_cache' });

module.exports = mongoose.model('IDCache', idCacheSchema);
