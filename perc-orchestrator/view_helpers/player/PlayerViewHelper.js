/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Player
 *
 * @author rayulu
 */

var mongoose = require('mongoose'),
    errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var PlayerUtil = require('./PlayerUtil');
var AdditionalMaterialHelper = require('./AdditionalMaterialHelper');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var TypographySetUtil = require('./TypographySetUtil');
// To be removed post development
var util = require('util');
var AWS = require('aws-sdk');
AWS.config.update({ accessKeyId: appConfig.AWS_ACCESSKEYID, secretAccessKey: appConfig.AWS_SECRETACCESSKEY });

exports.getAppConfig = function(req, res) {
    res.json({
        "pumpBaseUrl": appConfig.PUMP_BASE_URL,
        "pumpClientKey": appConfig.PUMP_CLIENT_KEY,
        "programmingEnvironmentBaseUrl": appConfig.PROGRAMMING_ENVIRONMENT_BASE_URL,
        "assessmentBasePercUrl": appConfig.ASSESSMENT_BASE_PERC_URL,
        "programmingStack": appConfig.PROGRAMMING_STACK
    });
}

exports.playLob = function(req, res) {
    LoggerUtil.setOperationName('playElement');
    var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
    var studentId = req.user.identifier;
    var lobId = decodeURIComponent(req.params.lobId);
    if (lobId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        lobId = PlayerUtil.addFedoraPrefix(lobId);
    }
    /* SV 05/02/15 - Disable Cache
    var cacheItem = NodeCacheUtil.get('PlayerVH:LOB', lobId);
    if(cacheItem && cacheItem != null && cacheItem != 'undefined') {
        console.log('Returning from cache...');
        res.send(cacheItem);
        return;
    }*/
    promise_lib.resolve()
    .then(function() {
        return getLearnerState(studentId, courseId);
    }).then(function(learnerState) {
        var lobMap = PlayerUtil.getMap(learnerState.learning_objects);
        var elementMap = PlayerUtil.getMap(learnerState.elements);
        var currentElement = {};
        if (lobMap[lobId]) {
            currentElement = getFirstElement(lobMap[lobId], lobMap, elementMap, currentElement);
        } else if (elementMap[lobId]) {
            currentElement = getParent(lobId, lobMap, currentElement);
        }
        if (!currentElement.lobId || !currentElement.elementId) {
            var currentElementId = learnerState.currentElementId;
            if (!currentElementId) {
                currentElementId = learnerState.elements[0].identifier;
            }
            if (currentElementId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
                currentElementId = PlayerUtil.addFedoraPrefix(currentElementId);
            }
            currentElement = getParent(currentElementId, lobMap, currentElement);
        }
        if (currentElement.lobId && currentElement.elementId) {
            playLearningElement(courseId, studentId, currentElement.lobId, currentElement.elementId, learnerState, req)
            .then(function(response) {
                /* SV 05/02/15 - Disable Cache
                NodeCacheUtil.set('PlayerVH:LOB', lobId, response, courseId);
                */
                res.send(response);
            }).catch(function(err) {
                res.send("");
            });
        } else {
            console.log("Error: Element not found");
            res.send(JSON.stringify({}));
        }
    });
}

exports.playElement = function(req, res) {
    LoggerUtil.setOperationName('playElement');
    var courseId = PlayerUtil.addFedoraPrefix(decodeURIComponent(req.params.courseId));
    var studentId = req.user.identifier;
    var lobId = decodeURIComponent(req.params.lobId);
    var elementId = decodeURIComponent(req.params.elementId);
    if (lobId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        lobId = PlayerUtil.addFedoraPrefix(lobId);
    }
    if (elementId.indexOf(PlayerUtil.fedoraPrefix) < 0) {
        elementId = PlayerUtil.addFedoraPrefix(elementId);
    }
    /* SV 05/02/15 - Disable Cache
    var cacheItem = NodeCacheUtil.get('PlayerVH:Element', elementId);
    if(cacheItem && cacheItem != null && cacheItem != 'undefined') {
        console.log('Returning from cache...');
        res.send(cacheItem);
        return;
    }*/
    promise_lib.resolve()
    .then(function() {
        return getLearnerState(studentId, courseId);
    }).then(function(learnerState) {
        playLearningElement(courseId, studentId, lobId, elementId, learnerState, req)
        .then(function(response) {
            /* SV 05/02/15 - Disable Cache
            NodeCacheUtil.set('PlayerVH:Element', elementId, response, courseId);
            */
            res.send(response);
        }).catch(function(err) {
            res.send("");
        });
    });
}

