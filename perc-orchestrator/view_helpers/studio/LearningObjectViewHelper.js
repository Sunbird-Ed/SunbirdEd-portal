/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Learning Object Resources
 *
 * @author Santhosh
 */
var mongoose = require('mongoose');
var errorModule = require('../ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
LearningObjectModel = mongoose.model('LearningObjectModel');
LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
var ViewHelperConstants = require('../ViewHelperConstants');
var courseMWHelper = require('./CourseMWViewHelper');

/** Get All resources in a LOB - Recursive Promises - Start */
exports.findLOBElements = function(req, res) {
	var recObj = {};
	recObj.lobs = [];
	recObj.elements = [];

	var lob = {};
	LearningObjectModel = mongoose.model('LearningObjectModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectModel.findOne, LearningObjectModel, [{identifier: req.params.id}, {identifier:1, children: 1, sequence: 1}]))
	.then(function(data) {
		lob = data;
		return populateChildren(data);
	})
	.then(function(lobs) {
		return leanify(lobs, req.params.id);
	})
	.then(function(lobs) {
		if(typeof lobs === 'undefined') {
			return lobs;
		}
		var resArray = [];
		lobs.forEach(function(lob){
			resArray[lob.identifier] = lob;
		})
		var seq = lob.sequence;
		seq.forEach(function(k) {
			recObj.lobs.push(resArray[k]);
		});
	})
	.then(function() {
		return getResources(lob);
	})
	.then(function(lobRes) {
		var resources = serializeResources(lobRes);
		if(resources && resources.length > 0) {
			recObj.resources = resources;
		}
		return recObj;
	})
	.done(function() {
		res.send(JSON.stringify(recObj));
	});
};

function getResources(lob) {
	var deferred = promise_lib.defer();
	LearningObjectElementsModel.findOne({lobId: lob.identifier}).exec(function(err, lobRes) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(lobRes);
		}
	});
	return deferred.promise;
}

function leanify(lobs, parentId) {
	if(typeof lobs === 'undefined') {
		return lobs;
	}
	var lobArray = new Array();
	lobs.forEach(function(lob) {
		lobArray.push({identifier: lob.identifier, parentId: parentId, type: 'learningobject',
			name: lob.name, elementId: lob.identifier})
	})
	return lobArray;
}

function serializeResources(lob) {
	var resArray = [];
	var type = 'LearningElement';
	if(lob.elements && lob.elements.length > 0) {
		lob.elements.forEach(function(element) {
			resArray[element.elementId] = element.toObject();
			resArray[element.elementId].lobId = lob.lobId;
			resArray[element.elementId].type = element.elementType;
		})
	}
	var seq = lob.sequence;
	var retArray = [];
	seq.forEach(function(k) {
		if(resArray[k]) {
			retArray.push(resArray[k]);
		}
	});
	return retArray;
}

function getChildrenProperties(lob) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	var deferred = promise_lib.defer();
	LearningObjectModel.findOne({identifier: lob.identifier}).exec(function(err, lobComplete) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(lobComplete);
		}
	});
	return deferred.promise;
}

function populateChildren(lob) {
	var deferred = promise_lib.defer();
	if(lob.children && lob.children.length > 0) {
		var promises = [];
		lob.children.forEach(function(child) {
			promises.push(getChildrenProperties(child));
		});
		promise_lib.all(promises).then(function(value) {
		    deferred.resolve(value);
		});
	} else {
		deferred.resolve();
	}
	return deferred.promise;
}

/** Get All resources in a LOB - Recursive Promises - End */

function createLOBElements(lobId) {
	IDCacheUtil.getId(function(id) {
		var lobElements = new LearningObjectElementsModel();
		lobElements.lobId = lobId;
		lobElements.identifier = id;
		lobElements.save(function(err, lobRes) {
			if(err) {
				console.log(err);
			}
		});
	});
}

exports.createLOBElements = createLOBElements;

exports.addElement = function(element, lobId) {
	LearningObjectElementsModel.findOne({lobId: lobId}).exec(function(err, lobElements) {
		if (err) {
			console.log('Error adding elements to LOB');
		} else {
			lobElements.elements.push(element);
			lobElements.sequence.push(element.identifier);
			lobElements.markModified('elements');
			lobElements.markModified('sequence');
			lobElements.save();
		}
	});
}

