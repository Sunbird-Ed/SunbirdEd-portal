/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Instructor
 *
 * @author Mahesh
 */


var mongoose = require('mongoose');
var errorModule = require('./ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var UserViewHelper = require('./UserViewHelper');
var ViewHelperConstants = require('./ViewHelperConstants');

var LearnerEnrollmentHelper = require('./player/LearnerEnrollmentHelper');

/**
*   Fetch the instructor details with given id.
*/

exports.getInstructor = function(req, res) {
    LoggerUtil.setOperationName('getInstructor');
    var instructorId = req.params.instructorId;
    InstructorModel = mongoose.model('InstructorModel');
    CourseModel = mongoose.model('CourseModel');
    var instructor = null;
    promise_lib.resolve()
        .then(function() {
            var defer = promise_lib.defer();
            InstructorModel.findOne({
                identifier: instructorId
            }).lean().exec(function(err, data) {
                if (err || typeof data === 'undefined' || data == null) {
                    defer.reject(err);
                } else {
                    instructor = data;
                    instructor.courses = [];
                    defer.resolve();
                }
            });
            return defer.promise;
        }).then(function() {
            var defer = promise_lib.defer();
            CourseModel.find({
                'faculty.identifier': instructorId
            }).lean().exec(function(err, data) {
                if (err || typeof data === 'undefined' || data == null) {
                    defer.reject(err);
                } else {
                    data.forEach(function(course) {
                        instructor.courses.push({
                            'identifier': course.identifier,
                            'name': course.name,
                            'image': course.image,
                            'status': course.status
                        });
                    });
                    defer.resolve();
                }
            });
            return defer.promise;
        }).then(function() {
            var defer = promise_lib.defer();
            CourseModel.find({
                'tutors.identifier': instructorId
            }).lean().exec(function(err, data) {
                if (err || typeof data === 'undefined' || data == null) {
                    defer.reject(err);
                } else {
                    data.forEach(function(course) {
                        instructor.courses.push({
                            'identifier': course.identifier,
                            'name': course.name,
                            'image': course.image,
                            'status': course.status
                        });
                    });
                    defer.resolve();
                }
            });
            return defer.promise;
        }).done(function() {
            res.send(JSON.stringify(instructor));
        });
}

exports.getInstructors = function(req, res) {
    LoggerUtil.setOperationName('getInstructor');
    var courseId = req.params.courseId;
    var instructors = [];
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.find('InstructorCoursesModel', {courseId: courseId}).toArray(function(err, instrs) {
            instructors = instrs;
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        var promises = [];
        if(instructors && instructors.length > 0) {
            var getUserName = function(instructor) {
                var defer = promise_lib.defer();
                MongoHelper.findOne('UserModel', {identifier: instructor.identifier}, {displayName: 1}, function(err, user) {
                    instructor.name = user.displayName;
                    defer.resolve();
                });
                return defer.promise;
            }
            instructors.forEach(function(instructor) {
                promises.push(getUserName(instructor));
            });
        }
        return promise_lib.all(promises);
    })
    .then(function() {
        res.json(instructors);
    }).done();
}

/**
*   Save the tutor details into InstructorModel.
*   @return response.
*/

exports.saveTutor = function(req, res) {
    var errors = [];
    InstructorModel = mongoose.model('InstructorModel');
    UserModel = mongoose.model('UserModel');
    var body = req.body;
    promise_lib.resolve()
        .then(function() {
            return UserViewHelper.upsertUser(body.user);
        })
        .then(function(userResp) {
            var user = userResp.user;
            var deferred = promise_lib.defer();
            if (user.roles.indexOf("tutor") > -1) {
                deferred.resolve(user);
            } else {
                user.roles.push("tutor");
                user.markModified("roles");
                user.save(function(err, user) {
                    if (err) {
                        console.log("Error saving user with roles:" + err);
                        deferred.reject(err);
                    } else {
                        deferred.resolve(user);
                    }
                });
            }
            return deferred.promise;
        })
        .then(ViewHelperUtil.promisifyWithArgs(InstructorModel.findOne, InstructorModel, [{
            identifier: body.user.identifier
        }]))
        .then(function(instructorModel) {
            var deferred = promise_lib.defer();
            if (instructorModel == null) {
                instructorModel = new InstructorModel();
                instructorModel.identifier = body.user.identifier;
            }
            instructorModel.name = body.user.name.givenName;
            if (body.user.name.middleName && body.user.name.middleName != '') {
                instructorModel.name += ' ' + body.user.name.middleName;
            }
            if (body.user.name.familyName && body.user.name.familyName != '') {
                instructorModel.name += ' ' + body.user.name.familyName;
            }
            instructorModel.description = body.tutor.description;
            instructorModel.organization = body.tutor.organization;

            instructorModel.save(function(err, instructor) {
                if (err) {
                    console.log("Error saving instructor: " + err);
                    deferred.reject(err);
                } else {
                    deferred.resolve(instructor);
                }
            });
        })
        .catch(function(err) {
            if (err) errors = err;
        })
        .done(function() {
            if (errors.length > 0) {
                res.send('Error:' + errors);
            } else {
                res.send('OK');
            }
        });
}

exports.addTutorRole = function(user) {
    var deferred = promise_lib.defer();
    if (user.roles.indexOf("tutor") > -1) {
        deferred.resolve(user);
    } else {
        user.roles.push("tutor");
        user.markModified("roles");
        user.save(function(err, user) {
            if (err) {
                console.log("Error saving user with roles:" + err);
                deferred.reject(err);
            } else {
                deferred.resolve(user);
            }
        });
    }
    return deferred.promise;
}

exports.updateInstructor = function(user) {
    var errors = [];
    var deferred = promise_lib.defer();
    InstructorModel = mongoose.model('InstructorModel');
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(InstructorModel.findOne, InstructorModel, [{
        identifier: user.identifier
    }]))
    .then(function(instructor) {
        var deferred = promise_lib.defer();
        if (instructor == null) {
            instructor = new InstructorModel();
            instructor.identifier = user.identifier;
        }
        instructor.name = user.displayName;
        instructor.roles = user.roles;
        instructor.markModified('roles');
        instructor.is_deleted = false;
        instructor.save(function(err, obj) {
            if (err) {
                console.log("Error saving instructor: " + err);
                deferred.reject(err);
            } else {
                deferred.resolve(obj);
            }
        });
        return deferred.promise;
    })
    .then(function(instructorObj) {
        deferred.resolve(instructorObj);
    })
    .catch(function(err) {
        deferred.reject(err);
    })
    .done();
    return deferred.promise;
}

