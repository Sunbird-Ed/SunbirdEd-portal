/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for TaxonomyModel
 *
 * @author Santhosh
 */
var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var pedagogyViewHelper = require('./PedagogyViewHelper');
var lobViewHelper = require('./LearningObjectViewHelper');
var RDFGraphUtil = require('../../commons/RDFGraphUtil');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
var promise_lib = require('when');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var courseUtil = require('./CourseUtil');
var playerUtil = require('../player/PlayerUtil');
var promise_lib = require('when');


exports.getCourse = function(req, res) {
	var recursiveObj = {};
	recursiveObj.loop = 0;
	recursiveObj.courseStructure = '';
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({identifier: req.params.id}).lean().exec(function(err, course) {
		if (err || typeof course === 'undefined' || course == null) {
			errorModule.handleError(err, "ERROR_FINDING_COURSE", req, res);
		} else {
			res.send(JSON.stringify(course));
		}
	});
};

exports.getCourseStructure = function(req, res) {

	var course;
	var courseId = req.params.id;
	promise_lib.resolve()
	.then(function() {
		return getLearningObject(courseId);
	})
	.then(function(courseObj) {
		course = courseObj;
		course.type = 'course';
		course.level = 0;
		var promises = [];
		if(course.children && course.children.length > 0) {
			course.children.forEach(function(module) {
				promises.push(getModule(module.identifier));
			});
			return promise_lib.all(promises);
		}
		return [];
	})
	.then(function(modules) {
		delete course.children;
		course.modules = modules;
		res.send(JSON.stringify(course));
	})
	.catch(function(err) {
		console.log('Error in getCourseStructure', err);
		res.send(err);
	}).done();
};

function getModule(moduleId) {
	console.log('Get module', moduleId);
	var module;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return getLearningObject(moduleId);
	})
	.then(function(moduleObj) {
		module = moduleObj;
		module.type = 'module';
		module.level = 1;
		var promises = [];
		if(module.children && module.children.length > 0) {
			module.children.forEach(function(lesson) {
				promises.push(getLesson(lesson.identifier));
			});
			return promise_lib.all(promises);
		}
		return [];
	})
	.then(function(lessons) {
		delete module.children;
		module.lessons = lessons;
		deferred.resolve(module);
	})
	.catch(function(err) {
		console.log('Error in getModule', err);
	}).done();
	return deferred.promise;
}

function getLesson(lessonId) {
	console.log('Get lesson', lessonId);
	var lesson;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return getLearningObject(lessonId);
	})
	.then(function(lessonObj) {
		lesson = lessonObj;
		lesson.type = 'lesson';
		lesson.level = 2;
		return getLearningObjectElements(lessonId);
	})
	.then(function(lobElements) {
		lesson.sequence = lobElements.sequence;
		var promises = [];
		if(lobElements.elements && lobElements.elements.length > 0) {
			lobElements.elements.forEach(function(element) {
				if(element.elementType == 'learningresource') {
					promises.push(getLearningResource(element.elementId));
				} else if(element.elementType == 'learningactivity') {
					promises.push(getLearningActivity(element.elementId));
				}
			});
			return promise_lib.all(promises);
		}
		return [];
	})
	.then(function(lectures) {
		delete lesson.children;
		lesson.lectures = lectures;
		deferred.resolve(lesson);
	})
	.catch(function(err) {
		console.log('Error in getLesson', err);
		deferred.reject(lesson);
	}).done();
	return deferred.promise;
}

function getLearningObject(identifier) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('LearningObjectModel', {identifier: identifier}, {identifier:1, sequenceId:1, sequence:1, metadata:1, children: 1}, function(err, element) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(element);
		}
	})
	return deferred.promise;
}

function getLearningObjectElements(identifier) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('LearningObjectElementsModel', {lobId: identifier}, {lobId:1, sequence:1, elements:1}, function(err, element) {
		if(err) {
			deferred.reject(err);
		} else {
			deferred.resolve(element);
		}
	})
	return deferred.promise;
}