exports.updateElementMandatory = function(lobId, elementId, isMandatory) {
	LearningObjectElementsModel.findOne({lobId: lobId}).exec(function(err, lobElements) {
		if (err) {
			console.log('Error adding elements to LOB');
		} else {
			var element;
			lobElements.elements.forEach(function(elem) {
				if(elem.elementId == elementId) {
					element = elem;
				}
			});
			element.isMandatory = isMandatory;
			lobElements.markModified('elements');
			lobElements.save();
		}
	});
}

exports.getElement = function(req, res) {
	if(req.body.elementType == ViewHelperConstants.LEARNING_RESOURCE) {
		var helper = require('./LearningResourceViewHelper');
		helper.getLearningResource(req, res);
	} else if(req.body.elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
		var helper = require('./LearningActivityViewHelper');
		helper.getLearningResource(req, res);
	} else if(req.body.elementType == ViewHelperConstants.COLLECTION) {
		var helper = require('./LearningCollectionViewHelper');
		helper.getLearningCollection(req, res);
	}
}

exports.addConcept = function(req, res) {
	var error = {};
	promise_lib.resolve().then(function() {
		var deferred = promise_lib.defer();
		if((typeof req.body.conceptId == undefined) || null == req.body.conceptId) {
			var conceptViewHelper = require('./ConceptViewHelper');
			conceptViewHelper.addConcept(req.body.conceptTitle).then(function(id) {
				req.body.conceptId = id;
				deferred.resolve();
			})
		}
		return deferred.promise;
	})
	.then(function() {
		if(req.body.linkedConcept) {
			var conceptViewHelper = require('./ConceptViewHelper');
			conceptViewHelper.addParent(req.body.conceptId, req.body.linkedConcept);
		}
	})
    .then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{identifier: req.body.lobId}, "concepts"]))
	.then(function(lob) {
		var deferred = promise_lib.defer();
		if(typeof lob === 'undefined')  {
			deferred.reject('No learning resource found for the matching id');
		} else {
			lob.concepts.push({conceptTitle: req.body.conceptTitle, conceptId: req.body.conceptId});
			lob.markModified('concepts');
			lob.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_CONCEPT", req, res));
}

exports.updateSequence = function(req, res) {
	LearningObjectElementsModel.findOne({lobId: req.body.id}).exec(function(err, lobRes) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
		} else {
			lobRes.sequence = req.body.sequence;
			lobRes.markModified('sequence');
			lobRes.save(function(err) {
				if(err) {
					errorModule.handleError(err, "ERROR_UPDATING_LOB_SEQUENCE", req, res);
				} else {
					res.send(JSON.stringify({status: "OK"}));
				}
			});
		}
	});
};

exports.addSupplementaryContent = function(req, res) {
	req.body.supplementaryContent.forEach(function(content) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{identifier: req.body.id}, "supplementary_content"]))
		.then(function(learningElement) {
			var deferred = promise_lib.defer();
			if(typeof learningElement === 'undefined')  {
				deferred.reject('No learning activity found for the matching id');
			} else {
				learningElement.supplementary_content.push(content);
				learningElement.markModified('supplementary_content');
				learningElement.save(ViewHelperUtil.buildUpdateFunction(deferred));
			}
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_SUPPLEMENTARY_CONTENT", req, res));
	});
}

