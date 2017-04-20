var pumpConfig = require('../config/pumpConfig.json');
var Client = require('node-rest-client').Client;
var client = new Client();
var baseUrl = appConfig.PUMP_BASE_URL;

exports.addPreAuthHeaders = function(args, userName) {
	args.headers = {
        "Content-Type": "application/json",
        "Ilimi-Api-Call": "true",
        "Consumer-Key": appConfig.PUMP_CLIENT_KEY,
        "Authorization": "OAuth"
    };
    if(userName) {
    	args.headers['User-Name'] = userName;
    }
}

exports.getUser = function(userName, callback) {
	var url = baseUrl + pumpConfig.GET_USER.replace(':userName', userName);
	var args = {};
	exports.addPreAuthHeaders(args, 'admin');
	getCall(url, args, callback);
}

exports.createUser = function(userName, password, displayName, image, callback) {
	var url = baseUrl + pumpConfig.CREATE_USER;
	var args = {};
	exports.addPreAuthHeaders(args);
	args.data = {
		"nickname": userName,
    	"password": password,
    	"displayName": displayName
	}
	if(image) {
		args.data.imageUrl = image;
	}
	postCall(url, args, callback);
}

exports.deleteUser = function(userName, callback) {
	var url = baseUrl + pumpConfig.GET_USER;
	var args = {};
	exports.addPreAuthHeaders(args, userName);
	deleteCall(url, args, callback);
}

exports.updateUserProfile = function(userName, displayName, image, callback) {
	var url = baseUrl + pumpConfig.FEED_URL.replace(':userName', userName);
	var args = {};
	exports.addPreAuthHeaders(args, userName);
	args.data = {
  		"verb":"update",
  		"object": {
    		"objectType": "person",
    		"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', userName),
    		"image": {
      			"url": image
    		},
    		"displayName": displayName
  		}
	}
	postCall(url, args, callback);
}

exports.follow = function(userId, followUserId, callback) {
	var url = baseUrl + pumpConfig.FEED_URL.replace(':userName', followUserId);
	var args = {};
	exports.addPreAuthHeaders(args, followUserId);
	args.data = {
		"verb": "follow",
		"object": {
    		"objectType": "person",
    		"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', userId)
  		}
	}
	postCall(url, args, callback);
}

exports.unfollow = function(userId, followUserId, callback) {
	var url = baseUrl + pumpConfig.FEED_URL.replace(':userName', followUserId);
	var args = {};
	exports.addPreAuthHeaders(args, followUserId);
	args.data = {
		"verb": "stop-following",
		"object": {
    		"objectType": "person",
    		"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', userId)
  		}
	}
	postCall(url, args, callback);
}

exports.addMemberToList = function(userId, collectionId, memberId, callback) {
	var url = baseUrl + pumpConfig.COLLECTION_MEMBERS.replace(':collectionUID', collectionId);
	var args = {};
	exports.addPreAuthHeaders(args, userId);
	args.data = {
		"objectType": "person",
		"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', memberId)

	}
	postCall(url, args, callback);
}

exports.removeMemberFromList = function(userId, collectionId, memberId, callback) {
	var url = baseUrl + pumpConfig.POST_MINOR.replace(':userName', userId);
	var args = {};
	exports.addPreAuthHeaders(args, userId);
	args.data = {
		"verb":"remove",
		"object": {
			"objectType":"person",
			"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', memberId)
		},
		"target": {
			"objectType":"collection",
			"id": baseUrl + pumpConfig.PUMP_COLLECTION.replace(':collectionUID', collectionId)
		}
	}
	postCall(url, args, callback);
}

exports.createList = function(userName, listName, description, context, callback) {
	var url = baseUrl + pumpConfig.FEED_URL.replace(':userName', userName);
	var args = {};
	exports.addPreAuthHeaders(args, userName);
	args.data = {
		"verb":"create",
		"object": {
			"objectType":"collection",
			"objectTypes":["person"],
			"displayName": listName,
			"content": description,
			"context": context
		}
	}
	postCall(url, args, callback);
}

