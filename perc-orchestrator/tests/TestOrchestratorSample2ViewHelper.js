/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */
/**
 * Test
 *
 * @author ravitejagarlapati
 */
var rdfGraphUtil = require('../commons/RDFGraphUtil');
var sample2ViewHelper = require('../view_helpers/Sample2ViewHelper');
var sample2ViewHelperPromise = require('../view_helpers/Sample2ViewHelperPromise');
var dummyServiceProvider = require('./DummyMWService');
var MWServiceProvider = require('../commons/MWServiceProvider');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var mongoose = require('mongoose');
var models = require('../models');
var promise_lib = require('when');
var server;
module.exports = {
    setUp: function(callback) {
        // Start dummy middleware servcice
        dummyServiceProvider.getDummyServer(function(serverFromCallback) {
            server = serverFromCallback;
            // Server has started so callback
            callback();
        });
    },
    tearDown: function(callback) {
        // Stop dummy middleware servcice
        server.close();
        callback();
    },
    testSample2ViewHelperCall: function(test) {
        // This simulates
        SampleModel2 = mongoose.model('SampleModel2');
        // Clear the data for the model
        SampleModel2.remove({}, function(err, object) {
            if (err) {
                test.throws(err);
            } else {
                console.log('cleared mongo db objects for sample model 2');
                var res1 = {
                    send: function(respData) {
                        console.log('obtained response: ' + JSON.stringify(respData));
                        // Now check in mongo db, it should be there in the mongodb
                        SampleModel2.find({
                            url: "http://canopusconsulting.com/test/node/1/#1"
                        }).exec(function(err, samplemodels) {
                            if (err) {
                                console.log('\n\n' + err);
                                test.throws(err);
                            } else {
                                console.log('Found the model object in mongodb: ' + JSON.stringify(samplemodels));
                                test.done();
                            }
                            // test.done();
                        });
                    }
                };
                var req1 = {
                    params: {
                        id: "name1.1"
                    }
                };
                console.log('Before calling Sample2ViewHelper.findById');
                sample2ViewHelper.findById(req1, res1);
            }
        });
    },
    testSample2ViewHelperCallPromise: function(test) {
        // This simulates
        SampleModel2 = mongoose.model('SampleModel2');
        promise_lib.resolve()
        .then (ViewHelperUtil.promisify(SampleModel2.remove, SampleModel2))
        .then(function() {
            var deferred = promise_lib.defer();
            var res1 = {
                send: function(respData) {
                    deferred.resolve(respData);
                }
            };
            var req1 = {
                params: {
                    id: "name1.1"
                }
            };
            console.log('Before calling Sample2ViewHelper.findById');
            sample2ViewHelper.findById(req1, res1);
            return deferred.promise;
        })
        .then (function(respData) {
        	console.log('obtained response: ' + JSON.stringify(respData));
        })
        .then ({
                url: "http://canopusconsulting.com/test/node/1/#1"
            })
        .then (ViewHelperUtil.promisify(SampleModel2.find, SampleModel2))
        .then (function(samplemodels) {
        	console.log('Found the model object in mongodb: ' + JSON.stringify(samplemodels));
        })
        .catch (function(err) {
            console.log(err);
            test.done();
        })
        .done(function(result) {
            console.log("Test Done!!!");
            test.done();
        });
    },
    testSample2ViewHelperCallPromiseHelperPromise: function(test) {
        // This simulates
        SampleModel2 = mongoose.model('SampleModel2');
        promise_lib.resolve()
        .then (ViewHelperUtil.promisify(SampleModel2.remove, SampleModel2))
        .then(function() {
            var deferred = promise_lib.defer();
            var res1 = {
                send: function(respData) {
                    deferred.resolve(respData);
                }
            };
            var req1 = {
                params: {
                    id: "name1.1"
                }
            };
            console.log('Before calling Sample2ViewHelperPromise.findById');
            sample2ViewHelperPromise.findById(req1, res1);
            return deferred.promise;
        })
        .then (function(respData) {
        	console.log('obtained response: ' + JSON.stringify(respData));
        })
        .then ({
                url: "http://canopusconsulting.com/test/node/1/#1"
            })
        .then (ViewHelperUtil.promisify(SampleModel2.find, SampleModel2))
        .then (function(samplemodels) {
        	console.log('Found the model object in mongodb: ' + JSON.stringify(samplemodels));
        })
        .catch (function(err) {
            console.log(err);
            test.done();
        })
        .done(function(result) {
            console.log("Test Done!!!");
            test.done();
        });
    },
    cleanupAfterTests: function(test) {
        mongoose.connection.close();
        test.done();
    }
};


