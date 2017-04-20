/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for User
 *
 * @author ravitejagarlapati
 */
var MWServiceProvider = require('../commons/MWServiceProvider');
var mongoose = require('mongoose');
var errorModule = require('./ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var UserImportUtil = require('./UserImportUtil');
var pumpUtil = require('../coaching/util/PumpIOUtil');
var randToken =require("rand-token");
var emailTemplates = require("../notifications/EmailTemplates");
var GitlabHelper = require('../commons/GitlabHelper');
// TODO remove this
exports.defaultUserId = "1";


exports.saveUser = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    // var userModel = new UserModel();
    var body = req.body;

    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
            identifier: body.identifier
        }]))
        .then(function(userModel) {
            if (userModel == null) {
                userModel = new UserModel();
                userModel.identifier = userModel._id;

            }
            // console.log("User in DB: " + userModel + " ");
            // Populate model to be saved to MongoDB
            for (var k in body) {
                if (k != "__v" && k != "_id") {
                    userModel[k] = body[k];
                }
            }

            if (userModel.local !== undefined) {
                userModel.local.password = userModel.generateHash(userModel.local.password);
            }

            userModel.is_deleted = false;
            var deferred = promise_lib.defer();
            userModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        })
        .done(function(user) {
            if (errors.length > 0) {
                console.log('failed to save user', errors);
            } else {
                res.send(user);
            }
        });

};

exports.upsertUser = function(userData, role, logger) {
    var defer = promise_lib.defer();
    var isNew = false;
    UserModel = mongoose.model('UserModel');
    var userModel;
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{'uniqueId': userData.uniqueId}]))
    .then(function(userModelObj) {
        userModel = userModelObj;
        delete userData.metadata.identifier;
        delete userData.metadata.password;
        if (userModel == null) {
            logger.debug('UserViewHelper:upsertUser() - User does not exist. Create - ' + userData.identifier);
            isNew = true;
            userModel = new UserModel();
            userModel.identifier = userData.identifier;
            userModel.inboxEmailId = userData.inboxEmailId;
            userModel.roles = [role];
            userModel.metadata = {};
        } else {
            logger.debug('UserViewHelper:upsertUser() - User exists. Update - ' + userModel.identifier);
            delete userData.identifier;
            delete userData.inboxEmailId;
            if(!userModel.roles) userModel.roles = [];
            if (userModel.roles.indexOf(role) == -1) {
                userModel.roles.push(role);
            }
            if(!userModel.metadata) userModel.metadata = {};
        }
        for (var k in userData) {
            if (k != "__v" && k != "_id" && k != 'identifier' && k != 'inboxEmailId' && k != 'metadata') {
                userModel[k] = userData[k];
            }
        }

        for (var k in userData.metadata) {
            userModel.metadata[k] = userData.metadata[k];
        }
        userModel.markModified('metadata');
        userModel.displayName = userModel.name.givenName;
        if (userModel.name.middleName && userModel.name.middleName != '') {
            userModel.displayName += ' ' + userModel.name.middleName;
        }
        if (userModel.name.familyName && userModel.name.familyName != '') {
            userModel.displayName += ' ' + userModel.name.familyName;
        }

        if (userModel.local !== undefined) {
            userModel.local.password = userModel.generateHash(userModel.local.password);
        }
        userModel.is_deleted = false;
    })
    // .then(function() {
    //     logger.debug('UserViewHelper:upsertUser() - Create user in gitlab - ' + userModel.identifier);
    //     var deferred = promise_lib.defer();
    //     GitlabHelper.createUser(userModel.inboxEmailId, userData.local.password, userModel.identifier, userModel.displayName, function(data) {
    //         if(null == data) {
    //             deferred.reject('Error creating user in gitlab');
    //         } else {
    //             if(data.id) {
    //                 userModel.gitId = data.id;
    //             }
    //             deferred.resolve();
    //         }
    //     })
    //     return deferred.promise;
    // })
    .then(function() {
        // Create user in pump
        var deferred = promise_lib.defer();
        pumpUtil.getUser(userModel.identifier, function(err, data) {
            if (err || data.error) {
                logger.debug('UserViewHelper:upsertUser() - User does not exist in pump. Create - ' + userModel.identifier);
                pumpUtil.createUser(userModel.identifier, userData.local.password, userModel.displayName, userModel.metadata.image, function(err, data) {
                    if (err) {
                        deferred.reject('Unable to create user in pump - ' + err);
                    } else {
                        deferred.resolve();
                    }
                });
            } else {
                logger.debug('UserViewHelper:upsertUser() - User exists in pump. Update - ' + userModel.identifier);
                pumpUtil.updateUserProfile(userModel.identifier, userModel.displayName, userModel.metadata.image, function(err, data) {
                    if (err) {
                        deferred.reject('Unable to update user in pump - ' + err);
                    } else {
                        deferred.resolve();
                    }
                });
            }
        });
        return deferred.promise;
    })
    .then(function() {
        logger.debug('UserViewHelper:upsertUser() - Save user in mongo - ' + userModel.identifier);
        var deferred = promise_lib.defer();
        userModel.save(function(err, object) {
            if (err) {
                deferred.reject('Error in saving user in mongo - ' + err);
            } else {
                deferred.resolve(object);
            }
        });
        return deferred.promise;
    })
    .then(function(user) {
        logger.debug('UserViewHelper:upsertUser() - User imported successfully - ' + user.identifier);
        var saveType = (isNew) ? UserImportUtil.INSERT : UserImportUtil.UPDATE;
        defer.resolve({'saveType': saveType, 'user': user});
    })
    .catch(function(err) {
        logger.error('UserViewHelper:upsertUser() - User imported failed for ' + userModel.identifier + '. Error ' + err);
        defer.reject(err);
    })
    .done();
    return defer.promise;
}