exports.updateSupplementaryContent = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{identifier: req.body.id}, "supplementary_content"]))
	.then(function(learningElement){
		var deferred = promise_lib.defer();
		if(typeof learningElement.supplementary_content === 'undefined')  {
			deferred.reject('No supplementary content found for the learning activity');
		} else {
			var suppContent;
			learningElement.supplementary_content.forEach(function(content) {
				if(content.contentId == req.body.contentId && content.contentGroup == req.body.contentGroup) {
					suppContent = content;
				}
			});
			for(k in req.body.content) suppContent[k] = req.body.content[k];
			learningElement.markModified('supplementary_content');
			learningElement.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_SUPPLEMENTARY_CONTENT", req, res));
}

exports.deleteSupplementaryContent = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{identifier: req.body.id}, "supplementary_content"]))
	.then(function(learningElement){
		var deferred = promise_lib.defer();
		if(typeof learningElement.supplementary_content === 'undefined')  {
			deferred.reject('No supplementary content found for the learning activity');
		} else {
			learningElement.supplementary_content.forEach(function(content) {
				if(content.contentId == req.body.contentId && content.contentGroup == req.body.contentGroup) {
					content.remove();
				}
			});
			learningElement.markModified('supplementary_content');
			learningElement.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_SUPPLEMENTARY_CONTENT", req, res));
}

exports.addLessonEndExercise = function(req, res) {
	req.body.supplementaryContent.forEach(function(content) {
		var error = {};
		promise_lib.resolve()
	    .then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{identifier: req.body.id}, "exercisesCollection"]))
		.then(function(lob) {
			var deferred = promise_lib.defer();
			if(typeof lob === 'undefined')  {
				deferred.reject('No learning object found for the matching id');
			} else {
				lob.exercisesCollection.elementId = req.body.collectionId;
				lob.exercisesCollection.elementType = 'ExercisesCollection';
				lob.save(ViewHelperUtil.buildUpdateFunction(deferred));
			}
			return deferred.promise;
		})
		.catch (ViewHelperUtil.buildCatchFunction(error))
		.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_LESSON_END_EXERCISES", req, res));
	});
}

exports.importLearningObject = function(node, graph, courseId) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);

	var sequence = ViewHelperUtil.getSequence(id, graph);
	var defer = promise_lib.defer();
	var isNew = false;
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectModel.findOne, LearningObjectModel, [{identifier: id}]))
	.then(function(element) {
		//console.log("INSIDE IMPORT LO", element.metadata.nodeId);
		var deferred = promise_lib.defer();
		if(typeof element == 'undefined' || element == null) {
			element = new LearningObjectModel();
			element.identifier = id;
			element.courseId = courseId;
			isNew = true;
		}
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'description', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'courseId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'setType', element, 'nodeSet');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'nodeSetId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'pedagogyId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'taxonomyId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'hasSequence', element, 'sequenceId');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'setType', element, 'lobType');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'entryCriteriaExpr', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'offset', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'startDate', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'endDate', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'createdBy', element);

		if(metadata && typeof metadata['keyword'] != 'undefined' && metadata['keyword'] != '') {
			element.concepts = [];
			element.markModified('concepts');
		}

		ViewHelperUtil.setSequence(sequence, graph, element, 'LearningObjects');


		if(typeof element.metadata == 'undefined' || element.metadata == null) element.metadata = {};
		for(k in metadata) {
			if(k!='isPartial')
			element.metadata[k] = metadata[k];
		}
		element.is_deleted = false;
		element.markModified('metadata');

		element.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				if(typeof object.nodeSetId === 'undefined' || object.nodeSetId == null) {
					PedagogyNodeSetModel = mongoose.model('PedagogyNodeSetModel');
					PedagogyNodeSetModel.findOne({nodeSetName: object.lobType, nodeSetClass: ViewHelperConstants.LEARNING_OBJECT, pedagogyId: object.pedagogyId}).exec(function(err, nodeSet) {
						if(!err && null != nodeSet) {
							object.nodeSetId = nodeSet.identifier;
							object.taxonomyId = nodeSet.taxonomyId;
							object.save(function(err) {
								if(err) {
									console.log('Error importing LOB - ', err);
								}
							});
						} else {
							console.log('Nodeset not found for ', object.lobType, ViewHelperConstants.LEARNING_OBJECT, object.pedagogyId);
						}
					});
				}
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.then(function(lob) {
		//console.log("NODE ID OF LEARNING OBJECT", lob);
		var deferred = promise_lib.defer();
		if(lob.lobType == ViewHelperConstants.COURSE) {
			var courseViewHelper = require('./CourseViewHelper');
			courseViewHelper.importCourse(node, graph);
		}
		LearningObjectElementsModel.findOne({lobId: lob.identifier}).exec(function(err, element) {
			if(typeof element == 'undefined' || element == null) {
				element = new LearningObjectElementsModel();
				element.lobId = lob.identifier;

			}
			element.name = lob.name;
			element.courseId = lob.courseId;
			ViewHelperUtil.setPropertyIfNotEmpty(node, 'hasSequence', element, 'sequenceId');
			ViewHelperUtil.setSequence(sequence, graph, element, 'LearningElements');
	//		console.log("LOB elements",element);
			element.save(function(err) {
				if(err) {
					console.log('Error importing LOB Elements - ', err);
					deferred.reject(err);
				}
				deferred.resolve(element);
			});
		});
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('lob import err', err);
	})
	.done(function(element) {

		//console.log("SAVED LEARNING OBJECT",element);
		var saveType = (isNew) ? ViewHelperConstants.INSERT : ViewHelperConstants.UPDATE;
		var resolveObject = {
            'saveType': saveType,
            'object': JSON.stringify(element)
        };
     // console.log("resolveObject:",resolveObject);
		defer.resolve(resolveObject);
	});
	return defer.promise;
}

