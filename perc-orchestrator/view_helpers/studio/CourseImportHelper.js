/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for course import/export.
 *
 * @author Santhosh
 */

var csv = require('csv');
var fs = require('fs');
var Decompress = require('decompress');
var mongoose = require('mongoose');
var promise_lib = require('when');
var IDCacheUtil = require('../../commons/IDCacheUtil');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var CSVImportUtil = require('../../commons/CSVImportUtil');
var Digraph = require("graphlib").Digraph;
var uriPrefix = "http://perceptronnetwork.com/ontologies/#";
var ViewHelperConstants = require('../ViewHelperConstants');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var CSVValidationHelper = require('../studio/CSVValidationHelper');

exports.headerFields = {
    "parent node id": "parentNodeId",
    "parent relation": "parentRelation",
    "node id": "nodeId",
    "node type": "nodeType",
    "node class": "nodeClass",
    "name": "name",
    "content group": "contentGroup",
    "interception media id": "interceptionMediaId",
    "interception point": "interceptionPoint",
    "code/short name": "codeName",
    "identifier": "identifier",
    "description": "description",
    "language": "language",
    "keyword": "keyword",
    "offered by": "offeredBy",
    "popularity": "popularity",
    "rating": "rating",
    "completion results in": "completionResult",
    "classification - stream": "classificationStream",
    "classification - subject area": "classificationSubject",
    "mandatory": "isMandatory",
    "structure": "structure",
    "aggregation level": "aggregationLevel",
    "current status": "currentStatus",
    "current version": "currentVersion",
    "version - date": "versionDate",
    "version - number": "versionNumber",
    "version - role": "versionRole",
    "version - person": "versionPerson",
    "version - status": "versionStatus",
    "owner": "owner",
    "copy right": "copyRight",
    "cost": "cost",
    "contributors": "contributors",
    "annotation record": "annotationRecord",
    "format": "format",
    "size": "size",
    "location": "location",
    "duration": "duration",
    "purpose": "purpose",
    "study level": "studyLevel",
    "learner level": "learnerLevel",
    "intended end-user role": "intendedEndUserRole",
    "difficulty level": "difficultyLevel",
    "interactivity type": "interactivityType",
    "context": "context",
    "learning time": "learningTime",
    "semantic density": "semanticDensity",
    "learning element type": "elementType",
    "knowledge dimension": "knowledgeDimension",
    "bloom's taxonomy level": "bloomsTaxonomyLevel",
    "instruction usage": "instructionUsage",
    "interactivity level": "interactivityLevel",
    "interactivity location": "interactivityLocation",
    "intervention": "intervention",
    "intervention role": "interventionRole",
    "collaboration": "collaboration",
    "evaluation type": "evaluationType",
    "learning style": "learningStyle",
    "place in container": "placeInContainer",
    "lesson type": "lessonType",
    "tutoring mode": "tutoringMode",
    "tutor type": "tutorType",
    "tutor/learner ratio": "tutorLearnerRatio",
    "categorize by learner profile": "categorizeByLP",
    "tutoring hours by profile": "tutorHoursByProfile",
    "tutoring language supported": "tutorLanguage",
    "tutoring learning resource types": "tutorLRTypes",
    "program template": "programTemplate",
    "program answer": "programAnswer",
    "image": "image",
    "min proficiency": "minProficiency",
    "proficiency weightage": "proficiencyWeightage",
	"author": "author",
	"author image": "authorImage",
	"author profile url": "authorProfileURL",
	"owner type": "ownerType",
	"owner image": "ownerImage",
	"owner profile url": "ownerProfileURL",
	"offeredby type": "offeredByType",
	"offeredby image": "offeredByImage",
	"offeredby profile url": "offeredByProfileURL",
	"extended material": "extendedMaterial",
	"outcome": "outcome",
	"content source": "contentSource",
	"one line description": "shortDescription",
	"synopsis": "synopsis",
	"home page description": "homeDescription",
	"duration in weeks": "weeksDuration",
	"hours per week": "hoursPerWeek",
	"hours of video": "hoursOfVideo",
	"objectives" : "objectives",
	"project description" : "projectDescription",
	"project image" : "projectImage",
	"organization name" : "organizationName",
	"organization type" : "organizationType",
	"organization url" : "organizationURL",
	"organization image" : "organizationImage",
	"price" : "price",
	"tutoring hours" : "tutoringHours",
	"concept map image" : "conceptMapImage",
	"order" : "order",
	"delete status" : "deleteStatus",
	"recursive" : "deleteRecursive",
	"start date" : "startDate",
	"end date" : "endDate",
	"time unit" : "timeUnit",
	"offset" : "offset",
	"created by" : "createdBy",
	"show on home page": 'showOnHomePage'
}

function createUploadFolder(folder) {
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
}

exports.importCSV = function(req, res) {

	var now = new Date();
	var file = req.files.importFile;
	var header = {};
	var headerLength = 0;
	var json = {nodeIds:[]};

	var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        type: CSVImportUtil.CONTENT_IMPORT,
        logFile: 'courseimport_' + Date.parse(now) + '.log'
    };

    var logger = LoggerUtil.getFileLogger(statistics.logFile);
    logger.info('CourseImportHelper:importCSV() - Course/Content Import - Reading CSV');
	csv()
	.from.stream(fs.createReadStream(file.path))
	.on('record', function(row, index){

		if(index == 0) {
			header = row;
			headerLength = header.length;
		} else {
			if(row.length > headerLength) {
				logger.info('CourseImportHelper:importCSV() - Row length > header length - ' + JSON.stringify(row));
			}
			var object = new Object();
			for(k in row) {
				var objKey = getObjectKey(header[k].toLowerCase())
				object[objKey]=row[k];
			}

			if(object.nodeId != "" && (!object.deleteStatus || object.deleteStatus.toLowerCase() != 'delete' )) {
				if(object.nodeClass != ViewHelperConstants.PACKAGE) statistics.total++;
                if (json.hasOwnProperty(object.nodeId)) {
                    statistics.duplicate++;
                    object.errorLog = 'Had duplicate. ';
                }
				if(typeof object.identifier == 'undefined') {
					object.identifier = '';
				}
				json[object.nodeId] = object;
				json.nodeIds.push(object.nodeId);
			} else {
				logger.info('CourseImportHelper:importCSV() - Invalid or blank Node Id - ' + JSON.stringify(object));
			}
		}
	})
	.on('end', function(count){
	  	promise_lib.resolve()
  		.then(function() {
            return CSVImportUtil.initalizeCSVImport(file, statistics);
        })
        .then(function() { // Copy file.
            var deferred = promise_lib.defer();
            var fileName = Date.parse(now)+'.json';
            createUploadFolder(appConfig.CSV_UPLOAD_DIR);
            var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
            fs.writeFile(filePath, JSON.stringify(json), function(err) {
                if(err) console.log("File write error:"+err);
            });
            return filePath;
        })
        .then(function(filePath) { // Create Queue record.
            statistics.filepath = filePath;
            return CSVImportUtil.createCSVImportQueueRecord(statistics);
        })
        .done(function(logRecord) {
            res.send(JSON.stringify(logRecord));
        });
	})
	.on('error', function(error){
		console.log('error', error);
	  	res.send(error);
	});
}

function getObjectKey(csvKey) {
	if(exports.headerFields[csvKey]) {
		return exports.headerFields[csvKey];
	} else {
		return csvKey.replace(/\s+/g, '_');
	}
}

