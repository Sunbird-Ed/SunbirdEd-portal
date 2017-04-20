var pumpUtil = require('./PumpIOUtil');
var promise_lib = require('when');
var pumpConfig = require('../config/pumpConfig.json');

exports.deleteUserLists = function(userIds, courseId) {
	console.log('#### deleting all lists ', userIds, ' ####');
	var promises = [];
	userIds.forEach(function(userId) {
		promises.push(exports.deleteUserList(userId, courseId));
	});
	return promise_lib.all(promises);
}

exports.deleteUserList = function(userId, courseId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		pumpUtil.getLists(userId, function(err, data) {
			defer.resolve(data);
		});
		return defer.promise;
	})
	.then(function(data) {
		if(data && data.items) {
			var promises = [];
			data.items.forEach(function(item) {
				if(item.context.listType == 'system' && item.context.courseId == courseId) {
					promises.push(exports.deleteList(userId, item.id));
				}
			})
			return promise_lib.all(promises);
		}
	})
	.then(function() {
		deferred.resolve();
	})
	.catch(function(err) {
		console.log('#### Error deleting user lists - ', userId, 'err', err, ' ####');
		deferred.reject(err);
	}).done();
	return deferred.promise;
}

exports.deleteList = function(userId, listId) {
	var deferred = promise_lib.defer();
	pumpUtil.deleteList(userId, exports.getListId(listId), function(err, data) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

exports.getListId = function(listId) {
    if(listId && listId.indexOf(appConfig.PUMP_BASE_URL) != -1) {
        var path = listId.replace(appConfig.PUMP_BASE_URL, '');
        var params = path.split('/');
        return params[2];
    }
    return listId;
}

exports.deleteLearnerFromGroups = function(coachId, learnerId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		pumpUtil.getLists(coachId, function(err, data) {
			defer.resolve(data);
		});
		return defer.promise;
	})
	.then(function(data) {
		if(data && data.items) {
			var promises = [];
			data.items.forEach(function(item) {
				promises.push(exports.deleteLearnerFromGroup(coachId, item.id, learnerId));
			})
			return promise_lib.all(promises);
		}
	})
	.then(function() {
		deferred.resolve();
	})
	.catch(function(err) {
		console.log('#### Error deleting learner from user custom lists - CoachId:', coachId, ',Learner:', learnerId, 'err', err, ' ####');
		deferred.reject(err);
	}).done();
	return deferred.promise;
}

exports.deleteLearnerFromGroup = function(userId, listId, learnerId) {
	//console.log('deleteLearnerFromGroup', userId, listId, learnerId);
	var deferred = promise_lib.defer();
	pumpUtil.removeMemberFromList(userId, exports.getListId(listId), learnerId, function(err, data) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});
	return deferred.promise;
}