exports.importRelation = function(edge, node, childNode) {
	var relation = ViewHelperUtil.getNodeProperty(edge, 'relation_label');
	var relationType = ViewHelperUtil.getNodeProperty(edge, 'relationType');
	var childNodeType = ViewHelperUtil.getNodeProperty(childNode, 'setType');
	var nodeType = ViewHelperUtil.getNodeProperty(node, 'setType');
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectElementsModel.findOne, LearningObjectElementsModel, [{lobId: ViewHelperUtil.getNodeProperty(node, 'identifier')}]))
	.then(function(element) {
		if(childNodeType == ViewHelperConstants.LEARNING_RESOURCE || childNodeType == ViewHelperConstants.LEARNING_ACTIVITY
			|| childNodeType == ViewHelperConstants.COLLECTION) {
			return upsertElement(element, childNode, childNodeType);
		} else if(childNodeType == ViewHelperConstants.MODULE || childNodeType == ViewHelperConstants.LESSON || childNodeType == ViewHelperConstants.BINDER) {
			return upsertChildren(node, childNode, relation, relationType);
		} else if(childNodeType == ViewHelperConstants.CONCEPT) {
			return upsertConcept(element, childNode);
		} else if(childNodeType == ViewHelperConstants.CONTENT && nodeType == ViewHelperConstants.BINDER) {
			return upsertElement(element, childNode, childNodeType);
		} else if(childNodeType == ViewHelperConstants.CONTENT) {
			return upsertContent(element, childNode, relationType);
		} else if(childNodeType == ViewHelperConstants.FACULTY || childNodeType == ViewHelperConstants.TUTOR) {
			upsertPerson(element, childNode, childNodeType);
		} else if(childNodeType == ViewHelperConstants.PACKAGE) {
			addPackages(element, childNode);
		}
	})
	.done(function() {
		defer.resolve();
	});
	return defer.promise;
}

function addPackages(learningElement, node) {

	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({identifier: learningElement.lobId,
	packages: {$elemMatch: {identifier: nodeId}}}).exec(function(err, course) {
		if (err) {
			console.log('Error Searching packages - ', err);
		} else {
			if (course && course != null) {
				CourseModel.update(
					{
						identifier: learningElement.lobId,
						"packages": {$elemMatch: {identifier: nodeId}}
					},
					{
						$set: {
							"packages.$.name": ViewHelperUtil.getNodeProperty(node, 'name'),
							"packages.$.outcome": ViewHelperUtil.getNodeProperty(node, 'outcome'),
							"packages.$.price": ViewHelperUtil.getNodeProperty(node, 'price'),
							"packages.$.totalLearningTime": ViewHelperUtil.getNodeProperty(node, 'learningTime'),
							"packages.$.tutoringHours": ViewHelperUtil.getNodeProperty(node, 'tutoringHours'),
							"packages.$.metadata": ViewHelperUtil.retrieveMetadata(node)
						}
					}
				).exec(function(err) {
					if(err)
						console.log('Error Updating Packages - ', err);
				});
			} else {
				CourseModel.update(
					{
						identifier: learningElement.lobId
					},
					{
						$push: {
							packages : {
								identifier: nodeId,
								name: ViewHelperUtil.getNodeProperty(node, 'name'),
								outcome: ViewHelperUtil.getNodeProperty(node, 'outcome'),
								price: ViewHelperUtil.getNodeProperty(node, 'price'),
								totalLearningTime: ViewHelperUtil.getNodeProperty(node, 'learningTime'),
								tutoringHours: ViewHelperUtil.getNodeProperty(node, 'tutoringHours'),
								metadata: ViewHelperUtil.retrieveMetadata(node)
							}
						}
					}
				).exec(function(err) {
					if(err) {
						console.log('Error Pushing Association - ', err);
					}
				});
			}
		}
	});
}