exports.createGraph = function(json, statistics) {

	var logger = LoggerUtil.getFileLogger(statistics.logFile);
    logger.info('CourseImportHelper:createGraph() - Course/Content Import - START');
	statistics.startTime = new Date();
	var graph = new Digraph();
	var errors = [];
	var errorCaught = false;
	var saveResult = null;
	promise_lib.resolve()
	.then(function() {
		var nodeTypeCounts = {};
		for(k in json) {
			if(json[k].nodeType) {
				var count = nodeTypeCounts[json[k].nodeType.toLowerCase()];
				if(!count) {
					nodeTypeCounts[json[k].nodeType.toLowerCase()] = 1;
				} else {
					nodeTypeCounts[json[k].nodeType.toLowerCase()]++;
				}
			}
		}
		logger.info('CourseImportHelper:createGraph() - Node Type Mapping - ' + JSON.stringify(nodeTypeCounts));
	})
	.then(function(){
		// get parent nodes for elements without parents
		logger.info('CourseImportHelper:createGraph() - Validating the JSON');
		return validateJson(json, errors);
	})
	.then(function() {
		logger.info('CourseImportHelper:createGraph() - JSON validated - Errors - ' + JSON.stringify(errors));
		logger.info('CourseImportHelper:createGraph() - Creating content/media nodes from LR/LA/Content. Count before - ' + json.nodeIds.length);
		return createContents(json);
	})
	.then(function() {
		logger.info('CourseImportHelper:createGraph() - Content/media nodes created from LR/LA/Content. Count after - ' + json.nodeIds.length);
		logger.info('CourseImportHelper:createGraph() - Creating nodes in the graph');
		return createNodes(json, errors, graph);
	})
	.then(function() {
		logger.info('CourseImportHelper:createGraph() - Nodes created in the graph');
		logger.info('CourseImportHelper:createGraph() - Creating relations in the graph');
		return createRelations(json, errors, graph)
	})
	.then(function() {
		logger.info('CourseImportHelper:createGraph() - Relations created in the graph');
		logger.info('CourseImportHelper:createGraph() - Create concepts');
		return createConcepts(json, graph);
	})
	.then(function() {
		logger.info('CourseImportHelper:createGraph() - Concepts created');
		return exports.saveIntoOrchestrator(graph, errors, logger);
	})
	.then(function(result) {
		saveResult = result.respObjects;
		if(result.courseId != '') {
			logger.info('CourseImportHelper:createGraph() - Updating course timestamp');
			updateCourseTimestamp(result.courseId);
			logger.info('CourseImportHelper:createGraph() - Emitting update concept map event');
			EventHelper.emitEvent('updateConceptMap', result.courseId);
			ClusterHub.emit('event', {type: 'cache', action: 'clear', courseId: result.courseId});
		} else {
			logger.info('CourseImportHelper:createGraph() - Emitting update concept map event');
			EventHelper.emitEvent('updateConceptMap', null, null, json['conceptIds']);
		}

		if(saveResult) {
			saveResult.forEach(function(result) {
				if(result.saveType && result.saveType == ViewHelperConstants.INSERT) {
					statistics.inserted++;
				} else if(result.saveType && result.saveType == ViewHelperConstants.UPDATE) {
					statistics.updated++;
				}
			})
		}
		// export as csv and save the csv file...
		var deferred = promise_lib.defer();
		var fileName = statistics["identifier"]+'.csv';
        var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
		var jsonCSV = require('json-csv');
		var jsonArray = [];
		for(k in json) {
			if(k != 'index' && k != 'nodeIds' && k != 'conceptIds') {
				jsonArray.push(json[k]);
			}
		}
		var jsonFields = [];
		for(k in exports.headerFields) {
			jsonFields.push({name: exports.headerFields[k], label: k});
		}
		var args = {
			data: jsonArray,
			fields: jsonFields
		}
		jsonCSV.toCSV(args, function(err, csv) {
			if(err) {
				logger.error('CourseImportHelper:createGraph() - JSON to CSV failed - ' + err);
            	deferred.reject(err);
	        } else {
	            fs.writeFile(filePath, csv, function(err) {
	                deferred.resolve(filePath);
	                logger.info('CourseImportHelper:createGraph() - ' + filePath + ' file created.');
	            });
	        }
		});
		return deferred.promise;
	})
	.then(function(filePath) {
		logger.info('CourseImportHelper:createGraph() - Course/Content Import completed');
		saveToMW(graph, logger);
		return filePath;
	})
	.catch(function(err) {
		logger.info('CourseImportHelper:createGraph() - Course/Content Import failed' + err);
		errors.push('Error importing csv - ' + err);
		errorCaught = true;
	})
	.done(function(filePath) {
		if(!filePath) filePath = '';
		var jsonFilePath = statistics.filepath;
		CSVImportUtil.deleteFile(jsonFilePath);
		statistics.filepath = filePath;
        statistics.endTime = new Date();
        statistics.exeTime = statistics.endTime.getTime() - statistics.startTime.getTime();
        statistics.warning = errors.length;
        statistics.errorDetails = errors;
		if(errorCaught) {
            statistics.status = CSVImportUtil.FAIL;
            setTimeout(function() {
	            sesWrapper.sendSupportMail('Course/Content Import - Failed', statistics.logFile, 'Course/Content import failed. <br> Please check the attached log file for errors.');
	        }, 5000);
        } else {
            statistics.status = CSVImportUtil.COMPLETE;
        }
        logger.info('CourseImportHelper:createGraph() - Course/Content Import statistics - ' + JSON.stringify(statistics));
        CSVImportUtil.updateCSVImportQueueRecord(statistics);
	})
}

exports.createGraphWithoutStats = function(json) {

	var graph = new Digraph();
	var errors = [];
	var errorCaught = false;
	var saveResult = null;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function(){
		// get parent nodes for elements without parents
		return validateJson(json,errors);
	})
	.then(function() {
		return createContents(json);
	})
	.then(function() {
		return createNodes(json, errors, graph);
	})
	.then(function() {
		return createRelations(json, errors, graph)
	})
	.then(function() {
		return createConcepts(json, graph);
	})
	.then(function() {
		return exports.saveIntoOrchestrator(graph, errors);
	})
	.then(function(result) {
		saveResult = result.respObjects;
		if(result.courseId != '') {
			updateCourseTimestamp(result.courseId);
			EventHelper.emitEvent('updateConceptMap', result.courseId);
		} else {
			EventHelper.emitEvent('updateConceptMap', null, null, json['conceptIds']);
		}
		saveToMW(graph);
	})
	.catch(function(err) {
		console.log('Error in createGraphWithoutStats()', err);
		deferred.reject(err);
	}).done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}

function updateCourseTimestamp(courseId) {
	MongoHelper.update('CourseModel', {identifier: courseId}, {$set:{lastUpdated: new Date()}}, function(err, obj) {
 		if (err) {
 			console.log('Course timestamp update failed: ' + err);
 		} else {
			console.log('Course timestamp updated');
		}
	});
}

function createNodes(json, errors, graph) {
	var deferred = promise_lib.defer();
	var promises = [];
	for(k in json) {
		if(k != 'index' && k != 'nodeIds' ) {
			promises.push(createNode(json[k], graph, json, errors));
		}
	}
	promise_lib.all(promises).then(function(value) {
	    deferred.resolve(value);
	});
	return deferred.promise;
}


function getObjectByNodeId(model, nodeId, defer) {
	model.findOne({'metadata.nodeId': nodeId}).exec(function(err, obj) {
		if (err) {
			defer.resolve();
		} else {
			if (obj && obj != null && obj.identifier) {
				defer.resolve(obj);
			} else {
				defer.resolve();
			}
		}
	});
}


function getIdentifierForNodeId(model, nodeId, defer) {
    model.findOne({'metadata.nodeId': nodeId},{identifier: 1, _id: 0, sequenceId:1}).lean().exec(function(err, obj) {
		if (err) {
			defer.resolve();
		} else {
			if (obj && obj != null && obj.identifier) {
				defer.resolve(obj);
			} else {
				defer.resolve();
			}
		}
	});
}

function getSequenceIdForNodeId(nodeId) {
	var defer = promise_lib.defer();
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({'metadata.nodeId': nodeId},{sequenceId: 1, _id: 0}).lean().exec(function(err, obj) {
		if (err) {
			defer.resolve();
		} else {
			if (obj && obj != null && obj.sequenceId) {
				defer.resolve(obj.sequenceId);
			} else {
				defer.resolve();
			}
		}
	});
	return defer.promise;
}

function getPackageIdForNodeId(nodeId, defer) {
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({'packages.metadata.nodeId':nodeId},{packages: {$elemMatch:{'metadata.nodeId': nodeId}}}).lean().exec(function(err, course) {
		if (err) {
			defer.resolve();
		} else {
			if (course && course.packages && course.packages != null && course.packages.length > 0) {
				defer.resolve({'identifier':course.packages[0].identifier});
			} else {
				defer.resolve();
			}
		}
	});
}

function getInstructorForNodeId(nodeId, defer) {
	InstructorModel = mongoose.model('InstructorModel');
	InstructorModel.findOne({nodeId: nodeId},{identifier: 1, _id: 0}).lean().exec(function(err, obj) {
		if (err) {
			defer.resolve();
		} else {
			if (obj && obj != null && obj.identifier) {
				defer.resolve(obj);
			} else {
				defer.resolve();
			}
		}
	});
}

function getIdentifier(node) {
	var defer = promise_lib.defer();
	var setType = node.nodeType;
	var nodeClass = setType;
	if(setType == ViewHelperConstants.COURSE || setType == ViewHelperConstants.MODULE || setType == ViewHelperConstants.LESSON || setType == ViewHelperConstants.BINDER) {
		nodeClass = ViewHelperConstants.LEARNING_OBJECT;
	}
	var nodeId = node.nodeId;
	promise_lib.resolve()
	.then(function() {
		if (nodeId && nodeId != null && nodeId != '' && node.identifier == '') {
			switch (nodeClass) {
				case ViewHelperConstants.CONCEPT:
			        defer.resolve();
			        break;
			    case ViewHelperConstants.CONTENT:
			        MediaContentModel = mongoose.model('MediaContentModel');
			        getIdentifierForNodeId(MediaContentModel, nodeId, defer);
			        break;
			    case ViewHelperConstants.MEDIA:
			        MediaModel = mongoose.model('MediaModel');
			        getIdentifierForNodeId(MediaModel, nodeId, defer);
			        break;
			    case ViewHelperConstants.LEARNING_OBJECT:
			        LearningObjectModel = mongoose.model('LearningObjectModel');
			        getIdentifierForNodeId(LearningObjectModel, nodeId, defer);
			        break;
			    case ViewHelperConstants.LEARNING_OBJECTIVE:
			        LearningObjectiveModel = mongoose.model('LearningObjectiveModel');
			        getIdentifierForNodeId(LearningObjectiveModel, nodeId, defer);
			        break;
			    case ViewHelperConstants.LEARNING_RESOURCE:
			        LearningResourceModel = mongoose.model('LearningResourceModel');
			        getIdentifierForNodeId(LearningResourceModel, nodeId, defer);
			        break;
			    case ViewHelperConstants.COLLECTION:
			        LearningCollectionModel = mongoose.model('LearningCollectionModel');
			        getIdentifierForNodeId(LearningCollectionModel, nodeId, defer);
			        break;
				case ViewHelperConstants.LEARNING_ACTIVITY:
			        LearningActivityModel = mongoose.model('LearningActivityModel');
			        getIdentifierForNodeId(LearningActivityModel, nodeId, defer);
			        break;
			    case ViewHelperConstants.FACULTY:
			        getInstructorForNodeId(nodeId, defer);
			    	break;
			    case ViewHelperConstants.TUTOR:
			    	getInstructorForNodeId(nodeId, defer);
			    	break;
			    case ViewHelperConstants.PACKAGE:
			        getPackageIdForNodeId(nodeId, defer);
			    	break;
			    default:
			    	defer.resolve();
			}
		} else {
			defer.resolve();
		}
	});
	return defer.promise;
}

