/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Utility class to register and listen for events.
 *
 * @author Santhosh
 */
var events = require('events');
var eventEmitter = new events.EventEmitter();

exports.registerEventListener = function(eventName, callbackFn) {
	if(!eventName && ! callbackFn) {
		throw "Event registration failed. Need an event name and a callback function";
	}
	if(!eventName)
		throw "Event registration failed. No event name passed to bing";
	if(!callbackFn || typeof callbackFn != 'function')
		throw "Event registration failed. Callback function is not provided or not a function";

	// Register the event
	eventEmitter.on(eventName, callbackFn);
}

exports.emitEvent = function() {
	var emitApply = Function.apply.bind(eventEmitter.emit, eventEmitter);
	emitApply(arguments);
}

/* Example Usage
function updateLearnerState(courseId, studentId, lobId) {
	console.log('Event received', 'courseId', courseId, 'studentId', studentId, 'lobId', lobId);
}
exports.registerEventListener('updateLS', updateLearnerState);
exports.emitEvent('updateLS', 'course:201', 'student:101', 'lob:404');
*/