function getFirstElement(lob, lobMap, elementMap, currentElement) {
    if (lob.sequence && lob.sequence.length > 0) {
        for (var i=0; i<lob.sequence.length; i++) {
            var seqId = lob.sequence[i];
            if (lobMap[seqId]) {
                return getFirstElement(lobMap[seqId], lobMap, elementMap, currentElement);
            } else if (elementMap[seqId]) {
                currentElement.lobId = lob.identifier;
                currentElement.elementId = seqId;
                return currentElement;
            }
        }
    }
    return currentElement;
}

function getParent(elementId, lobMap, currentElement) {
    for (var lobId in lobMap) {
        var lob = lobMap[lobId];
        if (lob.sequence && lob.sequence.length > 0) {
            if (lob.sequence.indexOf(elementId) >= 0) {
                currentElement.lobId = lobId;
                currentElement.elementId = elementId;
                return currentElement;
            }
        }
    }
    return currentElement;
}

function playLearningElement(courseId, studentId, lobId, elementId, learnerState, req) {
    LoggerUtil.setOperationName('playElement');
    var lobMap = {};
    var elementMap = {};
    var state = 1;
    var updateStatus = true;
    var defer = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        lobMap = PlayerUtil.getMap(learnerState.learning_objects);
        elementMap = PlayerUtil.getMap(learnerState.elements);
        var lob = lobMap[lobId];
        var deferred = promise_lib.defer();
        var currentElement = elementMap[elementId];
        if (currentElement.state) {
            if (currentElement.state == 0) {
                state = 1;
            } else {
                if (currentElement.state == 1) {
                    updateStatus = false;
                }
                state = currentElement.state;
            }
        }
        currentElement.state = state;
        if (currentElement) {
            var elementType = currentElement.elementType;
            console.log('elementType: ' + elementType);
            if ([ViewHelperConstants.LEARNING_RESOURCE, ViewHelperConstants.CLASSROOM].indexOf(elementType) != -1) {
                return getLearningResource(courseId, lob, currentElement.identifier);
            } else if ([ViewHelperConstants.LEARNING_ACTIVITY, ViewHelperConstants.PRACTICE_TEST, ViewHelperConstants.EXAM].indexOf(elementType) != -1) {
                return getLearningActivity(courseId, lob, currentElement.identifier);
            } else if (elementType == ViewHelperConstants.CONTENT) {
                return getMediaContent(lob, currentElement.identifier);
            } else {
                deferred.reject('Invalid element type');
            }
        } else {
            deferred.reject('Element not found');
        }
        return deferred.promise;
    }).then(function(element) {
        console.log('Element: ' + element);
        var currentLOB = element.lob;
        if (updateStatus) {
            saveLearnerState(studentId, courseId, currentLOB.identifier, elementId, state);
        } else {
            saveLearnerState(studentId, courseId, currentLOB.identifier, elementId);
        }
        return createPlayerResponse(element, currentLOB, courseId, elementMap, learnerState, req);
    }).then(function(response) {
        defer.resolve(response);
    }).catch (function(err) {
        console.log("Error in playLearningElement(): " + err);
        defer.reject(err);
    }).done();
    return defer.promise;
};

function getSeconds(ltime) {
    var ltArray = ltime.split(':', 3);
    ltArray.reverse();
    var inSec = 0;
    for (i = 0; i < ltArray.length; i++) {
        if (isNaN(ltArray[i])) {
            inSec = 0;
            break;
        } else {
            inSec += ltArray[i] * Math.pow(60, i);
        }
    }
    return inSec;
}