function getLearningResource(identifier) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('LearningResourceModel', {identifier: identifier}, {identifier:1, metadata:1}, function(err, element) {
		if(err) {
			deferred.reject(err);
		} else {
			element.type = 'learningresource';
			element.level = 3;
			deferred.resolve(element);
		}
	})
	return deferred.promise;
}

function getLearningActivity(identifier) {
	var deferred = promise_lib.defer();
	MongoHelper.findOne('LearningActivityModel', {identifier: identifier}, {identifier:1, metadata:1}, function(err, element) {
		if(err) {
			deferred.reject(err);
		} else {
			element.type = 'learningactivity';
			element.level = 3;
			deferred.resolve(element);
		}
	})
	return deferred.promise;
}

function writeCourseStructure(res, recursiveObj) {
	if(recursiveObj.loop == 0) {
		recursiveObj.loop--;
		res.send(JSON.stringify(recursiveObj.courseStructure));
	}
}

function getChildrenBySequence(lob) {
	var sequence = lob.sequence;
	var childMap = [];
	if(lob.children) {
		lob.children.forEach(function(child) {
			childMap[child.identifier] = child;
		});
	}
	var returnArray = [];
	for(var k in sequence) {
		returnArray.push(childMap[sequence[k]]);
	}
	return returnArray;
}

function setChildren(parent, res, recursiveObj) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: parent.identifier}).lean().exec(function(err, lob) {
		recursiveObj.loop--;
		if (err) {
			parent.children = [];
			if(parent.children.length == 0) {
				writeCourseStructure(res, recursiveObj);
			}
		} else {
			parent.name = lob.name;
			parent.nodeSet = lob.nodeSet;
			parent.nodeSetId = lob.nodeSetId;
			parent.taxonomyId = lob.taxonomyId;
			parent.children = getChildrenBySequence(lob);
			var nodeSet = pedagogyViewHelper.getNodeSetById(parent.nodeSetId);
			if(null != nodeSet && (typeof nodeSet != 'undefined')) {
				parent.relations = nodeSet.relations;
			}

			if(typeof parent.children === 'undefined' || parent.children.length == 0) {
				writeCourseStructure(res, recursiveObj);
			} else {
				recursiveObj.loop += parent.children.length;
				parent.children.forEach(function(child) {
					setChildren(child, res, recursiveObj);
				});
			}
		}
	})
}

exports.createCourse = function(req, res) {

	var error = {};
	var newId = '';
	promise_lib.resolve()
	.then(function(){return IDCacheUtil.getIdentifier()})
	.then(function(identifier) {
		newId = identifier;
		var deferred = promise_lib.defer();
		CourseModel = mongoose.model('CourseModel');
		var course = new CourseModel();
		course.description = req.body.description;
		course.identifier = identifier;
		course.name = req.body.name;
		course.isDraft = true;
		course.pedagogyId = req.body.pedagogyId;
		course.taxonomyId = req.body.taxonomyId;
		if(req.body.metadata) {
			course.metadata = {};
			for(var k in req.body.metadata) course.metadata[k] = req.body.metadata[k];
		}
		course.faculty = {name: req.body.facultyName, identifier: req.body.facultyId};
		console.log('beforeSave course:', course);
		course.save(ViewHelperUtil.buildCreateFunction(deferred));
		return deferred.promise;
	})
	.then(function(course) {
		console.log('afterSave course:', course);
		var deferred = promise_lib.defer();
		LearningObjectModel = mongoose.model('LearningObjectModel');
		var lob = new LearningObjectModel();
		lob.description = req.body.description;
		lob.identifier = course.identifier;
		lob.name = course.name;
		lob.courseId = course.identifier;
		lob.pedagogyId = course.pedagogyId;
		if(req.body.metadata) {
			lob.metadata = {};
			for(var k in req.body.metadata) lob.metadata[k] = req.body.metadata[k];
		}

		pedagogyViewHelper.getRootNodeSet(course.pedagogyId, function(nodeset) {
			lob.nodeSet = nodeset.nodeSetName;
			lob.nodeSetId = nodeset.identifier;
			lob.taxonomyId = nodeset.taxonomyId;
			deferred.resolve(lob);
		});
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, newId))
	.done(function(lob) {
		lob.save(function(err, learningObject) {
			if (err) {
				errorModule.handleError(err, "ERROR_CREATING_LOB", req, res);
			} else {
				lobViewHelper.createLOBElements(learningObject.identifier);
				res.send(JSON.stringify(learningObject));
			}
		});
	});
};