exports.deleteInstructor = function(identifier, isRemove) {
    var errors = [];
    var deferred = promise_lib.defer();
    InstructorModel = mongoose.model('InstructorModel');
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(InstructorModel.findOne, InstructorModel, [{'identifier': identifier}]))
    .then(function(instructor) {
        if(instructor) {
            if(isRemove) {
                instructor.remove();
            } else {
                instructor.is_deleted = true;
                instructor.save(function(err, instructor) {});
            }
        }
    })
    .done(function() {
        deferred.resolve();
    });
    return deferred.promise;
}

/**
*   It is used to assign a course to Tutor/Instructor.
*   @return response.
*   TODO: If courseId or tutorId is invalid, it is not sending error response.
*/

exports.assignCourse = function(req, res) {

    var errors = [];
    var courseId = req.body.courseId;
    var tutorId = req.body.tutorId;
    promise_lib.resolve()
    .then(function(data) {
        return exports.enrollCoach(courseId, tutorId);
    })
    .catch(function(err) {
        if (err) errors = err;
    })
    .done(function(instructor) {
        if (errors.length > 0) {
            res.send(400, 'Error: ' + errors);
        } else {
            res.send('OK');
        }
    });
}

exports.enrollCoach = function(courseId, coachId, role) {

    var defer = promise_lib.defer();
    InstructorCoursesModel = mongoose.model('InstructorCoursesModel');
    CourseModel = mongoose.model('CourseModel');
    var course = null;
    var instructorCourse;
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MongoHelper.findOne('LearningObjectModel', {identifier: courseId}, {name: 1, 'metadata.nodeId': 1}, function(err, course) {
            deferred.resolve(course);
        });
        return deferred.promise;
    })
    .then(function(data) {
        course = data;
        var deferred = promise_lib.defer();
        MongoHelper.findOne('InstructorCoursesModel', {identifier: coachId, courseId: courseId}, function(err, object) {
            if(!object || null == object || typeof object == 'undefined') {
                deferred.resolve(true);
            } else {
                instructorCourse = object;
                deferred.resolve(false);
            }
        });
        return deferred.promise;
    })
    .then(function(create) {
        var deferred = promise_lib.defer();
        if(create) {
            var object = new InstructorCoursesModel();
            object.courseId = courseId;
            object.nodeId = course.metadata.nodeId;
            object.courseName = course.name;
            object.identifier = coachId;
            object.learnerCount = 0;
            object.role = role;
            object.save(function(err, obj) {
                if(err) {
                    deferred.reject(err);
                } else {
                    instructorCourse = obj;
                    deferred.resolve(create);
                }
            })
        } else {
            MongoHelper.update('InstructorCoursesModel', {identifier: coachId, courseId: courseId}, {$set:{courseName: course.name, role: role, nodeId: course.metadata.nodeId}}, function(err, obj) {
                if(err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(create);
                }
            });
        }
        return deferred.promise;
    })
    .then(function(create) {
        return LearnerEnrollmentHelper.enrollLearnerToCourse(true, coachId, courseId, '', 'tutor');
    })
    .then(function() {
        defer.resolve(instructorCourse);
    })
    .catch(function(err) {
        if(err == 'Course already assigned.') {
            defer.resolve();
        } else {
            defer.reject(err);
        }
    })
    .done();
    return defer.promise;
}