exports.bulkUpdateLearnerInfo = function(userIds, logger) {

    logger.info('UserViewHelper:bulkUpdateLearnerInfo() - Update user profiles in MW - ' + userIds.length);
    var defer = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MongoHelper.find('UserModel', {identifier: {$in: userIds}}).toArray(function(err, users) {
            deferred.resolve(users);
        });
        return deferred.promise;
    })
    .then(function(users) {
        if(null != users && users.length > 0) {
            var learners = [];
            users.forEach(function(user) {
                var learner = {learnerId: user.identifier, metadata: []};
                for(k in user.metadata) {
                    if(user.metadata[k] instanceof Date) {
                        learner.metadata.push({propertyName: k, dateValue: user.metadata[k].getTime()});
                    } else {
                        learner.metadata.push({propertyName: k, propertyValue: user.metadata[k]});
                    }
                }
                learner.metadata.push({propertyName: 'name', propertyValue: user.displayName});
                learner.metadata.push({propertyName: 'uniqueId', propertyValue: user.uniqueId});
                learners.push(learner);
            });
            var req = new Object();
            req.LEARNERS = {"learners": learners};
            var deferred = promise_lib.defer();
            MWServiceProvider.callServiceStandard("learnerService", 'BulkUpdateLearnerProfiles', req, function(err, data, response) {
                if (err) {
                    deferred.reject('Error in Response from MW BulkUpdateLearnerProfiles ' + err);
                } else {
                    var resp = JSON.stringify(data, null, 4);
                    if(resp.responseValueObjects && resp.responseValueObjects.STATUS) {
                        if(resp.responseValueObjects.STATUS.statusType == 'ERROR') {
                            deferred.reject('Error in Response from MW BulkUpdateLearnerProfiles - ' + resp.responseValueObjects.STATUS.statusMessage);
                        } else {
                            deferred.resolve();
                        }
                    } else {
                        deferred.resolve();
                    }
                }
            });
            return deferred.promise;
        }
    })
    .then(function() {
        logger.info('UserViewHelper:bulkUpdateLearnerInfo() - User profiles updated in MW successfully');
        defer.resolve();
    })
    .catch(function(err) {
        logger.error('UserViewHelper:bulkUpdateLearnerInfo() - User profiles updated failed in MW - ' + err);
        defer.reject(err);
    }).done();
    return defer.promise;
}

