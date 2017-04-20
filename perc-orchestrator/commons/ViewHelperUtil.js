var promise_lib = require('when');
var errorModule = require('../view_helpers/ErrorModule');
var viewHelperConstants = require('../view_helpers/ViewHelperConstants');
var mongoose = require('mongoose');

exports.promisify = function(nodeAsyncFn, context) {
    return function() {
        var defer = promise_lib.defer(),
            args = Array.prototype.slice.call(arguments);
        args.push(function(err, val) {
            if (err !== null) {
                return defer.reject(err);
            }
            return defer.resolve(val);
        });
        nodeAsyncFn.apply(context || {}, args);

        return defer.promise;
    };
};

exports.promisifyWithArgs = function(nodeAsyncFn, context, objectArray) {
    return function() {
        var defer = promise_lib.defer();
        var args = [];
        objectArray.forEach(function(object) {
            args.push(object);
        });
        args.push(function(err, val) {
            if (err !== null) {
                return defer.reject(err);
            }
            return defer.resolve(val);
        });
        nodeAsyncFn.apply(context || {}, args);

        return defer.promise;
    };
};

exports.buildCatchFunction = function(error, id) {
    return function(err) {
        console.log('error', err);
        if (id) {
            console.log('returning id:', id);
            IDCacheUtil.returnId(id);
        }
        error.err = err;
    }
}

exports.buildTaxonomyFunction = function(object) {
    return function(data) {
        object.taxonomyId = data.taxonomyId;
    }
}

exports.buildDoneFunction = function(error, errorCode, req, res) {
    return function(data) {
        if (error.err) {
            errorModule.handleError(error.err, errorCode, req, res);
        } else {
            res.send(JSON.stringify(data));
        }
    }
}

exports.buildCreateFunction = function(deferred) {
    return function(err, object) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(object);
        }
    }
}

exports.buildUpdateFunction = function(deferred) {
    return function(err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve({
                status: "OK"
            });
        }
    }
}

exports.buildExpression = function(criterion) {
    var expression = "(";
    criterion.forEach(function(criteria) {
        expression += " " + criteria.condType + " (state['" + criteria.attribute + "']" + criteria.operand + "'" + criteria.value + "') ";
    });
    expression += ")";
    return expression;
}

exports.getNodeProperty = function(node, propertyName, uri) {
    uri = uri || 'http://perceptronnetwork.com/ontologies/#';
    var rdfURI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
    if (node[uri + propertyName]) {
        return node[uri + propertyName][0].value;
    } else if (node[rdfURI + propertyName]) {
        return node[rdfURI + propertyName][0].value;
    }
    return '';
}

exports.getPropertyKey = function(property, uri) {
    uri = uri || 'http://perceptronnetwork.com/ontologies/#';
    return property.replace(uri, '');
}

exports.getPropertyValue = function(node, property) {
    return node[property][0].value;
}

var nonMetadataFields = {"parentNodeId": "", "parentRelation": "", "nodeType": "", "courseId":"",
    "nodeClass": "", "name": "", "contentGroup": "", "hasConstituent":"", "pedagogyId":"", "nodeSet":"", 
    "order": "", "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":""};

exports.retrieveMetadata = function(node, nodeSet) {
    var metadata = {};
    for(k in node) {
        var propKey = exports.getPropertyKey(k);
        if(!nonMetadataFields.hasOwnProperty(propKey)) {
            metadata[propKey] = exports.getPropertyValue(node, k);
        }
    }
    return metadata;
}

exports.setPropertyIfNotEmpty = function(node, property, element, toProperty) {
    var val = exports.getNodeProperty(node, property);
    toProperty = toProperty || property;
    if(val != '' && typeof val != 'undefined') {
        element[toProperty] = val;
        element.markModified(property);
    }
}

exports.setJSONObject = function(node, property, element) {
    var val = exports.getNodeProperty(node, property);
    if(val != '') {
        obj = JSON.parse(val);
        element[property] = JSON.parse(val);
        element.markModified(property);
    }
}

exports.getSequence = function(id, graph, sequenceType) {
    sequenceType = sequenceType || 'hasSequence';
    var sequence = [];
    var sequenceId;
    graph.outEdges(id).forEach(function(edgeId) {
        var edge = graph.edge(edgeId);
        if(exports.getNodeProperty(edge, 'relation_label') == sequenceType) {
            sequenceId = exports.getNodeProperty(edge, 'relationEnd');
        }
    });
    if(sequenceId && graph.hasNode(sequenceId)) {
        var tempArray = [];
        graph.outEdges(sequenceId).forEach(function(edgeId) {
            var edge = graph.edge(edgeId);
            tempArray[exports.getNodeProperty(edge, 'sequence_index')] = exports.getNodeProperty(edge, 'relationEnd');
        });
        for(k in tempArray) {
            if(tempArray[k] != '') {
                sequence.push(tempArray[k]);
            }
        }
    }
    return sequence;
}