exports.getLOBById = function(req, res) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: req.params.id}).exec(function(err, lob) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
		} else {
			res.send(JSON.stringify(lob));
		}
	})
}

exports.createLOB = function(req, res) {

	IDCacheUtil.getId(function(id) {
		var error = {};
		promise_lib.resolve()
		.then(function() {
			var deferred = promise_lib.defer();
		})
		LearningObjectModel = mongoose.model('LearningObjectModel');
		var lob = new LearningObjectModel();
		lob.description = req.body.description;
		lob.identifier = id;
		lob.name = req.body.name;
		lob.nodeSet = req.body.nodeSet;
		lob.nodeSetId = req.body.nodeSetId;
		lob.courseId = req.body.courseId;
		lob.pedagogyId = req.body.pedagogyId;
		lob.taxonomyId = req.body.taxonomyId;
		if(req.body.metadata) {
			lob.metadata = {};
			for(var k in req.body.metadata) lob.metadata[k] = req.body.metadata[k];
		}

		lob.save(function(err, learningObject) {
			if (err) {
				errorModule.handleError(err, "ERROR_FINDING_TAXONOMY_MODEL", req, res);
			} else {
				LearningObjectModel.findOne({identifier: learningObject.identifier}).lean().exec(function(err, respLOB) {
					pedagogyViewHelper.getNodeSet(respLOB.nodeSetId, function(nodeSet) {
						respLOB.taxonomyId = nodeSet.taxonomyId;
						respLOB.relations = nodeSet.relations;
						res.send(JSON.stringify(respLOB));
					});
				});
				updateTaxonomyId(learningObject.identifier);
				lobViewHelper.createLOBElements(learningObject.identifier);
				var parentId = req.body.parentId;
				if(parentId == req.body.courseId) {
					CourseModel = mongoose.model('CourseModel');
					CourseModel.findOne({identifier: parentId}).exec(function(err, course) {
						if (err) {
							console.log("Unable to update course collection");
						} else {
							course.children.push({
								identifier: learningObject.identifier,
								nodeSet: learningObject.nodeSet,
								nodeSetId: learningObject.nodeSetId,
								relationName: req.body.relationName
							});
							course.save();
						}
					});
				} else {
					LearningObjectModel.findOne({identifier: parentId}).exec(function(err, parentLOB) {
						if (err) {
							console.log("Unable to update parent LOB collection");
						} else {
							parentLOB.children.push({
								identifier: learningObject.identifier,
								nodeSet: learningObject.nodeSet,
								nodeSetId: learningObject.nodeSetId,
								relationName: req.body.relationName
							});
							parentLOB.save();
						}
					});
				}
			}
		});
	});
};

function updateTaxonomyId(lobId) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: lobId}).exec(function(err, lob) {
		pedagogyViewHelper.getNodeSet(lob.nodeSetId, function(nodeSet) {
			lob.taxonomyId = nodeSet.taxonomyId;
			lob.markModified('taxonomyId');
			lob.save();
		});
	});
};

exports.getMetadata = function(req, res) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: req.params.id}).exec(function(err, lob) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
		} else {
			if(typeof lob.metadata === 'undefined') {
				lob.metadata = {};
			}
			res.send(JSON.stringify(lob.metadata));
		}
	});
}