function updateLearnerInfo(user, logger) {
    if(!logger) {
        logger = LoggerUtil.getConsoleLogger();
    }
    logger.debug('UserViewHelper:updateLearnerInfo() - Update user in MW - ' + user.identifier);
    var req = new Object();
    req.LEARNER_ID = user.identifier;
    var items = [];
    for(k in user.metadata) {
        if(user.metadata[k] instanceof Date) {
            items.push({propertyName: k, dateValue: user.metadata[k].getTime()});
        } else {
            items.push({propertyName: k, propertyValue: user.metadata[k]});
        }
    }
    items.push({propertyName: 'name', propertyValue: user.displayName});
    items.push({propertyName: 'uniqueId', propertyValue: user.uniqueId});
    req.METADATA_LIST = {"valueObjectList": items};
    var deferred = promise_lib.defer();
    MWServiceProvider.callServiceStandard("learnerService", 'UpdateLearnerProfile', req, function(err, data, response) {
        if (err) {
            deferred.reject('Error in Response from MW UpdateLearnerProfile ' + err);
        } else {
            var resp = JSON.stringify(data, null, 4);
            if(resp.responseValueObjects && resp.responseValueObjects.STATUS) {
                if(resp.responseValueObjects.STATUS.statusType == 'ERROR') {
                    deferred.reject('Error Saving User profile - ' + resp.responseValueObjects.STATUS.statusMessage);
                } else {
                    deferred.resolve();
                }
            } else {
                deferred.resolve();
            }
        }
    });
    return deferred.promise;
}

exports.updateLearnerInfo = updateLearnerInfo;

exports.deleteUser = function(identifier, isRemove) {
    var deferred = promise_lib.defer();
    var errors = [];
    var result = {};
    UserModel = mongoose.model('UserModel');
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
        'identifier': identifier
    }]))
    .then(function(user) {
        var deferred = promise_lib.defer();
        if (user) {
            if(isRemove) {
                user.remove();
                result.saveType = UserImportUtil.DELETE;
                deferred.resolve();
            } else {
                if (user.is_deleted) {
                    deferred.reject('record already deleted');
                } else {
                    result.saveType = UserImportUtil.DELETE;
                    user.is_deleted = true;
                    user.save(function(err, user) {
                        if (err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve();
                        }
                    });
                }
            }
        } else {
            deferred.reject('record not found.');
        }
        return deferred.promise;
    })
    .catch(function(err) {
        console.log("Error:", err);
        deferred.reject(err);
    })
    .done(function() {
        deferred.resolve(result);
    });
    return deferred.promise;
}

exports.saveNoteFilter = function(body, callback) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    // var userModel = new UserModel();
    // var body = req.body;

    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
            identifier: body.userId
        }]))
        .then(function(userModel) {
            // TODO remote this. Don't have to create user if not exists
            if (userModel == null) {
                userModel = new UserModel();
                userModel.identifier = userModel._id;
            }

            if (!userModel.noteSettings) {
                userModel.noteSettings = {};
            }
            userModel.noteSettings.noteFilter = body.noteFilter;

            var deferred = promise_lib.defer();
            userModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        })
        .done(function(user) {
            if (errors.length > 0) {
                console.log('failed to save user', errors);
                callback(errors);
            } else {
                callback(null, user);
            }
        });

};

exports.findById = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
            identifier: req.params.id
        }]))
        .done(function(user) {
            if (errors.length > 0) {
                console.log('failed to get user', errors);
            } else {
                delete user.local.password;
                res.send(user);
            }
        });
};