/**
*   Fetch tutor details for tutor dashboard.
*   @return response.
*/

exports.getTutor = function(req, res) {
    var errors = [];
    InstructorCoursesModel = mongoose.model('InstructorCoursesModel');
    var tutorId = req.user.identifier;
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(InstructorCoursesModel.find, InstructorCoursesModel, [{
            identifier: tutorId
        }]))
        .catch(function(err) {
            if (err) errors = err;
        })
        .done(function(courses) {
            var instructor = {courses: courses};
            if (errors.length > 0) {
                res.send(400, 'Error: ' + errors);
            } else {
                res.send(JSON.stringify(instructor));
            }
        })
}

exports.importInstructor = function(node) {
    InstructorModel = mongoose.model('InstructorModel');
    var id = ViewHelperUtil.getNodeProperty(node, 'identifier');
    var isNew = false;
    var defer = promise_lib.defer();
    promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(InstructorModel.findOne, InstructorModel, [{
            identifier: id
        }]))
        .then(function(element) {
            var deferred = promise_lib.defer();
            if (typeof element == 'undefined' || element == null) {
                element = new InstructorModel();
                element.identifier = id;
                isNew = true;
            }
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'name', element);
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'description', element);
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'image', element);
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'organizationName', element, 'organization');
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'organizationImage', element, 'organizationImage');
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'keyword', element, 'interests');
            ViewHelperUtil.setPropertyIfNotEmpty(node, 'nodeId', element);
            element.save(function(err, object) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(object);
                }
            });
            return deferred.promise;
        })
        .done(function(element) {
            var saveType = (isNew) ? ViewHelperConstants.INSERT : ViewHelperConstants.UPDATE;
            var resolveObject = {
                'saveType': saveType,
                'object': JSON.stringify(element)
            };
            defer.resolve(resolveObject);
        });
    return defer.promise;

}