exports.updateLOBMetadata = function(req, res) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: req.body.id}).exec(function(err, lob) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
		} else {
			if(typeof lob.metadata === 'undefined') {
				lob.metadata = {};
			}
			for(var k in req.body.metadata) lob.metadata[k] = req.body.metadata[k];
			lob.markModified('metadata');
			lob.save(function(err) {
				if(err) {
					errorModule.handleError(err, "ERROR_UPDATING_LOB_SEQUENCE", req, res);
				} else {
					var update = "OK"
					res.send(JSON.stringify(update));
				}
			});
		}
	});
};

exports.getConcepts = function(req, res) {
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		LearningObjectModel = mongoose.model('LearningObjectModel');
		LearningObjectModel.findOne({identifier: req.params.id}).exec(function(err, lob) {
			if (err) {
				deferred.reject(err);
			} else {
				if(lob) {
					if(typeof lob.concepts === 'undefined') {
						deferred.resolve({});
					} else {
						deferred.resolve(lob.concepts);
					}
				} else {
					deferred.resolve();
				}
			}
		});
		return deferred.promise;
	})
	.then(function(concepts) {
		var deferred = promise_lib.defer();
		if(concepts) {
			deferred.resolve(concepts);
		} else {
			LearningResourceModel = mongoose.model('LearningResourceModel');
			LearningResourceModel.findOne({identifier: req.params.id}).exec(function(err, content) {
				if (err) {
					deferred.reject(err);
				} else {
					if(content) {
						if(typeof content.concepts === 'undefined') {
							deferred.resolve({});
						} else {
							deferred.resolve(content.concepts);
						}
					} else {
						deferred.resolve();
					}
				}
			});
		}
		return deferred.promise;
	})
	.catch(function(err) {})
	.done(function(concepts) {
		var result = {};
		if(concepts && concepts.length > 0) {
			concepts.forEach(function(concept) {
				result[concept.conceptIdentifier] = concept.conceptTitle;
			});
		}
		res.send(JSON.stringify(result));
	});
}

exports.getCourseOutcomes = function(req, res) {
	var outcomes = [];
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.findOne('CourseModel', {'identifier': req.params.id}, function(err, course) {
			if(course && course.packages) {
				deferred.resolve(course.packages);	
			} else {
				deferred.resolve();
			}
		});
		return deferred.promise;
	})
	.done(function(packages) {
		if(packages) {
			packages.forEach(function(coursePackage) {
				var tempoutcomes = coursePackage.outcome.split(",");
				tempoutcomes.forEach(function(item) {
					if(outcomes.indexOf(item) == -1) outcomes.push(item);
				});
			})
		}
		res.send(JSON.stringify(outcomes));
	})
}

exports.updateLOBSequence = function(req, res) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: req.body.id}).exec(function(err, lob) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
		} else {
			lob.sequence = req.body.sequence;
			lob.markModified('sequence');
			lob.save(function(err) {
				if(err) {
					errorModule.handleError(err, "ERROR_UPDATING_LOB_SEQUENCE", req, res);
				} else {
					var update = "OK"
					res.send(JSON.stringify(update));
				}
			});
		}
	});
};

exports.deleteLOB = function(req, res) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: req.params.id}).exec(function(err, lob) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
		} else {
			if(typeof lob.children === 'undefined' || lob.children.length == 0) {
				LearningObjectModel.remove({identifier: req.params.id}).exec(function(err) {
					if (err) {
						errorModule.handleError(err, "ERROR_FINDING_LOB", req, res);
					} else {
						res.send(JSON.stringify({result: "OK"}));
					}
				});
				LearningObjectModel.find({'children.identifier':lob.identifier}).exec(function(err, lobs) {
					lobs.forEach(function(lob2) {
						lob2.children.forEach(function(child){
							if(child.identifier == lob.identifier) {
								child.remove();
							}
						});
						lob2.save();
					});
				});
				CourseModel = mongoose.model('CourseModel');
				CourseModel.find({'children.identifier':lob.identifier}).exec(function(err, lobs) {
					lobs.forEach(function(lob2) {
						lob2.children.forEach(function(child){
							if(child.identifier == lob.identifier) {
								child.remove();
							}
						});
						lob2.save();
					});
				});
			} else {
				errorModule.handleError('This learning object contains child learning objects. Please delete all the child LOB', "ERROR_CONTAINS_CHILD_LOBS", req, res);
			}
		}
	});
};

