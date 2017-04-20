/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Initializes Mongo DB Connection for log stream database
 *
 * @author rayulu
 */
var MongoClient = require('mongodb').MongoClient;

var logStreamDbConn;
var modelMap = {
	"APIActionsModel": "api_actions"
}

MongoClient.connect(appConfig.MONGO_LOG_STREAM_STORE_URI + "?", {
        server: {
            poolSize: 20
        }
    }, function(err, db) {
        console.log('Mongodb default connection open to ' + appConfig.MONGO_LOG_STREAM_STORE_URI, err);
        logStreamDbConn = db;
        //create collection
		logStreamDbConn.createCollection("api_actions", function(err, collection){
		   	if (err) {
		   		console.log("Error: " + err);
		   	} else {
		   		console.log("Created api_actions collection");
		   	}
		});
    }
);

exports.findAPIByBaseURL = function(modelName, url, type, callback) {
	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
		console.log('Incorrect model:findOne():', modelName);
	}
	var query = {baseURL: url, requestType: type.toLowerCase() };
	logStreamDbConn.collection(modelMap[modelName]).find(query).toArray(function(err, docs) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, docs);
		}
	});
}

exports.findAPIByURL = function(modelName, url, type, callback) {
	if(modelMap[modelName] == null || modelMap[modelName] == 'undefined') {
		console.log('Incorrect model:findOne():', modelName);
	}
	var query = {$where: 'function(){ return (new RegExp("^" + this.baseURL)).test("' + url + '")}', requestType: type.toLowerCase() };
	logStreamDbConn.collection(modelMap[modelName]).find(query).toArray(function(err, docs) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, docs);
		}
	});
}