exports.getUser = function(id, callback) {
    LoggerUtil.setOperationName('getUser');
    var errors = [];
    UserModel = mongoose.model('UserModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
            identifier: id
        }]))
        .done(function(user) {
            if (errors.length > 0) {
                console.log('failed to get user', errors);
                callback(errors);
            } else {
                delete user.local.password;
                callback(null, user);
            }
        });
};

exports.delete = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.remove, UserModel, [{
            identifier: req.params.id
        }]))
        .done(function() {
            if (errors.length > 0) {
                console.log('failed to delete user', errors);
            } else {
                res.send();
            }
        });
};

exports.findAll = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.find, UserModel, [{}]))
        .done(function(users) {
            if (errors.length > 0) {
                console.log('failed to get user', errors);
            } else {
                users.forEach(function(user) {
                    delete user.local.password;
                });
                res.send(users);
            }
        });
};

exports.addRoleToUsers = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    RoleModel = mongoose.model('RoleModel');
    var body = req.body;
    promise_lib.resolve()
        .then(function() {
            var defer = promise_lib.defer();
            if (body.users.length > 0) {
                UserModel.find({
                    identifier: {
                        $in: body.users
                    }
                }).exec(function(err, users) {
                    if (err) {
                        defer.reject('error fetching users:' + err);
                    } else {
                        if (users.length == body.users.length) {
                            defer.resolve(users);
                        } else {
                            defer.resolve('Invalid user identifiers');
                        }
                    }
                });
            } else {
                defer.reject('empty users array');
            }
            return defer.promise;
        })
        .then(function(users) {
            var promises = [];
            users.forEach(function(user) {
                promises.push(exports.addRoleToUser(user, body.role));
            });
            return promise_lib.all(promises);
        })
        .catch(function(err) {
            if (err) errors = err;
        })
        .done(function() {
            if (errors.length > 0) {
                console.log('Error add role to users:', errors);
                res.send(errors);
            } else {
                res.send('OK');
            }
        });

}


exports.removeRoleFromUsers = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    RoleModel = mongoose.model('RoleModel');
    var body = req.body;
    promise_lib.resolve()
        .then(function() {
            var defer = promise_lib.defer();
            if (body.users.length > 0) {
                UserModel.find({
                    identifier: {
                        $in: body.users
                    }
                }).exec(function(err, users) {
                    if (err) {
                        defer.reject('error fetching users:' + err);
                    } else {
                        if (users.length == body.users.length) {
                            defer.resolve(users);
                        } else {
                            defer.resolve('Invalid user identifiers');
                        }
                    }
                });
            } else {
                defer.reject('empty users array');
            }
            return defer.promise;
        })
        .then(function(users) {
            var promises = [];
            users.forEach(function(user) {
                promises.push(removeRoleFromUser(user, body.role));
            });
            return promise_lib.all(promises);
        })
        .catch(function(err) {
            if (err) errors = err;
        })
        .done(function() {
            if (errors.length > 0) {
                console.log('Error add role to users:', errors);
                res.send(errors);
            } else {
                res.send('OK');
            }
        });
};

exports.addRoleToUser = function(user, role) {
    var defer = promise_lib.defer();
    if (user.roles.indexOf(role) > -1) {
        // Role already exists - resolve
        defer.resolve(user);
    } else {
        user.roles.push(role);
        user.markModified('roles');
        user.save(function(err, obj) {
            if (err) {
                defer.reject('failed to save user:' + user.identifier);
            } else {
                defer.resolve(obj);
            }
        });
    }
    return defer.promise;
}

function removeRoleFromUser(user, role) {
    var defer = promise_lib.defer();
    if (user.roles.indexOf(role) > -1) {
        var index = user.roles.indexOf(role);
        user.roles.splice(index, 1);
        user.markModified('roles');
        user.save(function(err, obj) {
            if (err) {
                defer.reject('failed to save user:' + user.identifier);
            } else {
                defer.resolve();
            }
        })
    } else {
        defer.reject('role not exist to remove from user:' + user.identifier);
    }
    return defer.promise;
}

