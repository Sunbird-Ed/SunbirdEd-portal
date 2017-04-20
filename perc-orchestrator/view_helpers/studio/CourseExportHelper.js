
var mongoose = require('mongoose');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var ViewHelperConstants = require('../ViewHelperConstants');

function createNode(json, identifier, parentNodeId, relation) {

	var nodeId = getNodeId(json, identifier);
	if(typeof nodeId === 'undefined' || nodeId == null || nodeId == '') {
		nodeId = '' + json.index++;
		var node = {nodeId: nodeId, identifier: identifier, parentNodeId: parentNodeId, parentRelation: relation};
		json.nodes[nodeId] = node;
		json.idmap[identifier] = nodeId;
	} else {
		if(typeof parentNodeId != 'undefined' && parentNodeId != '') {
			addToNode(json, nodeId, 'parentNodeId', parentNodeId);
		}
		if(typeof relation != 'undefined' && relation != '') {
			addToNode(json, nodeId, 'parentRelation', relation);
		}
	}
	return nodeId;
}

function escapeNewlineForCSV(input) {
    if (input && input != null) {
        input = input.replace(/\r\n/g, '<br/>');
        input = input.replace(/\n/g, '<br/>');
        input = input.replace(/\r/g, '<br/>');
    }
    return input;
}

function getNodeId(json, identifier) {
	return json.idmap[identifier];
}

function addToNode(json, nodeId, key, value) {
	if (key == 'description') {
		value = escapeNewlineForCSV(value);
	}
	json.nodes[nodeId][key] = value;
}

function addMetadata(json, nodeId, metadata) {
	if(metadata) {
		for(k in metadata) {
			addToNode(json, nodeId, k, metadata[k]);
		}
	}
}