function createPlayerResponse(element, lob, courseId, elementMap, learnerState, req) {
    var parentLOB;
    var course;
    var response = {};
    var categories = [];
    var studentId = req.user.identifier;
    var elementId = element.identifier;
    var learnerStateElement = elementMap[element.identifier];
    response.deployment = appConfig.DEPLOYMENT_FOR;

    var defer = promise_lib.defer();
    promise_lib.resolve()
        .then(function() {
            var deferred = promise_lib.defer();
            MongoHelper.findOne('CourseModel', {identifier: courseId}, function(err, data) {
                if(err) {
                    deferred.reject(err);
                } else {
                    course = data;
                    deferred.resolve(data);
                }
            });
            return deferred.promise;
        }).then(function() {
            response.faculty = course.faculty;
            if(response.faculty) {
                response.faculty.identifier = PlayerUtil.removeFedoraPrefix(response.faculty.identifier);
            }
            response.tutors = course.tutors;
            response.tutors.forEach(function(tutor) {
                tutor.identifier = PlayerUtil.removeFedoraPrefix(tutor.identifier);
            });
            var deferred = promise_lib.defer();
            MongoHelper.findOne('LearningObjectModel', {
                courseId: courseId,
                identifier: lob.identifier
            }, function(err, obj) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (obj) {
                        deferred.resolve(obj);
                    } else {
                        deferred.reject('LOB not found');
                    }
                }
            });
            return deferred.promise;
        }).then(function(obj) {
            parentLOB = obj;
            var deferred = promise_lib.defer();
            MongoHelper.findOne('MediaContentModel', {identifier: element.contentIdentifier}, function(err, content) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (content) {
                        deferred.resolve(content);
                    } else {
                        deferred.reject('Content object not found');
                    }
                }
            });
            return deferred.promise;
        }).then(function(content) {
            var interceptionMap = {};
            if (content.interceptions && content.interceptions.length > 0) {
                content.interceptions.forEach(function(interception) {
                    var arr = interceptionMap[interception.mediaId];
                    if (!arr) {
                        arr = [];
                    }
                    interception.contentId = PlayerUtil.removeFedoraPrefix(interception.contentId);
                    var seconds = getSeconds(interception.interceptionPoint);
                    if (seconds && seconds > 0) {
                        interception.interceptionPoint = seconds;
                        arr.push(interception);
                    }
                    interceptionMap[interception.mediaId] = arr;
                });
            }
            element.contentType = content.contentType;
            element.contentSubType = content.contentSubType;
            if (element.contentSubType == 'program') {
                element.programAnswer = content.metadata.programAnswer;
                element.programTemplate = content.metadata.programTemplate;
            }
            element.media = {};
            element.mediaList = [];
            var mainMediaUrl = element.identifier;
            for (var i = 0; i < content.media.length; i++) {
                var obj = content.media[i];
                obj.contentType = content.contentType;
                obj.contentSubType = content.contentSubType;
                obj.interceptions = interceptionMap[content.media[i].mediaId];
                if(obj.mimeType === 'application/pdfjs') {
                    var regex = /https:\/\/s3-(.*?)\.amazonaws\.com\/(.*?)\/(.*)/g;
                    var matches = regex.exec(obj.mediaUrl);
                    var region = matches[1];
                    var bucket = matches[2];
                    var key = matches[3];
                    var s3 = new AWS.S3({signatureVersion: 'v4', region: region});
                    var params = {
                        Bucket: bucket,
                        Key: key,
                        Expires: 200
                    };
                    obj.mediaUrl = s3.getSignedUrl('getObject', params);
                }
                if (obj.isMain && obj.isMain == true) {
                    mainMediaUrl = obj.mediaUrl;
                    if (learnerStateElement.event && learnerStateElement.event.eventId) {
                        //element.mediaList.push(obj);
                    } else {
                        element.media = obj;
                    }
                } else {
                    element.mediaList.push(obj);
                }
            }
            var deferred = promise_lib.defer();
            if (learnerStateElement.event) {
                setEventMedia(learnerStateElement, element, mainMediaUrl, deferred);
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        }).then(function() {
            var deferreds = [];
            if (element.media && element.media.mediaType && (element.media.mediaType == 'package' || element.media.mediaType == 'video')) {
                deferreds.push(setMediaMetadata(element.media));
            }
            if (element.mediaList && element.mediaList.length > 0) {
                for (var i=0; i<element.mediaList.length; i++) {
                    if (element.mediaList[i].mediaType && (element.mediaList[i].mediaType == 'package' || element.mediaList[i].mediaType == 'video')) {
                        deferreds.push(setMediaMetadata(element.mediaList[i]));
                    }
                }
            }
            return promise_lib.all(deferreds);
        }).then(function() {
            var deferred = promise_lib.defer();
            var ids = [];
            for (var i = 0; i < element.concepts.length; i++) {
                var concept = element.concepts[i];
                ids.push(concept.conceptIdentifier);
            }
            MongoHelper.find('ConceptModel', {identifier : {$in: ids}}).toArray(function(err, concepts) {
                if(err) {
                    deferred.reject(err);
                } else {
                    element.concepts = concepts;
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }).then(function(){
            var deferred = promise_lib.defer();
            NoteModel = mongoose.model('NoteModel');
            var noteFilter = {courseId: courseId, elementId : elementId, learnerId : studentId};
            NoteModel.findOne(noteFilter).sort({updatedOn: -1}).lean().exec(function(err, latestNote) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                    response.latestNote = latestNote;
                }
            });
            return deferred.promise;
        }).then(function() {
            response.element = element;
            response.element.tags = [];
            PlayerUtil.addTags(element, response.element);
            response.element.elementType = learnerStateElement.elementType;
            response.element.state = learnerStateElement.state;
            response.identifier = PlayerUtil.removeFedoraPrefix(element.identifier);
            response.parent = {};
            response.parent.identifier = PlayerUtil.removeFedoraPrefix(parentLOB.identifier);
            response.parent.name = parentLOB.name;
            response.parent.nodeSet = parentLOB.nodeSet;
            response.sequence = [];
            setLearnerStateValues(learnerStateElement, response);
            setMetadata(element, response);
            setInfoData(element, response)
            var isSupplementaryContent = false;
            if(learnerStateElement.category) {
                isSupplementaryContent = true;
            }
            response.typographySet = TypographySetUtil.getTypographySet(element, isSupplementaryContent);
            setSequenceValues(element, learnerState, response, elementMap);
            if(element.createdBy){
                var identifier = element.createdBy;
                MongoHelper.findOne('InstructorModel', {identifier: identifier}, function(err, instructor) {
                    if(instructor) {
                        response.instructor = instructor;
                    }
                    defer.resolve(JSON.stringify(response));
                });
            } else {
                defer.resolve(JSON.stringify(response));
            }
        }).catch (function(err) {
            console.log("Error in createPlayerResponse(): " + err);
            defer.reject(err);
        }).done();
    return defer.promise;
}

function setMediaMetadata(elementMedia) {
    var childDefer = promise_lib.defer();
    MongoHelper.findOne('MediaModel', {
        identifier: elementMedia.mediaId
    }, function(err, media) {
        if (err || !media) {
            childDefer.reject(err);
        } else {
            if (media.metadata) {
                elementMedia.posterUrl = media.metadata.posterUrl;
            }
            if (media.metadata && media.metadata.height && media.metadata.height != '') {
                if (!isNaN(media.metadata.height) && parseInt(media.metadata.height) > 0) {
                    elementMedia.height = media.metadata.height;
                }
            }
            if (media.metadata && media.metadata.width && media.metadata.width != '') {
                if (!isNaN(media.metadata.width) && parseInt(media.metadata.width) > 0) {
                    elementMedia.width = media.metadata.width;
                }
            }
            childDefer.resolve(media);
        }
    });
    return childDefer.promise;
}

function setInfoData(modelObject, responseElement) {
    if (modelObject && modelObject.metadata) {
        setResponseInfoObject(responseElement, modelObject.metadata, 'author');
        setResponseInfoObject(responseElement, modelObject.metadata, 'authorProfileURL');
        setResponseInfoObject(responseElement, modelObject.metadata, 'owner');
        setResponseInfoObject(responseElement, modelObject.metadata, 'ownerProfileURL');
        setResponseInfoObject(responseElement, modelObject.metadata, 'offeredBy');
        setResponseInfoObject(responseElement, modelObject.metadata, 'offeredByProfileURL');
        setResponseInfoObject(responseElement, modelObject.metadata, 'duration');
        var elementType = responseElement.element.elementType;
        if ([ViewHelperConstants.LEARNING_RESOURCE, ViewHelperConstants.CLASSROOM, ViewHelperConstants.CONTENT].indexOf(elementType) != -1) {
            setResponseInfoObject(responseElement, modelObject.metadata, 'difficultyLevel');
            if (ViewHelperConstants.CONTENT == elementType) {
                if (modelObject.media) {
                    if (modelObject.media.isMain && modelObject.media.mediaType == 'url') {
                        if (!responseElement.infoData) {
                            responseElement.infoData = {};
                        }
                        responseElement.infoData['source'] = modelObject.media.mediaUrl;
                    }
                }
            }
        } else if ([ViewHelperConstants.LEARNING_ACTIVITY, ViewHelperConstants.PRACTICE_TEST, ViewHelperConstants.EXAM].indexOf(elementType) != -1) {
            // setResponseInfoObject(responseElement, modelObject.metadata, 'numAttempts');
            if(modelObject.media) {
                var testInfo = JSON.parse(modelObject.media.mediaUrl);
                if(testInfo && testInfo.numAttempts) responseElement.infoData['numAttempts'] = testInfo.numAttempts;
            }
            setResponseInfoObject(responseElement, modelObject.metadata, 'proficiencyWeightage');
            if (!responseElement.infoData) {
                responseElement.infoData = {};
            }
            if (ViewHelperConstants.EXAM == elementType) {
                responseElement.infoData.elementType = 'Exam';
            } else {
                responseElement.infoData.elementType = 'Practice';
            }
        }
    }
}

function setResponseInfoObject(responseElement, metadata, property) {
    if (metadata[property] && metadata[property] != '') {
        if (!responseElement.infoData) {
            responseElement.infoData = {};
        }
        responseElement.infoData[property] = metadata[property];
    }
}

function setEventMedia(learnerStateElement, element, mainMediaUrl, deferred) {
    var eventObj = learnerStateElement.event;
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.findOne('EventModel', {identifier: eventObj.eventId}, function(err, obj) {
            if(err || !obj) {
                defer.reject('Event not found');
            } else {
                defer.resolve(obj);
            }
        });
        return defer.promise;
    }).then(function(event) {
        var defer = promise_lib.defer();
        var mediaObj = {};
        if (event.location && event.location != '') {
            mediaObj.mediaUrl = event.location;
        }
        element.name = event.name;
        mediaObj.title = event.name;
        mediaObj.mediaType = 'event';
        mediaObj.mediaId = event.identifier;
        mediaObj.mimeType = 'ilimi/event';
        mediaObj.isMain = true;
        mediaObj.action = eventObj.action
        mediaObj.lastUpdated = eventObj.lastUpdated;
        mediaObj.releasedBy = event.releasedBy;
        mediaObj.objectId = event.objectId;
        mediaObj.objectType = event.objectType;
        mediaObj.isMandatory = learnerStateElement.isMandatory;
        if(event.startDate){
            var currentDate = Date.parse(new Date())/1000;
            var startDate = Date.parse(event.startDate)/1000;
            if(currentDate < startDate) {
                mediaObj.state = ViewHelperConstants.NOTSTARTED;
            }
            if(event.endDate) {
                var endDate = Date.parse(event.endDate)/1000;
                if(currentDate > startDate && currentDate < endDate ) {
                    mediaObj.state = ViewHelperConstants.INPROGRESS;
                } else if(currentDate > startDate && currentDate > endDate) {
                    mediaObj.state = ViewHelperConstants.COMPLETE;
                }
                mediaObj.endDate = event.endDate;
            } else {
                if(currentDate > startDate) {
                    mediaObj.state = ViewHelperConstants.INPROGRESS;
                }
            }
            mediaObj.startDate = event.startDate;
        } else {
            mediaObj.state = ViewHelperConstants.INPROGRESS;
        }
        if (event.media && event.media.length > 0) {
            for (var i=0; i<event.media.length; i++) {
                element.mediaList.push(event.media[i]);
            }
        }
        defer.resolve(mediaObj);
        return defer.promise;
    }).then(function(mediaObj) {
        MongoHelper.findOne('InstructorModel', {identifier: mediaObj.releasedBy}, function(err, instructor) {
            if(instructor) {
                mediaObj.instructor = instructor;
                element.media = mediaObj;
                if (!element.media.mediaUrl) {
                    element.media.mediaUrl = mainMediaUrl;
                } else {
                    try {
                        // if JSON, replace the question paper id with concrete paper id
                        var examInfo = JSON.parse(mainMediaUrl);
                        examInfo.questionPaperId = element.media.mediaUrl;
                        element.media.mediaUrl = JSON.stringify(examInfo);
                    } catch(e) {
                        // do nothing
                    }
                }
                deferred.resolve();
            } else {
                deferred.reject('Instructor not found');
            }
        });
    });
}

