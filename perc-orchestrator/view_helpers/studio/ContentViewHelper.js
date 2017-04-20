/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for ContentModel
 *
 * @author rayulu
 */
var mongoose = require('mongoose'),
fs = require('fs'),
errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var mediaUtil = require('../../commons/MediaHelper');
var pedagogyHelper = require('./PedagogyViewHelper');
var courseMWHelper = require('./CourseMWViewHelper');
var courseHelper = require('./CourseViewHelper');
var MWServiceProvider = require('../../commons/MWServiceProvider');
var promise_lib = require('when');
var IDCacheUtil = require('../../commons/IDCacheUtil');
MediaContentModel = mongoose.model('MediaContentModel');
MediaModel = mongoose.model('MediaModel');
var ViewHelperConstants = require('../ViewHelperConstants');

exports.getContentNodeSet = function(req, res) {
	var courseId = decodeURIComponent(req.params.courseId);
	courseHelper.getPedagogyId(courseId, function(err, pedagogyId) {
		if (err) {
			errorModule.handleError(err, "ERROR_CREATING_CONTENT", req, res);
		} else {
			pedagogyHelper.findNodeSet(pedagogyId, ViewHelperConstants.CONTENT, function(err, nodeSet) {
				if (err) {
					errorModule.handleError(err, "ERROR_FETCHING_PEDAGOGY", req, res);
				} else {
					res.send(JSON.stringify(nodeSet));
				}
			});
		}
	});
};

function createMedia(req) {
	var deferred = promise_lib.defer();
	var mediaFrom = req.body.from;
	if(mediaFrom == 'URL') {
		var tmpFilePath = req.body.url;
		var title = req.body.name;
		var mimeType = req.body.mimeType;
		var mediaType = req.body.mediaType;
	} else if(mediaFrom == 'FILE') {
		var tmpFilePath = req.files.mediafile.path;
		var title = req.files.mediafile.name;
		var mimeType = req.files.mediafile.type;
		var mediaType = '';
		if (mimeType.toLowerCase().indexOf('video') >= 0) {
			mediaType = 'video';
		} else if (mimeType.toLowerCase().indexOf('image') >= 0) {
			mediaType = 'image';
		} else if (mimeType.toLowerCase().indexOf('audio') >= 0) {
			mediaType = 'audio';
		} else if (mimeType.toLowerCase().indexOf('text') >= 0) {
			mediaType = 'text';
		} else if (mimeType.toLowerCase().indexOf('json') >= 0) {
			mediaType = 'mcq';
		} else if (mimeType.toLowerCase().indexOf('test') >= 0) {
			mediaType = 'test';
		} else if (mimeType.toLowerCase().indexOf('pdf') >= 0) {
			mediaType = 'slides';
		} else if(mimeType.toLowerCase().indexOf('powerpoint') >=0) {
			mediaType = 'slides';
		} else if(mimeType.toLowerCase().indexOf('rtf') >=0) {
			mediaType = 'RTF';
		} else {
			mediaType = 'OTHERS';
		}
	}
	var contentType = 'lecture'; // lecture or learningactivity
	var tmpServer = req.protocol + '://' + req.get('host');
	promise_lib.resolve()
	.then(function(){
		return mediaUtil.createMedia(mediaFrom, tmpFilePath, title, tmpServer, mimeType, mediaType, contentType);
	})
	.done(function(media) {
		deferred.resolve(media);
	});
	return deferred.promise;
};

exports.createMedia = function(req, res) {
	promise_lib.resolve()
	.then(function(){
		return createMedia(req);
	}).done(function(media) {
		res.send(media);
	});
};

exports.getAllMedia = function(req, res) {
	var errors = [];
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MediaModel = mongoose.model('MediaModel');
		MediaModel.find().lean().exec(function(err, mediaItems) {
			if (err) {
				errorModule.handleError(err, "ERROR_GETTING_ALL_MEDIA", req, res);
				deferred.reject(err);
			} else {
				deferred.resolve(mediaItems);
			}
		});
		return deferred.promise;
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
	.done(function(mediaItems) {
		if(errors.length > 0) {
            console.log('fialed to get all media.',errors);
        } else {
            res.send(mediaItems);
        }
	});
};