exports.findByRole = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    var role = req.params.role;
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.find, UserModel, [{
            roles: role
        }]))
        .done(function(users) {
            if (errors.length > 0) {
                console.log('failed to get user', errors);
            } else {
                users.forEach(function(user) {
                    delete user.local.password;
                });
                res.send(users);
            }
        });
}

/**
 * Start of utility functions to bulk create users for performance engineering exercise.
 */

var learnerEnrollmentHelper = require('./player/LearnerEnrollmentHelper');
require('date-format-lite');

exports.createPerfData = function(req, res) {
    var start = 1;
    var courseId = 'info:fedora/learning:7924';
    var packageId = 'info:fedora/learning:7575';
    var j = parseInt(start) + 1;
    var end = parseInt(start) + 5000;
    var state;
    var now = new Date();

    promise_lib.resolve()
        .then(function() {
            return createUser(start);
        }).then(function() {
            var defer = promise_lib.defer();
            learnerEnrollmentHelper.createEnrollments('user' + start, courseId, packageId, defer);
            return defer.promise;
        }).then(function(basePath) {
            console.log('first enrolment created');
            state = basePath;
            promise_lib.resolve()
                .then(function() {
                    var deferreds = [];
                    for (var i = j; i < end; i++) {
                        deferreds.push(createUser(i));
                    }
                    return promise_lib.all(deferreds);
                }).then(function(values) {
                    values.forEach(function(value) {
                        createEnrollments(state, value, courseId, packageId, now);
                    });
                }).catch(function() {

                })
        })
    res.send('Done');
};

function createUser(i) {
    var body = {};
    body.identifier = 'user' + i;
    body.displayName = 'user' + i;
    body.local = {};
    body.local.email = 'user' + i;
    body.local.password = 'user' + i;
    var defer = promise_lib.defer();
    UserModel = mongoose.model('UserModel');
    StudentModel = mongoose.model('StudentModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
            identifier: body.identifier
        }]))
        .then(function(userModel) {
            if (userModel == null) {
                userModel = new UserModel();
                userModel.identifier = body.identifier;
            }
            for (var k in body) {
                if (k != "__v" && k != "_id") {
                    userModel[k] = body[k];
                }
            }
            if (userModel.local !== undefined) {
                userModel.local.password = userModel.generateHash(userModel.local.password);
            }
            var deferred = promise_lib.defer();
            userModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        }).then(ViewHelperUtil.promisifyWithArgs(StudentModel.findOne, StudentModel, [{
            identifier: body.identifier
        }]))
        .then(function(stdModel) {
            if (stdModel == null) {
                stdModel = new StudentModel();
                stdModel.identifier = body.identifier;
            }
            stdModel.name = body.displayName;
            stdModel.email = body.local.email;
            stdModel.username = body.identifier;
            var deferred = promise_lib.defer();
            stdModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        })
        .then(function() {
            console.log('created user: ' + body.identifier);
            defer.resolve(body.identifier);
        }).catch(function(err) {
            console.log(body.identifier + ' : error : ' + err);
            defer.reject(err);
        });
    return defer.promise;
};

