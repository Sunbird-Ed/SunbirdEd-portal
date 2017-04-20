var NodeCache = require( "node-cache" );
var nc = new NodeCache({stdTTL: 0, checkperiod: 0});
var playerUtil = require('../view_helpers/player/PlayerUtil');

exports.set = function(context, key, value, courseId) {
	var cacheKey = getCacheKey(context, key);
	if(courseId) {
		courseId = playerUtil.addFedoraPrefix(courseId);
		var keysInCourse = nc.get(courseId)[courseId];
		if(!keysInCourse || keysInCourse == null || keysInCourse == 'undefined') {
			keysInCourse = [];
		}
		keysInCourse.push(cacheKey);
		nc.set(courseId, keysInCourse);
	}
	nc.set(cacheKey, value);
}

exports.get = function(context, key) {
	var ckey = getCacheKey(context, key);
	return nc.get(ckey)[ckey];
}

exports.del = function(key) {
	return nc.del(key);
}

exports.clearCache = function(courseId) {
	console.log('Clear Cache for course - ', courseId);
	courseId = playerUtil.addFedoraPrefix(courseId);
	var keysInCourse = nc.get(courseId)[courseId];
	if(keysInCourse && keysInCourse.length > 0) {
		exports.del(keysInCourse);
	}
}

function getCacheKey(context, key) {
	var ckey;
	if(typeof key == 'object') {
		key['context'] = context;
		ckey = JSON.stringify(key);
	} else {
		ckey = context + '_' + key;
	}
	return ckey;
}