exports.deleteList = function(userName, collectionUID, callback) {
	var url = baseUrl + pumpConfig.PUMP_COLLECTION.replace(':collectionUID', collectionUID);
	var args = {};
	exports.addPreAuthHeaders(args, userName);
	deleteCall(url, args, callback);
}

exports.getLists = function(userName, callback) {
	var url = baseUrl + pumpConfig.GET_LISTS.replace(':userName', userName);
	var args = {};
	exports.addPreAuthHeaders(args, userName);
	getCall(url, args, callback);
}

exports.getListMembers = function(userId, collectionUID, callback) {
	var url = baseUrl + pumpConfig.COLLECTION_MEMBERS.replace(':collectionUID', collectionUID);
	var args = {};
	exports.addPreAuthHeaders(args, userId);
	getCall(url, args, callback);
}

exports.postMessage = function(userName, title, post, context, to, cc, objectType, callback) {
	var url = baseUrl + pumpConfig.POST_MAJOR.replace(':userName', userName);
	var args = {};
	exports.addPreAuthHeaders(args, userName);
	args.data = {
		"verb":"post",
		"object": {
			"objectType": objectType,
			"displayName": title,
			"content": post
		},
		"to": [],
		"cc": []
	}
	if(context) {
		args.data.context = context;
	}
	if(to) {
		to.forEach(function(item) {
			if(item.type == 'learner') {
				args.data.to.push({
					"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', item.id),
					"objectType": "person"
				});
			} else if(item.type == 'list') {
				args.data.to.push({
					"id": baseUrl + pumpConfig.PUMP_COLLECTION.replace(':collectionUID', item.id),
					"objectType": "collection"
				});
			} else if(item.type == 'followers') {
				args.data.to.push({
					"id": baseUrl + pumpConfig.FOLLOWERS.replace(':userName', userName),
					"objectType": "collection"
				});
			}
		});
	}
	if(cc) {
		cc.forEach(function(item) {
			if(item.type == 'learner') {
				args.data.cc.push({
					"id": baseUrl + pumpConfig.PUMP_USER_ID.replace(':userName', item.id),
					"objectType": "person"
				});
			} else if(item.type == 'list') {
				args.data.cc.push({
					"id": baseUrl + pumpConfig.PUMP_COLLECTION.replace(':collectionUID', item.id),
					"objectType": "collection"
				});
			} else if(item.type == 'followers') {
				args.data.cc.push({
					"id": baseUrl + pumpConfig.FOLLOWERS.replace(':userName', userName),
					"objectType": "collection"
				});
			}
		});
	}
	postCall(url, args, callback);
}

function postCall(url, args, callback) {

	if(!appConfig.PUMP_ENABLED) {
		callback(null, {error: 'Pump not enabled'});
		return;
	}
	client.post(url, args, function(data, response) {
		parseResponse(data, callback);
    }).on('error', function(err) {
        callback(err);
    });
}

function parseResponse(data, callback) {
	if(typeof data == 'string') {
		if(data.indexOf('Incorrect auth details') != -1) {
			data = {error: true, errorMsg: 'Incorrect auth details'};
			callback(data);
			return;
		}
		try {
			data = JSON.parse(data);
			callback(null, data);
		} catch(err) {
			console.log('PumpIOUtil.parseResponse(). Err', err);
			data = {error: true};
			callback(data);
		}
	} else {
		callback(null, data);
	}
}

function getCall(url, args, callback) {

	if(!appConfig.PUMP_ENABLED) {
		callback(null, {error: 'Pump not enabled'});
		return;
	}
	client.get(url, args, function(data, response) {
		parseResponse(data, callback);
    }).on('error', function(err) {
        callback(err);
    });
}

function putCall(url, args, callback) {

	if(!appConfig.PUMP_ENABLED) {
		callback(null, {error: 'Pump not enabled'});
		return;
	}
	client.put(url, args, function(data, response) {
		parseResponse(data, callback);
    }).on('error', function(err) {
        callback(err);
    });
}

function deleteCall(url, args, callback) {

	if(!appConfig.PUMP_ENABLED) {
		callback(null, {error: 'Pump not enabled'});
		return;
	}
	client.delete(url, args, function(data, response) {
        callback(null, data);
    }).on('error', function(err) {
        callback(err);
    });
}