function createNode(node, graph, json, errors) {
	var error = false;
	var conceptViewHelper = require('./ConceptViewHelper');
	node.nodeType = node.nodeType.trim().toLowerCase();
	node.nodeClass = node.nodeClass.trim().toLowerCase();
	if(node.nodeClass == '') {
		node.nodeClass = node.nodeType;
	}
	PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		defer.resolve(CSVValidationHelper.validateNode(node));
		return defer.promise;
	})
	.then(function(validatedNode) {
		var deferred = promise_lib.defer();
		if(!validatedNode.isValid) {
			if(validatedNode.messages.length > 0){
				validatedNode.messages.forEach(function(item) {
					errors.push(item);
				});
			}
			error = true;
			delete json[node.nodeId];
			delete json.nodeIds[node.nodeId];
			deferred.reject(validatedNode.messages);
		} else {
			if(validatedNode.messages.length > 0){
				validatedNode.messages.forEach(function(item) {
					errors.push(item);
				});
			}
			node = validatedNode.node;
			if (node.startDate && node.startDate != null && node.startDate != '') {
				var startDate = new Date(node.startDate);
				if (!isNaN(startDate.getTime())) {
					node.startDate = startDate;
				}
			}
			if (node.endDate && node.endDate != null && node.endDate != '') {
				var endDate = new Date(node.endDate);
				if (!isNaN(endDate.getTime())) {
					node.endDate = endDate;
				}
			}
			if (node.duration && node.duration != null && node.duration != '' && !isNaN(node.duration)) {
				node.duration = parseInt(node.duration) * 60;
			}
			getIdentifier(node)
			.then(function(nodeObj) {
				// set node start date and end date
				if (nodeObj && nodeObj.identifier != '') {
					if(node.nodeType == 'course' || node.nodeType == 'module' || node.nodeType == 'lesson') {
						node.sequenceId = nodeObj.sequenceId;
					}
					deferred.resolve(nodeObj.identifier);
				}
				else {
					if(node.identifier && node.identifier != '') {
						node.isNew = false;
						deferred.resolve(node.identifier);
					} else if(node.nodeType == 'concept') {
						var concept = node.name.trim();
						var context = node.context.trim();
						node.name = concept;
						node.context = context;
						isNew = true;
						conceptViewHelper.addConcept(concept, context)
						.then(function(identifier) {
							deferred.resolve(identifier);
						});
					} else {
						isNew = true;
						return IDCacheUtil.getIdentifierPromise(deferred);
					}
				}
			});
		}
		return deferred.promise;
	})
	.then(function(identifier) {
		node.identifier = identifier;
		var deferred = promise_lib.defer();
		PedagogyNodeSetModel.findOne({'nodeSetName': node.nodeType, 'nodeSetClass': node.nodeClass}).exec(function(err, nodeset) {
			if(err) {
				deferred.reject(err);
			} else {
				if(nodeset == null) {
					node.nodeSet = node.nodeType;
					deferred.resolve(node);
				} else {
					node.pedagogyId = nodeset.pedagogyId;
					node.nodeSet = nodeset.nodeSetName;
					deferred.resolve(node);
				}
			}
		})
		return deferred.promise;
	})
	.then(function(node) {
		return createGraphNode(node, graph);
	})
	.catch(function(err) {
		console.log('Error adding node ------ ', err, '',node.nodeId);
	})
	.done(function(rdfNode) {
		if (!graph.hasNode(node.identifier) && !error) {
	    		graph.addNode(node.identifier, rdfNode);
		}
		deferred.resolve(node);
	});
	return deferred.promise;
}

function validateJson(json,errors){
	var deferred = promise_lib.defer();
	var promises = [];
	for(k in json) {
		if(k != 'index' && k != 'nodeIds') {
			node = json[k];
			promises.push(getParent(json,node,errors));
		}
	}
	promise_lib.all(promises).then(function(value) {
		if(value) {
			value.forEach(function(respObj){
				if(respObj) {
					json[respObj.nodeId] = respObj;
					json.nodeIds.push(respObj.nodeId);
				}
			});
		}
		deferred.resolve();
	})
	.catch(function(err){
		console.log("error creating json",err);
		deferred.resolve();
	})
	return deferred.promise;
}

function getParent(json,node,errors) {
	if(typeof node.contentGroup == 'undefined')
		node.contentGroup = '';
	if(node.nodeType == ViewHelperConstants.COURSE) {
		promise_lib.resolve()
		.then(function(){
			var d = promise_lib.defer();
			getObjectByNodeId(LearningObjectModel, node.nodeId, d);
			return d.promise;
		})
		.catch(function(err){errors.push(err);})
		.done(function(courseObj){
			if(courseObj) {
				node.packageSequenceId = courseObj.metadata.hasPackageSequence;
				node.outcomeSequenceId = courseObj.metadata.hasOutcomeSequence;
			}
		})
	}
	var dmain = promise_lib.defer();
	if(node.nodeType != 'course' && node.parentNodeId && !json[node.parentNodeId]) {
		promise_lib.resolve()
		.then(function(){
			var d = promise_lib.defer();
			if(node.nodeClass == 'learningobject' || node.nodeClass == 'learningresource' || node.nodeClass == 'learningactivity') {
				getObjectByNodeId(LearningObjectModel, node.parentNodeId, d);
			} else if(node.nodeType == 'content' && node.contentGroup.toLowerCase() != 'interception') {
				getParentForContent(node.parentNodeId,d);
			} else {
				d.resolve();
			}
			return d.promise;
		})
		.catch(function(err) {
			//errors other than mongo fetch
			console.log("ERROR WHILE FETCHING PARENT NODE", err);
		})
		.done(function(parentNode){
			var resp = {};
			if(parentNode) {
				for(k in parentNode.metadata) {
					if(k != 'node_type' || k != 'object_uri') {
						resp[k] = parentNode.metadata[k];
					}
				}
				resp['sequenceId'] = parentNode.sequenceId
				resp['nodeType']= parentNode.nodeSet;
				if(parentNode.nodeSet == 'lesson' || parentNode.nodeSet == 'module' || parentNode.nodeSet == 'course') {
					resp['nodeClass']= 'learningobject';
				} else if(parentNode.nodeSet == 'learningactivity' || parentNode.nodeSet == 'learningresource') {
					resp['nodeClass']= parentNode.nodeSet;
					resp['isMandatory']= parentNode.metadata.isMandatory;
					resp['learningTime']= parentNode.metadata.learningTime;
					resp['instructionUsage'] = parentNode.metadata.instructionUsage;
					resp['minProficiency'] = parentNode.metadata.minProficiency;
					resp['proficiencyWeightage']= parentNode.metadata.proficiencyWeightage;
				}
				resp['contentGroup'] = '';
				resp['isPartial']=true;
				dmain.resolve(resp);
			} else {
				var index = '';
				for(var k in json)
				{
					if(json[k].parentNodeId == node.nodeId)
					{
						delete json[k];
						index = json['nodeIds'].indexOf(k);
						json['nodeIds'].splice(index,1)	;
					}
				}
				delete json[node.nodeId];
				index = json['nodeIds'].indexOf(node.nodeId);
				json['nodeIds'].splice(index,1);
				errors.push("node skipped because of parent node is not available for node Id:"+node.nodeId);
				dmain.resolve();
			}
		})
	} else {
		dmain.resolve();
	}
	return dmain.promise;
}

function getParentForContent(contentParentId,defer) {
	//content's parent could be one of LA/LR/LO
	promise_lib.resolve()
	.then(function(){
		var d = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.findOne({'metadata.nodeId': contentParentId}).exec(function(err, obj) {
			if (err) {
				d.resolve();
			} else {
				if (obj && obj != null)
					d.resolve(obj);
				else
					d.resolve();
			}
		});
		return d.promise;
	})
	.then(function(contentParentNode){
		var d = promise_lib.defer();
		if(contentParentNode) {
			d.resolve(contentParentNode);
		} else {
			LearningResourceModel = mongoose.model('LearningResourceModel');
			LearningResourceModel.findOne({'metadata.nodeId': contentParentId}).exec(function(err, obj) {
				if (err) {
					d.resolve();
				} else {
					if (obj && obj != null) {
						d.resolve(obj);
					} else {
						d.resolve();
					}
				}
			});
		}
		return d.promise;
	})
	.then(function(contentParentNode){
		var d = promise_lib.defer();
		if(contentParentNode) {
			d.resolve(contentParentNode);
		} else {
			LearningObjectModel = mongoose.model('LearningObjectModel');
			LearningObjectModel.findOne({'metadata.nodeId': contentParentId}).exec(function(err, obj) {
				if (err) {
					d.resolve();
				} else {
					if (obj && obj != null)
						d.resolve(obj);
					else
						d.resolve();
				}
			});
		}
		return d.promise;
	})
	.catch(function(err){
		defer.resolve();
	})
	.done(function(contentParentNode){
		if(contentParentNode)
			defer.resolve(contentParentNode);
		else
			defer.resolve();
	});
}

var skipProperties=['parentNodeId', 'parentRelation', 'contentGroup', 'sequenceId', 'interceptionMediaId', 'interceptionPoint'];

