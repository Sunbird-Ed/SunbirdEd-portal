/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Util for user import.
 *
 * @author Mahesh
 */

var promise_lib = require('when');

exports.STUDENT = 'student';
exports.TUTOR = 'tutor';
exports.COACH = 'coach';
exports.FACULTY = 'faculty';
exports.FACULTY_OBSERVER = 'faculty_observer';
exports.INSERT = 'insert';
exports.UPDATE = 'update';
exports.DELETE = 'delete';

exports.SUCCESS = 'success';
exports.FAIL = 'fail';


exports.validate = function(jsonArray) {
	var promises = [];
	for( k in jsonArray) {
		jsonArray[k].isValid = true;
		promises.push(validateJson(jsonArray[k]));
	}
	return promise_lib.all(promises);
}

// TODO I think this method processing async

function validateJson(json) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		//TODO  Validate email properly
		if(json.email && json.email.indexOf('@') == -1) {
			json.isValid = false;
			json.errorLog += 'email invalid. ';
		}
	})
	.then(function() {
		if(json.type && (['student', 'tutor', 'coach', 'faculty', 'faculty_observer'].indexOf(json.type.toLowerCase()) != -1)) {
			json.isValid = true;
		} else {
			json.isValid = false;
			json.errorLog = 'type is invalid. ';
		}
	})
	.then(function() {
		if(!json.password) {
			json.isValid = false;
			json.errorLog += 'password is empty. ';
		}
	})
	.done(function() {
		deferred.resolve(json);
	});
	return deferred.promise;
}