function upsertElement(learningElement, node, elementType) {

	var defer = promise_lib.defer();
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var matched;
	if(learningElement.elements) {
		learningElement.elements.forEach(function(element) {
			if(element.elementId == nodeId && element.elementType == elementType) {
				matched = true;
			}
		});
	}
	promise_lib.resolve()
	.then(function() {
		if(!matched) {
			var deferred = promise_lib.defer();
			var element = {
				name: ViewHelperUtil.getNodeProperty(node, 'name'),
				elementId: nodeId,
				elementType: elementType,
				isMandatory: (ViewHelperUtil.getNodeProperty(node, 'isMandatory') == 'false' ? false : true)
			};
			MongoHelper.update('LearningObjectElementsModel', {lobId: learningElement.lobId}, {$push: {elements: element}}, function(err, obj) {
				if(err) console.log('Content - Error upserting concept on import - ', err);
				deferred.resolve()
			});
			return deferred.promise;
		}
	})
	.then(function() {
		var deferred = promise_lib.defer();
		if(elementType == ViewHelperConstants.LEARNING_RESOURCE) {
			MongoHelper.update('LearningResourceModel', {identifier: nodeId}, {$set: {lobId: learningElement.lobId}}, function(err, obj) {
				deferred.resolve();
			});
		} else if(elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
			MongoHelper.update('LearningActivityModel', {identifier: nodeId}, {$set: {lobId: learningElement.lobId}}, function(err, obj) {
				deferred.resolve();
			})
		} else if(elementType == ViewHelperConstants.COLLECTION) {
			MongoHelper.update('LearningCollectionModel', {identifier: nodeId}, {$set: {lobId: learningElement.lobId}}, function(err, obj) {
				deferred.resolve();
			})
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function() {
		defer.resolve();
	})
	.catch(function(err) {
		defer.reject(err);
	}).done();

	return defer.promise;
}

function upsertChildren(node, childNode, relation, relationType) {

	var defer = promise_lib.defer();
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var childNodeId = ViewHelperUtil.getNodeProperty(childNode, 'identifier');
	MongoHelper.findOne(
		'LearningObjectModel',
		{identifier: nodeId, children: {$elemMatch: {identifier: childNodeId}}},
		{identifier: 1},
		function(err, lob) {
			if(!lob || null == lob) {
				MongoHelper.update(
					'LearningObjectModel',
					{identifier: nodeId},
					{$push: {children: {identifier: childNodeId, nodeSet: ViewHelperUtil.getNodeProperty(childNode, 'setType')}}},
					function(err, obj) {
						defer.resolve();
					}
				);
			} else {
				defer.resolve();
			}
		}
	);
	return defer.promise;
}

function upsertPerson(element, node, nodeType) {
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({identifier: element.lobId}).exec(function(err, course) {
		if(err) {
			console.log('Course not found - ', err);
		} else {
			if(nodeType == ViewHelperConstants.FACULTY) {
				if(!course.faculty) course.faculty = {};
				course.faculty.name = ViewHelperUtil.getNodeProperty(node, 'name');
				course.faculty.identifier = ViewHelperUtil.getNodeProperty(node, 'identifier');
				course.faculty.description = ViewHelperUtil.getNodeProperty(node, 'description');
				course.faculty.image = ViewHelperUtil.getNodeProperty(node, 'image');
				course.markModified('faculty');
			} else {
				var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
				var matched;
				if(course.tutors) {
					course.tutors.forEach(function(tutor) {
						if(tutor.identifier == nodeId) {
							matched = tutor;
						}
					});
				}
				if(!matched) {
					course.tutors.push({
						name: ViewHelperUtil.getNodeProperty(node, 'name'),
						identifier: ViewHelperUtil.getNodeProperty(node, 'identifier'),
						description: ViewHelperUtil.getNodeProperty(node, 'description'),
						image: ViewHelperUtil.getNodeProperty(node, 'image')
					});
				} else {
					matched.name = ViewHelperUtil.getNodeProperty(node, 'name');
					matched.description = ViewHelperUtil.getNodeProperty(node, 'description');
					matched.image = ViewHelperUtil.getNodeProperty(node, 'image');
				}
				course.markModified('tutors');
			}
			course.save(function(err) {
				if(err) console.log('Error upserting course on import - ', err);
			});
		}
	});
}

function upsertConcept(element, node) {

	var defer = promise_lib.defer();
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	LearningObjectModel.findOne({identifier: element.lobId, concepts: {$elemMatch: {conceptIdentifier: nodeId}}}).exec(function(err, lob) {
		if (err) {
			console.log('Error Searching Assoications - ', err);
			defer.resolve();
		} else {
			if (lob && lob != null) {
				LearningObjectModel.update(
					{identifier: element.lobId, "concepts": {$elemMatch: {conceptIdentifier: nodeId}}},
					{
						$set: {
							"concepts.$.conceptTitle": ViewHelperUtil.getNodeProperty(node, 'title')
						}
					}
				).exec(function(err) {
					if(err) {
						console.log('Error updating concept to LOB - ', err);
					}
					defer.resolve();
				});
			} else {
				LearningObjectModel.update({identifier: element.lobId},
					{
						$push: {
							concepts : {
								conceptTitle : ViewHelperUtil.getNodeProperty(node, 'title'),
								conceptIdentifier : nodeId
							}
						}
					}
				).exec(function(err, obj) {
					if(err) {
						console.log('Error adding concept to LOB - ', err);
					}
					defer.resolve();
				});
			}
		}
	});
	return defer.promise;
}

function upsertContent(element, node, relationType) {

	var defer = promise_lib.defer();
	if(relationType == '') {
		relationType = 'references';
	}
	relationType = ViewHelperConstants.getContentGroup(relationType.toLowerCase());
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	ContentModel = mongoose.model('MediaContentModel');
	ContentModel.findOne({identifier: nodeId}).exec(function(err, content) {
		if(!err) {
			var matched;
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(object) {
					if(object.contentId == nodeId && object.contentGroup.toLowerCase() == relationType) {
						matched = object;
					}
				});
			}
			var media = content.media[0];
			content.media.forEach(function(med) {
				if(med.isMain) {
					media = med;
				}
			});
			if(!matched) {
				MongoHelper.update(
					'LearningObjectElementsModel',
					{lobId: element.lobId},
					{
						$push: {
							supplementary_content : {
								name: content.name,
								mediaURL: media.mediaUrl,
								mimeType: media.mimeType,
								mediaType: media.mediaType,
								contentGroup: relationType,
								contentId: nodeId
							}
						}
					},
					function(err, obj) {
						if(err) {
							console.log('Error Pushing Association - ', err);
						}
						defer.resolve();
					}
				);
			} else {
				MongoHelper.update(
					'LearningObjectElementsModel',
					{lobId: element.lobId, 'supplementary_content': {$elemMatch: {contentId: nodeId}}},
					{
						$set: {
							'supplementary_content.$.name': content.name,
							'supplementary_content.$.mediaURL': media.mediaUrl,
							'supplementary_content.$.mimeType': media.mimeType,
							'supplementary_content.$.mediaType': media.mediaType
						}
					},
					function(err, obj) {
						if(err) {
							console.log('Error Updating Association - ', err);
						}
						defer.resolve();
					}
				);
			}
		} else {
			defer.resolve();
		}
	});
	return defer.promise;
}