function createGraphNode(node, graph) {
	var deferred = promise_lib.defer();
	var rdfNode = {
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            "value": "http://perceptronnetwork.com/ontologies/domainRelation/" + node.pedagogyId + "/setType#" + node.nodeSet,
            "type": "uri"
        }, {
            "value": node.nodeSet,
            "type": "literal"
        }]
    };
    addProperty(rdfNode, "node_type", "NODE");
    addProperty(rdfNode, "object_uri", node.identifier);
    addProperty(rdfNode, "setType", node.nodeSet);
    for(k in node) {
    	if(skipProperties.indexOf(k) == -1) {
    		addProperty(rdfNode, k, node[k]);
    	}
    }
	if(node.nodeClass == ViewHelperConstants.LEARNING_OBJECT || node.nodeClass == ViewHelperConstants.COLLECTION) {
		promise_lib.resolve()
		.then(function() {
			var defer = promise_lib.defer();
			if(!node.sequenceId || node.sequenceId == '') {
				IDCacheUtil.getId(function(identifier) {
					addProperty(rdfNode, "hasSequence", identifier);
					defer.resolve();
				});
			}else {
				addProperty(rdfNode, "hasSequence", node.sequenceId);
				defer.resolve();
			}
			return defer.promise;
		})
		.then(function() {
			var defer = promise_lib.defer();
			if(node.nodeType == ViewHelperConstants.COURSE) {
				if(!node.packageSequenceId || node.packageSequenceId == '') {
					IDCacheUtil.getId(function(identifier) {
						addProperty(rdfNode, "hasPackageSequence", identifier);
						defer.resolve();
					});
				} else {
					addProperty(rdfNode, "hasPackageSequence", node.packageSequenceId);
					defer.resolve();
				}
			} else {
				defer.resolve();
			}
			return defer.promise;
		})
		.then(function() {
			var defer = promise_lib.defer();
			if(node.nodeType == ViewHelperConstants.COURSE) {
				if(!node.outcomeSequenceId || node.outcomeSequenceId == '') {
					IDCacheUtil.getId(function(identifier) {
						addProperty(rdfNode, "hasOutcomeSequence", identifier);
						defer.resolve();
					});
				} else {
					addProperty(rdfNode, "hasOutcomeSequence", node.outcomeSequenceId);
					defer.resolve();
				}
			} else {
				defer.resolve();
			}
			return defer.promise;
		})
		.done(function(){deferred.resolve(rdfNode);});
	} else {
		deferred.resolve(rdfNode);
	}
	return deferred.promise;
}

function addProperty(rdfNode, propName, propValue) {
	rdfNode[uriPrefix + propName] = [];
    rdfNode[uriPrefix + propName][0] = {
    	"value": propValue,
    	"type": 'literal'
    }
}

function createRelations(json, errors, graph) {
	var deferred = promise_lib.defer();
	json['index'] = 1;

	for(k in json.nodeIds) {
		try {
			var node = json[json.nodeIds[k]];
			if((node && typeof node.parentNodeId != 'undefined' && node.parentNodeId != '') || (node && node.isPartial == true)) {
				var parentNode = json[node.parentNodeId];
				if(parentNode) {
					var relation = node.parentRelation;
					if(relation == 'contains') relation = 'hasConstituent';
					if(relation == '') relation = 'associatedTo';
	                if(node.nodeType == ViewHelperConstants.CONCEPT) {
	                    if(relation == 'subconcept of' || relation == 'subconcept') {
	                        relation = 'associatedTo';
	                        node.contentGroup = 'subconcept';
	                    } else if(relation == 'pre-requisite') {
	                        relation = 'associatedTo';
	                        node.contentGroup = 'pre-requisite';
	                    } else if(relation == 'related to' || relation == 'related') {
	                        relation = 'associatedTo';
	                        node.contentGroup = 'related';
	                    } else if (relation == 'same as') {
	                        relation = 'hasEquivalent';
	                        node.contentGroup = 'sameAs';
	                    } else {
	                        node.contentGroup = relation;
	                        relation = 'associatedTo';
	                    }
	                }
					if(node.contentGroup && node.contentGroup.toLowerCase() == 'interception') {
						if(!json['interceptions']) json['interceptions'] = [];
						json['interceptions'].push(node);
						continue;
					}
					createGraphEdge(graph, node, parentNode, relation, json.index++);
					if(parentNode.nodeClass == ViewHelperConstants.LEARNING_OBJECT || parentNode.nodeClass == ViewHelperConstants.COLLECTION) {
						if(node.nodeClass == ViewHelperConstants.LEARNING_RESOURCE || node.nodeClass == ViewHelperConstants.LEARNING_ACTIVITY
							|| node.nodeClass == ViewHelperConstants.LEARNING_OBJECT || node.nodeClass == ViewHelperConstants.BINDER) {
							if(typeof parentNode.sequence == 'undefined') parentNode.sequence = [];
							parentNode.sequence.push(node.identifier);
						}
					}
					if(parentNode.nodeClass == ViewHelperConstants.BINDER) {
						if(node.nodeClass == ViewHelperConstants.CONTENT) {
							if(typeof parentNode.sequence == 'undefined') parentNode.sequence = [];
							parentNode.sequence.push(node.identifier);
						}
					}
					if(parentNode.nodeClass == ViewHelperConstants.LEARNING_OBJECT && node.nodeClass == ViewHelperConstants.PACKAGE) {
						if(typeof parentNode.packageSequence == 'undefined') parentNode.packageSequence = [];
							parentNode.packageSequence.push(node.identifier);
					}
					if(parentNode.nodeClass == ViewHelperConstants.LEARNING_OBJECT && node.nodeClass == ViewHelperConstants.LEARNING_OBJECTIVE) {
						if(typeof parentNode.outcomeSequence == 'undefined') parentNode.outcomeSequence = [];
							parentNode.outcomeSequence.push(node.identifier);
					}
				} else {
					errors.push("relation skipped because of parent node is not available for node Id:"+node.nodeId);
				}
			}
		} catch(err) {
			console.log('Exception in createRelations for node ' + node + ' Error - ' + err);
		}
	}

	// Create Sequences
	for(k in json) {
		if(k == 'nodeIds' || k == 'index') {
			continue;
		}
		var node = json[k];
		if(node.sequence && typeof node.sequence != 'undefined') {
			createSequence(graph, node.identifier, node.sequence, json, 'hasSequence');
		}
		if(node.packageSequence && typeof node.packageSequence != 'undefined') {
			createSequence(graph, node.identifier, node.packageSequence, json, 'hasPackageSequence');
		}
		if(node.outcomeSequence && typeof node.outcomeSequence != 'undefined') {
			createSequence(graph, node.identifier, node.outcomeSequence, json, 'hasOutcomeSequence');
		}
	}

	//Create Interceptions
	if(json.interceptions) {
		json.interceptions.forEach(function(node) {
			var parentNode = json[node.parentNodeId];
			if(parentNode) {
				var intcpMediaId = node.interceptionMediaId;
				if(intcpMediaId == '') {
					// Attach the interception to main media
					var parentEdges = graph.outEdges(parentNode.identifier);
					parentEdges.forEach(function(edgeId) {
						var edge = graph.edge(edgeId);
						var endNode = graph.node(ViewHelperUtil.getNodeProperty(edge, 'relationEnd'));
						if(ViewHelperUtil.getNodeProperty(endNode, 'setType') == 'media' &&
							ViewHelperUtil.getNodeProperty(edge, 'relationType') == 'main') {
							intcpMediaId = ViewHelperUtil.getNodeProperty(endNode, 'nodeId');
						}
					});
				}
				var props = {
					interceptionMediaId: intcpMediaId,
					interceptionPoint: node.interceptionPoint
				}
				createGraphEdge(graph, node, parentNode, node.parentRelation, json.index++, props);
			} else {
				errors.push("relation skipped (interception) because of parent node is not available for node Id:"+node.nodeId);
			}
		});
		delete json.interceptions;
	}
	deferred.resolve(json);
	return deferred.promise;
}

function createGraphEdge(graph, node, parentNode, relation, index, props) {
	var relationId = parentNode.identifier + "/relation" + index;
    var relationRDF = {
        "http://perceptronnetwork.com/ontologies/#id": [{
            "value": index + '',
            "type": "literal"
        }],
        "http://perceptronnetwork.com/ontologies/#relationEnd": [{
            "value": node.identifier,
            "type": "uri"
        }],
        "http://perceptronnetwork.com/ontologies/#relationStart": [{
            "value": parentNode.identifier,
            "type": "uri"
        }],
        "http://perceptronnetwork.com/ontologies/#relation_label": [{
            "value": relation,
            "type": "literal"
        }]
    };
    if(props) {
    	for(k in props) {
    		addProperty(relationRDF, k, props[k]);
    	}
    }
    if(typeof node.contentGroup != 'undefined' && node.contentGroup != '') {
    	relationRDF['http://perceptronnetwork.com/ontologies/#relationType'] = [];
    	relationRDF['http://perceptronnetwork.com/ontologies/#relationType'][0] = {
    		value: node.contentGroup.toLowerCase(),
    		"type": "literal"
    	};
    }
    graph.addEdge(relationId, parentNode.identifier, node.identifier, relationRDF);
}

function createSequence(graph, nodeId, sequence, json, sequenceType) {
	sequenceType = sequenceType || 'hasSequence';
	var gNode = graph.node(nodeId);
	var sequenceId = ViewHelperUtil.getNodeProperty(gNode, sequenceType);
	if(!sequenceId)
		sequenceId = gNode.sequenceId;
	var rdfNode = {};
    addProperty(rdfNode, "id", sequenceId);
    addProperty(rdfNode, "node_type", "ORDERED_LIST");
    addProperty(rdfNode, "pedagogyId", ViewHelperUtil.getNodeProperty(gNode, 'pedagogyId'));
    addProperty(rdfNode, "setType", ViewHelperConstants.SEQUENCE);
    addProperty(rdfNode, "title", "Sequence");
	if (!graph.hasNode(sequenceId)) {
    	graph.addNode(sequenceId, rdfNode);
	}

	var sequenceNode = {'identifier': sequenceId};
	createGraphEdge(graph, sequenceNode, {'identifier': nodeId}, sequenceType, json.index++);
	var idx = 1;
    for (var k in sequence) {
    	if(graph.hasNode(sequence[k])) {
    		createGraphEdge(graph, {'identifier': sequence[k]}, sequenceNode, 'hasCollectionMember', json.index++, {'sequence_index':idx++});
    	}
    }
}

function createConcepts(json, graph) {
	var deferred = promise_lib.defer();
	var promises = [];
	json['conceptIds'] = [];
	for(k in json) {
		if(k == 'nodeIds' || k == 'conceptIds') {
			continue;
		}
		var node = json[k];
		if(typeof node.keyword != 'undefined' && node.keyword != '') {
			var concepts = node.keyword.split(',');
			concepts.forEach(function(concept) {
				concept = concept.trim();
				if(concept != '') {
					promises.push(createConcept(concept, node, graph, json));
				}
			});
		}
	}
	promise_lib.all(promises).then(function(value) {
	    deferred.resolve(value);
	});
	return deferred.promise;
}