function setSequenceValues(element, learnerState, response, elementMap) {
    if (learnerState.groups) {
        var elementId = element.identifier;
        var prevElementId;
        var nextElementId;
        var index = -1;
        var pathElements;
        for (var i=0; i<learnerState.groups.length; i++) {
            var subList = learnerState.groups[i];
            var idx = subList.indexOf(elementId);
            if (idx > -1) {
                if (idx > 0) {
                    prevElementId = subList[idx-1];
                }
                if (idx < subList.length-1) {
                    nextElementId = subList[idx+1];
                }
                index = i;
                pathElements = subList;
                break;
            }
        }
        if (index > -1) {
            if (!prevElementId && index > 0) {
                var prevList = learnerState.groups[index-1];
                if (prevList.length > 0) {
                    prevElementId = prevList[prevList.length-1];
                }
            }
            if (prevElementId && elementMap[prevElementId]) {
                response.prevElement = elementMap[prevElementId];
            }
            if (!nextElementId && index < learnerState.groups.length-1) {
                var nextList = learnerState.groups[index+1];
                if (nextList.length > 0) {
                    nextElementId = nextList[0];
                }
            }
            if (nextElementId && elementMap[nextElementId]) {
                response.nextElement = elementMap[nextElementId];
            }
            if (pathElements && pathElements.length > 0) {
                response.path = [];
                pathElements.forEach(function(eleId) {
                    if (elementMap[eleId]) {
                        response.path.push(elementMap[eleId]);
                    }
                });
            }
        }
    }
}