function addMediaToJSON(json, id) {
	MediaModel = mongoose.model('MediaModel');
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(MediaModel.findOne, MediaModel, [{identifier: id}]))
	.then(function(media) {
		var nodeId = createNode(json, id);
		addToNode(json, nodeId, 'name', media.title);
		addToNode(json, nodeId, 'location', media.url);
		addToNode(json, nodeId, 'format', media.mimeType);
		addToNode(json, nodeId, 'nodeType', ViewHelperConstants.MEDIA);
		addToNode(json, nodeId, 'nodeClass', ViewHelperConstants.MEDIA);
		addMetadata(json, nodeId, media.metadata);
		return json;
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	.done(function(rdf) {
		deferred.resolve(rdf);
	});
	return deferred.promise;
}

function addContentToJSON(json, content) {
	var id = content.identifier;
	var nodeId = createNode(json, id);
	addMetadata(json, nodeId, content.metadata);
	addToNode(json, nodeId, 'name', content.name || content.description);
	addToNode(json, nodeId, 'contentType', content.contentType);
	addToNode(json, nodeId, 'contentSubType', content.contentSubType);
	addToNode(json, nodeId, 'nodeType', ViewHelperConstants.CONTENT);
	addToNode(json, nodeId, 'nodeClass', ViewHelperConstants.CONTENT);

	if(content.media) {
		content.media.forEach(function(media) {
			var mediaNodeId = createNode(json, media.mediaId, nodeId, 'associatedTo');
			if(media.isMain) {
				addToNode(json, mediaNodeId, 'contentGroup', 'main');
			} else {
				addToNode(json, mediaNodeId, 'contentGroup', 'additional media');
			}
		});
	}
	if(content.transcripts) {
		content.transcripts.forEach(function(media) {
			var mediaNodeId = createNode(json, media.mediaId, nodeId, 'associatedTo');
			addToNode(json, mediaNodeId, 'contentGroup', 'transcripts');
		});
	}
	if(content.subtitles) {
		content.subtitles.forEach(function(media) {
			var mediaNodeId = createNode(json, media.mediaId, nodeId, 'associatedTo');
			addToNode(json, mediaNodeId, 'contentGroup', 'subtitles');
		});
	}
	if(content.interceptions) {
		content.interceptions.forEach(function(intercp) {
			var contentNodeId = createNode(json, intercp.contentId, nodeId, 'relatesTo');
			addToNode(json, contentNodeId, 'contentGroup', 'interception');
			addToNode(json, contentNodeId, 'interceptionPoint', intercp.interceptionPoint);
			addToNode(json, contentNodeId, 'nodeType', ViewHelperConstants.CONTENT);
			addToNode(json, contentNodeId, 'nodeClass', ViewHelperConstants.CONTENT);
			var mediaNodeId = createNode(json, intercp.mediaId);
			addToNode(json, contentNodeId, 'interceptionMediaId', mediaNodeId);
		});
	}
	if(content.concepts) {
		var keyword = '';
		content.concepts.forEach(function(concept) {
			keyword += concept.conceptTitle;
			keyword += ',';
		});
		keyword = keyword.substring(0, keyword.length - 1);
		//addToNode(json, nodeId, 'keyword', keyword);
	}
}

function addElementsToJSON(json, element) {
	var id = element.identifier;
	var nodeId = createNode(json, id);
	addMetadata(json, nodeId, element.metadata);
	addToNode(json, nodeId, 'name', element.name);
	addToNode(json, nodeId, 'isMandatory', element.isMandatory);
	addToNode(json, nodeId, 'nodeType', element.nodeSet);
	addToNode(json, nodeId, 'nodeClass', element.nodeSet);

	if(element.contentIdentifier) {
		var contentNodeId = createNode(json, element.contentIdentifier, nodeId, 'associatedTo');
		addToNode(json, contentNodeId, 'contentGroup', 'main');
	}

	if(element.supplementary_content) {
		element.supplementary_content.forEach(function(content) {
			var contentNodeId = createNode(json, content.contentId, nodeId, 'relatesTo');
			addToNode(json, contentNodeId, 'contentGroup', content.contentGroup);
		});
	}
}

function addCollectionToJSON(json, element) {
	var id = element.identifier;
	var nodeId = createNode(json, id);
	addMetadata(json, nodeId, element.metadata);
	addToNode(json, nodeId, 'name', element.name);
	addToNode(json, nodeId, 'isMandatory', element.isMandatory);

	if(element.sequence) {
		element.sequence.forEach(function(elementId) {
			createNode(json, elementId, nodeId, 'contains');
		});
	}
}

function addLOBElementToJSON(json, lobElement) {
	var id = lobElement.lobId;
	var nodeId = getNodeId(json, id);
	if(lobElement.elements && lobElement.elements.length > 0) {
		lobElement.elements.forEach(function(element) {
			createNode(json, element.elementId, nodeId, 'contains');
		});
	}
	if(lobElement.supplementary_content) {
		lobElement.supplementary_content.forEach(function(content) {
			var contentNodeId = createNode(json, content.contentId, nodeId, 'relatesTo');
			addToNode(json, contentNodeId, 'contentGroup', content.contentGroup);
		});
	}
}

function addLOBToJSON(json, element) {

	var id = element.identifier;
	var nodeId = createNode(json, id);
	addMetadata(json, nodeId, element.metadata);
	addToNode(json, nodeId, 'name', element.name);
	addToNode(json, nodeId, 'nodeType', element.lobType);
	addToNode(json, nodeId, 'nodeClass', 'learningobject');
	if(element.sequence && element.sequence.length > 0) {
		element.sequence.forEach(function(elementId) {
			createNode(json, elementId, nodeId, 'contains');
		});
	}
}

function sequenceLOBs(learningObjects, courseId) {
	var lobs = [];
	var lobMap = {};
	learningObjects.forEach(function(lob) {
		lobMap[lob.identifier] = lob;
	});
	var course = lobMap[courseId];
	lobs.push(course);
	if(course.sequence && course.sequence.length > 0) {
		course.sequence.forEach(function(moduleId) {
			var module = lobMap[moduleId];
			lobs.push(module);
			if(module.sequence && module.sequence.length > 0) {
				module.sequence.forEach(function(lessonId) {
					var lesson = lobMap[lessonId];
					lobs.push(lesson);
					if(lesson.sequence && lesson.sequence.length > 0) {
						lesson.sequence.forEach(function(binderId) {
							lobs.push(lobMap[binderId]);
						});
					}
				});
			}
		})
	}
	return lobs;
}

exports.exportCourseAsCSV = function(req, res) {
	var courseId = req.params.id;
	CourseModel = mongoose.model('CourseModel');
	LearningObjectModel = mongoose.model('LearningObjectModel');
	LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
	LearningResourceModel = mongoose.model('LearningResourceModel');
	LearningActivityModel = mongoose.model('LearningActivityModel');
	LearningCollectionModel = mongoose.model('LearningCollectionModel');
	var error = false;
	var json = {nodes:[], idmap:[], index: 1};
	var contentArray = [], mediaArray = [], intContentArray = [];
	var labels = [];
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(CourseModel.findOne, CourseModel, [{identifier: courseId}]))
	.then(function(course) {
		var nodeId = createNode(json, course.identifier);
		addToNode(json, nodeId, 'image', course.image);
		if(course.faculty) {
			var fn = createNode(json, course.faculty.identifier, nodeId, '');
			addToNode(json, fn, 'nodeType', 'faculty');
			addToNode(json, fn, 'nodeClass', 'person');
			addToNode(json, fn, 'name', course.faculty.name);
			addToNode(json, fn, 'description', course.faculty.description);
			addToNode(json, fn, 'image', course.faculty.image);
		}
		if(course.tutors) {
			course.tutors.forEach(function(tutor) {
				var fn = createNode(json, tutor.identifier, nodeId, '');
				addToNode(json, fn, 'nodeType', 'tutor');
				addToNode(json, fn, 'nodeClass', 'person');
				addToNode(json, fn, 'name', tutor.name);
				addToNode(json, fn, 'description', tutor.description);
				addToNode(json, fn, 'image', tutor.image);
			});
		}
		console.log('Course JSON exported');
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningObjectModel.find, LearningObjectModel, [{courseId: courseId, $or: [{is_deleted: false}, {is_deleted: {$exists: false}}]}]))
	.then(function(learningObjects) {
		var lobs = sequenceLOBs(learningObjects, courseId);
		var lobIds = [];
		lobs.forEach(function(lob) {
			addLOBToJSON(json, lob);
			lobIds.push(lob.identifier);
		});
		console.log('LOB JSON exported');
		var defer = promise_lib.defer();
		LearningObjectElementsModel.find().where('lobId').in(lobIds).exec(function (err, elements) {
			defer.resolve(elements);
		});
		return defer.promise;
	})
	.then(function(elements) {
		elements.forEach(function(element) {
			addLOBElementToJSON(json, element);
			if(element.elements && element.elements.length > 0) {
				element.elements.forEach(function(obj) {
					if(obj.elementType == ViewHelperConstants.CONTENT) {
						if(contentArray.indexOf(obj.elementId) == -1)
							contentArray.push(obj.elementId);
					}
				});
			}
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(obj) {
					if(contentArray.indexOf(obj.contentId) == -1)
						contentArray.push(obj.contentId);
				});
			}
		});

		console.log('LOB Elements JSON exported');
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.find, LearningResourceModel, [{courseId: courseId, lobId: {$exists: true}, $or: [{is_deleted: false}, {is_deleted: {$exists: false}}]}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			addElementsToJSON(json, element);
			if(typeof element.contentIdentifier === 'undefined') {
				console.log('Element with undefined content', element.identifier);
			}
 			if(contentArray.indexOf(element.contentIdentifier) == -1 && typeof element.contentIdentifier != 'undefined')
				contentArray.push(element.contentIdentifier);
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(obj) {
					if(contentArray.indexOf(obj.contentId) == -1 && typeof obj.contentId != 'undefined')
						contentArray.push(obj.contentId);
				});
			}
		});
		console.log('Learning Resources json exported');
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningActivityModel.find, LearningActivityModel, [{courseId: courseId, lobId: {$exists: true}, $or: [{is_deleted: false}, {is_deleted: {$exists: false}}]}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			addElementsToJSON(json, element);
			if(typeof element.contentIdentifier === 'undefined') {
				console.log('Element with undefined content', element.identifier);
			}
			if(contentArray.indexOf(element.contentIdentifier) == -1 && typeof element.contentIdentifier != 'undefined') {
				contentArray.push(element.contentIdentifier);
			}
			if(element.supplementary_content) {
				element.supplementary_content.forEach(function(obj) {
					if(contentArray.indexOf(obj.contentId) == -1 && typeof obj.contentId != 'undefined') {
						contentArray.push(obj.contentId);
					}
				});
			}
		});
		console.log('Learning Activities JSON exported');
	})
	.then(ViewHelperUtil.promisifyWithArgs(LearningCollectionModel.find, LearningCollectionModel, [{courseId: courseId, $or: [{is_deleted: false}, {is_deleted: {$exists: false}}]}]))
	.then(function(elements) {
		elements.forEach(function(element) {
			addCollectionToJSON(json, element);
		});
		console.log('Learning Collections JSON exported');
	})
	.then(function() {
		var defer = promise_lib.defer();
		ContentModel = mongoose.model('MediaContentModel');
		ContentModel.find().where('identifier').in(contentArray).exec(function (err, contents) {
			contents.forEach(function(content) {
				addContentToJSON(json, content);
				if(content.media) {
					content.media.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.transcripts) {
					content.transcripts.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.subtitles) {
					content.subtitles.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.interceptions) {
					content.interceptions.forEach(function(intercp) {
						if(intContentArray.indexOf(intercp.contentId) == -1) {
							intContentArray.push(intercp.contentId);
						}
					});
				}
			});
			console.log('Contents JSON exported');
			defer.resolve(json);
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		ContentModel = mongoose.model('MediaContentModel');
		ContentModel.find().where('identifier').in(intContentArray).exec(function (err, contents) {
			contents.forEach(function(content) {
				addContentToJSON(json, content);
				if(content.media) {
					content.media.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.transcripts) {
					content.transcripts.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.subtitles) {
					content.subtitles.forEach(function(media) {
						if(mediaArray.indexOf(media.mediaId) == -1)
							mediaArray.push(media.mediaId);
					});
				}
				if(content.interceptions) {
					content.interceptions.forEach(function(intercp) {
						if(intContentArray.indexOf(intercp.contentId) == -1) {
							intContentArray.push(intercp.contentId);
						}
					});
				}
			});
			console.log('Contents JSON exported');
			defer.resolve(json);
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		var promises = [];
		mediaArray.forEach(function(mediaId) {
			promises.push(addMediaToJSON(json, mediaId));
		});
		promise_lib.all(promises).then(function(value) {
			console.log('Media JSON exported');
		    defer.resolve();
		});
		return defer.promise;
	})
	.then(function() { // To populate parent IDs.
		var skipLabels = ["node_type","object_uri","setType","deleteStatus","isNew","deleteRecursive","recursive","errorLog","hasSequence","hasPackageSequence","hasOutcomeSequence","descriptionVerified","entryCriteriaExpr","category","contentType","contentSubType"];
		var nodeIdMap = {};
		json.nodes.forEach(function(node) {
			nodeIdMap[node.identifier] = node.nodeId;
		});
		json.nodes.forEach(function(node) {
			var tempParentNodeId = node.parentNodeId;
			if(json.nodes[tempParentNodeId]) {
				node.parentNodeId = json.nodes[tempParentNodeId].nodeId;
			} else if(nodeIdMap[tempParentNodeId]) {
				node.parentNodeId = nodeIdMap[tempParentNodeId];
			}

			for(k in node) {
				if(labels.indexOf(k.trim()) == -1 && skipLabels.indexOf(k.trim()) == -1) labels.push(k.trim());
			}
		});
	})
	.then(function() {
		json.nodes.forEach(function(node) {
			if(node.interceptionMediaId) {
				node.interceptionMediaId = json.nodes[node.interceptionMediaId].nodeId;
			}
		})
	})
	.catch(function(err) {
		console.log('err', err);
		error = true;
	})
	.done(function() {
		if(!error) {
			exportCSV(json.nodes, labels, res);
		}
	});
}


function exportCSV(json, labels, res, errors) {
	var jsonCSV = require('json-csv');
	var jsonArray = [];

	for(k in json) {
		if(k != 'index' && k != 'nodeIds' && k != 'conceptIds') {
			if(json[k]) jsonArray.push(json[k]);
		}
	}

	var jsonFields = [];
	var headerFields = getHeaderFields(labels);
	for(k in headerFields) {
		jsonFields.push({name: headerFields[k], label: k});
	}
	var args = {
		data: jsonArray,
		fields: jsonFields
	}
	jsonCSV.toCSV(args, function(err, csv) {
		res.setHeader('Content-disposition', 'attachment; filename=course_'+ Date.parse(new Date())+'.csv');
	    res.set('Content-Type', 'application/octet-stream');
	    res.set('Content-Type', 'text/plain');
	    res.write(csv);
	    if(errors) {
	    	res.write(JSON.stringify(errors));
	    }
	    res.end();
	});
}

function getHeaderFields(labels) {
	var courseImportHelper = require('./CourseImportHelper');
	var headerFields = courseImportHelper.headerFields;
	for(k in headerFields) {
		if(labels.indexOf(headerFields[k]) > -1)
			labels.splice(labels.indexOf(headerFields[k]), 1);
	}
	if(labels.length > 0) {
		labels.forEach(function(label) {
			headerFields[label] = label;
		})
	}
	delete headerFields["delete status"];
	delete headerFields["recursive"];
	delete headerFields["identifier"];
	return headerFields;
}