function createConcept(concept, node, graph, json) {

	var conceptViewHelper = require('./ConceptViewHelper');
	var conceptArr = concept.split(':');
	var conceptName, conceptContext;
	if(conceptArr.length == 1) {
		conceptName = conceptArr[0].trim();
	} else if(conceptArr.length > 1) {
		conceptContext = conceptArr[0].trim();
		conceptName = conceptArr[1].trim();
	}
	var conceptNode = {};
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		conceptViewHelper.getConceptByTitle(conceptName, conceptContext)
		.then(function(returnedConceptIdentifier) {
			var d = promise_lib.defer();
			if(returnedConceptIdentifier) {
				conceptNode['object_type']=ViewHelperConstants.CONCEPT;
				conceptNode['nodeSet']=ViewHelperConstants.CONCEPT;
				conceptNode['nodeClass']=ViewHelperConstants.CONCEPT;
				conceptNode['title']=conceptName;
				conceptContext = conceptContext || '';
				conceptNode['context']=conceptContext;
				conceptNode['identifier']=returnedConceptIdentifier;
				if(json['conceptIds'].indexOf(returnedConceptIdentifier) == -1) {
					json['conceptIds'].push(returnedConceptIdentifier);
				}
				PedagogyNodeSetModel.findOne({'nodeSetName': ViewHelperConstants.CONCEPT, 'nodeSetClass': ViewHelperConstants.CONCEPT}).exec(function(err, nodeset) {
					if(err) {
						d.reject(err);
					} else {
						conceptNode.pedagogyId = nodeset.pedagogyId;
						conceptNode.nodeSet = nodeset.nodeSetName;
						d.resolve(conceptNode);
					}
				});
			}
			else
				d.resolve();
			return d.promise;
		})
		.then(function(conceptNode) {
			if(conceptNode) {
				promise_lib.resolve()
				.then(function() {
					return createGraphNode(conceptNode, graph);
				})
				.then(function(rdfNode) {
					if (!graph.hasNode(conceptNode.identifier)) {
				    	graph.addNode(conceptNode.identifier, rdfNode);
					}
					createGraphEdge(graph, conceptNode, node, 'associatedTo', json.index++);
				})
				.catch(function(err) {
					console.log('createConcept() err', err, 'node', node, 'conceptNode', conceptNode);
					defer.resolve(err);
				})
				.done(function() {
					defer.resolve(conceptNode);
				});
			}
			else
				defer.resolve();
		})
		return defer.promise;
	})
	.catch(function(err) {
		console.log('createConcept() error creating concept', err);
		deferred.reject(err);
	})
	.done(function() {
		deferred.resolve(concept);
	});
	return deferred.promise;
}

function createContents(json) {
	for(k in json) {
		if(k == 'nodeIds') {
			continue;
		}
		var node = json[k];
		var nodeClass = node.nodeClass.toLowerCase();	
		if(typeof node.location == 'undefined')
			node.location = '';
		if((nodeClass == ViewHelperConstants.LEARNING_ACTIVITY || nodeClass == ViewHelperConstants.CONTENT)
			&& node.location == '' && node.elementType && node.elementType.toLowerCase() == ViewHelperConstants.PROGRAM) {
			node.format = 'text/plain';
			node.location = 'description';
		}
		if((nodeClass == ViewHelperConstants.LEARNING_RESOURCE || nodeClass == ViewHelperConstants.LEARNING_ACTIVITY)
			&& node.location && node.location != '') {
			var content = {
				'nodeId':'content_' + node.nodeId,
				'parentNodeId': node.nodeId,
			    'nodeType': ViewHelperConstants.CONTENT,
			    'nodeClass': ViewHelperConstants.CONTENT,
			    'name': (typeof node.name === 'undefined'?'':node.name),
			    'keyword': (typeof node.keyword === 'undefined'?'':node.keyword),
			    'identifier': '',
			    'size': '',
			    'duration' : '',
			    'category' : '',
			    'location' : '',
			    'parentRelation': 'associatedTo',
			    'programTemplate': (typeof node.programTemplate === 'undefined'?'':node.programTemplate),
			    'programAnswer': (typeof node.programAnswer === 'undefined'?'':node.programAnswer),
			    'elementType': (typeof node.elementType === 'undefined'?'':node.elementType),
			    'learningTime': (typeof node.learningTime === 'undefined'?'':node.learningTime),
		    	'contentSource': (typeof node.contentSource === 'undefined'?'':node.contentSource)
			};
			json['content_' + node.nodeId] = content;
			json.nodeIds.push('content_' + node.nodeId);
			var media = {
				'nodeId': 'media_' + node.nodeId,
				'parentNodeId':'content_' + node.nodeId,
			    'nodeType': ViewHelperConstants.MEDIA,
			    'nodeClass': ViewHelperConstants.MEDIA,
			    'name': (typeof node.name === 'undefined'?'':node.name),
			    'format':(typeof node.format === 'undefined'?'':node.format),
			    'size': (typeof node.size === 'undefined'?'':node.size),
			    'location':(typeof node.location === 'undefined'?'':node.location),
			    'duration': (typeof node.duration === 'undefined'?'':node.duration),
			    'identifier': '',
			    'parentRelation': 'associatedTo',
			    'contentGroup': 'main',
			  	'author': (typeof node.author === 'undefined'?'':node.author),
			    'authorImage': (typeof node.authorImage === 'undefined'?'':node.authorImage),
			    'authorProfileURL': (typeof node.authorProfileURL === 'undefined'?'':node.authorProfileURL),
			    'ownerType': (typeof node.ownerType === 'undefined'?'':node.ownerType),
			    'ownerImage': (typeof node.ownerImage === 'undefined'?'':node.ownerImage),
			    'ownerProfileURL': (typeof node.ownerProfileURL === 'undefined'?'':node.ownerProfileURL),
			    'offeredBy': (typeof node.offeredBy === 'undefined'?'':node.offeredBy),
			    'offeredByType': (typeof node.offeredByType === 'undefined'?'':node.offeredByType),
			    'offeredByImage': (typeof node.offeredByImage === 'undefined'?'':node.offeredByImage),
			    'offeredByProfileURL': (typeof node.offeredByProfileURL === 'undefined'?'':node.offeredByProfileURL)
			};
			json['media_' + node.nodeId] = media;
			json.nodeIds.push('media_' + node.nodeId);
			node.format = '';
			node.size = '';
			node.location = '';
			node.duration = '';
			node.programTemplate = '';
			node.programAnswer = '';
		} else if(nodeClass == ViewHelperConstants.CONTENT && node.location && node.location != '') {
			var media = {
				'nodeId': 'media_' + node.nodeId,
				'parentNodeId': node.nodeId,
			    'nodeType': ViewHelperConstants.MEDIA,
			    'nodeClass': ViewHelperConstants.MEDIA,
			    'name': node.name,
			    'format': node.format,
			    'size': (typeof node.size === 'undefined'?'':node.size),
			    'location': node.location,
			    'duration': (typeof node.duration === 'undefined'?'':node.duration),
			    'identifier': '',
			    'parentRelation': 'associatedTo',
			    'contentGroup': 'main'
			};
			json['media_' + node.nodeId] = media;
			json.nodeIds.push('media_' + node.nodeId);
			node.format = '';
			node.size = '';
			node.location = '';
			node.duration = '';
		}

		if(nodeClass == ViewHelperConstants.CONTENT) {
			if (!node.contentGroup) {
				node.contentGroup = '';
			}
			node['category'] = node.contentGroup;
		}
	}
}

exports.saveIntoOrchestrator = function(graph, errors, logger) {
	if(!logger) {
        logger = LoggerUtil.getConsoleLogger();
    }
	logger.info('CourseImportHelper:saveIntoOrchestrator() - Saving into orchestrator begin');
	var deferred = promise_lib.defer();
	var respObjects = null;
	var courseId = '';
	promise_lib.resolve()
	.then(function() {
		var nodes = graph.nodes();
		nodes.forEach(function(nodeId) {
			var node = graph.node(nodeId);
			if(ViewHelperUtil.getNodeProperty(node, 'setType') == ViewHelperConstants.COURSE) {
				courseId = ViewHelperUtil.getNodeProperty(node, 'identifier');
			}
		});
	})
	.then(function() {
		logger.info('CourseImportHelper:saveIntoOrchestrator() - Removing nodes without neighbours');
		return removeNodesWithOutNeighbors(graph, errors);
	})
	.then(function() {
		logger.info('CourseImportHelper:saveIntoOrchestrator() - Saving Nodes');
		return upsertModelObjects(graph, courseId, logger);
	})
	.then(function(resultObjects) {
		respObjects = resultObjects;
	})
	.then(function() {
		logger.info('CourseImportHelper:saveIntoOrchestrator() - Saving content node relations');
		return upsertContentRelations(graph, logger);
	})
	.then(function() {
		logger.info('CourseImportHelper:saveIntoOrchestrator() - Saving all node relations');
		return upsertOtherRelations(graph, logger);
	})
	.then(function() {
		logger.info('CourseImportHelper:saveIntoOrchestrator() - Save into Orchestrator completed');
	})
	.catch(function(err) {
		logger.error('CourseImportHelper:saveIntoOrchestrator() - Save into Orchestrator failed ' + err);
		deferred.reject(err);
	})
	.done(function() {
		var lastUpdated = new Date().getTime(); // time in millseconds
		deferred.resolve({'courseId' : courseId, 'respObjects': respObjects, 'lastUpdated': lastUpdated});
	});
	return deferred.promise;
}