exports.getMedia = function(req, res) {
	var errors = [];
	var mediaId = req.params.mediaId;
	promise_lib.resolve()
	.then(function() {
		return mediaUtil.getMedia(mediaId);
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
    .done(function(media) {
		if(errors.length > 0) {
            console.log('fialed to get media.',errors);
        } else {
            res.send(media);
        }
	});

}

exports.createNewContent = function(req, res) {
	var errors = [];
	var courseId = decodeURIComponent(req.params.courseId);
	var mediaItems = req.body.mediaItems;
	console.log("MediaItems: "+JSON.stringify(mediaItems));
	console.log(mediaItems.length);
	var reqContent = req.body.content;
	console.log("reqContent:"+JSON.stringify(reqContent));

	promise_lib.resolve()
	.then(function(){return IDCacheUtil.getIdentifier()})
	.then(function(identifier) {
		var deferred = promise_lib.defer();
		courseHelper.getPedagogyId(courseId, function(err, pedagogyId) {
			if (err) {
				errorModule.handleError(err, "ERROR_CREATING_CONTENT", req, res);
				deferred.reject(err);
			} else {
				deferred.resolve({'identifier': identifier, 'pedagogyId': pedagogyId});
			}
		});
		return deferred.promise;
	})
	.then(function(obj) {
		//TODO call "createContent" command.

		// var reqJSON = new Object();
		// reqJSON.CONTENT_NAME = reqContent.name;
		// reqJSON.PEDAGOGY_ID = obj.pedagogyId;
		// reqJSON.COURSE_ID = courseId;
		// reqJSON.METADATA = metadataJSON;
		return obj;
	})
	.then(function(obj) {
		var deferred = promise_lib.defer();
		MediaContentModel = mongoose.model('MediaContentModel');
		var content = new MediaContentModel();
		content.identifier = obj.identifier;
		content.pedagogyId = obj.pedagogyId;
		content.linkedCourses.push(courseId);
		content.name = reqContent.name;
		content.description = reqContent.description;
		content.contentType = reqContent.contentType;
		if(reqContent.contentSubType)
			content.contentSubType = reqContent.contentSubType;
		content.metadata = {};
		content.metadata.name = reqContent.name;
		content.metadata.identifier = obj.identifier;
		content.metadata.contentType = reqContent.contentType;
		content.metadata.description = reqContent.description;
		for(var i=0;i<mediaItems.length;i++){
			var newMedia = new Object();
			newMedia.title = mediaItems[i].title;
			newMedia.mediaUrl = mediaItems[i].url;
			newMedia.mediaType = mediaItems[i].mediaType;
			newMedia.mediaId = mediaItems[i].identifier;
			newMedia.mimeType = mediaItems[i].mimeType;
			newMedia.state = mediaItems[i].state;
			if(i==0){
				newMedia.isMain = true;
			} else {
				newMedia.isMain = false;
			}
			content.media.push(newMedia);
		}

		content.save(function(err, object) {
			if (err) {
				deferred.reject(err);
			} else {

//				console.log('Afer Save reqContent:',object);
				deferred.resolve(object);
			}
		});
		return deferred.promise;

	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
	.done(function(){
		if(errors.length > 0) {
            console.log('fialed to create content',errors);
        } else {
            res.send('ok');
        }
	});
};

exports.addMediaToContent = function(req, res) {
	var errors = [];
	ContentModel = mongoose.model('MediaContentModel');

	promise_lib.resolve()
	.then(function() {
		var contentId = decodeURIComponent(req.body.contentId)
		return {'identifier' : contentId};
	})
	.then(ViewHelperUtil.promisify(ContentModel.findOne, ContentModel))
	.then(function(content) {
		var deferred = promise_lib.defer();
		var mediaItems = req.body.mediaItems;
		if(mediaItems && mediaItems.length > 0) {
			//var contentMediaItems = content.media;
			//console.log("Before contentMedia:"+JSON.stringify(contentMediaItems));
			console.log("MediaItems Length:"+ mediaItems.length);
			for (var i = 0; i < mediaItems.length; i++) {
				//console.log("Processing:"+i);
				var media = mediaItems[i];
				//TODO -- Tried to not allow duplicates but, when I do this async process is coming and save is calling before it complete for loop.
				// var alreadyHas = false;
				// for (var i = 0; i < contentMediaItems.length; i++) {
				// 	if(media.identifier == contentMediaItems[i].identifier){
				// 		alreadyHas = true;
				// 		break;
				// 	}
				// }
				// if(!alreadyHas) {
					console.log("Content:"+JSON.stringify(content));
					var newMedia = new Object();
					newMedia.title = media.title;
					newMedia.mediaUrl = media.url;
					newMedia.mediaType = media.mediaType;
					newMedia.mediaId = media.identifier;
					newMedia.mimeType = media.mimeType;
					newMedia.state = media.state;
					content.media.push(newMedia);
				//}
			}
			console.log("Before Save content.");
			content.save(function(err, data) {
				if(err) {
					deferred.reject(err);
				} else {
					deferred.resolve(data);
				}
			});
		} else {
			deferred.reject('no mediaItems to add.');
		}
		return deferred.promise;
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
	.done(function(content) {
		if(errors.length > 0) {
            console.log('fialed to add media to content.',errors);
        } else {
            res.send(content);
        }
	});
};

exports.addEnhanceMediaToContent = function(req, res) {
	var errors = [];
	ContentModel = mongoose.model('MediaContentModel');

	promise_lib.resolve()
	.then(function() {
		var contentId = decodeURIComponent(req.params.contentId)
		return {'identifier' : contentId};
	})
	.then(ViewHelperUtil.promisify(ContentModel.findOne, ContentModel))
	.then(function(content) {
		var deferred = promise_lib.defer();
		var enhanceItem = req.body.enhanceItem;
		var reqEnhanceData = req.body.enhanceData;
		if(enhanceItem) {
			var enhanceData = new Object();
			enhanceData.mediaUrl = enhanceItem.url;
			enhanceData.language = reqEnhanceData.language;
			enhanceData.name = reqEnhanceData.name;
			enhanceData.mediaIdentifier = reqEnhanceData.mediaIdentifier;
			enhanceData.identifer = enhanceItem.identifier;
			enhanceData.mimeType = enhanceItem.mimeType;
			enhanceData.mediaType = enhanceItem.mediaType;
			if(reqEnhanceData.action == 'transcripts') {
				content.transcripts.push(enhanceData);
			} else if(reqEnhanceData.action == 'subtitles') {
				content.subtitles.push(enhanceData);
			}
			content.save(function(err,data) {
				if(err) {
					deferred.reject(err);
				} else {
					deferred.resolve(data);
				}
			})
		} else {
			deferred.reject('no enhance item to add.');
		}

	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
	.done(function(content) {
		if(errors.length > 0) {
            console.log('fialed to add enhance item to content.',errors);
        } else {
            res.send(content);
        }
	});

};

exports.getContent = function(req, res) {

	LoggerUtil.setOperationName('getContent');
	ContentModel = mongoose.model('MediaContentModel');
	promise_lib.resolve()
	.then(function() {
		var mediaId = decodeURIComponent(req.params.id)
		return {'identifier' : mediaId};
	})
	.then(ViewHelperUtil.promisify(ContentModel.findOne, ContentModel))
	.then(function(content){
		res.json(content);
	})
	.catch (function(err) {
        console.log("Error:"+err);
        res.json({error: err});
    })
    .done();
};

exports.getCourseContents = function(req, res) {
	LoggerUtil.setOperationName('getCourseContents');
	MediaContentModel = mongoose.model('MediaContentModel');
	MediaContentModel.find({
		linkedCourses : decodeURIComponent(req.params.courseId)
	}).lean().exec(function(err, contentItems) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_CONTENT_ITEMS", req, res);
		} else {
			res.send(JSON.stringify(contentItems));
		}
	});
};

exports.getCourseMediaContent = function(req, res) {
	LoggerUtil.setOperationName('getCourseMediaContent');
	MediaContentModel = mongoose.model('MediaContentModel');
	MediaContentModel.find({
		linkedCourses : decodeURIComponent(req.params.courseId),
		"media.contentType" : "Media"
	}).lean().exec(function(err, contentItems) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_CONTENT_ITEMS", req, res);
		} else {
			res.send(JSON.stringify(contentItems));
		}
	});
};

exports.getCourseLearningActivityContent = function(req, res) {
	LoggerUtil.setOperationName('getCourseLearningActivityContent');
	MediaContentModel = mongoose.model('MediaContentModel');
	MediaContentModel.find({
		linkedCourses : decodeURIComponent(req.params.courseId),
		"media.contentType" : "LearningActivity"
	}).lean().exec(function(err, contentItems) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_CONTENT_ITEMS", req, res);
		} else {
			res.send(JSON.stringify(contentItems));
		}
	});
};

exports.removeMediaFromContent = function(req, res) {
	var errors = [];
	var media = req.body.media;
	var contentId = req.params.contentId;
	ContentModel = mongoose.model('MediaContentModel');
	promise_lib.resolve()
	.then(function() {
		return {'identifier' : contentId};
	})
	.then(ViewHelperUtil.promisify(ContentModel.findOne, ContentModel))
	.then(function(content) {
		var deferred = promise_lib.defer();
		if(content != null) {
			var index = -1;
			for(var i = 0, len = content.media.length; i < len; i++) {
			    if (content.media[i].mediaId === media.mediaId) {
			        index = i;
			        break;
			    }
			}
			if(index == -1) {
				deferred.reject('INVALID_MEDIA_TO_DELETE');
			} else {
	        	content.media.splice(index, 1);
				content.save(function(err, data) {
					if(err) {
						deferred.reject(err);
					} else {
						deferred.resolve(data);
					}
				});
			}
		} else {
			deferred.reject('INVALID_CONTENT_TO_SAVE');
		}
		return deferred.promise;
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
    .done(function(newContent) {
        if(errors.length > 0) {
            console.log('fialed to get media state',errors);
        } else {
            res.send(newContent);
        }
    });
};

exports.saveMetadataInContent = function(req, res) { // TODO this method needs to be changed.
	var metadata = req.body;
	ContentModel = mongoose.model('MediaContentModel');
	ContentModel.findOne({
		identifier : decodeURIComponent(req.params.id)
	}).exec(function(err, content) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_CONTENT_MODEL", req, res);
		} else {
			// async call middleware save content
			var keys = Object.keys(metadata);
			content.name = metadata['name'];
			content.metadata = {};
			for (var i in keys) {
				var key = keys[i];
				content.metadata[key] = metadata[key];
			}
			content.save(function(err, object) {
				if (err) {
					errorModule.handleError(err, "ERROR_CREATING_CONTENT", req, res);
				} else {
					//mediaUtil.updateMediaTitle(content.media.identifier, content.name);
					var rdf = populateRDFFromContentObject(content, metadata);
					console.log(JSON.stringify(rdf));
					var req = new Object();
    				req.CONTENT = JSON.stringify(rdf);
    				req.CONTENT_ID = content.identifier;
    				MWServiceProvider.callServiceStandard("DummyService", "saveContent", req, function(err, data, response) {
                        if (err) {
                            console.log("Error in Response from MW saveContent: " + JSON.stringify(err, null, 4));
                    	} else {
                        	console.log("Response from MW saveContent: " + JSON.stringify(data, null, 4));
                    	}
                	});
					res.send(JSON.stringify(content));
				}
			});
		}
	});
};



exports.addInterception = function(req, res) {

	var error = {};
	console.log("identifier: req.body.currentContentId",req.body.contentId);
	MediaContentModel = mongoose.model('MediaContentModel');
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(MediaContentModel.findOne, MediaContentModel, [{identifier: req.body.contentId}]))
	.then(function(content) {
		console.log("content:",content);
		var deferred = promise_lib.defer();
		if(typeof content === 'undefined')  {
			deferred.reject('No Content found for the matching id');
		} else {
			content.interceptions.push(req.body.interception);
			content.markModified('interceptions');
			content.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_PRE_CONDITION", req, res));
}

exports.updateInterception = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(MediaContentModel.findOne, MediaContentModel, [{identifier: req.body.contentId}, "interceptions"]))
	.then(function(content){
		var deferred = promise_lib.defer();
		if(typeof content.interceptions === 'undefined')  {
			deferred.reject('No Content found for the matching id');
		} else {
			var interception;
			content.interceptions.forEach(function(intsep) {
				if(intsep._id == req.body.interceptionId) {
					interception = intsep;
				}
			});
			for(k in req.body.interception) interception[k] = req.body.interception[k];
			content.markModified('interceptions');
			content.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_UPDATING_PRE_CONDITION", req, res));
}

exports.deleteInterception = function(req, res) {
	var error = {};
	promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(MediaContentModel.findOne, MediaContentModel, [{identifier: req.body.contentId}, "interceptions"]))
	.then(function(content){
		var deferred = promise_lib.defer();
		if(typeof content.interceptions === 'undefined')  {
			deferred.reject('No reference found for the matching content');
		} else {
			content.interceptions.forEach(function(ref) {
				if(ref._id == req.body.interceptionId) {
					ref.remove();
				}
			});
			content.markModified('interceptions');
			content.save(ViewHelperUtil.buildUpdateFunction(deferred));
		}
		return deferred.promise;
	})
	.catch(ViewHelperUtil.buildCatchFunction(error, id))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_DELETING_REFERENCE", req, res));
}




function populateRDFFromContentObject(content, metadata) {
	var id = content.identifier.split(":");
    id = id[id.length - 1];

    var rdfNode = {
        "http://perceptronnetwork.com/ontologies/#node_type": [{
            "value": "NODE",
            "type": "literal"
        }],
        "http://perceptronnetwork.com/ontologies/#pedagogyId": [{
            "value": content.pedagogyId,
            "type": "literal"
        }],
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": [{
            "value": "http://perceptronnetwork.com/ontologies/domainRelation/" + content.pedagogyId + "/setType#Content",
            "type": "uri"
        }],
        "http://perceptronnetwork.com/ontologies/#id": [{
            "value": id,
            "type": "literal"
        }],
        "http://perceptronnetwork.com/ontologies/#setType": [{
            "value": "Content",
            "type": "literal"
        }],
        "http://perceptronnetwork.com/ontologies/#object_uri": [{
            "value": content.identifier,
            "type": "literal"
        }]
    };

	var pcp_uri = "http://perceptronnetwork.com/ontologies/#";
    var courses = content.linkedCourses;
    var coursePredicate = pcp_uri + "courseId";
    rdfNode[coursePredicate] = [];
    for (var i=0; i<courses.length; i++) {
    	console.log(i + " -- " + courses[i]);
    	rdfNode[coursePredicate][i] = {};
		rdfNode[coursePredicate][i]["value"] = courses[i];
        rdfNode[coursePredicate][i]["type"] = "literal";
    }

	var keys = Object.keys(metadata);
	for (var i in keys) {
		var key = keys[i];
		var val = metadata[key];
		if (val && val != '') {
			var predicate = pcp_uri + key;
			rdfNode[predicate] = [];
        	rdfNode[predicate][0] = {};
			rdfNode[predicate][0]["value"] = metadata[key];
        	rdfNode[predicate][0]["type"] = "literal";
		}
	}
	var rdf = {};
	rdf[content.identifier] = rdfNode;
	return rdf;
}

exports.addConcept = function(req, res) {
	var error = {};
	var conceptIdentifier = "";
	ConceptModel = mongoose.model('ConceptModel');
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		if(null != req.body.conceptName && null != req.body.contentId) {
			var title = { title : decodeURIComponent(req.body.conceptName) };
			deferred.resolve(title);
		} else {
			deferred.reject("NO_CONCEPT_NAME_OR_CONTENT_ID");
		}
		return deferred.promise;
	})
	.then(ViewHelperUtil.promisify(ConceptModel.findOne, ConceptModel))
	.then(function(concept) {
		var deferred = promise_lib.defer();
		if(typeof concept === 'undefined' || null == concept) {
			var conceptViewHelper = require('./ConceptViewHelper');
			conceptViewHelper.addConcept(req.body.conceptName).then(function(id) {
				conceptIdentifier = id;
				deferred.resolve();
			});
		} else {
			conceptIdentifier = concept.identifier;
			deferred.resolve();
		}

		return deferred.promise;
	})
	.then(function() {
		console.log("conceptIdentifier:"+conceptIdentifier);
		var deferred = promise_lib.defer();
		MediaContentModel.findOne({
			identifier : decodeURIComponent(req.body.contentId)
		}).exec(function(err, obj) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(obj);
			}
		});
		return deferred.promise;
	})
	.then(function(mediaContent) {
		var isConceptThere = false;
		var deferred = promise_lib.defer();
		for (var i = 0; i < mediaContent.concepts.length; i++) {
			console.log("Check:"+mediaContent.concepts[i].conceptIdentifier+" : "+conceptIdentifier);
			if(mediaContent.concepts[i].conceptIdentifier == conceptIdentifier) {
				isConceptThere = true;
				break;
			}
		}
		if(isConceptThere) {
			deferred.resolve(mediaContent);
		} else {
			var conceptData = new Object();
			conceptData.conceptIdentifier = conceptIdentifier;
			conceptData.conceptTitle = req.body.conceptName;
			mediaContent['concepts'].push(conceptData);
			mediaContent.save(function(err, data) {
				if (err) {
					console.log("Error: "+err);
					deferred.reject(err);
				} else {
					deferred.resolve(data);
				}
			});
		}

		return deferred.promise;
	})
	.catch (ViewHelperUtil.buildCatchFunction(error))
	.done(ViewHelperUtil.buildDoneFunction(error, "ERROR_ADDING_CONCEPT", req, res));
};

