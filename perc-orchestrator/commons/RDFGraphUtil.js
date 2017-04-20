/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Used to parse RDF string and give graph object
 *
 * @author ravitejagarlapati
 */

var parser = require('n3').Parser();

var Digraph = require("graphlib").Digraph;

function localGetGraphFromRDF(rdfObject) {
    var graph = new Digraph();
    // var relations = {};
    // var nodes = {};
    var result = {};
    result.graph = graph;
    // result.relations = relations;
    // result.nodes = nodes;
    rdfObject = JSON.parse(rdfObject);
    for (var subject in rdfObject) {
        var isRelation = false;
        var fromNode, toNode;
        if (rdfObject.hasOwnProperty(subject)) {
            for (var propertyUrl in rdfObject[subject]) {
                if (propertyUrl.indexOf('relationStart', propertyUrl.length - 'relationStart'.length) !== -1) {
                    // relations[subject] = rdfObject[subject];
                    // console.log("Relation Start for " + subject + " is "+
                    // JSON.stringify(rdfObject[subject], null, 4));
                    fromNode = rdfObject[subject][propertyUrl][0];
                    if (!graph.hasNode(fromNode.value)) {
                        graph.addNode(fromNode.value);
                    }
                    isRelation = true;
                    // break;
                } else if (propertyUrl.indexOf('relationEnd',
                    propertyUrl.length - 'relationEnd'.length) !== -1) {
                    // relations[subject] = rdfObject[subject];
                    toNode = rdfObject[subject][propertyUrl][0];
                    if (!graph.hasNode(toNode.value)) {
                        graph.addNode(toNode.value);
                    }
                    // isRelation = true;
                    // break;
                } else if (propertyUrl === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
                    var propertyValues = rdfObject[subject][propertyUrl];
                    var isRootNode = false;
                    for (var i=0; i<propertyValues.length; i++) {
                        if (propertyValues[i].value === "http://canopusconsulting.com/type#RootNode") {
                            isRootNode = true;
                            break;
                        }
                    }
                    if (isRootNode) {
                        result.rootNodeUrl = subject;
                    }
                }

            }
        }
        if (isRelation) {
            graph.addEdge(subject, fromNode.value, toNode.value,
                rdfObject[subject]);
        } else {
            if (!graph.hasNode(subject)) {
                graph.addNode(subject, rdfObject[subject]);
            } else {
                graph.node(subject, rdfObject[subject]);
            }
            // nodes[subject] = rdfObject[subject];
        }
    }
    return result;
}

/*
 * Gets Graph from an RDF.
 *
 * @param rdfObject
 * @return graph object
 */
exports.getSyncGraphFromRDF = function(rdfObject) {
    return localGetGraphFromRDF(rdfObject);
}

/*
 * Gets Graph from an RDF. Graph is provided through callback.
 * @Deprecated - callback is not required as this is not asynchronous method
 * use @see getSyncGraphFromRDF which returns Graph object
 *
 * @param rdfObject
 * @param callback
 */
exports.getGraphFromRDF = function(rdfObject, callback) {
    var result = localGetGraphFromRDF(rdfObject);
    callback(result);
};

/*
 * Populates properties in the given model object from triples in the given RDF node
 * using the property-predicate mappings.
 *
 * @param rdfNode
 * @param modelObject
 * @param mappings
 * @return the property populated model object
 */
exports.setProperties = function(rdfNode, modelObject, mappings) {
    for (var k in mappings) {
        var rdfValueArr = rdfNode[mappings[k]];
        if (rdfValueArr) {
            modelObject[k] = rdfValueArr[0].value;
        }
    }
    return modelObject;
};

/*
 * Populates triples in the given RDF Node object from properties in the given model object
 * using the property-predicate mappings.
 *
 * @param modelObject
 * @param rdfNode
 * @param mappings
 * @return the property populated model object
 */
exports.setRDFNodeTriples = function(modelObject, rdfNode, mappings) {
    for (var k in mappings) {
        if (modelObject.hasOwnProperty(k)) {
	    // console.log(k + " " + JSON.stringify(mappings[k]) + " " + modelObject[k]);
        var modelPropertyValue = modelObject[k];
            rdfNode[mappings[k].predicate] = [];
            rdfNode[mappings[k].predicate][0] = {};
            rdfNode[mappings[k].predicate][0]["value"] = modelPropertyValue;
            rdfNode[mappings[k].predicate][0]["type"] = mappings[k].propertyType;
        }
    }
    return rdfNode;
};

/**
 * Parses the rdf in n3 format and returns graph through the callback.
 *
 * @param rdf
 * @param callback
 */
exports.parseN3 = function(rdf, callback) {
    var graph = {};
    graph.nodes = {};
    graph.numTriplets = 0;
    graph.numNodes = 0;
    graph.numRelations = 0;

    parser.parse(rdf, function(error, triple, prefixes) {
        if (triple) {
            graph.numTriplets++;

            var subjectNode = graph.nodes[triple.subject];
            if (!subjectNode) {
                subjectNode = {};
                subjectNode.properties = {};
                subjectNode.relations = {};
                graph.nodes[triple.subject] = subjectNode;
                graph.numNodes++;
            }
            var obj = triple.object;
            var pred = triple.predicate;
            // check if literal
            if (obj.indexOf('"') === 0) {
                // this is property
                if (!subjectNode.properties[pred]) {
                    subjectNode.properties[pred] = [];
                }
                subjectNode.properties[pred].push(obj.substring(1,
                    obj.length - 1));
            } else {
                // this is relation
                if (!subjectNode.relations[pred]) {
                    subjectNode.relations[pred] = [];
                }
                subjectNode.relations[pred].push(obj);
                graph.numRelations++;
            }

            // graph.triples.push(triple);
        } else {
            graph.prefixes = prefixes;
            // Parsing is done. Call the callback with the outout graph
            callback(graph);
        }
    });
};