exports.deleteLOB = function(object) {
	object.recursive = object.recursive.toLowerCase();
	var isRecursive = (object.recursive == 'true' || object.recursive == 'Y');
	var message = '';
	var errors = [];
	var deleted = [];
	var extId = null;
	var courseId;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearningObjectModel.findOne({identifier: object.nodeId}).lean().exec(function(err, lobElement) {
			if(err) {
				deferred.reject(err);
			} else if(!lobElement) {
				extId = object.nodeId;
				deferred.reject('element does not exist.');
			} else {
				extId = lobElement.metadata.nodeId;
				courseId = lobElement.courseId;
				if(!isRecursive && (lobElement.children.length > 0)) {
					deferred.reject(lobElement.metadata.nodeId+' have children. please select recursive.');
				} else {
					deferred.resolve(lobElement);
				}
			}
		});
		return deferred.promise;
	})
	.then(function(lob) {
		courseMWHelper.emptyObjectInMW(lob.sequenceId);
		if(object.isRemove) courseMWHelper.disconnectObjectInMW(lob.identifier, lob.sequenceId, 'hasSequence');
	})
	.then(function() {
		console.log("After isRecursive check...");
		var deferred = promise_lib.defer();
		if(object.parentNodeId != '') {
			//Delete the parent relation
			deleteLobRelation(object.parentNodeId, object.nodeId)
			.then(function(msg) {
				message = msg;
				deferred.resolve(true);
			});
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	})
	.then(function(checkForParent) {
		var deferred = promise_lib.defer();
		if(checkForParent) {
			isReferenced(object.nodeId).then(function(hasParent) {
				deferred.resolve(!hasParent);
			});
		} else {
			deferred.resolve(true);
		}
		return deferred.promise;
	})
	.then(function(deleteElement) {
		var deferred = promise_lib.defer();
		if(deleteElement) {
			deleteLobRelations(object.nodeId).then(function() {
				deferred.resolve(true);
			});
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	})
	.then(function(deleteElement) {
		var deferred = promise_lib.defer();
		if(deleteElement) {
			if(object.isRemove) {
				LearningObjectModel.findOneAndRemove({identifier: object.nodeId}).exec(function(err, deletedObject) {
					if(err) {
						console.log("Error:",err);
						deferred.reject(err);
					} else {
						courseMWHelper.emptyObjectInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve(deletedObject);
					}
				});
			} else {
				LearningObjectModel.findOneAndUpdate({identifier: object.nodeId},{'is_deleted' : true, sequence:[], sequenceId: ''}).exec(function(err, deletedObject) {
					if(err) {
						deferred.reject(err);
					} else {
						// TODO MW update is pending... removeRelation(parentNodeId), updateDeleteFlag.
						courseMWHelper.setDeleteStatusInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve(deletedObject);
					}
				});
			}
		} else {
			message += object.nodeId + ' is not deleted as it is referenced by another object';
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function(deletedObject) {
		var deferred = promise_lib.defer();
		LearningObjectElementsModel.findOneAndRemove({lobId: object.nodeId}).exec(function(err, deletedLOBElement) {
			if(err) {
				deferred.reject(err);
			} else if(deletedObject) {
				deletedObject = deletedObject.toObject();
				deletedObject['lobElement'] = deletedLOBElement;
				deferred.resolve(deletedObject);
			} else {
				deferred.resolve(deletedObject);
			}
		});
		return deferred.promise;
	})
	.then(function(deletedObject) {
		if(deletedObject && isRecursive) {
			var contentViewHelper = require('./ContentViewHelper');
			var lrViewHelper = require('./LearningResourceViewHelper');
			var laViewHelper = require('./LearningActivityViewHelper');
			var collViewHelper = require('./LearningCollectionViewHelper');
			var promises = [];
			deletedObject.children.forEach(function(lob) {
				promises.push(exports.deleteLOB({
					nodeId: lob.identifier,
					parentNodeId: deletedObject.identifier,
					parentNodeType: ViewHelperConstants.LEARNING_OBJECT,
					recursive: 'true',
					isRemove: object.isRemove
				}));
			});
			if(deletedObject.lobElement && deletedObject.lobElement.supplementary_content) {
				deletedObject.lobElement.supplementary_content.forEach(function(content) {
					promises.push(contentViewHelper.deleteContent({
						nodeId: content.contentId,
						parentNodeId: deletedObject.identifier,
						parentNodeType: ViewHelperConstants.LEARNING_OBJECT,
						recursive: 'true',
						isRemove: object.isRemove
					}));
				});
			}
			if(deletedObject.lobElement && deletedObject.lobElement.elements) {
				deletedObject.lobElement.elements.forEach(function(element) {
					if(element.elementType == ViewHelperConstants.LEARNING_RESOURCE) {
						promises.push(lrViewHelper.deleteLearningResource({
							nodeId: element.elementId,
							parentNodeId: deletedObject.identifier,
							parentNodeType: ViewHelperConstants.LEARNING_OBJECT,
							recursive: 'true',
							isRemove: object.isRemove
						}));
					} else if(element.elementType == ViewHelperConstants.LEARNING_ACTIVITY) {
						promises.push(laViewHelper.deleteLearningActivity({
							nodeId: element.elementId,
							parentNodeId: deletedObject.identifier,
							parentNodeType: ViewHelperConstants.LEARNING_OBJECT,
							recursive: 'true',
							isRemove: object.isRemove
						}));
					} else if(element.elementType == ViewHelperConstants.COLLECTION) {
						promises.push(collViewHelper.deleteCollection({
							nodeId: element.elementId,
							parentNodeId: deletedObject.identifier,
							parentNodeType: ViewHelperConstants.LEARNING_OBJECT,
							recursive: 'true',
							isRemove: object.isRemove
						}));
					}
				});
			}
			return promise_lib.all(promises);
		}
	})
	.then(function(promises) {
		if(promises){
			promises.forEach(function(promise) {
				promise.deletedList.forEach(function(deletedNodeId) {
					deleted.push(deletedNodeId);
				});
			});
		}
	})
	.catch(function(err) {
		console.log('Error deleting learning object - ', err);
		if(err) errors.push(err);
	})
	.done(function() {
		if(errors.length > 0) {
			errors.forEach(function(err) {
				message+=err;
			});
		}
		console.log("Length: ", deleted.length);
		console.log("LOB DELETED: ", deleted);
		console.log("DONE LOB Promises with ID:"+object.nodeId+" ::",deleted);
		defer.resolve({'message': message, 'extId': extId, 'deletedList': deleted, 'courseId': courseId});
	});
	return defer.promise;
}

function deleteLobRelations(elementId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel.find({'children.identifier': elementId}).exec(function(err, lobs) {
			if(err) {
				defer.reject(err);
			} else if(lobs && lobs.length > 0) {
				var promises = [];
				lobs.forEach(function(lob) {
					promises.push(deleteLobRelation(lob.identifier, elementId));
				})
				promise_lib.all(promises).then(function(value) {
				    defer.resolve();
				});
			} else {
				defer.resolve();
			}
		});
		return defer.promise;
	})
	.done(function() {
		deferred.resolve();
	});
	return deferred.promise;
}

function deleteLobRelation(parentId, elementId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel.update({identifier: parentId},{$pull: {children : {'identifier': elementId}}}).exec(function(err, pulledObj) {
			if(err) console.log('Unable to delete LOB - LOB relation - ', err);
			defer.resolve();
		});
		defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel.update({identifier: parentId},{$pull: {'sequence': elementId}}).exec(function(err, pulledObj) {
			if(err) console.log('Unable to delete LOB - LA relation - ', err);
			defer.resolve();
		});
		defer.promise;
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	.done(function() {
		/*courseMWHelper.exportLOBToMW(parentId);*/
		courseMWHelper.disconnectObjectInMW(parentId, elementId, 'hasConstituent');
		courseMWHelper.updateSequenceInMW(parentId,'LearningObjectElementsModel');
		deferred.resolve('Relation between ' + parentId + ' and ' + elementId + ' is deleted.');
	});
	return deferred.promise;
}

function isReferenced(lobId) {
	var hasParent = false;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel.count({'children.identifier': lobId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.done(function() {
		deferred.resolve(hasParent);
	});
	return deferred.promise;
}

exports.getBindersByParent = function(req, res) {
	var errors = [];
	var parentId = req.params.parentId;
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningObjectModel', {"parentId": parentId}, {identifier: 1 }).toArray(function(err, binders) {
			deferred.resolve(binders);
		});
		return deferred.promise;
	})
	.then(function(bindersOnlyIds) {
		var binders = [];
		var deferred = promise_lib.defer();
		if(bindersOnlyIds && bindersOnlyIds.length > 0) {
			var ids = [];
			bindersOnlyIds.forEach(function(binder) {
				ids.push(binder.identifier);
			});
			MongoHelper.find('LearningObjectElementsModel',{lobId : {$in : ids}}, {lobId:1, name:1, elements:1}).toArray(function(err, binders) {
				deferred.resolve(binders);
			});
		} else {
			deferred.resolve(binders);
		}
		return deferred.promise;
	})
	.catch(function(err) {
		console.log("Error while fetching binders using parentId:",err);
		errors.push(err);
	})
	.done(function(binders) {
		if(errors.length > 0) {
			res.send({"status":"ERROR", "errorMessage": JSON.stringify(errors)});
		} else {
			res.send({"status":"SUCCESS", "binders": binders});
		}
	});
}

exports.saveLOB = function(req, res) {
	//TODO: Save the LOB to MW
}

