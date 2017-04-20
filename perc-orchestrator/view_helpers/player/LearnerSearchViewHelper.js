/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Learner Search
 *
 * @author Santhosh
 */

var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var MWServiceProvider = require("../../commons/MWServiceProvider");

exports.getLearnerSearchConfig = function(req, res) {
	var courseId = req.params.courseId;
    var response = {
        searchFields: [],
        events: [],
        learningActivites: []
    }
    var query = {
        'courseId': courseId,
        'createdBy': req.user.identifier,
        'metadata.instructionUsage': 'coaching'
    }
    var projection = {identifier: 1, name: 1};

    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.find('LearnerSearchFieldsModel', {}, {}, {sort:'order'}).toArray(function(err, fields) {
            response.searchFields = fields;
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.find('LearningResourceModel', query, projection).toArray(function(err, events) {
            response.events.push.apply(response.events, events);
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.find('LearningActivityModel', query, projection).toArray(function(err, events) {
            response.events.push.apply(response.events, events);
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        var query = {
            'courseId': courseId,
            $or:[{'metadata.instructionUsage': {$ne: 'coaching'}}, {'createdBy': req.user.identifier, 'metadata.instructionUsage': 'coaching'}]
        }
        var defer = promise_lib.defer();
        MongoHelper.find('LearningActivityModel', query, projection).toArray(function(err, elements) {
            response.learningActivites = elements;
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        res.json(response);
    })
    .catch(function(err) {
        console.log('Error', err);
        res.json({error: true, errorMsg: err});
    }).done();
}

exports.searchLearners = function(req, res) {

	var learnerList = {};
    var courseId = req.body.courseId;
    var searchType = req.body.type;
    var query = req.body.query;

    var args = {
        filters:[],
        offset: req.body.offset || 0,
        limit: appConfig.DEFAULT_RESULT_SIZE,
        fields:["email", "name", "image", "type", "degree", "stream", "college", "yearOfGraduation", "identifier"]
    }

    args.filters.push({name:'enrolled_to', operator:'eq', value: courseId});
    if(req.body.filters) {
        req.body.filters.forEach(function(filter) {
            var f = {name: filter.name, operator: filter.operator, value: filter.value};
            if(filter.type == 'date') {
                delete f.value;
                f.dateValue = filter.value.date().getTime();
            }
            if(filter.name == 'batch') {
                delete f.name;
                f.name = courseId + '_' + filter.name;
            }
            if(filter.optional) f.optional = true;
            args.filters.push(f);
        })
    }

    if(searchType == 'learnerSearch') {
        args.filters.push({name:'type', operator:'eq', value: 'student'});
        if(req.user.roles.indexOf('faculty') == -1) {
            args.filters.push({name:courseId + "_" +'coach', operator:'eq', value: req.user.identifier});
        }
    }
    //console.log('args', args);

    var req = new Object();
    req.SEARCH_CRITERIA = args;
	promise_lib.resolve()
	.then(function(){
	    var defer = promise_lib.defer();
        MWServiceProvider.callServiceStandard("learnerService", "SearchLearners", req, function(err, data, response) {
            if (err) {
                defer.reject("Error in Response from MW SearchLearners: " + err);
            } else {
				defer.resolve(data.responseValueObjects);
            }
        });
		return defer.promise;
   	})
    .then(function(response) {
        var learners = [];
        response.RESULTS.valueObjectList.forEach(function(valObj) {
            learners.push(valObj.baseValueMap);
        });
        learnerList["learners"] = learners;
        learnerList["learnerCount"] = response.COUNT.id;
        res.send(JSON.stringify(learnerList));
    })
    .catch(function(err) {
        console.log('err', err);
    	res.send(err);
    })
    .done();
};
