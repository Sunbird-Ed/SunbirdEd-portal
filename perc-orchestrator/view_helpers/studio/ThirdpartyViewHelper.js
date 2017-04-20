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

var Scribd = require('scribd');
var mongoose = require('mongoose');
var importer = require('./CourseImportHelper.js');
var when = require('when');
var creds = {
    key: '5qi28tf7xkikvs7l8x1ml',
    secret: 'sec-6hduobumg6h7twtqn1yyp7swms'
};
var errorModule = require('../ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var IDCacheUtil = require('../../commons/IDCacheUtil');
LearningResourceModel = mongoose.model('LearningResourceModel');
var ViewHelperConstants = require('../ViewHelperConstants');
var courseMWHelper = require('./CourseMWViewHelper');

var scribd = new Scribd(creds.key, creds.secret)


exports.uploadFileToScribd = function(req, res) {
    console.log(req.files.document.path);
    scribd.upload(function(err, response) {
        var data = {
            doc_id: response.doc_id,
            access_key: response.access_key,
        }
        res.send(data);
    }, req.files.document.path, req.files.document.type.split('/')[1], 'private');
}

exports.getContentMetadata = function(req, res) {
    mongoose.model('MediaContentModel').findOne({
        'identifier': req.params.id
    }, function(err, doc) {
        res.send(doc);
    });
}

exports.generateId = function(course) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:";

    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

exports.saveMedia = function(mediaList, contentNodeId) {
    if (mediaList === undefined)
        return when(null);
    var getMedia = function(media, contentNodeId) {
        console.log(contentNodeId);
        if (media.mediaId) {
            return mongoose.model('MediaModel').findOne({
                identifier: media.mediaId
            }).exec().then(function(doc) {
                doc.metadata.location = media.mediaUrl;
                doc.metadata.format = media.mimeType;
                doc.metadata.learningTime = media.learingTime;
                doc.metadata.contentGroup = (media.isMain) ? 'main' : media.mediaType;
                doc.metadata.title = media.title;
                doc.metadata.name = media.title;
                doc.metadata.duration = media.duration || 0;
                return doc.metadata;
            });
        } else {
            media.nodeId = exports.generateId();
            media.parentNodeId = contentNodeId;
            media.name = media.title;
            media.format = media.mimeType;
            media.learningTime = media.learningTime;
            media.location = media.mediaUrl;
            media.contentGroup = (media.isMain) ? 'main' : media.mediaType;
            return media;
        }
    }

    return when.all(mediaList.map(getMedia, contentNodeId)).then(function(media) {
        var items = [];
        media.forEach(function(item) {
            if (!item.mediaId) {
                item.parentNodeId = contentNodeId;
                item.contentId = contentNodeId;
                item.identifier = '';
            }
            item.nodeType = item.nodeClass = 'media';
            var data = {};
            data[item.nodeId] = item;
            items.push(data);
        });
        return items;
    });
}

exports.saveContent = function(content, media, lr) {
    if (content === undefined)
        return null;
    if (!content.metadata.nodeId) {
        content.metadata.nodeId = exports.generateId();
    }
    content.metadata.parentNodeId = lr;
    var data = {};
    //content.metadata.media = media;
    content.metadata.nodeClass = content.metadata.nodeType = 'content';
    data[content.metadata.nodeId] = content.metadata;
    return data;
}

exports.saveSupplementary = function(sup, parent) {
    if (sup === undefined)
        return when(null);
    var getContent = function(supContent, parent) {
        if (supContent.contentId) {
            return mongoose.model('MediaContentModel').findOne({
                identifier: supContent.contentId
            }).exec().then(function(doc) {
                doc.metadata.location = supContent.mediaURL;
                doc.metadata.format = supContent.mimeType;
                doc.metadata.contentGroup = supContent.contentGroup;
                doc.metadata.name = doc.metadata.title = supContent.name;
                doc.metadata.duration = supContent.duration || 0;
                return doc.metadata;
            });
        } else {
            supContent.nodeId = exports.generateId();
            supContent.contentGroup = supContent.contentGroup;
            supContent.format = supContent.mimeType;
            supContent.location = supContent.mediaURL;
            supContent.title = supContent.name;
            supContent.duration = supContent.duration || 0;
            supContent.node_type = 'NODE';
            return supContent;
        }
    }

    return when.all(sup.map(getContent, parent)).then(function(media) {
        var items = [];
        media.forEach(function(item) {
            if (!item.contentId) {
                item.parentNodeId = parent;
                item.identifier = '';
            }
            item.nodeType = item.nodeClass = 'content';
            var data = {};
            data[item.nodeId] = item;
            items.push(data);
        });
        return items;
    });
}
exports.saveLearningObject = function(req, res) {
    var keyword = [];
    req.body.metadata.createdBy = req.user.identifier;
    var getConcept = function(concept) {
        return mongoose.model('ConceptModel').findOne({
            identifier: concept.id
        }, {
            context: 1,
            title: 1
        }).exec().then(function(doc) {
            var entry = doc.context + ":" + doc.title;
            return entry;
        });
    }
    if (!req.body.metadata.nodeId) {
        req.body.metadata.parentNodeId = req.body.parentNodeId;
        req.body.metadata.nodeId = exports.generateId();
    }

    when.all(req.body.metadata.concepts.map(getConcept)).then(function(entries) {
        entries.forEach(function(entry) {
            keyword.push(entry);
        });
        req.body.metadata.keyword = keyword.join(',');
        var data = {};
        data[req.body.metadata.nodeId] = req.body.metadata;
        req.body.metadata.concepts.map(function(concept) {
            concept.conceptIdentifier = concept.id;
            concept.conceptTitle = concept.name;
        });

        var _requests = [];
        if (req.body.content !== undefined) {
            if (!req.body.content.metadata.nodeId) {
                req.body.content.metadata.nodeId = exports.generateId();
                req.body.content.metadata.parentNodeId = req.body.metadata.nodeId;
            }
        }
        req.body.metadata.concepts = '';
        _requests.push(data);
        var contentData = exports.saveContent(req.body.content, req.body.media, req.body.metadata.nodeId);
        if (contentData !== null)
            _requests.push(contentData);


        exports.saveSupplementary(req.body.supplementary, req.body.metadata.nodeId).then(function(_supp) {
            if (_supp !== null)
                _requests.push.apply(_requests, _supp);
            var id = (req.body.content) ? req.body.content.metadata.nodeId : undefined;
            exports.saveMedia(req.body.media, id).then(function(_media) {
                if (_media !== null)
                    _requests.push.apply(_requests, _media);
                var nodeIds = [];
                _requests.forEach(function(ob) {
                    Object.keys(ob).forEach(function(key) {
                        nodeIds.push(key);
                    });
                });
                var fin = {};
                for (var i = 0; i < nodeIds.length; i++) {
                    fin[nodeIds[i]] = _requests[i][nodeIds[i]];
                }
                fin.nodeIds = nodeIds;
                console.log(fin);
                importer.createGraphWithoutStats(fin)
                    .then(function() {
                        res.send({
                            success: true
                        });
                    }).catch(function(err) {
                        console.log("Error while creating Learning Resources: " + err);
                        res.send({
                            success: false
                        });
                    });
            });
        })
    });
}


exports.getSearchContent = function(req, res) {
    var errors = [];
    var mediaContentColls = {};
    // console.log(req.body);
    var nPerPage = req.body.pageSize || 1000;
    var pageNumber = req.body.page || 0;
    var queryParams = getSearchQueryParams(req);
    //console.log("query params : ", queryParams);
    when.resolve()
        .then(function() {
            var defer = when.defer();
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
        .then(function() {
            var defer = when.defer();
            MediaContentModel = mongoose.model('MediaContentModel');
            MediaContentModel.find(queryParams).skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0).limit(nPerPage).exec(function(err, mediaContent) {
                console.log("Number of media content found : " + mediaContent.length);
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
            if (err) errors = err;
        })
        .done(function() {
            if (errors.length > 0) {
                console.log("Error cacheing searches: " + err);
                res.send("Update cache failed:" + err);
            } else {
                res.send(mediaContentColls);
            }
        });
};

function getSearchQueryParams(req) {
    console.log(keyword);
    var keyword = req.body.keyword;
    var concepts = JSON.parse(req.body.concepts);
    var concepts = concepts.map(function(item) {
        return {
            id: item
        }
    });
    console.log(concepts);
    //var diffLevels = req.body.params.diffLevels;
    //var mediaTypes = req.body.params.mediaTypes;
    //var bloomsTaxonomyLevels = req.body.params.bloomsTaxonomyLevels;
    var skipMediaTypes = ['mcq', 'event'];

    var queryParams = {};
    if (typeof keyword == 'string' && keyword.trim() != '') {
        queryParams.$or = [];
        queryParams.$or.push({
            name: {
                $regex: keyword
            }
        });
        queryParams.$or.push({
            description: {
                $regex: keyword
            }
        });
    }
    /*if (typeof mediaTypes == 'object' && mediaTypes != null && mediaTypes.length > 0) {
        queryParams.media = {$elemMatch: {mediaType : {$in: mediaTypes }}};
    } else {
        queryParams.media = {$elemMatch: {mediaType : {$nin: skipMediaTypes }}};
    }*/
    if (typeof concepts == 'object' && concepts != null && concepts.length > 0) {
        queryParams.concepts = {
            $elemMatch: {
                id: {
                    $in: concepts
                }
            }
        };
    }
    /*
    if (typeof diffLevels == 'object' && diffLevels != null && diffLevels.length > 0) {
        queryParams['metadata.difficultyLevel'] = {$in: diffLevels};
    }
    if (typeof bloomsTaxonomyLevels == 'object' && bloomsTaxonomyLevels != null && bloomsTaxonomyLevels.length > 0) {
        queryParams['metadata.bloomsTaxonomyLevel'] = {$in: bloomsTaxonomyLevels};
    }*/
    return queryParams;
}

exports.getLearningObject = function(req, res) {
    if (req.params.level == 2) {
        var error = {};
        var id = req.params.id || req.body.elementId;
        promise_lib.resolve()
            .then(ViewHelperUtil.promisifyWithArgs(LearningResourceModel.findOne, LearningResourceModel, [{
                identifier: id
            }]))
            .then(function(element) {
                var deferred = promise_lib.defer();
                MediaContentModel = mongoose.model('MediaContentModel');
                MediaContentModel.findOne({
                    identifier: element.contentIdentifier
                }).exec(function(err, content) {
                    var elementObj = element.toObject();
                    if (content && content.media) {
                        elementObj['media'] = content.media;
                    }
                    deferred.resolve(elementObj);
                });
                return deferred.promise;
            })
            .catch(ViewHelperUtil.buildCatchFunction(error))
            .done(ViewHelperUtil.buildDoneFunction(error, "ERROR_FETCHING_LEARNING_RESOURCE", req, res));
    } else {
        mongoose.model('LearningObjectModel').findOne({
            identifier: req.params.id
        }, function(error, doc) {
            res.send(doc);
        });
    }
}
