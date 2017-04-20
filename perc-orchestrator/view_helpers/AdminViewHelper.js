/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for for admin functionalities.
 *
 * @author Santhosh
 */
var MWServiceProvider = require('../commons/MWServiceProvider');
var mongoose = require('mongoose');
var promise_lib = require('when');
var validator = require('validator');
var coachingVH = require('../coaching/view_helpers/CoachingViewHelper');
var pumpUtil = require('../coaching/util/PumpIOUtil');
var pumpHelper = require('../coaching/util/PumpHelper');
var pumpConfig = require('../coaching/config/pumpConfig.json');
var S = require('string');
var fs = require('fs');
var gmailWrapper = require('../interactions/wrappers/gmail/gmailWrapper')

exports.checkInboxTokens = function(req, res) {
    var inboxId = req.body.inboxEmailId;
    var tokens = InteractionCache.getAccessToken(inboxId);
    var resp = {hasTokens: false, tokensWorking: false};
    if(tokens && typeof tokens != 'undefined' && tokens.refresh_token) {
        resp.hasTokens = true;
        gmailWrapper.getUserInfo(inboxId).then(function() {
            resp.tokensWorking = true;
        }).catch(function(err) {console.log('checkInboxTokens(). Error - ' + err);}).done(function() {
            res.json(resp);
        });
    } else {
        res.json(resp);
    }

}

exports.setCourseInbox = function(req, res) {
    var courseId = req.body.courseId;
    var inboxEmailId = req.body.inboxEmailId;
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.update('CourseModel', {identifier: courseId}, {$set: {inboxEmailId: inboxEmailId}}, function(err, count) {
            defer.resolve();
        })
        return defer.promise;
    })
    .then(function() {
        var r = new Object();
        r.USER_EMAIL_ID = req.user.identifier;
        r.COURSE = {
            courseId: courseId,
            inboxEmailId: inboxEmailId
        };
        var defer = promise_lib.defer();
        MWServiceProvider.callServiceStandard("interactionService", 'PublishCourse', r, function(err, data, response) {
            if (err) {
                defer.reject('Error in Response from Interactions MW PublishCourse ' + err);
            } else {
                defer.resolve();
            }
        });
        return defer.promise;
    })
    .then(function() {
        res.send('OK');
    })
    .catch(function(err) {
        res.send('Error updating course inbox ' + err);
    }).done();
}

exports.prepareCourseCommunity = function(req, res) {
    var courseId = req.body.courseId;
    exports.addCommunityToCourse(courseId).then(function(community) {
        res.json(community);
    }).catch(function(err) {
        console.log('Error', err);
        res.send('Course community create/update failed - ' + err);
    });
}