exports.reset = function(req, res) {
	//Refresh the course from the middleware
};

exports.upload = function(req, res) {

}

exports.save = function(req, res) {
	getCourse(req.params.id, courseCallback);
	lobViewHelper.createLOBResources(req.params.id);
	res.send('OK');
};

exports.getPedagogyId = function(courseId, callback) {
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({identifier: courseId}).lean().exec(function(err, course) {
		if (err) {
			callback(err);
		} else {
			if (course) {
				callback(null, course.pedagogyId);
			} else {
				callback("Course not found");
			}
		}
	});
}

function courseCallback(recursiveObj, err) {
	if(err) {
		//console.log('err', err);
	} else {
		if(recursiveObj.loop == 0) {
			recursiveObj.loop--;
			exports.saveCourseMW(recursiveObj.courseStructure);
			//TODO: Call middleware helpers to convert the course json and save it. The complete course is encapsulated
			//in the recursiveObj.courseStructure
			//console.log('courseStructure', JSON.stringify(recursiveObj.courseStructure));
		}
	}
}

function getCourse(courseId, callback) {
	var recursiveObj = {};
	recursiveObj.loop = 0;
	recursiveObj.courseStructure = '';
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOne({identifier: courseId}).lean().exec(function(err, course) {
		if (err) {
			callback(recursiveObj, err);
		} else {
			recursiveObj.courseStructure = course;
			recursiveObj.courseStructure.identifier = course.identifier;
			pedagogyViewHelper.getRootNodeSet(course.pedagogyId, function(nodeSet) {
				recursiveObj.courseStructure.nodeSet = nodeSet.nodeSetName;
				recursiveObj.courseStructure.nodeSetClass = nodeSet.nodeSetClass;
				if(typeof recursiveObj.courseStructure.children === 'undefined' || recursiveObj.courseStructure.children.length == 0) {
					callback(recursiveObj);
				}
				recursiveObj.loop += recursiveObj.courseStructure.children.length;
				recursiveObj.courseStructure.children.forEach(function(child) {
					getChildren(child, callback, recursiveObj);
				});
			});
		}
	});
};

exports.getAllCourses =function(req, res) {
	var errors = [];
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('LearningObjectModel', {lobType: 'course'},{name:1,identifier:1, 'metadata.nodeId': 1}).toArray(function(err, courses) {
			if (err) {
				console.log("Error "+err);
				deferred.reject(err);
			} else {
				deferred.resolve(courses);
			}
		});
		return deferred.promise;
	})
	.then(function(courses) {
		res.json(courses);
	})
	.catch(function(err) {
		if(err) errors.push(err);
		res.json(errors);
	})
	.done();
};

function getChildren(parent, callback, recursiveObj) {
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectModel.findOne({identifier: parent.identifier}).lean().exec(function(err, lob) {
		recursiveObj.loop--;
		if (err) {
			parent.children = [];
			callback(recursiveObj, err);
		} else {
			parent.name = lob.name;
			parent.identifier = lob.identifier;
			parent.taxonomyId = lob.taxonomyId;
			parent.metadata = lob.metadata;
			parent.children = lob.children;
			parent.learningObjectives = lob.learningObjectives;
			parent.sequence = lob.sequence;
			pedagogyViewHelper.getNodeSet(parent.nodeSetId, function(nodeSet) {
				parent.nodeSetClass = nodeSet.nodeSetClass;
				if(typeof parent.children === 'undefined' || parent.children.length == 0) {
					callback(recursiveObj);
				} else {
					recursiveObj.loop += parent.children.length;
					parent.children.forEach(function(child) {
						getChildren(child, callback, recursiveObj);
					});
				}
			})
		}
	})
}