exports.getAllConcepts = function(req, res) {
	ConceptModel = mongoose.model('ConceptModel');
	ConceptModel.find().lean().exec(function(err, concepts) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_CONCEPT_ITEMS", req, res);
		} else {
			console.log("Concepts:"+JSON.stringify(concepts));
			res.send(JSON.stringify(concepts));
		}
	});
};

exports.getMediaTypes = function(req, res) {
	MediaTypeModel = mongoose.model('MediaTypeModel');
	MediaTypeModel.find().lean().exec(function(err, mediatypes) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_MEDIA_TYPES", req, res);
		} else {
			console.log("MediaTypes:"+JSON.stringify(mediatypes));
			res.send(JSON.stringify(mediatypes));
		}
	});
};

exports.importContent = function(node, courseId) {
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);
	var isNew = false;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(MediaContentModel.findOne, MediaContentModel, [{identifier: id}]))
	.then(function(content) {
		var deferred = promise_lib.defer();
		if(typeof content == 'undefined' || content == null) {
			content = new MediaContentModel();
			content.identifier = id;
			isNew = true;
		}
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', content);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'description', content);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'pedagogyId', content);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'contentType', content);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'contentSubType', content);

		ViewHelperUtil.setPropertyIfNotEmpty(node, 'learningTime', content);
		ViewHelperUtil.setPropertyIfNotEmpty(node, 'order', content);

		ViewHelperUtil.setJSONObject(node, 'interceptions', content);
		if(typeof content.metadata == 'undefined' || content.metadata == null) content.metadata = {};
		for(k in metadata) {
			content.metadata[k] = metadata[k];
		}
		if(content.linkedCourses) {
			if(content.linkedCourses.indexOf(courseId) == -1) {
				content.linkedCourses.push(courseId);
			}
		} else {
			content.linkedCourses.push(courseId);
		}
		var category = ViewHelperUtil.getNodeProperty(node, 'category');
		var categories = [];
		if (category) {
			categories = category.split(',');
		}
		//if(!content.categories) content.categories = [];
		content.categories = [];
		categories.forEach(function(cat) {
			if(cat != "") {
				if(content.categories.indexOf(cat) == -1) {
					content.categories.push(ViewHelperConstants.getContentGroup(cat));
				}
			}
		});
		if(content.metadata.category == "interception") {
			content.contentType = "learningactivity";
			content.contentSubType = "quiz";
		}
		//console.log(content.identifier, 'category', category, 'categories', categories, 'content.categories', content.categories);
		content.is_deleted = false;
		content.markModified('categories');
		content.markModified('metadata');
		content.markModified('linkedCourses');
		content.save(function(err, object) {
			if(err) {
				console.log('err', err);
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.done(function(content) {
		var saveType = (isNew) ? ViewHelperConstants.INSERT : ViewHelperConstants.UPDATE;
		var resolveObject = {
                'saveType': saveType,
                'object': JSON.stringify(content)
            };
         // console.log("resolveObject:",resolveObject);
		defer.resolve(resolveObject);
	});
	return defer.promise;
}

exports.importMedia = function(node) {
	var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var metadata = ViewHelperUtil.retrieveMetadata(node);
	var isNew = false;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(MediaModel.findOne, MediaModel, [{identifier: id}]))
	.then(function(media) {
		var deferred = promise_lib.defer();
		if(typeof media == 'undefined' || media == null) {
			media = new MediaModel();
			media.identifier = id;
			isNew = true;
		}
		media.title = ViewHelperUtil.getNodeProperty(node, 'name');
		media.description = ViewHelperUtil.getNodeProperty(node, 'description');
		media.url = ViewHelperUtil.getNodeProperty(node, 'location');
		media.mimeType = ViewHelperUtil.getNodeProperty(node, 'format');

		if(typeof media.metadata == 'undefined' || media.metadata == null) media.metadata = {};
		for(k in metadata) {
			media.metadata[k] = metadata[k];
		}
		media.is_deleted = false;
		media.markModified('metadata');
		
		if(media.mimeType == 'ilimi/test') {
				var testInfo = eval("(" + media.url + ")");
				if(testInfo.questionPaperId) {
					var test = {};
					test.usageId = testInfo.usageId;
					test.questionPaperId = testInfo.questionPaperId;
					test.numAttempts = testInfo.numAttempts;

					var reqData = {};
					reqData.ASSESSMENT_TEST_LIST = {};
					reqData.ASSESSMENT_TEST_LIST.valueObjectList = [];
					reqData.ASSESSMENT_TEST_LIST.valueObjectList.push(test);

					console.log("reqData:",JSON.stringify(reqData));
		            var MWServiceProvider = require("../../commons/MWServiceProvider");
		            MWServiceProvider.callServiceStandardWithUser("assessmentService", "saveAssessmentTest", reqData, null, function(mwerr, mwData) {
		                if (mwerr) {
		                    console.log("Error in Response from MW saveAssessmentTest: " + mwerr);
		                } else {
		                    console.log("Response from MW saveAssessmentTest: " + mwData);
		                }
		            });
				}
		}
		media.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.done(function(media) {
		var saveType = (isNew) ? ViewHelperConstants.INSERT : ViewHelperConstants.UPDATE;
		var resolveObject = {
            'saveType': saveType,
            'object': JSON.stringify(media)
        };
        // console.log("resolveObject:",resolveObject);
		defer.resolve(resolveObject);
		defer.resolve(media);
	});
	return defer.promise;
}

exports.importRelation = function(edge, node, childNode) {
	var relation = ViewHelperUtil.getNodeProperty(edge, 'relation_label');
	var relationType = ViewHelperUtil.getNodeProperty(edge, 'relationType');
	var childNodeType = ViewHelperUtil.getNodeProperty(childNode, 'setType');
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(MediaContentModel.findOne, MediaContentModel, [{identifier: ViewHelperUtil.getNodeProperty(node, 'identifier')}]))
	.then(function(content) {
		var deferred = promise_lib.defer();
		if(childNodeType == ViewHelperConstants.MEDIA) {
			if(relationType.toLowerCase() === 'subtitle') {
				upsertMedia(content, childNode, 'subtitles', relationType, deferred);
			} else if(relationType.toLowerCase() === 'transcript') {
				upsertMedia(content, childNode, 'transcripts', relationType, deferred);
			} else {
				upsertMedia(content, childNode, 'media', relationType, deferred);
			}

		} else if(childNodeType == ViewHelperConstants.CONCEPT) {
			upsertConcept(content, childNode);
			deferred.resolve();
		} else if(childNodeType == ViewHelperConstants.CONTENT) {
			addInterception(content, childNode, edge);
			deferred.resolve();
		}
		return deferred.promise;
	})
	.done(function() {
		defer.resolve();
	});
	return defer.promise;
}

function upsertConcept(content, node) {
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var matched;
	if(content.concepts) {
		content.concepts.forEach(function(concept) {
			if(concept.conceptIdentifier == nodeId) {
				matched = concept;
			}
		});
	}
	if(!matched) {
		var obj = {
			conceptTitle: ViewHelperUtil.getNodeProperty(node, 'title'),
			conceptIdentifier: nodeId
		};
		MediaContentModel.update(
			{
				identifier: content.identifier
			},
			{
				$push: {
					concepts: obj
				}
			}
		).exec(function(err) {
			if(err) console.log('Content - Error upserting concept on import - ', err);
		});
	} else {
		MediaContentModel.update(
			{
				identifier: content.identifier,
				"concepts": {$elemMatch: {conceptIdentifier: nodeId}}
			},
			{
				$set: {
					"concepts.$.conceptTitle": ViewHelperUtil.getNodeProperty(node, 'title'),
				}
			}
		).exec(function(err) {
			if(err) {
				console.log('Error Updating concept - ', err);
			}
		});
	}
}

function getMediaIdentifier(nodeId, defer) {
	var model = mongoose.model('MediaModel');
    model.findOne({'metadata.nodeId': nodeId},{identifier: 1}).lean().exec(function(err, obj) {
		if (err) {
			defer.reject('Media not found for:', nodeId);
		} else {
			if (obj && obj != null && obj.identifier) {
				defer.resolve(obj.identifier);
			} else {
				defer.reject('Media not found for:', nodeId);
			}
		}
	});
}

function addInterception(content, node, edge) {
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var interceptionName = ViewHelperUtil.getNodeProperty(node, 'name');
	var mediaNodeId = ViewHelperUtil.getNodeProperty(edge, 'interceptionMediaId');
	var interceptionPoint = ViewHelperUtil.getNodeProperty(edge, 'interceptionPoint');

	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		getMediaIdentifier(mediaNodeId, defer);
		return defer.promise;
	})
	.then(function(interceptionMedia) {
		var matched = false;
		if(content.interceptions) {
			content.interceptions.forEach(function(interception) {
				if(interception.contentId == nodeId && interception.mediaId == interceptionMedia) {
					matched = true;
				}
			});
		}

		if(!matched) {
			var obj = {
				name: interceptionName,
				contentId: nodeId,
				mediaId: interceptionMedia,
				interceptionPoint: interceptionPoint
			};

			MediaContentModel.update(
				{
					identifier: content.identifier
				},
				{
					$push: {
						interceptions: obj
					}
				}
			).exec(function(err) {
				if(err) console.log('Content - Error adding interceptions on import - ', err);
			});
		} else {
			MediaContentModel.update(
				{
					identifier: content.identifier,
					"interceptions": {$elemMatch: {contentId: nodeId, mediaId: interceptionMedia}}
				},
				{
					$set: {
						"interceptions.$.name": interceptionName,
						"interceptions.$.interceptionPoint": interceptionPoint
					}
				}
			).exec(function(err) {
				if(err) {
					console.log('Error Updating Interceptions - ', err);
				}
			});
		}
	})
	.catch(function(err) {
		console.log('Error saving media interception', err);
	})
	.done();
}

function upsertMedia(content, node, property, relationType, deferred) {
	var nodeId = ViewHelperUtil.getNodeProperty(node, 'identifier');
	var matched;
	if(content[property]) {
		content[property].forEach(function(object) {
			if(object.mediaId == nodeId) {
				matched = object;
			}
		});
	}
	if(!matched) {
		var obj = {
			title: ViewHelperUtil.getNodeProperty(node, 'name'),
			language: ViewHelperUtil.getNodeProperty(node, 'language'),
			mediaUrl: ViewHelperUtil.getNodeProperty(node, 'location'),
			mimeType: ViewHelperUtil.getNodeProperty(node, 'format'),
			mediaType: ViewHelperUtil.getMediaType(ViewHelperUtil.getNodeProperty(node, 'format')),
			mediaId: nodeId
		};
		obj.isMain = (property == 'media' && relationType.toLowerCase() == 'main');
		//content[property].push(obj);
		MediaContentModel.update(
			{
				identifier: content.identifier
			},
			{
				$push: {
					media: obj
				}
			}
		).exec(function(err) {
			if(err) console.log('Error Pushing Media to MediaContent - ', err);
			deferred.resolve();
		});

	} else {
		MediaContentModel.update(
			{
				identifier: content.identifier,
				"media": {$elemMatch: { mediaId : nodeId }}
			},
			{
				$set: {
					"media.$.title": ViewHelperUtil.getNodeProperty(node, 'name'),
					"media.$.language": ViewHelperUtil.getNodeProperty(node, 'language'),
					"media.$.mediaUrl": ViewHelperUtil.getNodeProperty(node, 'location'),
					"media.$.mimeType": ViewHelperUtil.getNodeProperty(node, 'format'),
					"media.$.mediaType": ViewHelperUtil.getMediaType(ViewHelperUtil.getNodeProperty(node, 'format')),
					"media.$.isMain": (property == 'media' && relationType.toLowerCase() == 'main')
				}
			}
		).exec(function(err) {
			if(err) console.log('Error Updating Media to MediaContent - ', err);
			deferred.resolve();
		});
	}
	/*if(content.identifier == 'info:fedora/learning:38815') {

		MediaContentModel.findOne({ media: {$elemMatch: { mediaId : nodeId }}}).exec(function(err, mediaContent) {
			console.log("err:",err);
			console.log("mediaContent:", mediaContent.identifier);
		});

	}
	
	content.markModified(property);
	content.save(function(err) {
		if(err) console.log('Error upserting ' + property + ' on import - ', err);
		deferred.resolve();
	});*/
}

exports.getContentFromURL = function(req, res) {
	LoggerUtil.setOperationName('getContentFromURL');
	var Client = require('node-rest-client').Client;
	var client = new Client();
	var url = 'https://readability.com/api/content/v1/parser?token=14676a8ab08967621a9b494326462d5a9223f918'
		+ '&url=' + req.param('url');
	var args = {};
	client.get(url, args, function(data, response) {
		try {
			var dataObj = JSON.parse(data);
			res.set('Content-Type', 'text/plain');
        	res.send(dataObj);
		} catch(e) {
			console.log('err', e);
        	res.send('error');
		}
    }).on('error', function(err) {
        console.log('err', err);
        res.send('error');
    });
}

exports.deleteMedia = function(object) {
	object.recursive = object.recursive.toLowerCase();
	var isRecursive = (object.recursive == 'true' || object.recursive == 'Y');
	var message = '';
	var deleted = [];
	var extId = null;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		if(object.parentNodeId != '' && object.parentNodeType.toLowerCase() == ViewHelperConstants.CONTENT) {
			//Delete the relation
			deleteMediaRelation(object.parentNodeId, object.nodeId)
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
			MediaContentModel.count({'media.mediaId': object.nodeId}).exec(function(err, count) {
				if(count == 0) {
					deferred.resolve(true);
				} else {
					deferred.resolve(false);
				}
			});
		} else {
			deferred.resolve(true);
		}
		return deferred.promise;
	})
	.then(function(deleteMedia) {
		var deferred = promise_lib.defer();
		if(deleteMedia) {
			// Delete all media relations with Content object
			MediaContentModel.find({'media.mediaId': object.nodeId}).exec(function(err, contents) {
				if(err) {
					deferred.reject(err);
				} else if(contents && contents.length > 0) {
					var promises = [];
					contents.forEach(function(content) {
						promises.push(deleteMediaRelation(content.identifier, object.nodeId));
					})
					promise_lib.all(promises).then(function(value) {
					    deferred.resolve(true);
					});
				} else {
					deferred.resolve(true);
				}
			});
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	})
	.then(function(deleteMedia) {
		var deferred = promise_lib.defer();
		if(deleteMedia) {
			if(object.isRemove) {
				MediaModel.findOneAndRemove({identifier: object.nodeId}).exec(function(err, deletedObject) {
					if(err) {
						deferred.reject(err);
					} else {
						courseMWHelper.emptyObjectInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve();
					}
				});
			} else {
				MediaModel.findOneAndUpdate({identifier: object.nodeId}, {'is_deleted': true }).exec(function(err, deletedObject) {
					if(err) {
						deferred.reject(err);
					} else {
						// TODO MW update is pending... removeRelation(parentNodeId), updateDeleteFlag.
						courseMWHelper.setDeleteStatusInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve();
					}
				});
			}
		} else {
			message += object.nodeId + ' is not deleted as it is referenced by another object';
			deferred.resolve();
		}
		return deferred.promise;
	})
	.catch(function(err) {
		console.log('Error deleting the media - ', err);
		defer.reject(err);
	})
	.done(function(msg) {
		console.log("Length: ", deleted.length);
		console.log("Media DELETED: ", deleted);
		defer.resolve({'message': message, 'extId': extId, 'deletedList': deleted});
	});
	return defer.promise;
}

function deleteMediaRelation(contentId, mediaId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		MediaContentModel.update({identifier: contentId},{$pull: { media :{'mediaId': mediaId}}}).exec(function(err, pulledObj) {
			if(err) console.log('Unable to delete content media relation - ', err);
			defer.resolve();
		});
		defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		MediaContentModel.update({identifier: contentId},{$pull: {transcripts:{'mediaIdentifier': mediaId}}}).exec(function(err, pulledObj) {
			if(err) console.log('Unable to delete content media transcripts relation - ', err);
			defer.resolve();
		});
		defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		MediaContentModel.update({identifier: contentId},{$pull: { subtitles: {'mediaIdentifier': mediaId}}}).exec(function(err, pulledObj) {
			if(err) console.log('Unable to delete content media subtitles relation - ', err);
			defer.resolve();
		});
		defer.promise;
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	.done(function() {
		/*courseMWHelper.exportContentToMW(contentId);*/
		courseMWHelper.disconnectObjectInMW(contentId, mediaId, 'associatedTo');
		deferred.resolve('Relation between ' + contentId + ' and ' + mediaId + ' is deleted.');
	});
	return deferred.promise;
}

exports.deleteContent = function(object) {
	object.recursive = object.recursive.toLowerCase();
	var isRecursive = (object.recursive == 'true' || object.recursive == 'Y');
	var message = '';
	var errors = [];
	var deleted = [];
	var extId = null;
	var defer = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MediaContentModel.findOne({identifier: object.nodeId}).exec(function(err, contentObject) {
			if(err) {
				deferred.reject(err);
			} else if(!contentObject) {
				extId = object.nodeId;
				deferred.reject('element does not exist.');
			} else {
				extId = contentObject.metadata.nodeId;
				if(!isRecursive && (contentObject.media.length > 0)) {
					deferred.reject(contentObject.metadata.nodeId+' has children. please select recursive.');
				} else {
					deferred.resolve();	
				}
			}
		});
		return deferred.promise;
	})
	.then(function() {
		var deferred = promise_lib.defer();
		if(object.parentNodeId != '') {
			//Delete the parent relation
			deleteContentIdentifier(object.parentNodeId, object.parentNodeType.toLowerCase())
			.then(function() {
				return deleteContentRelation(object.parentNodeId, object.nodeId, object.parentNodeType.toLowerCase());
			})
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
	.then(function(deleteContent) {
		var deferred = promise_lib.defer();
		if(deleteContent) {
			// Delete all content relations with LOB/LR/LA/Content objects
			deleteContentRelations(object.nodeId).then(function() {
				deferred.resolve(true);
			});
		} else {
			deferred.resolve(false);
		}
		return deferred.promise;
	})
	.then(function(deleteContent) {
		var deferred = promise_lib.defer();
		if(deleteContent) {
			if(object.isRemove) {
				MediaContentModel.findOneAndRemove({identifier: object.nodeId}).exec(function(err, deletedObject) {
					if(err) {
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
				MediaContentModel.findOneAndUpdate({identifier: object.nodeId}, {'is_deleted': true }).exec(function(err, deletedObject) {
					if(err) {
						deferred.reject(err);
					} else {
						// TODO MW update is pending... removeRelation(parentNodeId), updateDeleteFlag.
						console.log("setDeleteStatusInMW called on "+object.nodeId);
						courseMWHelper.setDeleteStatusInMW(object.nodeId);
						message += object.nodeId + ' is deleted';
						deleted.push(deletedObject.metadata.nodeId);
						extId = deletedObject.metadata.nodeId;
						deferred.resolve(deletedObject);
					}
				})
			}
		} else {
			message += object.nodeId + ' is not deleted as it is referenced by another object';
			deferred.resolve();
		}
		return deferred.promise;
	})
	.then(function(deletedObject) {
		if(deletedObject && isRecursive && deletedObject.media && deletedObject.media.length > 0) {
			var promises = [];
			deletedObject.media.forEach(function(media) {
				promises.push(exports.deleteMedia({
					nodeId: media.mediaId,
					parentNodeId: deletedObject.identifier,
					parentNodeType: ViewHelperConstants.CONTENT,
					recursive: 'true'
				}));
			});
			return promise_lib.all(promises);
		}
	})
	.then(function(promises) {
		if(promises) {
			promises.forEach(function(promise) {
				promise.deletedList.forEach(function(deletedNodeId) {
					deleted.push(deletedNodeId);
				});
			});
		}
	})
	.catch(function(err) {
		console.log('Error deleting content - ', err);
		if(err) errors.push(err);
	})
	.done(function() {
		if(errors.length > 0) {
			errors.forEach(function(err) {
				message+=err;
			});
		}
		console.log("Length: ", deleted.length);
		console.log("Content DELETED: ", deleted);
		defer.resolve({'message': message, 'extId': extId, 'deletedList': deleted});
	});
	return defer.promise;
}

function isReferenced(contentId) {
	var hasParent = false;
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
		LearningObjectElementsModel.count({'supplementary_content.contentId': contentId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningResourceModel = mongoose.model('LearningResourceModel');
		LearningResourceModel.count({'contentIdentifier': contentId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningResourceModel = mongoose.model('LearningResourceModel');
		LearningResourceModel.count({'supplementary_content.contentId': contentId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.count({'contentIdentifier': contentId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.count({'supplementary_content.contentId': contentId}).exec(function(err, count) {
			if(count > 0) hasParent = true;
			defer.resolve();
		});
		return defer.promise;
	})
	.then(function() {
		var defer = promise_lib.defer();
		MediaContentModel.count({'interceptions.contentId': contentId}).exec(function(err, count) {
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

function checkForParent(model, parameter, value) {
	var defer = promise_lib.defer();
	var modelObj = mongoose.model(model);
	modelObj.count({parameter: value}).exec(function(err, count) {
		if(count > 0) hasParent = true;
		defer.resolve();
	});
	return defer.promise;
}

function deleteContentRelations(contentId) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var defer = promise_lib.defer();
		LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
		LearningObjectElementsModel.find({'supplementary_content.contentId': contentId}).exec(function(err, lobs) {
			if(err) {
				defer.reject(err);
			} else if(lobs && lobs.length > 0) {
				var promises = [];
				lobs.forEach(function(lob) {
					promises.push(deleteContentRelation(lob.lobId, contentId, ViewHelperConstants.LEARNING_OBJECT));
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
	.then(function() {
		var defer = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.find({'supplementary_content.contentId': contentId}).exec(function(err, las) {
			if(err) {
				defer.reject(err);
			} else if(las && las.length > 0) {
				var promises = [];
				las.forEach(function(las) {
					promises.push(deleteContentRelation(las.identifier, contentId, ViewHelperConstants.LEARNING_ACTIVITY));
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
	.then(function() {
		var defer = promise_lib.defer();
		LearningActivityModel = mongoose.model('LearningActivityModel');
		LearningActivityModel.find({'contentIdentifier': contentId}).exec(function(err, elements) {
			if(err) {
				defer.reject(err);
			} else if(elements && elements.length > 0) {
				var promises = [];
				elements.forEach(function(element) {
					promises.push(deleteContentIdentifier(element.identifier, ViewHelperConstants.LEARNING_ACTIVITY));
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
	.then(function() {
		var defer = promise_lib.defer();
		LearningResourceModel = mongoose.model('LearningResourceModel');
		LearningResourceModel.find({'supplementary_content.contentId': contentId}).exec(function(err, elements) {
			if(err) {
				defer.reject(err);
			} else if(elements && elements.length > 0) {
				var promises = [];
				elements.forEach(function(element) {
					promises.push(deleteContentRelation(element.identifier, contentId, ViewHelperConstants.LEARNING_RESOURCE));
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
	.then(function() {
		var defer = promise_lib.defer();
		LearningResourceModel = mongoose.model('LearningResourceModel');
		LearningResourceModel.find({'contentIdentifier': contentId}).exec(function(err, elements) {
			if(err) {
				defer.reject(err);
			} else if(elements && elements.length > 0) {
				var promises = [];
				elements.forEach(function(element) {
					promises.push(deleteContentIdentifier(element.identifier, ViewHelperConstants.LEARNING_RESOURCE));
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
	.then(function() {
		var defer = promise_lib.defer();
		MediaContentModel.find({'interceptions.contentId': contentId}).exec(function(err, contents) {
			if(err) {
				defer.reject(err);
			} else if(contents && contents.length > 0) {
				var promises = [];
				contents.forEach(function(content) {
					promises.push(deleteContentRelation(content.identifier, contentId, ViewHelperConstants.CONTENT));
				});
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

function deleteContentIdentifier(parentId, parentNodeType) {
	var deferred = promise_lib.defer();

	switch(parentNodeType) {
		case ViewHelperConstants.LEARNING_RESOURCE:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningResourceModel = mongoose.model('LearningResourceModel');
				LearningResourceModel.update({identifier: parentId},{$set: {'contentIdentifier': ''}}).exec(function(err) {
					if(err) console.log('Unable to delete LR content relation - ', err);
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				deferred.resolve('Relation between ' + parentId + ' and current node is deleted.');
			});
			break;
		case ViewHelperConstants.LEARNING_ACTIVITY:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningActivityModel = mongoose.model('LearningActivityModel');
				LearningActivityModel.update({identifier: parentId},{$set: {'contentIdentifier': ''}}).exec(function(err) {
					if(err) console.log('Unable to delete LR content relation - ', err);
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				deferred.resolve('Relation between ' + parentId + ' and current node is deleted.');
			});
			break;
	}
	return deferred.promise;
}

function deleteContentRelation(parentId, contentId, nodeType) {
	var deferred = promise_lib.defer();

	switch(nodeType) {
		case ViewHelperConstants.LEARNING_OBJECT:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
				LearningObjectElementsModel.update({lobId: parentId},{$pull: { supplementary_content: {'contentId': contentId}}}).exec(function(err, pulledObj) {
					if(err) {
						console.log('Unable to delete lob content relation - ', err);
					} else {
						/*courseMWHelper.exportLOBToMW(parentId);*/
						courseMWHelper.disconnectObjectInMW(parentId, contentId, 'associatedTo');
					}
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				deferred.resolve('Relation between ' + parentId + ' and ' + contentId + ' is deleted.');
			});
			break;
		case ViewHelperConstants.LEARNING_RESOURCE:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningResourceModel = mongoose.model('LearningResourceModel');
				LearningResourceModel.update({identifier: parentId},{$pull: { supplementary_content: {'contentId': contentId}}}).exec(function(err, pulledObj) {
					if(err)
						console.log('Unable to delete LR content relation - ', err);
					else
						/*courseMWHelper.exportLearningResourceToMW(parentId);*/
						courseMWHelper.disconnectObjectInMW(parentId, contentId, 'associatedTo');
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				deferred.resolve('Relation between ' + parentId + ' and ' + contentId + ' is deleted.');
			});
			break;
		case ViewHelperConstants.LEARNING_ACTIVITY:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				LearningActivityModel = mongoose.model('LearningActivityModel');
				LearningActivityModel.update({identifier: parentId},{$pull: { supplementary_content: {'contentId': contentId}}}).exec(function(err, pulledObj) {
					if(err)
						console.log('Unable to delete LR content relation - ', err);
					else {
						/*courseMWHelper.exportLearningActivityToMW(parentId);*/
						courseMWHelper.disconnectObjectInMW(parentId, contentId, 'associatedTo');
					}
						
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				deferred.resolve('Relation between ' + parentId + ' and ' + contentId + ' is deleted.');
			});
			break;
		case ViewHelperConstants.CONTENT:
			promise_lib.resolve()
			.then(function() {
				var defer = promise_lib.defer();
				MediaContentModel.update({identifier: parentId},{$pull: {interceptions: {'contentId': contentId}}}).exec(function(err, pulledObj) {
					if(err)
						console.log('Unable to delete Content - Content relation - ', err);
					else
						/*courseMWHelper.exportContentToMW(parentId);*/
						courseMWHelper.disconnectObjectInMW(parentId, contentId, 'associatedTo');
					defer.resolve();
				});
				defer.promise;
			})
			.catch(function(err) {
				deferred.reject(err);
			})
			.done(function() {
				deferred.resolve('Relation between ' + parentId + ' and ' + contentId + ' is deleted.');
			});
			break;
	}
	return deferred.promise;
}
