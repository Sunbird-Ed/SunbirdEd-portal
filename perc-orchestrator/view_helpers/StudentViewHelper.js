/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Student
 *
 * @author Mahesh
 */

 var mongoose = require('mongoose');
var errorModule = require('./ErrorModule');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var UserViewHelper = require('./UserViewHelper');

/**
*	To Create or Save Student with user record.
*	@return response.
*/
exports.saveStudent = function(req, res) {
    var errors = [];
    StudentModel = mongoose.model('StudentModel');
    UserModel = mongoose.model('UserModel');
    var body = req.body;
    console.log(body);
    promise_lib.resolve()
        .then(function() {
            return UserViewHelper.upsertUser(body.user);
        })
        .then(function(userResp) {
            var user = userResp.user;
            var deferred = promise_lib.defer();
            if (user.roles.indexOf("student") > -1) {
                deferred.resolve(user);
            } else {
                user.roles.push("student");
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
        .then(ViewHelperUtil.promisifyWithArgs(StudentModel.findOne, StudentModel, [{
            identifier: body.user.identifier
        }]))
        .then(function(studentModel) {
            var deferred = promise_lib.defer();
            if (studentModel == null) {
                studentModel = new StudentModel();
                studentModel.identifier = body.user.identifier;
                if(body.student.profile) {
                	studentModel.profile = body.student.profile;
                } else {
                	studentModel.profile = { "name" : "", "outcome" : "default", "learnerLevel" : "" };
                }
            }
            
            studentModel.educationQualification = body.student.educationQualification;
            studentModel.jobTitle = body.student.jobTitle;
            studentModel.companyName = body.student.companyName;
            studentModel.contactNumber = body.student.contactNumber;
            studentModel.website = body.student.website;
            //TODO check about profile will be updated with this api.
            
            //studentModel.organization = body.tutor.organization;

            studentModel.save(function(err, student) {
                if (err) {
                    console.log("Error saving student: " + err);
                    deferred.reject(err);
                } else {
                	console.log("Student:",student);
                    deferred.resolve(student);
                }
            });
        })
        .catch(function(err) {
            if (err) errors.push(err);
        })
        .done(function() {
            if (errors.length > 0) {
                res.send('Error:' + errors);
            } else {
                res.send('OK');
            }
        });
}

exports.addStudentRole = function(user) {
    var deferred = promise_lib.defer();
    if (user.roles.indexOf("student") > -1) {
        deferred.resolve(user);
    } else {
        user.roles.push("student");
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

exports.updateStudent = function(user, student) {
    var errors = [];
    var deferred = promise_lib.defer();
    StudentModel = mongoose.model('StudentModel');
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(StudentModel.findOne, StudentModel, [{
        identifier: user.identifier
    }]))
    .then(function(studentModel) {
        var deferred = promise_lib.defer();
        if (studentModel == null) {
            studentModel = new StudentModel();
            studentModel.identifier = user.identifier;
            if(student.profile) {
                studentModel.profile = student.profile;
            } else {
                studentModel.profile = { "name" : "", "outcome" : "default", "learnerLevel" : "" };
            }
        }
        
        studentModel.educationQualification = student.educationQualification;
        studentModel.jobTitle = student.jobTitle;
        studentModel.companyName = student.companyName;
        studentModel.contactNumber = student.contactNumber;
        studentModel.website = student.website;
        //TODO check about profile will be updated with this api.
        studentModel.is_deleted = false;
        studentModel.save(function(err, student) {
            if (err) {
                console.log("Error saving student: " + err);
                deferred.reject(err);
            } else {
                deferred.resolve(student);
            }
        });
        return deferred.promise;
    })
    .catch(function(err) {
        if (err) errors.push(err);
    })
    .done(function(student) {
        if(errors.length > 0) {
            console.log('Error: ',errors);
            deferred.reject(errors);
        } else {
            deferred.resolve(student);
        }
    });
    return deferred.promise;

}

exports.deleteStudent = function(identifier, isRemove) {
    var errors = [];
    var deferred = promise_lib.defer();
    StudentModel = mongoose.model('StudentModel');
    promise_lib.resolve()
    .then(ViewHelperUtil.promisifyWithArgs(StudentModel.findOne, StudentModel, [{
        'identifier': identifier
    }]))
    .then(function(student) {
        if(student) {
            if(isRemove) {
                student.remove();
            } else {
                student.is_deleted = true;
                student.save(function(err, student){});
            }
        }
    })
    .done(function() {
        deferred.resolve();
    });
    return deferred.promise;
}