function removeNodesWithOutNeighbors(graph, errors) {
	var deferred = promise_lib.defer();
	var promises = [];
	var nodes = graph.nodes();
	nodes.forEach(function(nodeId) {
		var childDefer = promise_lib.defer();
		promises.push(childDefer);
		var node = graph.node(nodeId);
		var setType = ViewHelperUtil.getNodeProperty(node, 'setType');
		var nodeClass = setType;
		if(setType == ViewHelperConstants.COURSE || setType == ViewHelperConstants.MODULE || setType == ViewHelperConstants.LESSON || setType == ViewHelperConstants.BINDER) {
			nodeClass = ViewHelperConstants.LEARNING_OBJECT;
		}

		if(nodeClass == ViewHelperConstants.LEARNING_OBJECT || nodeClass == ViewHelperConstants.LEARNING_RESOURCE || nodeClass == ViewHelperConstants.LEARNING_ACTIVITY) {
			var neighbors = graph.neighbors(nodeId);
			if(neighbors.length == 0) {
				errors.push("node creation skipped because of there is no relation with other nodes for node: [ name:"+ViewHelperUtil.getNodeProperty(node, 'name')+", type:"+ViewHelperUtil.getNodeProperty(node, 'setType')+"]");
				graph.delNode(nodeId);
			}
			childDefer.resolve();
		} else {
			childDefer.resolve();
		}
	});
	deferred.resolve(promise_lib.all(promises));
	return deferred.promise;
}

function upsertModelObjects(graph, courseId, logger) {

	var conceptViewHelper = require('./ConceptViewHelper');
	var contentViewHelper = require('./ContentViewHelper');
	var laViewHelper = require('./LearningActivityViewHelper');
	var lcViewHelper = require('./LearningCollectionViewHelper');
	var loViewHelper = require('./LearningObjectiveViewHelper');
	var lobViewHelper = require('./LearningObjectViewHelper');
	var lrViewHelper = require('./LearningResourceViewHelper');
	var instructorViewHelper = require('../InstructorViewHelper');
	var deferred = promise_lib.defer();
	var promises = [];
	var nodes = graph.nodes();
	logger.info('CourseImportHelper:upsertModelObjects() - Total nodes to be saved - ' + nodes.length);
	nodes.forEach(function(nodeId) {
		var node = graph.node(nodeId);
		var setType = ViewHelperUtil.getNodeProperty(node, 'setType');
		var nodeClass = setType;
		if(setType == ViewHelperConstants.COURSE || setType == ViewHelperConstants.MODULE || setType == ViewHelperConstants.LESSON || setType == ViewHelperConstants.BINDER) {
			nodeClass = ViewHelperConstants.LEARNING_OBJECT;
		}
		switch (nodeClass) {
			case ViewHelperConstants.CONCEPT:
		        promises.push(conceptViewHelper.importConcept(node, courseId));
		        break;
		    case ViewHelperConstants.CONTENT:
		        promises.push(contentViewHelper.importContent(node, courseId));
		        break;
		    case ViewHelperConstants.MEDIA:
		        promises.push(contentViewHelper.importMedia(node));
		        break;
		    case ViewHelperConstants.LEARNING_OBJECT:
		        promises.push(lobViewHelper.importLearningObject(node, graph, courseId));
		        break;
		    case ViewHelperConstants.LEARNING_OBJECTIVE:
		        promises.push(loViewHelper.importLearningObjective(node, graph, courseId));
		        break;
		    case ViewHelperConstants.LEARNING_RESOURCE:
		        promises.push(lrViewHelper.importLearningResource(node, courseId));
		        break;
		    case ViewHelperConstants.COLLECTION:
		        promises.push(lcViewHelper.importLearningCollection(node, graph, courseId));
		        break;
			case ViewHelperConstants.LEARNING_ACTIVITY:
		        promises.push(laViewHelper.importLearningActivity(node, courseId));
		        break;
		    case ViewHelperConstants.FACULTY:
		    	promises.push(instructorViewHelper.importInstructor(node));
		    	break;
		    case ViewHelperConstants.TUTOR:
		    	promises.push(instructorViewHelper.importInstructor(node));
		    	break;
		}
	});
	promise_lib.all(promises).then(function(value) {
		logger.info('CourseImportHelper:upsertModelObjects() - Nodes saved');
	    deferred.resolve(value);
	})
	.catch(function(err){
		logger.error('CourseImportHelper:upsertModelObjects() - Nodes save failed - ' + err);
		deferred.reject(err);
	})
	.done();
	return deferred.promise;
}

function upsertContentRelations(graph, logger) {

	var contentViewHelper = require('./ContentViewHelper');
	var deferred = promise_lib.defer();
	var promises = [];
	var edges = graph.edges();
	edges.forEach(function(edgeId) {
		var edge = graph.edge(edgeId);
		var startNodeId = ViewHelperUtil.getNodeProperty(edge, 'relationStart');
		var startNode = graph.node(startNodeId);
		var endNodeId = ViewHelperUtil.getNodeProperty(edge, 'relationEnd');
		var endNode = graph.node(endNodeId);
		var nodeClass = ViewHelperUtil.getNodeProperty(startNode, 'setType');
		if (nodeClass == ViewHelperConstants.CONTENT) {
		    promises.push(contentViewHelper.importRelation(edge, startNode, endNode));
		}
	});
	logger.info('CourseImportHelper:upsertContentRelations() - Total content relations to be saved - ' + promises.length);
	promise_lib.all(promises).then(function(value) {
		logger.info('CourseImportHelper:upsertContentRelations() - Content relations saved');
	    deferred.resolve(value);
	}).catch(function(err) {
		logger.err('CourseImportHelper:upsertContentRelations() - Content relations save failed - ' + err);
		deferred.reject(value);
	});
	return deferred.promise;
}

function upsertOtherRelations(graph, logger) {

	var conceptViewHelper = require('./ConceptViewHelper');
	var laViewHelper = require('./LearningActivityViewHelper');
	var lcViewHelper = require('./LearningCollectionViewHelper');
	var lobViewHelper = require('./LearningObjectViewHelper');
	var lrViewHelper = require('./LearningResourceViewHelper');
	var deferred = promise_lib.defer();
	var promises = [];
	var edges = graph.edges();
	edges.forEach(function(edgeId) {
		var edge = graph.edge(edgeId);
		var startNodeId = ViewHelperUtil.getNodeProperty(edge, 'relationStart');
		var startNode = graph.node(startNodeId);
		var endNodeId = ViewHelperUtil.getNodeProperty(edge, 'relationEnd');
		var endNode = graph.node(endNodeId);
		var nodeClass = ViewHelperUtil.getNodeProperty(startNode, 'setType');
		if(nodeClass == ViewHelperConstants.COURSE || nodeClass == ViewHelperConstants.MODULE || nodeClass == ViewHelperConstants.LESSON || nodeClass == ViewHelperConstants.BINDER) {
			nodeClass = ViewHelperConstants.LEARNING_OBJECT;
		}
		switch (nodeClass) {
			case ViewHelperConstants.CONCEPT:
		        promises.push(conceptViewHelper.importRelation(edge, startNode, endNode));
		        break;
		    case ViewHelperConstants.LEARNING_OBJECT:
		        promises.push(lobViewHelper.importRelation(edge, startNode, endNode));
		        break;
		    case ViewHelperConstants.LEARNING_RESOURCE:
		        promises.push(lrViewHelper.importRelation(edge, startNode, endNode));
		        break;
		    case ViewHelperConstants.COLLECTION:
		        promises.push(lcViewHelper.importRelation(edge, startNode, endNode));
		        break;
			case ViewHelperConstants.LEARNING_ACTIVITY:
		        promises.push(laViewHelper.importRelation(edge, startNode, endNode));
		        break;
		}
	});
	logger.info('CourseImportHelper:upsertOtherRelations() - Total other relations to be saved - ' + promises.length);
	promise_lib.all(promises).then(function(value) {
		logger.info('CourseImportHelper:upsertOtherRelations() - Other relations saved');
	    deferred.resolve(value);
	})
	.catch(function(err) {
		logger.err('CourseImportHelper:upsertOtherRelations() - Other relations save failed - ' + err);
		deferred.reject(err);
	});
	return deferred.promise;
}

function writeRDFToFile(rdf) {
	fs.writeFile('content_rdf_export_testCase_1.rdf', JSON.stringify(rdf), function (err) {
	   	if (err) {
	   		console.log('unable to save');
	   	} else {
	   		console.log('It\'s saved!');
	   	}
	});
}

function saveToMW(graph, logger) {

	if(!logger) {
        logger = LoggerUtil.getConsoleLogger();
    }
	logger.info('CourseImportHelper:saveToMW() - Saving to MW');
	var rdf = {};
	var courseId = "";
	graph.nodes().forEach(function(nodeId) {
		var node = graph.node(nodeId);
    	if(ViewHelperUtil.getNodeProperty(node, 'setType') == 'course') {
    		courseId = nodeId;
    	}
		rdf[nodeId] = node;
	});
	graph.edges().forEach(function(edgeId) {
		var edge = graph.edge(edgeId);
		rdf[edgeId] = graph.edge(edgeId);
	});
	var req = new Object();
    req.LEARNING_OBJECT = JSON.stringify(rdf);
 	// writeRDFToFile(rdf);
	promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MWServiceProvider.callServiceStandard("ontologyManager", "SaveObject", req, function(err, data, response) {
            if (err) {
                deferred.reject(err);
                EventHelper.emitEvent('SavedToMW',false);
            } else {
                deferred.resolve(data);
                EventHelper.emitEvent('SavedToMW',true);
            }
        });
        return deferred.promise;
    })
    .catch(function(err){
    	logger.info('CourseImportHelper:saveToMW() - Error saving course/content in MW' + err);
    })
    .done();
}

exports.uploadImage = function(req, res) {
	var file = req.files.uploadFile;
	uploadFile(file, 'image', req, res);
}

exports.uploadJSON = function(req, res) {
	var file = req.files.uploadFile;
	uploadFile(file, 'json', req, res);
}

