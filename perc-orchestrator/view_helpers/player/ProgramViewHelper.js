/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

 /**
 * View Helper for Program
 * 
 * @author Mahesh
 */

var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');

exports.getProgram = function(req, res) {
	LoggerUtil.setOperationName('getProgram');
	var programId = req.body.programId;
	MongoHelper.findOne('ProgramModel', {identifier: programId}, function(err, program) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_PROGRAM", req, res);
		} else {
			res.send(JSON.stringify(program));
		}
	});
};