function createEnrollments(basePath, studentId, courseId, packageId, now) {
    EnrolledCoursesModel = mongoose.model('EnrolledCoursesModel');
    LearnerStateModel = mongoose.model('LearnerStateModel');
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(EnrolledCoursesModel.findOne, EnrolledCoursesModel, [{
            student_id: studentId,
            course_id: courseId
        }]))
        .then(function(enrollModel) {
            if (enrollModel == null) {
                enrollModel = new EnrolledCoursesModel();
                enrollModel.identifier = studentId + "_" + courseId;
            }
            enrollModel.student_id = studentId;
            enrollModel.course_id = courseId;
            enrollModel.package_id = packageId;
            enrollModel.save(function(err, object) {
                if (err) {
                    console.log('EnrolledCoursesModel failed ' + studentId);
                } else {
                    lState = new LearnerStateModel();
                    lState.student_id = studentId;
                    lState.courseId = courseId;
                    lState.packageId = packageId;
                    lState.enrolled_date = now.format("DD MMMM YYYY");
                    lState.proficiency = '0';
                    lState.currentElementId = '';
                    lState.learning_objects = basePath.learning_objects;
                    lState.elements = basePath.elements;
                    lState.save(function(err2, ls) {
                        if (err2) {
                            console.log('LearnerStateModel failed ' + studentId);
                        } else {
                            console.log('Enrollment created ' + studentId);
                        }
                    });
                }
            });
        }).done();
};

exports.getUserProfile = function(req, res) {
    var userId = req.user.identifier;
    MongoHelper.findOne('UserModel', {identifier: userId}, {identifier: 1, displayName: 1, metadata: 1, image: 1, roles: 1, name: 1}, function(err, user) {
        if(err) res.send({error: err});
        else res.send(JSON.stringify(user));
    });
}

exports.saveUserProfile = function(req, res) {
    var errors = [];
    var metadata = req.body;
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MongoHelper.update('UserModel', {identifier: req.user.identifier}, {$set: {'metadata': metadata}}, function(err, user) {
            if(err)
                deferred.reject("Error while saving user details.")
            else
                deferred.resolve();
        });
        return deferred.promise;
    })
    .then(function(){
        var deferred = promise_lib.defer();
        MongoHelper.findOne('UserModel', {identifier: req.user.identifier}, function(err, user) {
            if(err) {
                deferred.reject("Error while updating Learner info.");
            } else {
                deferred.resolve(user);
            }
        });
        return deferred.promise;
    })
    .then(function(user) {
        return updateLearnerInfo(user);
    })
    .catch(function(err) {
        if(err) errors.push(err);
    })
    .done(function(){
        if(errors.length > 0) {
            res.send({error: errors.toString()});
        } else {
            res.send('OK');
        }
    });
}

exports.changeUserPassword = function(req, res) {
    var errors = [];
    var result = {};
    var body = req.body;
    UserModel = mongoose.model('UserModel');
    var user;
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
        identifier: req.user.identifier
    }]))
    .then(function(userModel) {
        var deferred = promise_lib.defer();
        user = userModel;
        if (!bcrypt.compareSync(body.currentPassword, userModel.local.password)) {
            deferred.resolve(false);
        } else {
            userModel.local.password = userModel.generateHash(body.newPassword);
            userModel.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(true);
                }
            });
        }
        return deferred.promise;
    })
    .then(function(isValidPassword) {
        result.isValidPassword = isValidPassword;
        if(!isValidPassword) {
            result.errorMessage = "The password you gave is incorrect.";
        } else {
            result.errorMessage = "";
        }
    })
    .catch(function(err) {
        if(err) {
            errors.push(err);
        }
    })
    .done(function() {
        if(errors.length > 0) {
            result.STATUS = "ERROR";    
            result.errorMessage = errors.toString();    
        } else {
            result.STATUS = "SUCCESS";
        }
        res.send(result);
    });
}

function sendEmail(subjectTemplate, bodyTemplate, args, deferred) {
    var formatTemplate = require("string-template");
    var subject = formatTemplate(subjectTemplate, args);
    var mailBody = formatTemplate(bodyTemplate, args);
    var ses = require('../interactions/wrappers/ses/sesWrapper.js');
    var mailoptions = {
        from: appConfig.ADMIN_EMAIL, // sender address
        to: args.userEmail, // list of receivers
        subject: subject, // Subject line
        html:  mailBody, // html body
        inReplyTo : ''
    }
    ses.sendMail(mailoptions, function(err, info) {
        if(err) {
            console.log(err);
            if(deferred) deferred.reject("Error while sending mail. Please contact Admin.");
        }else{
            console.log('Message sent: ' + info);
            if(deferred) deferred.resolve(info);
        }
    });
    
}