function getAlternateMediaDefer(elementMedia) {
    var childDefer = promise_lib.defer();
    MongoHelper.findOne('MediaModel', {
        identifier: elementMedia.mediaId
    }, function(err, media) {
        if (err) {
            childDefer.reject(err);
        } else {
            elementMedia.author = media.metadata.author;
            elementMedia.owner = media.metadata.owner;
            childDefer.resolve(media);
        }
    });
    return childDefer.promise;
}

function setLearnerStateValues(element, child) {
    if (element) {
        child.category = element.category;
        child.status = element.status;
        var progress = getProgressPercent(element);
        child.progress = progress;
        if (element.learningTime && element.learningTime > 0) {
            child.learningTime = getLearningTime(element.learningTime);
        }
    }
}

function getLearningTime(totalSec) {
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var learningTime = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes); 
    return learningTime;
}

function getProgressPercent(element) {
    var progress = 0;
    if (element.elements_count && element.elements_count.length > 0) {
        var total = 0;
        var complete = 0;
        element.elements_count.forEach(function(count) {
            if (count.total && !isNaN(count.total)) {
                total = total + count.total;
            }
            if (count.complete && !isNaN(count.complete)) {
                complete = complete + count.complete;
            }
        });
        if (total > 0) {
            progress = (complete*100)/total;
        }
    } else {
        var status = element.status;
        if (status && status != '') {
            if (status.toLowerCase() == 'complete') {
                progress = 100;
            } else if (status.toLowerCase() == 'in progress') {
                progress = 50;
            }
        }
    }
    return progress;
}