/*
 * Saves course in Backend
 *
 */
exports.saveCourseMW = function(courseStructure) {
    console.log('Got Save request for :' + JSON.stringify(courseStructure));
    var pedagogyId = courseStructure.pedagogyId;
    var rdfData = {
        pedagogyId: courseStructure.pedagogyId
    };
    courseUtil.populateRDFFromLearningObject(courseStructure, rdfData);

    var req = new Object();
    req.LEARNING_OBJECT = JSON.stringify(rdfData.rdf);
    req.LEARNING_OBJECT_ID = courseStructure.identifier;

    console.log('Sending save Req :' + JSON.stringify(req, null, 4));

    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MWServiceProvider.callServiceStandard("DummyService", "SaveObject", req, function(err, data, response) {
            if (err) {
                console.log("Error in Response from MW saveLearningObject: " + JSON.stringify(err, null, 4));
                dererred.reject(err);
            } else {
                console.log("Response from MW saveLearningObject: " + JSON.stringify(data, null, 4));
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    }).done();
}

exports.importCourse = function(node, graph) {
	CourseModel = mongoose.model('CourseModel');
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');

	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(CourseModel.findOne, CourseModel, [{identifier: id}]))
	.then(function(element) {
		var deferred = promise_lib.defer();
		if(typeof element == 'undefined' || element == null) {
			element = new CourseModel();
			element.identifier = id;
		}

		ViewHelperUtil.setPropertyIfNotEmpty(node, 'nodeId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'description', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'pedagogyId', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'image', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'homeDescription', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'weeksDuration', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'hoursPerWeek', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'hoursOfVideo', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'order', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'timeUnit', element);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'showOnHomePage', element);
		if(!element.introduction) element.introduction = {};
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'description', element.introduction, 'text');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'location', element.introduction, 'videoURL');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'format', element.introduction, 'videoMimeType');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'hasPackageSequence', element, 'packageSequenceId');
		element.packageSequence = ViewHelperUtil.getSequence(id, graph, 'hasPackageSequence');
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'currentStatus', element, 'status');
		element.outcomeSequence = ViewHelperUtil.getSequence(id, graph, 'hasOutcomeSequence');

		element.markModified('packageSequence');
		element.markModified('introduction');
		element.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.done(function(element) {
		defer.resolve(element);
	});
	return defer.promise;
}

exports.getHomePageCourses = function(req, res) {
	LoggerUtil.setOperationName('getHomePageCourses');
	CourseModel = mongoose.model('CourseModel');
	var courses = null;
	var homeCourses = {};
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('CourseModel',{showOnHomePage: 1}).toArray(function(err, data) {
			if(err) {
				deferred.reject(err);
			} else {
				courses = data;
				deferred.resolve(data);
			}
		});
		return deferred.promise;
	}).then(function() {
		var deferreds = [];
		// TODO: Update - unecessary multiple calls for each course. Make one single call for all courses
		courses.forEach(function(course) {
			deferreds.push(getHomePageCourseData(course));
		});
		return promise_lib.all(deferreds);
	})
	.then(function() {
		homeCourses.popular = [];
		homeCourses.upcoming = [];
		courses.forEach(function(course) {
			course.shortId = playerUtil.removeFedoraPrefix(course.identifier);
			if(course.faculty) {
				course.faculty.shortId = playerUtil.removeFedoraPrefix(course.faculty.identifier);
			}
			if(course.featuredCourse && !homeCourses.featured) {
				homeCourses.featured = course;
			} else {
				if(course.status == "upcoming") {
					homeCourses.upcoming.push(course);
				} else {
					homeCourses.popular.push(course);
				}
			}
		});
		if(!homeCourses.featured) {
			homeCourses.featured = courses[0];
			if(homeCourses.popular.indexOf(courses[0]) > -1) {
				homeCourses.popular.splice(homeCourses.popular.indexOf(courses[0]), 1);
			}
		}
	})
	.catch(function(err) {
		console.log("Error: " + err);
		res.send(err);
	})
	.done(function() {
		res.send(JSON.stringify(homeCourses));
	});
}

