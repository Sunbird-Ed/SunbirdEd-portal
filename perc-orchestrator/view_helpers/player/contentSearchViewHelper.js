/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Content Search
 *
 * @author shreekant
 */

var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var IDCacheUtil = require('../../commons/IDCacheUtil');
var CourseMWViewHelper = require('../studio/CourseMWViewHelper');

exports.getSearchContent = function(req, res) {
	var errors = [];
    var mediaContentColls = {};
    //console.log(req.body);
    var skipSearchIndex = req.body.params.skipSearchIndex;
    var nPerPage = req.body.params.pageSize;
    var pageNumber = req.body.params.page + 1;
    var queryParams = getSearchQueryParams(req);
    console.log("query params : ", queryParams);
	promise_lib.resolve()
    .then(function(){
        var defer = promise_lib.defer();
        MediaContentModel = mongoose.model('MediaContentModel');
        MediaContentModel.count(queryParams).exec(function(err, mediaContentCount) {
            console.log("Total number of media content : " + mediaContentCount);
            if (err) {
                defer.reject(err);
            } else {
                mediaContentColls["totalContentItems"] = mediaContentCount;
                console.log("total count : ", mediaContentCount);
                defer.resolve();
            }
        });
        return defer.promise;   
    })
	.then(function(){
	    var defer = promise_lib.defer();
        MediaContentModel = mongoose.model('MediaContentModel');
		//MediaContentModel.find(queryParams).skip(pageNumber > 0 ? ((pageNumber-1)*nPerPage) : 0).limit(nPerPage).exec(function(err, mediaContent) {        
        MediaContentModel.find(queryParams).skip(skipSearchIndex * appConfig.DEFAULT_RESULT_SIZE).limit(appConfig.DEFAULT_RESULT_SIZE).exec(function(err, mediaContent) {            
			console.log("Number of media content found : "+ mediaContent.length);
            /*to show/hide show more option*/
            if(mediaContent.length < appConfig.DEFAULT_RESULT_SIZE || mediaContent == null || !mediaContent) mediaContentColls['showMore'] = false;
            else mediaContentColls['showMore'] = true;
			if (err) {
				defer.reject(err);
			} else {
                mediaContentColls["mediaContent"] = mediaContent;
				defer.resolve();
			}
		});
		return defer.promise;	
   	})
    .catch(function(err) {
    	if(err) errors = err;
    })
    .done(function() {
        if(errors.length > 0) {
        	console.log("Error cacheing searches: "+err);
        	res.send("Update cache failed:"+err);
        } else {
        	res.send(mediaContentColls);
        }
    });
};

function getSearchQueryParams(req) {
    var keyword = req.body.params.keyword;
    var concepts = req.body.params.concepts;
    var diffLevels = req.body.params.diffLevels;
    var mediaTypes = req.body.params.mediaTypes;
    var bloomsTaxonomyLevels = req.body.params.bloomsTaxonomyLevels;
    var skipMediaTypes = ['mcq', 'event'];

    var queryParams = {};
    if (typeof keyword == 'string' && keyword.trim() != '') {
        queryParams.$or = [];
        queryParams.$or.push({name: {$regex: keyword}});
        queryParams.$or.push({description: {$regex: keyword}});
    }
    if (typeof concepts == 'object' && concepts != null && concepts.length > 0) {
        queryParams.concepts = {$elemMatch: {conceptIdentifier : {$in: concepts }}};
    }
    if (typeof diffLevels == 'object' && diffLevels != null && diffLevels.length > 0) {
        queryParams['metadata.difficultyLevel'] = {$in: diffLevels};
    }
    if (typeof mediaTypes == 'object' && mediaTypes != null && mediaTypes.length > 0) {
        queryParams.media = {$elemMatch: {mediaType : {$in: mediaTypes }}};
    } else {
        queryParams.media = {$elemMatch: {mediaType : {$nin: skipMediaTypes }}};
    }
    if (typeof bloomsTaxonomyLevels == 'object' && bloomsTaxonomyLevels != null && bloomsTaxonomyLevels.length > 0) {
        queryParams['metadata.bloomsTaxonomyLevel'] = {$in: bloomsTaxonomyLevels};
    }
    queryParams['categories.0'] = {$exists: true};
    return queryParams;
};


