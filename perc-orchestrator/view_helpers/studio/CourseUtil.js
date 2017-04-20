/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Util for Course Related Functionalities. This contains pure computation functionalities
 *
 * @author ravitejagarlapati
 */
var RDFGraphUtil = require('../../commons/RDFGraphUtil');

exports.populateRDFFromLearningObject = function(learningObject, rdfData) {
    var id = learningObject.identifier.split(":");
    id = id[id.length - 1]

    var rdfNode = {
        "http://perceptronnetwork.com/ontologies/#node_type": [{
            "value": "NODE",
            "type": "literal"
        }],
        "http://perceptronnetwork.com/ontologies/#pedagogyId": [{
            "value": rdfData.pedagogyId,
            "type": "literal"
        }],
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            "value": "http://perceptronnetwork.com/ontologies/domainRelation/" + rdfData.pedagogyId + "/setType#" + learningObject.nodeSet,
            "type": "uri"
        }, {
            "value": learningObject.nodeSet,
            "type": "literal"
        }],
        "http://perceptronnetwork.com/ontologies/#id": [{
            "value": id,
            "type": "literal"
        }]
    };

    // TODO some of these are uri and not literal. Change them later when backend is changed

    RDFGraphUtil.setRDFNodeTriples(learningObject, rdfNode, {
        "description": {
            "predicate": "http://perceptronnetwork.com/ontologies/#description",
            "propertyType": "literal"
        },
        "identifier": {
            "predicate": "http://perceptronnetwork.com/ontologies/#object_uri",
            "propertyType": "literal"
        },
        "nodeSet": {
            "predicate": "http://perceptronnetwork.com/ontologies/#setType",
            "propertyType": "literal"
        },
        "name": {
            "predicate": "http://perceptronnetwork.com/ontologies/#name",
            "propertyType": "literal"
        }
    });

    if (learningObject.hasOwnProperty('metadata') && learningObject.metadata) {
        RDFGraphUtil.setRDFNodeTriples(learningObject.metadata, rdfNode, {
            "tutorName": {
                "predicate": "http://perceptronnetwork.com/ontologies/#tutorName",
                "propertyType": "literal"
            },
            "concept": {
                "predicate": "http://perceptronnetwork.com/ontologies/#concept",
                "propertyType": "literal"
            },
            "learningObjective": {
                "predicate": "http://perceptronnetwork.com/ontologies/#learningObjective",
                "propertyType": "literal"
            },
            "studentProfile": {
                "predicate": "http://perceptronnetwork.com/ontologies/#studentProfile",
                "propertyType": "literal"
            },
            "difficultyLevel": {
                "predicate": "http://perceptronnetwork.com/ontologies/#difficultyLevel",
                "propertyType": "literal"
            },
            "subject": {
                "predicate": "http://perceptronnetwork.com/ontologies/#subject",
                "propertyType": "literal"
            }
        });
    }

    if (learningObject.sequence && learningObject.sequence.length > 0) {
	    rdfNode["http://perceptronnetwork.com/ontologies/#hasConstituent"] = [];
	    for (var k in learningObject.sequence) {
	        rdfNode["http://perceptronnetwork.com/ontologies/#hasConstituent"][k] = {};
	        rdfNode["http://perceptronnetwork.com/ontologies/#hasConstituent"][k].value = learningObject.sequence[k];
	        rdfNode["http://perceptronnetwork.com/ontologies/#hasConstituent"][k].type = "uri";
	    }
	}

    if (!rdfData.rdf) {
        rdfData.rdf = {};
    }
    rdfData.rdf[learningObject.identifier] = rdfNode;

    if (!rdfData.relationId) {
        rdfData.relationId = 1;
    }
    for (var k in learningObject.children) {
        var relationId = learningObject.identifier + "/relation" + rdfData.relationId;
        var relationRDF = {
            "http://perceptronnetwork.com/ontologies/#id": [{
                "value": rdfData.relationId,
                "type": "literal"
            }],
            "http://perceptronnetwork.com/ontologies/#pedagogyId": [{
                "value": rdfData.pedagogyId,
                "type": "literal"
            }],
            "http://perceptronnetwork.com/ontologies/#relationEnd": [{
                "value": learningObject.children[k].identifier,
                "type": "uri"
            }],
            "http://perceptronnetwork.com/ontologies/#relationStart": [{
                "value": learningObject.identifier,
                "type": "uri"
            }],
            "http://perceptronnetwork.com/ontologies/#relation_label": [{
                "value": "hasConstituent",
                "type": "literal"
            }]
        };

        rdfData.rdf[relationId] = relationRDF;
        rdfData.relationId++;
        exports.populateRDFFromLearningObject(learningObject.children[k], rdfData);
    }

}