function setMetadata(modelObject, object) {
    if(modelObject) {
        object.difficultyLevel = modelObject.metadata.difficultyLevel;
        if(modelObject.metadata.author) {
            object.author = modelObject.metadata.author;
        }
        if(modelObject.metadata.owner) {
            object.owner = modelObject.metadata.owner;
        }
        if (modelObject.metadata.currentStatus) {
            object.currentStatus = modelObject.metadata.currentStatus;
        }
    }
}

function saveLearnerState(studentId, courseId, lobId, elementId, state) {
    if (state) {
        MongoHelper.update(
            'LearnerStateModel',
            {student_id: studentId, courseId: courseId, "elements.identifier": elementId},
            {$set: {"elements.$.state" : state}},
            function(err, obj) {
                if (err) {
                    console.log("Error updating learning element state: " + err);
                } else {
                    console.log("Learning Element State updated");
                }
            }
        );
    }
}

/*function saveLearnerState(studentId, courseId, lobId, elementId, state) {
    var MWServiceProvider = require('../../commons/MWServiceProvider');
    var req = new Object();
    req.LEARNER_ID = studentId;
    req.COURSE_ID = courseId;
    req.LEARNING_ELEMENT_ID = elementId;
    MWServiceProvider.callServiceStandard("learnerService", "StartAttempt", req, function(err, data, response) {
        console.log("Request:",JSON.stringify(req));
        if (err) {
            console.log("Error in Response from MW StartAttempt: " + err);
        } else {
            console.log("Response from MW StartAttempt: " + data);
            if (state) {
                MongoHelper.update('LearnerStateModel', {student_id: studentId, courseId: courseId, "elements.identifier": elementId}, 
                    {$set: {"elements.$.state" : state}}, function(err, obj) {
                    if (err) {
                        console.log("Error updating learning element state: " + err);
                    } else {
                        console.log("Learning Element State updated");
                    }
                });
            }
        }
    });
}*/