function getHomePageCourseData(course) {
	var defer = promise_lib.defer();
	MongoHelper.find('LearningObjectModel', {courseId : course.identifier}).toArray(function(err, data) {
		if(err) {
			defer.reject(err);
		} else {
			course.noOfModules = 0;
			data.forEach(function(lob) {
				if(lob.nodeSet == 'module') {
					course.noOfModules++;
				} else if(lob.nodeSet == 'course') {
					course.status = lob.metadata.currentStatus;
					course.location = lob.metadata.location;
				}
			});
			defer.resolve();
		}
	});

	return defer.promise;
}

exports.getAnnouncementCourse = function(req, res) {
	LoggerUtil.setOperationName('getAnnouncementCourse');
	var courseId = req.params.courseId;
	console.log("courseId:", courseId);
	var course = null;
	var courseLOB = null;
	CourseModel = mongoose.model('CourseModel');
	LearningObjectModel = mongoose.model('LearningObjectModel');
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		CourseModel.findOne({nodeId : courseId}).lean().exec(function(err, data) {
			if(err) {
				deferred.reject(err);
			} else {
				if (!data) {
					CourseModel.findOne({identifier : courseId}).lean().exec(function(err, courseData) {
						if(err || !courseData) {
							deferred.reject(err);
						} else {
							if(courseData.faculty) {
								courseData.faculty.shortId = playerUtil.removeFedoraPrefix(courseData.faculty.identifier);
							}
							if(courseData.tutors && courseData.tutors.length > 0) {
								courseData.tutors.forEach(function(tutor) {
									tutor.shortId = playerUtil.removeFedoraPrefix(tutor.identifier);
								});
							}
							course = courseData;
							deferred.resolve(courseData);
						}
					});
				} else {
					if(data.faculty) {
						data.faculty.shortId = playerUtil.removeFedoraPrefix(data.faculty.identifier);
					}
					if(data.tutors && data.tutors.length > 0) {
						data.tutors.forEach(function(tutor) {
							tutor.shortId = playerUtil.removeFedoraPrefix(tutor.identifier);
						});
					}
					course = data;
					deferred.resolve(data);
				}
			}
		});
		return deferred.promise;
	}).then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel.findOne({identifier : course.identifier}).exec(function(err, data) {
			if(err) {
				defer.reject(err);
			} else {
				courseLOB = data;
				defer.resolve();
			}
		});
		return defer.promise;
	}).then(function() {
		var defer = promise_lib.defer();
		LearningObjectModel.find({courseId : course.identifier, nodeSet: 'module'}).exec(function(err, data) {
			if(err) {
				defer.reject(err);
			} else {
				course.modules = [];
				var modules = {};
				data.forEach(function(lob) {
					modules[lob.identifier] = lob;
				})
				course.noOfModules = data.length;
				course.objectives = courseLOB.metadata.objectives;
				course.showCaseProject = courseLOB.metadata.projectDescription;
				course.projectImage = courseLOB.metadata.projectImage;
				if(courseLOB.metadata.conceptMapImage) {
					course.conceptMapImage = courseLOB.metadata.conceptMapImage;
				}
				courseLOB.sequence.forEach(function(moduleId) {
					var lob = modules[moduleId];
					course.modules.push({'name' : lob.name, 'description' : lob.metadata.shortDescription});
				});
				defer.resolve();
			}
		});
		return defer.promise;
	}).catch(function(err) {
		console.log("Error: " + err);
		res.send(err);
	}).done(function() {
		res.send(JSON.stringify(course));
	});
}

exports.deleteCourse = function(courseId) {
	var defer = promise_lib.defer();
	CourseModel = mongoose.model('CourseModel');
	CourseModel.findOneAndRemove({identifier: courseId}).exec(function(err, deletedCourse) {
		if(err)
			defer.reject(err);
		else
			defer.resolve(deletedCourse);
	});
	return defer.promise;
}