exports.getBinders = function(req, res) {
    var errors = [];
    var binderList = [];
    promise_lib.resolve()
    .then(function(){
        var defer = promise_lib.defer();
        var LearningObjectModel = mongoose.model('LearningObjectModel');
        LearningObjectModel.find({"lobType" : "binder", "createdBy" : req.user.identifier, "courseId":req.params.courseId}).sort({createdDate: -1}).exec(function(err, binders) {
            console.log("Number of binders found : "+ binders.length);
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(binders);
            }
        });
        return defer.promise;   
    })
    .then(function(binders) {
        var binderIdsArray = [];
        binders.forEach(function(binderObj) {
            binderIdsArray.push(binderObj.identifier);
        });

        var defer = promise_lib.defer();
        var LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
        LearningObjectElementsModel.find({lobId : {$in : binderIdsArray}}).exec(function(err, data) {
           if (err) {
                defer.reject(err);
            } else {
                  binders.forEach(function(binderObj) {
                    data.forEach(function(element) {
                        if(element.lobId ==  binderObj.identifier) {
                            var item = {"binder":binderObj, "binderContents":element};
                            binderList.push(item);
                            return;
                        }
                    });
                });
                defer.resolve(binderList);
            }
        });
        return defer.promise; 
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(binderList) {
        if(errors.length > 0) {
            console.log("Error cacheing binders list : " + err);
            res.send("Update cache failed : " + err);
        } else {
            res.send(binderList);
        }
    });
};

exports.getBinder = function(req, res) {
    var errors = [];
    var binderId = decodeURIComponent(req.params.binderId);
    if (binderId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        binderId = PlayerUtil.addFedoraPrefix(binderId);    
    }
    promise_lib.resolve()
    .then(function(){
        var defer = promise_lib.defer();
        var LearningObjectModel = mongoose.model('LearningObjectModel');
        LearningObjectModel.findOne({"identifier" : binderId, "createdBy" : req.user.identifier}).exec(function(err, binder) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(binder);
            }
        });
        return defer.promise;   
    })
    .then(function(binder) {
        var defer = promise_lib.defer();
        var LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
        LearningObjectElementsModel.findOne({lobId : binder.identifier}).exec(function(err, data) {
           if (err) {
                defer.reject(err);
            } else {
                var item = {"binder":binder, "binderContents":data};
                defer.resolve(item);
            }
        });
        return defer.promise; 
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(item) {
        if(errors.length > 0) {
            console.log("Error cacheing binders list : " + err);
            res.send("Update cache failed : " + err);
        } else {
            res.send(item);
        }
    });
};

exports.generateId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.createBinder = function(req, res) {
    var errors = [];
    var binder = {};
    var now = new Date();
    var parentId;
    var nodeSet = 'lesson';
    var taxonomyId;
    var nodeSetId;
    var pedagogyId;
    var binderId;
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.findOne('PedagogyNodeSetModel', {nodeSetName: nodeSet}, function(err, pedagogy) {
            if(err) {
                defer.reject(err);
            } else {
                nodeSetId = pedagogy.identifier;
                pedagogyId = pedagogy.pedagogyId;
                taxonomyId = pedagogy.taxonomyId;
                defer.resolve();
            }
        });
        return defer.promise;
    })
    .then(function(){return IDCacheUtil.getIdentifier()})
    .then(function(identifier){
        var defer = promise_lib.defer();
        var LearningObjectModel = mongoose.model('LearningObjectModel');
        parentId = req.body.params.parentId;
        if (!parentId) {
            defer.reject('Parent LOB is not provided');
        }
        var lobModel = new LearningObjectModel();
        lobModel.name = req.body.params.name;
        lobModel.description = req.body.params.description;
        lobModel.identifier = identifier;
        lobModel.lobType = "binder";
        lobModel.nodeSet = nodeSet;
        lobModel.nodeSetId = nodeSetId;
        lobModel.pedagogyId = pedagogyId;
        lobModel.taxonomyId = taxonomyId;
        lobModel.courseId = req.body.params.courseId;
        lobModel.parentId = parentId;
        lobModel.concepts = req.body.params.concepts;
        lobModel.createdBy = req.user.identifier;
        lobModel.createdDate = now;
        lobModel.lastUpdated = now;
        lobModel.metadata = {
            nodeId : exports.generateId(),
            parentNodeId : parentId,
            setType: ViewHelperConstants.LESSON,
            node_type: "NODE",
            nodeType: ViewHelperConstants.LESSON,
            nodeClass: ViewHelperConstants.LEARNING_OBJECT,
            elementType : ViewHelperConstants.BINDER,  
            instructionUsage : ViewHelperConstants.COACHING, 
            description: req.body.params.description};
        // console.log('beforeSave binder:', lobModel);
        lobModel.save(function(err) {
            if(err) {
                errorModule.handleError(err, "Error While Creating Binder", req, res);
                defer.reject(err);
            } else {
                // console.log('afterSave binder:', lobModel);
                binder['binder'] = lobModel;
                defer.resolve(lobModel);
            }
        });
        return defer.promise;   
    })
    .then(function(lobModel){
        var LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
        var defer = promise_lib.defer();
        var lobElementModel = new LearningObjectElementsModel();
        lobElementModel.name = lobModel.name;
        lobElementModel.courseId = lobModel.courseId;
        lobElementModel.lobId = lobModel.identifier;
        // console.log('beforeSave new content into binder:', lobElementModel);
        lobElementModel.save(function(err) {
            if(err) {
                errorModule.handleError(err, "Error While creating binder content", req, res);
                defer.reject(err);
            } else {
                // console.log('after creating binder content :', lobElementModel);
                binder['binderContents'] = lobElementModel;
                defer.resolve(lobModel.identifier);
            }
        });
        return defer.promise;
    })
    .then(function(elementId) {
        binderId = elementId;
        var defer = promise_lib.defer();
        if (parentId) {
            MongoHelper.update('LearningObjectModel', {identifier: parentId}, {$push:{sequence: binderId}}, 
                function(err, obj) {
                    if (err) {
                        console.log('Learning Object sequence update failed: ' + err);
                        defer.reject(err);
                    } else {
                        defer.resolve();
                    }
            });
        } else {
            defer.reject('Parent LOB is not provided');
        }
        return defer.promise;
    })
    .catch(function(err) {
        if(err) {
            errors.push(err);
        }
    })
    .done(function() {
        if(errors.length > 0) {
            console.log("Error cacheing binder list: "+err);
            res.send("Update cache failed:"+err);
        } else {
            CourseMWViewHelper.exportLOBToMW(parentId);
            res.send(binder);
        }
    });
};