exports.addCommunityToCourse = function(courseId, logger) {
    if(!logger) {
        logger = LoggerUtil.getConsoleLogger();
    }
    logger.info('AdminViewHelper:addCommunityToCourse() - Add community user and groups to the course ' + courseId);
    var deferred = promise_lib.defer();
    var community;
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.findOne('CourseModel', {identifier: courseId}, {'community': 1, name: 1, identifier: 1}, function(err, course) {
            if(err || !course) defer.reject('Course not found');
            else defer.resolve(course);
        });
        return defer.promise;
    })
    .then(function(course) {
        if(!course.community || !course.community.userId) {
            logger.info('AdminViewHelper:addCommunityToCourse() - Creating course community user and groups');
            return createCourseCommunity(course);
        }
        return course.community;
    })
    .then(function(communityObj) {
        logger.info('AdminViewHelper:addCommunityToCourse() - Course community user and groups created' + JSON.stringify(communityObj));
        community = communityObj;
        var defer = promise_lib.defer();
        MongoHelper.find('InstructorCoursesModel', {role: 'coach', courseId: courseId, identifier:{$nin: community.coachGroup.groupMembers}}, {identifier: 1}).toArray(function(err, coaches) {
            defer.resolve(coaches);
        });
        return defer.promise;
    })
    .then(function(coaches) {
        if(coaches && coaches.length > 0) {
            logger.info('AdminViewHelper:addCommunityToCourse() - Adding coaches to community group ' + coaches.length);
            return addMembersToGroup(coaches, community.userId, community.coachGroup.groupId);
        }
        return [];
    })
    .then(function(members) {
        if(members) {
            community.coachGroup.groupMembers.push.apply(community.coachGroup.groupMembers, members);
        }
        var defer = promise_lib.defer();
        MongoHelper.find('InstructorCoursesModel', {role: 'faculty', courseId: courseId, identifier:{$nin: community.facultyGroup.groupMembers}}, {identifier: 1}).toArray(function(err, faculties) {
            defer.resolve(faculties);
        });
        return defer.promise;
    })
    .then(function(faculties) {
        if(faculties && faculties.length > 0) {
            logger.info('AdminViewHelper:addCommunityToCourse() - Adding faculty to community group ' + faculties.length);
            return addMembersToGroup(faculties, community.userId, community.facultyGroup.groupId);
        }
        return [];
    })
    .then(function(members) {
        if(members) {
            community.facultyGroup.groupMembers.push.apply(community.facultyGroup.groupMembers, members);
        }
        var defer = promise_lib.defer();
        MongoHelper.update('CourseModel', {identifier: courseId}, {$set: {'community': community}}, function(err, obj) {
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        logger.info('AdminViewHelper:addCommunityToCourse() - Course community created/updated');
        deferred.resolve(community);
    })
    .catch(function(err) {
        logger.error('AdminViewHelper:addCommunityToCourse() - Course community created/updated failed - ' + err);
        deferred.reject(err);
    }).done();
    return deferred.promise;
}

function addMembersToGroup(members, userId, groupId) {
    var promises = [];
    members.forEach(function(member) {
        promises.push(addMemberToGroup(userId, groupId, member.identifier));
    });
    return promise_lib.all(promises);
}

function addMemberToGroup(userId, groupId, memberId) {
    var defer = promise_lib.defer();
    coachingVH.addMemberToGroup(userId, groupId, memberId)
    .then(function() {
        defer.resolve(memberId);
    }).catch(function() {
        defer.resolve();
    });
    return defer.promise;
}

function createCourseCommunity(course) {
    var community = {
        userId: 'course' + course.identifier.replace('info:fedora/learning:', ''),
        coachGroup: {
            groupId: undefined,
            groupMembers: []
        },
        facultyGroup: {
            groupId: undefined,
            groupMembers: []
        }
    };
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        pumpUtil.createUser(community.userId, 'ilimi123', 'Course Admin', '', function(err, data) {
            console.log('Create User', data);
            defer.resolve(data);
        });
        return defer.promise;
    })
    .then(function() {
        var defer = promise_lib.defer();
        var context = {
            "objectType": "context",
            "groupName": 'Faculty Group',
            "courseId": course.identifier,
            "listType": "system"
        }
        pumpUtil.createList(community.userId, 'Faculty Group', 'All faculties for this course', context, function(err, data) {
            if(data) {
                community.facultyGroup.groupId = pumpHelper.getListId(data.object.id);
            }
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        var defer = promise_lib.defer();
        var context = {
            "objectType": "context",
            "groupName": 'Coaches Group',
            "courseId": course.identifier,
            "listType": "system"
        }
        pumpUtil.createList(community.userId, 'Coaches Group', 'All coaches for this course', context, function(err, data) {
            if(data) {
                community.coachGroup.groupId = pumpHelper.getListId(data.object.id);
            }
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.update('CourseModel', {identifier: course.identifier}, {$set: {'community': community}}, function(err, count) {
            console.log('Course community updated ', count);
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        deferred.resolve(community);
    })
    .catch(function(err) {
        console.log('Error creating community - ', err);
        deferred.reject(err);
    }).done();
    return deferred.promise;
}

exports.updateOrganization = function(req, res) {
    var file = req.files.file;
    var body = req.body;
    promise_lib.resolve()
    .then(function() {
        return createOrganizationFolder(body.id);
    })
    .then(function(orgFolder) {
        var deferred = promise_lib.defer();
        if(file) {
            fs.readFile(file.path, function (err, data) {
                fs.writeFile('public' + orgFolder + file.name, data, function (err) {
                    if(err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(orgFolder + file.name);
                    }
                });
            });
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    })
    .catch(function(err) {
        console.log("Error while uploading file:",err);
    })
    .done(function(imagePath) {
        if(imagePath) req.body.image = imagePath;
        exports.upsertOrganization(req, res);
    });

}

function createOrganizationFolder(orgId) {
    var deferred = promise_lib.defer();
    var orgFolder = "public/uploads/organization/";
    if (!fs.existsSync(orgFolder)) {
        fs.mkdirSync(orgFolder);
    }
    if (!fs.existsSync(orgFolder + orgId)) {
        fs.mkdirSync(orgFolder + orgId);
    }
    deferred.resolve('/uploads/organization/' + orgId + "/");
    return deferred.promise;
}

exports.upsertOrganization = function(req, res) {
    var org = req.body;
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.findOne('Organization', {identifier: org.id}, function(err, obj) {
            defer.resolve(obj);
        });
        return defer.promise;
    })
    .then(function(orgObj) {
        var defer = promise_lib.defer();
        if(orgObj) {
            var options = {};
            if(org.name) {
                options.name = org.name;
            }
            if(org.description) {
                options.description = org.description;
            }
            if(org.image) {
                options.image = org.image;
            }
            MongoHelper.update('Organization', {identifier: org.id}, {$set: options}, function(err, count) {
                defer.resolve(org);
            });
        } else {
            Organization = mongoose.model('Organization');
            var organization = new Organization();
            organization.identifier = org.id;
            organization.description = org.description;
            organization.image = org.image;
            organization.name = org.name;
            organization.save(function(err, obj) {
                defer.resolve(obj);
            })
        }
        return defer.promise;
    })
    .then(function(orgObj) {
        var defer = promise_lib.defer();
        pumpUtil.getUser(orgObj.identifier, function(err, data) {
            if (err || data.error) {
                console.log('Organization does not exist in pump - create');
                // User doesnot exist in pump. Create one...
                pumpUtil.createUser(orgObj.identifier, 'Il1m1DOT1n', orgObj.name, orgObj.image, function(err, data) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve();
                    }
                });
            } else {
                console.log('Organization exists in pump. Update profile...');
                pumpUtil.updateUserProfile(orgObj.identifier, orgObj.name, orgObj.image, function(err, data) {
                    if (err) {
                        defer.reject(err);
                    } else {
                        defer.resolve();
                    }
                });
            }
        });
        return defer.promise;
    })
    .then(function() {
        res.json({status: 'Organization created/updated', error: false});
    })
    .catch(function(err) {
        console.log('AdminViewHelper:upsertOrganization() - Error ', err);
        res.json({status: err, error: true});
    })
}

exports.getOrganization = function(req, res) {
    MongoHelper.findOne('Organization', {identifier: req.params.id}, function(err, org) {
        if(err || org == null) {
            res.json({error: true, status: 'Organization not found'});
        } else {
            res.json(org);
        }
    });
}