exports.uploadAudio = function(req, res) {
	var file = req.files.uploadFile;
	uploadFile(file, 'audio', req, res);
}

exports.uploadHtml = function(req, res) {
	var file = req.files.uploadFile;
	uploadFile(file, 'richtext', req, res);
}

exports.uploadText = function(req, res) {
	var file = req.files.uploadFile;
	uploadFile(file, 'text', req, res);
}

exports.uploadCourseContent = function(req, res){
	var errors = [];
	var file = req.files.importFile;
	var courseId = req.body.courseId;
	courseId = courseId.replace(/:/g, '_');
	var folderPath = req.body.folderPath;
	var fileName = file.name;
	var courseFolder = "public/uploads/"+courseId;
	var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        type: CSVImportUtil.COURSE_CONTENT_UPLOAD
    };
    var finalPaths = [];
	promise_lib.resolve()
	.then(function() {
        return CSVImportUtil.initalizeCSVImport(file, statistics);
    })
	.then(function() {
		if (!fs.existsSync(courseFolder)) {
			fs.mkdirSync(courseFolder);
		}
	})
	.then(function(userPath) {
		var deferred = promise_lib.defer();
		var desPath  = courseFolder;

		fs.readFile(file.path, function (err, data) {
		  	var newPath = desPath +'/'+ fileName;
		  	fs.writeFile(newPath, data, function (err) {
		  		if(err){
		  			console.log("error:",err);
		  			deferred.reject(err);
		  			errors.push(err);
		  		}else{
		  			statistics.uploadTime = new Date();
					statistics.total = 1;
		  			if(file.type == 'application/zip' || file.type == 'application/x-gzip') {
		  				var decompress = new Decompress({ mode: 755 })
						    .src(newPath)
						    .dest(desPath);
					     if(file.type == 'application/zip') {
					    	decompress.use(Decompress.zip({ strip: 1 }));
					    }  else if(file.type == 'application/x-gzip'){
					    	decompress.use(Decompress.targz({ strip: 1 }));
					    }
						decompress.run(function (err, files, stream) {
						    if (err) {
						        deferred.reject("Error:"+err);
						    } else {
						    	console.log('Archive extracted successfully!');
						    	console.log('Files:', files.length);
						    	statistics.inserted = files.length;
						    	files.forEach(function(item) {
						    		finalPaths.push(item.path.split("/public")[1]);
						    		fs.chmod(item.path, '777', function(err){});
						    	})
						    	statistics.status = CSVImportUtil.COMPLETE;
						    	fs.unlink(newPath, function (err) {
								  if (err) {
								  	console.log("Error while deleting file:"+err);
								  }
								  console.log('successfully deleted: '+newPath);
								});
						    	deferred.resolve(finalPaths);
						    }
						});
		  			} else {
		  				statistics.inserted = 1;
		  				statistics.status = CSVImportUtil.COMPLETE;
		  				finalPaths.push(newPath.split("public")[1]);
		  				fs.chmod(newPath, '777', function(err){});
		  				deferred.resolve(finalPaths);
		  			}
		  		}
		  	});
		});
		return deferred.promise;
	})
	.then(function(finalPaths) {
		var deferred = promise_lib.defer();
		var filepath = appConfig.CSV_UPLOAD_DIR+Date.parse(new Date())+'.csv';
		var pathData = "";
		finalPaths.forEach(function(row) {
			pathData += row + "\n";
		});
		fs.writeFile(filepath, pathData, function (err) {
			statistics.filepath = filepath;
		  	deferred.resolve();
		});
		return deferred.promise;
	})
	.then(function() {
		return CSVImportUtil.updateCSVImportQueueRecord(statistics);
	})
	.catch(function(err) {
        console.log("Error: "+err);
        if(err) errors.push(err);
    })
    .done(function(){
    	res.send("Done");
    	console.log("Uploading the file....");
    });
}

function uploadFile(file, path, req, res) {
	fs.readFile(file.path, function (err, data) {
	  	var newPath = 'public/uploads/' + path + '/' + file.name;
	  	fs.writeFile(newPath, data, function (err) {
	    	res.send({url: req.protocol + '://' + req.get('host') + '/uploads/' + path + '/' + file.name});
	  	});
	});
}

exports.importConceptCSV = function(req, res) {
	var file = req.files.importFile;
	var header = {};
	var json = {nodeIds:[]};
	var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        type: CSVImportUtil.CONCEPT_IMPORT
    };

	csv()
	.from.stream(fs.createReadStream(file.path))
	.on('record', function(row, index){
		if(index == 0) {
			header = row;
		} else {
			var object = new Object();
			for(k in row) {
				if(ViewHelperConstants.conceptHeaderFields[header[k].toLowerCase()]) {
					object[ViewHelperConstants.conceptHeaderFields[header[k].toLowerCase()]]=row[k];
				}
			}
			if(object.nodeId != "") {
				statistics.total++;
				json[object.nodeId] = object;
				json[object.nodeId]['nodeType'] = 'concept';
				json[object.nodeId]['nodeClass'] = 'concept';
				if(!json[object.nodeId]['identifier']) {
					json[object.nodeId]['identifier'] = "";
				}
				json.nodeIds.push(object.nodeId);
			}
		}
	})
	.on('end', function(count){
		promise_lib.resolve()
		.then(function() {
            return CSVImportUtil.initalizeCSVImport(file, statistics);
        })
        .then(function() { // Copy file.
            var deferred = promise_lib.defer();
            var fileName = Date.parse(new Date())+'.json';
            var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
            fs.writeFile(filePath, JSON.stringify(json), function(err) {
                if(err) console.log("File write error:"+err);
            });
            return filePath;
        })
        .then(function(filePath) { // Create Queue record.
            statistics.filepath = filePath;
            console.log("createCSVImportQueueRecord...");
            return CSVImportUtil.createCSVImportQueueRecord(statistics);
        })
        .done(function(logRecord) {
            res.send(JSON.stringify(logRecord));
        });
	  	// createConceptGraph(json, res);
	})
	.on('error', function(error){
	  	res.send(error);
	});
}

function getRootConceptId(json) {
	for(k in json) {
		if(k != 'index' && k != 'nodeIds') {
			if(!json[k].parentNodeId || json[k].parentNodeId == null || json[k].parentNodeId == '' || json[k].parentNodeId == 'undefined') {
				return json[k].identifier;
			}
		}
	}
	return null;
}

function getConceptsList(json) {
	var conceptIds = [];
	for(k in json) {
		if(k != 'index' && k != 'nodeIds') {
			if(json[k].nodeType == 'concept') {
				conceptIds.push(json[k].identifier);
			}
		}
	}
	return conceptIds;
}

exports.createConceptGraph = function(json, statistics) {
	var conceptViewHelper = require('./ConceptViewHelper');
	var errorCaught = false;
	var errors = [];
	var saveResult = null;
	statistics.startTime = new Date();
	var graph = new Digraph();
	promise_lib.resolve()
	.then(function() {
		return createNodes(json, errors, graph);
	})
	.then(function() {
		return createRelations(json, errors, graph)
	})
	.then(function() {
		return exports.saveIntoOrchestrator(graph, errors);
	})
	.then(function(resultObjects) {
		saveResult = resultObjects.respObjects;
		conceptViewHelper.saveConceptToMW(graph);
		EventHelper.emitEvent('updateConceptMap', null, getRootConceptId(json));	
	})
	.then(function() {
		var deferred = promise_lib.defer();
		var fileName = statistics["identifier"]+'.csv';
        var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
        var jsonCSV = require('json-csv');
		var jsonArray = [];
		for(k in json) {
			if(k != 'index') {
				jsonArray.push(json[k]);
			}
		}
		var jsonFields = [];
		for(k in ViewHelperConstants.conceptHeaderFields) {
			jsonFields.push({name: ViewHelperConstants.conceptHeaderFields[k], label: k});
		}
		var args = {
			data: jsonArray,
			fields: jsonFields
		}
		jsonCSV.toCSV(args, function(err, csv) {
			if(err) {
            	deferred.reject(err);
	        } else {
	            fs.writeFile(filePath,csv, function(err) {
	                deferred.resolve(filePath);
	                console.log(filePath+" file created...");
	            });
	        }
		});
		return deferred.promise;
	})
	.catch(function(err) {
		if(err) {
			errorCaught = true;
			console.log('Error importing concept csv - ', err);
			res.send(err);
		}
	})
	.done(function(filePath) {
		// exports.exportConceptCSV(json, res);
		if(!filePath) filePath = '';
		var jsonFilePath = statistics.filepath;
		CSVImportUtil.deleteFile(jsonFilePath);
		statistics.filepath = filePath;
        statistics.endTime = new Date();
        statistics.exeTime = statistics.endTime.getTime() - statistics.startTime.getTime();
        var nodes = graph.nodes();
        nodes.forEach(function(node) {
        	if(node.isNew) {
        		statistics.inserted++;
        	} else {
        		statistics.updated++;
        	}
        })

        statistics.warning = errors.length;
        statistics.errorDetails = errors;
		if(errorCaught) {
            statistics.status = CSVImportUtil.FAIL;
        } else {
            statistics.status = CSVImportUtil.COMPLETE;
        }

        console.log("Completed Processing Queue record: "+statistics.identifier);
        console.log("Statistics: "+statistics);
        CSVImportUtil.updateCSVImportQueueRecord(statistics);
	})
}

exports.exportConceptCSV = function(json, res) {
	var jsonCSV = require('json-csv');
	var jsonArray = [];
	for(k in json) {
		if(k != 'index') {
			jsonArray.push(json[k]);
		}
	}
	var jsonFields = [];
	for(k in ViewHelperConstants.conceptHeaderFields) {
		jsonFields.push({name: ViewHelperConstants.conceptHeaderFields[k], label: k});
	}
	var args = {
		data: jsonArray,
		fields: jsonFields
	}
	jsonCSV.toCSV(args, function(err, csv) {
		res.setHeader('Content-disposition', 'attachment; filename=output_with_identifiers.csv');
	    res.set('Content-Type', 'application/octet-stream');
	    res.send(new Buffer(csv));
	});
}