exports.forgotPassword = function(req, res) {
    var errors = [];
    var result = {};
    var body = req.body;
    var displayName = "User";
    UserModel = mongoose.model('UserModel');
    var user;
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
        '$or': [{"local.email": body.email}, {"metadata.email": body.email}]
    }]))
    .then(function(userModel) {
        var deferred = promise_lib.defer();
        if(userModel) {
            deferred.resolve(userModel);
        } else {
            deferred.reject("Invalid email ID. Please contact "+appConfig.PLATFORM_WHITELABEL+" if you have forgotten your email ID also.");
        }
        return deferred.promise;
    })
    .then(function(userModel) {
        var deferred = promise_lib.defer();
        var token = randToken.generate(24);
        console.log("Token:", token);
        userModel.resetPassword.token = token;
        userModel.resetPassword.expire = new Date();
        displayName = userModel.displayName;
        userModel.save(function(err, object) {
            if (err) {
                deferred.reject("Error while generating token. Please contact Admin.");
            } else {
                deferred.resolve(token);
            }
        });
        return deferred.promise;
    })
    .then(function(token) {
        var deferred = promise_lib.defer();
            var url = "http://" + req.get('host') + "/public/user/resetpassword/"+token;
            var values = {"displayName": displayName, "link":url, "plaformWhitelabel": appConfig.PLATFORM_WHITELABEL, "userEmail": body.email};
            sendEmail(emailTemplates.FORGOT_PASSWORD_SUBJECT_TEMPLATE, emailTemplates.FORGOT_PASSWORD_BODY_TEMPLATE, values, deferred);
        return deferred.promise;
    })
    .catch(function(err) {
        if(err) {
            errors.push(err);
        }
    })
    .done(function() {
        if(errors.length > 0) {
            result.STATUS = "ERROR";   
            result.errorMessage = errors.toString();    
        } else {
            result.STATUS = "SUCCESS";
        }
        res.send(result);
    });
}

exports.updateForgotPassword = function(req, res) {
    var errors = [];
    var result = {};
    var body = req.body;
    UserModel = mongoose.model('UserModel');
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(UserModel.findOne, UserModel, [{
        "resetPassword.token": body.passwordResetToken 
    }]))
    .then(function(userModel) {
        var deferred = promise_lib.defer();
        if(userModel) {
            var date = userModel.resetPassword.expire;
            var currendDate = new Date();
            var diff = currendDate - date;
            if(diff > appConfig.PASSWORD_EXPIRE_DURATION) {
                deferred.reject("The token is expired. Please retry forgot password process...");
            } else {
                userModel.local.password = userModel.generateHash(body.newPassword);
                var token = randToken.generate(15);
                console.log("Token:", token);
                userModel.resetPassword.token = token;
                userModel.save(function(err, object) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        var values = {"displayName": userModel.displayName, "plaformWhitelabel": appConfig.PLATFORM_WHITELABEL, "userEmail": userModel.local.email};
                        sendEmail(emailTemplates.PASSWORD_RESET_CONFIRMATION_SUBJECT_TEMPLATE, emailTemplates.PASSWORD_RESET_CONFIRMATION_BODY_TEMPLATE, values, deferred);
                        deferred.resolve();
                    }
                });
            }
        } else {
            deferred.reject("Password reset token is either invalid or has expired. Please click on Forgot Password link again to re-generate the reset token.");
        }
        return deferred.promise;
    })
    .catch(function(err) {
        if(err) {
            errors.push(err);
        }
    })
    .done(function() {
        if(errors.length > 0) {
            result.STATUS = "ERROR";
            result.errorMessage = errors.toString();
        } else {
            result.STATUS = "SUCCESS";
        }
        res.send(result);
    });
}