exports.addContentIntoBinder = function(req, res) {
    console.log(JSON.stringify(req.body));
    LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');
    LearningObjectElementsModel.findOne({lobId : req.body.params.lobId}).exec(function(err, lobElementModel) {
        if (err) {
            errorModule.handleError(err, "Error While fetching binder content ", req, res);
        } else {
            lobElementModel.elements.push(req.body.params.elements);
            lobElementModel.sequence.push(req.body.params.elements.elementId);
            //console.log('before update binder content :', lobElementModel);
            lobElementModel.save(function(err) {
                if(err) {
                    errorModule.handleError(err, "Error While updating Binder content", req, res);
                } else {
                   // console.log('after updating binder content :', lobElementModel);
                    updateCourseTimestamp(lobElementModel.courseId);
                    res.send(JSON.stringify(lobElementModel));
                }
            });
        }
    });
};

function updateCourseTimestamp(courseId) {
    MongoHelper.update('CourseModel', {identifier: courseId}, {$set:{lastUpdated: new Date()}}, 
        function(err, obj) {
            if (err) {
                console.log('Course timestamp update failed: ' + err);
            } else {
                console.log('Course timestamp updated');
            }
    });
};


exports.removeContentIntoBinder = function(req, res) {
    console.log(JSON.stringify(req.body));
    LearningObjectElementsModel = mongoose.model('LearningObjectElementsModel');

    LearningObjectElementsModel.findOne({lobId : req.body.params.lobId}).exec(function(err, contentItem) {
        if (err) {
            errorModule.handleError(err, "Error While fetching binder content ", req, res);
        } else {
            var contentItemArray = [];
            contentItem.elements.forEach(function(item) {
                console.log(item);
                if(item.elementId != req.body.params.elementId){
                    contentItemArray.push(item);
                }
            });

            var seqIndex = contentItem.sequence.indexOf(req.body.params.elementId);
            if (seqIndex > -1) {
                contentItem.sequence.splice(seqIndex, 1);
            }

            contentItem.elements = contentItemArray;
            contentItem.save(function(err) {
                if(err) {
                    errorModule.handleError(err, "Error While update existing Binder content", req, res);
                } else {
                   // console.log('after update binder content :', contentItem);
                    updateCourseTimestamp(contentItem.courseId);
                    res.send(JSON.stringify(contentItem));
                }
            });
        }
    });
};

exports.getBinderContentItems = function(req, res) {
    var errors = [];
    var elements = req.body.params.elements;
    console.log(req.body);
    promise_lib.resolve()
    .then(function(){
        var defer = promise_lib.defer();
        var MediaContentModel = mongoose.model('MediaContentModel');
        MediaContentModel.find({identifier : {$in : elements}}).exec(function(err, mediaContent) {
            console.log("Number of media content found : "+ mediaContent.length);
            if (err) {
                defer.reject(err);
            } else {
              //  console.log("success");
                defer.resolve(mediaContent);
            }
        });
        return defer.promise;   
    })
    .catch(function(err) {
        if(err) errors = err;
    })
    .done(function(mediaContent) {
        if(errors.length > 0) {
            console.log("Error cacheing searches: "+err);
            res.send("Update cache failed:"+err);
        } else {
           // console.log(" resp data : ", mediaContent);
            res.send(mediaContent);
        }
    });
};

           