exports.deleteObjectsCSV = function(req, res) {
	deleteContentCSV(false, req, res);
}

exports.cleanupObjectsCSV = function(req, res) {
	deleteContentCSV(true, req, res);	
}

function deleteContentCSV(isRemove, req, res) {
	var file = req.files.importFile;
	var header = {};
	var json = {};
	var nodes = {};
	var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        type: CSVImportUtil.CONTENT_DELETE
    };
	csv()
	.from.stream(fs.createReadStream(file.path))
	.on('record', function(row, index){
		if(index == 0) {
			header = row;
		} else {
			var object = new Object();
			for(k in row) {
				if(ViewHelperConstants.deleteCSVHeaderFields[header[k].toLowerCase()]) {
					object[ViewHelperConstants.deleteCSVHeaderFields[header[k].toLowerCase()]]=row[k].trim();
				}
			}
			nodes[object.extId] = object;
			if(object.extId != "" && object.nodeType != "" && object.deleteStatus.trim().toLowerCase() == 'delete') {
				statistics.total++;
                object.errorLog = '';
                object.isRemove = isRemove;
				if(object.parentExtId) {
					object['parentNodeType'] = nodes[object.parentExtId]['nodeType'];
				}
				(object.recursive.toLowerCase() == 'recursive')?object.recursive = 'true' : object.recursive = 'false';
				object.isRemove = isRemove;
				json[object.extId] = object;
			}
		}
	})
	.on('end', function(count){
		promise_lib.resolve()
			.then(function() {
                return CSVImportUtil.initalizeCSVImport(file, statistics);
            })
            .then(function() { // Copy file.
                var deferred = promise_lib.defer();
                var fileName = Date.parse(new Date())+'.json';
                var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
                fs.writeFile(filePath, JSON.stringify(json), function(err) {
                    if(err) console.log("File write error:"+err);
                });
                return filePath;
            })
            .then(function(filePath) { // Create Queue record.
                statistics.filepath = filePath;
                console.log("createCSVImportQueueRecord...");
                return CSVImportUtil.createCSVImportQueueRecord(statistics);
            })
            .done(function(logRecord) {
                res.send(JSON.stringify(logRecord));
            });
	  	//deleteObjects(json, res);
	})
	.on('error', function(error){
		console.log('Error:', error);
	  	res.send(error);
	});
}

exports.deleteObjects = function(json, statistics) {
	var errors = [];
	statistics.startTime = new Date();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		var promises = [];
		for(k in json) {
			promises.push(_deleteObject(json[k]));
		}
		promise_lib.all(promises).then(function(value) {
		    deferred.resolve(value);
		});
		return deferred.promise;
	})
	.then(function(resultJsonArray) {
		console.log("resultJsonArray:",resultJsonArray);
		var fileName = statistics["identifier"]+'.csv';
        var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
        var exportJson = [];
        if(resultJsonArray) {
        	resultJsonArray.forEach(function(result) {
        		if(result) {
        			var row = json[result.extId];
	        		row.message = result.message;
	        		row.deletedList = result.deletedList.toString();
	        		var deletecount = result.deletedList.length;
	        		statistics.deleted += deletecount;
	        		exportJson.push(row);
	        		delete json[result.extId];
        		}
        	});
        }
    	for(k in json) {
        	exportJson.push(json[k]);
        }
        var deleteCSVHeaderFields = ViewHelperConstants.deleteCSVHeaderFields;
        deleteCSVHeaderFields["deleted children ext ids"] ="deletedList";
        deleteCSVHeaderFields["message"] = "message";
        return saveJsonAsCSV(exportJson, filePath, ViewHelperConstants.deleteCSVHeaderFields);
	})
	.catch(function(err) {
		console.log('Error in deleting objects - ', err);
		if(err) errors.push(err);
	})
	.done(function(filePath) {
		var jsonFilePath = statistics.filepath;
		CSVImportUtil.deleteFile(jsonFilePath);		
		statistics.filepath = filePath;
        statistics.endTime = new Date();
        statistics.exeTime = statistics.endTime.getTime() - statistics.startTime.getTime();
        if(errors.length > 0) {
            statistics.status = CSVImportUtil.FAIL;
        } else {
            statistics.status = CSVImportUtil.COMPLETE;
        }
        // update delete count...
        console.log("Completed Processing Queue record: "+statistics.identifier);
        console.log("Statistics: "+statistics);
        CSVImportUtil.updateCSVImportQueueRecord(statistics);
	});
}

exports.deleteObject = function(req, res) {
	_deleteObject(req.body).then(function(msg) {
		res.send(msg);
	});
}

function _deleteObject(object) {
	var deferred = promise_lib.defer();
	var courseViewHelper = require('./CourseViewHelper');
	var contentViewHelper = require('./ContentViewHelper');
	var laViewHelper = require('./LearningActivityViewHelper');
	var lcViewHelper = require('./LearningCollectionViewHelper');
	var lobViewHelper = require('./LearningObjectViewHelper');
	var lrViewHelper = require('./LearningResourceViewHelper');
	var errors = [];
	var isCourse = false;

	promise_lib.resolve()
	.then(function() {
		return ViewHelperUtil.populateIdentifiers(object);
	})
	.then(function(updatedObject) {
		var deferred = promise_lib.defer();
		if(updatedObject.nodeId == "") {
			deferred.resolve(false);
		} else {
			object = updatedObject;
			deferred.resolve(true);
		}
		return deferred.promise;
	})
	.then(function(nodeIdFound) {
		var deferred = promise_lib.defer();
		if(nodeIdFound) {
			switch (object.nodeType.toLowerCase()) {
				case ViewHelperConstants.MEDIA:
				contentViewHelper.deleteMedia(object).then(function(msg) {deferred.resolve(msg)});
			        break;
				case ViewHelperConstants.CONTENT:
			        contentViewHelper.deleteContent(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.LEARNING_OBJECT:
			        lobViewHelper.deleteLOB(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.LESSON:
			    	object.nodeType = ViewHelperConstants.LEARNING_OBJECT;
			        lobViewHelper.deleteLOB(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.MODULE:
			    	object.nodeType = ViewHelperConstants.LEARNING_OBJECT;
			        lobViewHelper.deleteLOB(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.BINDER:
			    	object.nodeType = ViewHelperConstants.LEARNING_OBJECT;
			        lobViewHelper.deleteLOB(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.COURSE:
			    	object.nodeType = ViewHelperConstants.LEARNING_OBJECT;
			    	isCourse = true;
			    	lobViewHelper.deleteLOB(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.LEARNING_RESOURCE:
			        lrViewHelper.deleteLearningResource(object).then(function(msg) {deferred.resolve(msg)});
			        break;
			    case ViewHelperConstants.COLLECTION:
			        lcViewHelper.deleteCollection(object).then(function(msg) {deferred.resolve(msg)});
			        break;
				case ViewHelperConstants.LEARNING_ACTIVITY:
			        laViewHelper.deleteLearningActivity(object).then(function(msg) { console.log("msg",msg);deferred.resolve(msg)});
			        break;
			}
		} else {
			deferred.resolve({'message': 'Object already deleted or does not exist', 'extId': object.extId, 'deletedList': []})
		}
		return deferred.promise;
	})
	.then(function(msg) {
		console.log("message after delete",msg);
		var deferred = promise_lib.defer();
		if(isCourse) {
			var message = msg;
			promise_lib.resolve()
	        .then(function() {
	        	return courseViewHelper.deleteCourse(object.nodeId);
	        })
	        .then(function() {
	        	var defer = promise_lib.defer();
	        	LearnerStateModel = mongoose.model('LearnerStateModel');
	        	LearnerStateModel.remove({courseId: object.nodeId}).exec(function(err) {
	        		if(err)
	        			defer.reject(err);
	        		else
	        			defer.resolve();
	        	});
	        	return defer.promise;
	        })
	        .then(function() {
	        	var defer = promise_lib.defer();
	        	EnrolledCoursesModel = mongoose.model('EnrolledCoursesModel');
	        	EnrolledCoursesModel.remove({course_id: object.nodeId}).exec(function(err) {
	        		if(err)
	        			defer.reject(err);
	        		else
	        			defer.resolve();
	        	});
	        	return defer.promise;
	        })
	        .done(function() {
				deferred.resolve(message);
	        });
		} else {
			deferred.resolve(msg);
		}
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error deleting - ', err);
		if(err) {
			errors.push(err);
		}
	})
	.done(function(deleteResp) {
		if(errors.length > 0){
			deferred.reject(errors);
		} else {
			if(deleteResp) {
				if (deleteResp.courseId && deleteResp.courseId != null) {
					updateCourseTimestamp(deleteResp.courseId);
				}
				if(object.nodeId) deleteResp.message = deleteResp.message.replace(new RegExp(object.nodeId, 'g'), object.extId+'('+object.nodeId+')');
				if(object.parentNodeId) deleteResp.message = deleteResp.message.replace(new RegExp(object.parentNodeId, 'g'), object.parentExtId+'('+object.parentNodeId+')');
			}
			deferred.resolve(deleteResp);
		}
	});

	return deferred.promise;
}

function saveJsonAsCSV(jsonWithStates, filePath, headerFields) {
    var deferred = promise_lib.defer();
    var jsonCSV = require('json-csv');
    var jsonFields = [];
    for (k in headerFields) {
        jsonFields.push({
            name: headerFields[k],
            label: k
        });
    }
    var args = {
        data: jsonWithStates,
        fields: jsonFields
    }
    jsonCSV.toCSV(args, function(err, csv) {
        if(err) {
            deferred.reject(err);
        } else {
            fs.writeFile(filePath,csv, function(err) {
                deferred.resolve(filePath);
                console.log(filePath+" file created...");
            });
        }
    });
    return deferred.promise;
}