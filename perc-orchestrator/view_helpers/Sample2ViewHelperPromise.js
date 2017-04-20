/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for SampleModel
 *
 * @author ravitejagarlapati
 */
var mongoose = require('mongoose'),
    errorModule = require('./ErrorModule');
var rdfGraphUtil = require('../commons/RDFGraphUtil');
var MWServiceProvider = require('../commons/MWServiceProvider');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');

exports.findById = function(req, res) {
    var errorCodes = [];
    var errors = [];
    var sampleModel;
    var rdfGraph;
    var mongoResp;

    console.log("Inside Sample2ViewHelperPromise.findById");
    SampleModel2 = mongoose.model('SampleModel2');

    promise_lib.resolve()
    // The object is returned as is to become param for next step
    .then({
        url: req.params.id
    })
    // promisified find method
    .then(ViewHelperUtil.promisify(SampleModel2.find, SampleModel2))
        .then(function(mongoRes) {
            mongoResp = mongoRes;
        })
    .done();

    if (mongoResp && mongoResp.length > 0) {
        console.log("Response: " + mongoResp + " ");

        res.send(JSON.stringify(mongoResp));
    } else {
        // TODO Error handling with codes
        // .catch(function(err) {
        //  errorCodes.push("ERROR_FINDING_SAMPLE_MODEL");
        //  errors.push(err);
        // })
        // promisified middleware service call
        promise_lib.resolve()
            .then(function() {
                var deferred = promise_lib.defer();
                MWServiceProvider.callServiceStandard("DummyService", "cmd1", null, function(err, data, response) {
                    if (err) {
                        console.log(err);
                        dererred.reject(err);
                    } else {
                        deferred.resolve(data);
                    }
                });
                return deferred.promise;
            })
        // .then(["DummyService", "cmd1", null]).then(ViewHelperUtil.promisify(MWServiceProvider.callServiceStandard, MWServiceProvider))
        // Middlewares output will be become input to this method. The method is not promisified and will execue as is
        // The tansformation from middleware response to the DataModel is done here.
        .then(function(data) {
            sampleModel = transformRDFToSample2Model(data);
            return sampleModel;
        })
        // promisified save to mongo
        .then(function() {
            var deferred = promise_lib.defer();
            sampleModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        })
        // .then(ViewHelperUtil.promisify(SampleModel2.save, sampleModel))
        // if there are any exception above, handle them
        .
        catch (function(err) {
            errors.push(err);
            // errorModule.handleError(err, "ERROR_FINDING_SAMPLE_MODEL", req, res);
        })
        // finally send the response
        .done();
        res.send(JSON.stringify(sampleModel));
    }

    if (errors.length > 0) {
        throw errors[0];
    }
};

exports.add = function(req, res) {
    SampleModel2 = mongoose.model('SampleModel');
    var sampleModel = new SampleModel2();
    var body = req.body;
    // Create model to be saved to MongoDB
    for (var k in body) sampleModel[k] = body[k];
    sampleModel.save(function(err, object) {
        if (err) {
            errorModule.handleError(err, "ERROR_ADDING_SAMPLE_MODEL", req, res);
        } else {
            console.log("Response: " + object + " ");
            res.send("" + object);
        }
    });
};

function transformRDFToSample2Model(data) {
    data = eval('(' + data + ')');
    console.log("Response from middleware: " + JSON.stringify(data.responseValueObjects.RDF.id));
    // for(var k in data) {console.log(k + " " + data[k]);}
    var rdf = data.responseValueObjects.RDF.id;
    if (!rdf) {
        // errorModule.handleError(null, "SAMPLE_MODEL_NOT_FOUND", req, res);
        throw new Error('SAMPLE_MODEL_NOT_FOUND');
    }
    var rdfGraph = rdfGraphUtil.getSyncGraphFromRDF(rdf);
    console.log("RDFGraph:" + JSON.stringify(rdfGraph));
    // Create model to be saved to MongoDB
    var sampleModel = new SampleModel2();
    sampleModel.url = rdfGraph.rootNodeUrl;
    // Get the rood node RDf Troples
    var rdfNode = rdfGraph.graph.node(rdfGraph.rootNodeUrl);
    // Convert the triples for the Node into relavent schema properties
    rdfGraphUtil.setProperties(rdfNode, sampleModel, {
        name: "http://canopusconsulting.com/test#name",
        description: "http://canopusconsulting.com/test#description"
    })
    sampleModel.children = [];
    var successors = rdfGraph.graph.successors(rdfGraph.rootNodeUrl);
    for (var i in successors) {
        sampleModel.children.push({
            childUrl: successors[i]
        });
    }
    console.log('ModelObject:' + JSON.stringify(sampleModel));
    return sampleModel;
}