exports.setSequence = function(sequence, graph, element, type) {

    if(!element.sequence)
    element.sequence = [];

    for(k in sequence) {
        var node = graph.node(sequence[k]);
        // nodeId = exports.getNodeProperty(node, 'nodeId');
        // console.log("SETTING SEQUENCE FOR ",element.metadata.nodeId,"sequendId",nodeId,"SEQUENCE IS", sequence[k])
        var nodeClass = exports.getNodeProperty(node, 'setType');
        if(nodeClass == 'course' || nodeClass == 'module' || nodeClass == 'lesson' || nodeClass == 'binder') {
            nodeClass = "learningobject";
        }
        if(type == 'LearningObjects' && nodeClass == 'learningobject') {
            if(element.sequence.indexOf(sequence[k]) == -1)
                element.sequence.push(sequence[k]);
        }
        if(type == 'LearningElements' && nodeClass != 'learningobject') {
            if(element.sequence.indexOf(sequence[k]) == -1)
                element.sequence.push(sequence[k]);        }
        if(type == 'Collection') {
            if(element.sequence.indexOf(sequence[k]) == -1)
                element.sequence.push(sequence[k]);
        }
    }
    element.markModified('sequence');
}

exports.setSequenceOld = function(sequence, graph, element, type) {
    for(k in sequence) {
        var node = graph.node(sequence[k]);
        var nodeClass = exports.getNodeProperty(node, 'setType');
        if(nodeClass == 'course' || nodeClass == 'module' || nodeClass == 'lesson') {
            nodeClass = "learningobject";
        }
        if(type == 'LearningObjects' && nodeClass == 'learningobject') {
            element.sequence.push(sequence[k]);
        }
        if(type == 'LearningElements' && nodeClass != 'learningobject') {
            element.sequence.push(sequence[k]);
        }
        if(type == 'Collection') {
            element.sequence.push(sequence[k]);
        }
    }
    element.markModified('sequence');
}


exports.getMediaType = function(mimeType) {
    if(viewHelperConstants.mediaTypeMapping.hasOwnProperty(mimeType)) {
        return viewHelperConstants.mediaTypeMapping[mimeType];
    }
    return mimeType;
}

exports.handleError = function(res, errors) {
    res.send(500, {error:errors[0].message});
}

exports.addToErrors = function(errors, error) {
    if (error instanceof Array) {
        errors.concat(error);
    } else {
        errors.push(error);
    }
}





/**
* To populate Object with nodeId, parentNodeId (fedora ids) using external IDs.
* In some request objects parentExtId will be null. In that case, parentNodeType, parentNodeId will be set to empty string.
*/

exports.populateIdentifiers = function(object) {
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        if(typeof object.parentNodeType == undefined || !object.parentNodeType) {
            object.parentNodeType = "";
        }
        if(typeof object.parentExtId == undefined || !object.parentExtId) {
            object.parentNodeId = "";
        }
    })
    .then(function() {
        return exports.getIdentifier(object.extId, object.nodeType);
    })
    .then(function(nodeId) {
        console.log("populateIdentifiers nodeId:",nodeId);
        object.nodeId = nodeId;
    })
    .then(function() {
        return exports.getIdentifier(object.parentExtId, object.parentNodeType);
    })
    .then(function(parentNodeId) {
        console.log("populateIdentifiers parentNodeId:",parentNodeId);
        object.parentNodeId = parentNodeId;
    })
    .done(function() {
        deferred.resolve(object);
    });
    return deferred.promise;
}


/**
*   Fetch identifier (fedora id) of a node using external ID and node type.
*
*/
exports.getIdentifier = function(externalId, type) {
    var deferred = promise_lib.defer();
    switch (type.toLowerCase()) {
        case viewHelperConstants.MEDIA:
            mediaModel = mongoose.model('MediaModel');
            getIdentifier(externalId, mediaModel, deferred);
            break;
        case viewHelperConstants.CONTENT:
            mediaContentModel = mongoose.model('MediaContentModel');
            getIdentifier(externalId, mediaContentModel, deferred);
            break;
        case viewHelperConstants.LEARNING_OBJECT:
            learningObjectModel = mongoose.model('LearningObjectModel');
            getIdentifier(externalId, learningObjectModel, deferred);
            break;
        case viewHelperConstants.COURSE:
            learningObjectModel = mongoose.model('LearningObjectModel');
            getIdentifier(externalId, learningObjectModel, deferred);
            break;
        case viewHelperConstants.MODULE:
            learningObjectModel = mongoose.model('LearningObjectModel');
            getIdentifier(externalId, learningObjectModel, deferred);
            break;    
        case viewHelperConstants.LESSON:
            learningObjectModel = mongoose.model('LearningObjectModel');
            getIdentifier(externalId, learningObjectModel, deferred);
            break;        
        case viewHelperConstants.BINDER:
            learningObjectModel = mongoose.model('LearningObjectModel');
            getIdentifier(externalId, learningObjectModel, deferred);
            break;        
        case viewHelperConstants.LEARNING_RESOURCE:    
            lrModel = mongoose.model('LearningResourceModel');
            getIdentifier(externalId, lrModel, deferred);
            break;
        case viewHelperConstants.COLLECTION:
            lcModel = mongoose.model('LearningCollectionModel');
            getIdentifier(externalId, lcModel, deferred);
            break;
        case viewHelperConstants.LEARNING_ACTIVITY:
            laModel = mongoose.model('LearningActivityModel');
            getIdentifier(externalId, laModel, deferred);
            break;
        default:
            deferred.resolve("");    
    }
    return deferred.promise;
}

function getIdentifier(externalId, modelObject, deferred) {
    console.log("externalId: ",externalId);
    modelObject.findOne({"metadata.nodeId": externalId},{identifier: 1}).exec(function(err, object) {
        if(err) {
            deferred.reject(err);
        } else if(!object) {
            deferred.resolve("");
        } else {
            if(object.is_deleted) {
                deferred.resolve("");
            } else {
                deferred.resolve(object.identifier);
            }
        }
    });
}