function getLearningResource(courseId, lob, lrId, defer) {
    if (!defer) {
        defer = promise_lib.defer();
    }
    MongoHelper.findOne('LearningResourceModel', {
        lobId: lob.identifier,
        identifier: lrId
    }, function(err, lr) {
        console.log('lr: ' + lr);
        if (err) {
            defer.reject(err);
        } else {
            lr.lob = lob;
            defer.resolve(lr);
        }
    });
    return defer.promise;
}

function getLearningActivity(courseId, lob, lrId, defer) {
    if (!defer) {
        defer = promise_lib.defer();
    }
    MongoHelper.findOne('LearningActivityModel', {
        lobId: lob.identifier,
        identifier: lrId
    }, function(err, lr) {
        if (err) {
            defer.reject(err);
        } else {
            lr.lob = lob;
            defer.resolve(lr);
        }
    });
    return defer.promise;
}

function getMediaContent(lob, contentId, defer) {
    if (!defer) {
        defer = promise_lib.defer();
    }
    MongoHelper.findOne('MediaContentModel', {
        identifier: contentId
    }, function(err, content) {
        if (err) {
            defer.reject(err);
        } else {
            content.lob = lob;
            content.contentIdentifier = contentId;
            defer.resolve(content);
        }
    });
    return defer.promise;
}

