/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved. 
 * 
 * This code is intellectual property of Canopus Consulting. The intellectual and technical 
 * concepts contained herein may be covered by patents, patents in process, and are protected 
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval 
 * from Canopus Consulting is prohibited.
 */

/**
 * Framework component that provides error handling mechanisms
 * 
 * @author ravitejagarlapati
 */

exports.handleError = function(err, errorCode, req, res) {

	// TODO what is right error handling
	console.log("Error Code: " + errorCode + " Error:" + err);
	var resp = {};
	resp.error = 'An error has occurred';
	resp.errorcode = errorCode;
	resp.errorstack = err;
	res.send(JSON.stringify(resp));

};