exports.getDisplayNamesByIds = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        UserModel.find({identifier: { $in: req.body.ids}},{ identifier:true, displayName: true}).exec(function(err, users) {
            var displayNames = {};
            if(err) {
                deferred.reject("Error while fetching DisplayNames.");
            } else {
                console.log("users.length:",users.length);
                users.forEach(function(user) {
                    displayNames[user.identifier] = user.displayName;
                });
                deferred.resolve(displayNames);
            }
        });
        return deferred.promise;
    })
    .catch(function(err) {
        if(err) errors.push(err);
    })
    .done(function(displayNames) {
        console.log("displayNames:",displayNames);
        if(errors.length > 0) {
            res.send({"status": "ERROR", "errorMessage": errors.toString()});
        } else {
            res.send({"status": "SUCCESS", "displayNames":displayNames});
        }
    });
}

exports.sendRegisterMail = function(req, res) {
        var errors = [];
    var body = req.body;
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        var phone = (body.phone)?body.phone:"";
        var college = (body.college)?body.college:"";
        var stream = (body.stream)?body.stream:"";
        var organization =(body.organization)?body.organization:"";
        var designation = (body.designation)?body.designation:"";
        var _location = (body.location)?body.location:"";
        var messageBody = (body.messageBody)?body.messageBody:"No message.";
        var htmlbody = "Name: "+body.name+"<br/>"
                        +"Email: "+body.email+"<br/>"
                        +"Phone Number: "+phone+"<br/>"
                        +"College: "+college+"<br/>"
                        +"Stream: "+stream+"<br/>"
                        +"Company/Organization: "+organization+"<br/>"
                        +"Designation: "+designation+"<br/>"
                        +"Location/City: "+_location+"<br/><br/>";
                        // +"Message:<br/> "+messageBody+"<br/>";


        var ses = require('../interactions/wrappers/ses/sesWrapper.js');
        var mailoptions = {
            from: appConfig.ADMIN_EMAIL, // sender address
            to: appConfig.REGISTER_EMAIL, // list of receivers
            subject: "["+appConfig.PLATFORM_WHITELABEL+"] Register request from "+body.name, // Subject line
            html:  htmlbody, // html body
            inReplyTo : body.email
        }
        ses.sendMail(mailoptions, function(err, info) {
            if(err) {
                console.log(err);
                if(deferred) deferred.reject("Error while sending message. Please contact Admin.");
            }else{
                console.log('Message sent: ' + JSON.stringify(info));
                if(deferred) deferred.resolve(info);
            }
        });
        return deferred.promise;
    })
    .catch(function(err) {
        if(err) errors.push(err);
    })
    .done(function() {
        if(errors.length > 0) {
            res.send({"status":"ERROR", "errorMessage": errors.toString()});
        } else {
            res.send({"status":"SUCCESS"});
        }
    });
}

exports.agreeTermsAndConditions = function(req, res) {
    var errors = [];
    UserModel = mongoose.model('UserModel');
    var tandcObj = { accept: true, acceptDate: new Date()};
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        UserModel.findOne({identifier: req.user.identifier}, function(err, user) {
            if(err) 
                deferred.reject('No User found.');
            else
                deferred.resolve(user);
        });
        return deferred.promise;
    })
    .then(function(user) {
        var deferred = promise_lib.defer();
        user.termsAndConditions = tandcObj;
        user.markModified('termsAndConditions');
        user.save(function(err, obj) {
            if (err) {
                deferred.reject('failed to save user:' + user.identifier);
            } else {
                deferred.resolve(obj);
            }
        });
        return deferred.promise;
    })
    .then(function(user) {
        var deferred = promise_lib.defer();
        req.login(user, function(err) {
            deferred.resolve();
        });
        return deferred.promise;
    })
    .done(function() {
        res.send('OK');
    });
}