function getLearnerState(studentId, courseId) {
    var defer = promise_lib.defer();
    MongoHelper.findOne('LearnerStateModel', {
        student_id: studentId,
        courseId: courseId
    }, function(err, learnerState) {
        if (err) {
            defer.reject(err);
        } else {
            if (learnerState) {
                defer.resolve(learnerState);
            } else {
                defer.reject('Learning Object not found in learner path');
            }
        }
    });
    return defer.promise;
}

exports.getClassRooms = function(req, res){
    var courseId = req.body.courseId;
    var userId = req.body.userId;
    var response = { currentClassRooms : [], upcomingClassRooms : [], completedClassRooms : []};
    var learnerStatesList = [];
    var eventIds = [];
    var eventMap = {};
    var elementMap = {};
    promise_lib.resolve()
        .then(function() {
            return getLearnerState(userId, courseId);
        }).then(function(state) {
            state.elements.forEach(function(item){
                if(item.elementType == ViewHelperConstants.CLASSROOM && item.event){
                    learnerStatesList.push(item.identifier);
                    eventIds.push(item.event.eventId);
                    elementMap[item.identifier] = item;
                }
            });
        }).then(function() {
            var deferred = promise_lib.defer();
            if (eventIds.length > 0) {
                MongoHelper.find('EventModel', {identifier: {$in: eventIds}}).toArray(function(err, events) {
                    events.forEach(function(ev) {
                        eventMap[ev.objectId] = ev;
                    });
                    deferred.resolve(eventMap);
                });
            } else {
                deferred.resolve(eventMap);
            }
            return deferred.promise;
        }).then(function(){
            console.log('learnerStatesList: ' + learnerStatesList.length);
            var deferred = promise_lib.defer();
            if( learnerStatesList && learnerStatesList.length > 0 ){
                MongoHelper.find('LearningResourceModel', { 'identifier' : { $in: learnerStatesList}}).toArray(function(err, LearningResources) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(LearningResources);
                    }
                });
            }else{
                deferred.resolve([]);
            }
            return deferred.promise;
        }).then(function(LearningResources){
            var deferreds = [];
            if( learnerStatesList && learnerStatesList.length > 0 ){
                LearningResources.forEach(function(item){
                    var deferred = promise_lib.defer();
                    deferreds.push(deferred.promise);
                    var identifier = item.createdBy;
                    if(identifier){
                        MongoHelper.findOne('InstructorModel', {identifier: identifier}, function(err, instructor) {
                            if(instructor) {
                                item.createrName = instructor.name;
                            }
                            deferred.resolve(item);
                        });
                    }
                });
             }
             return promise_lib.all(deferreds);
        }).then(function(values){
            values.forEach(function(lr){
                setClassroomsResponse(response, lr, eventMap, elementMap);
            });
            res.send(JSON.stringify(response));
        }).
        catch (function(err) {
        console.log("Error: " + err);
        res.send("");
    }).done();
};

function setClassroomsResponse(response, lr, eventMap, elementMap) {
    var eventObj = eventMap[lr.identifier];
    if (eventObj) {
        var startDate = Date.parse(eventObj.startDate)/1000;
        lr.startDate = eventObj.startDate;
        lr.endDate = eventObj.endDate;
        lr.event = elementMap[lr.identifier].event;
        if(eventObj.endDate){
            var endDate = Date.parse(eventObj.endDate)/1000;
        }else {
            var endDate = Date.parse(eventObj.startDate)/1000 + lr.metadata.duration;
        }
        var currentDate = Date.parse(new Date())/1000;
           if(currentDate < startDate){
                lr.status = ViewHelperConstants.NOTSTARTEDLABEL;
                response.upcomingClassRooms.push(lr);
           } else if(currentDate > startDate && currentDate < endDate ){
                lr.status = ViewHelperConstants.INPROGRESSLABEL;
                response.currentClassRooms.push(lr);
           }else if(currentDate >= endDate){
                lr.status = ViewHelperConstants.COMPLETELABEL;
                response.completedClassRooms.push(lr);
           }
    }
}

