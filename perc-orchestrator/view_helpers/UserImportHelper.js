/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for user import.
 *
 * @author Mahesh
 */
var csv = require('csv');
var fs = require('fs');
var mongoose = require('mongoose');
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var ViewHelperConstants = require('./ViewHelperConstants');
var UserViewHelper = require('./UserViewHelper');
var studentViewHelper = require('./StudentViewHelper');
var instructorViewHelper = require('./InstructorViewHelper');
var emailNotificationHelper = require('./EmailNotificationHelper');
var CSVImportUtil = require('../commons/CSVImportUtil');
var UserImportUtil = require('./UserImportUtil');
var S = require('string');
var validator = require('validator');
var sesWrapper = require('../interactions/wrappers/ses/sesWrapper');
require('date-format-lite');

var headerFields = {
    "type": "type",
    "family name": "familyName",
    "given name": "givenName",
    "middle name": "middleName",
    "email": "email",
    "uniqueid": "uniqueId",
    "unique id": "uniqueId",
    "password": "password",
    "linkedin": "linkedin",
    "facebook": "facebook",
    "googleplus": "googleplus",
    "twitter": "twitter",
    "github": "github",
    "job title": "jobTitle",
    "company": "company",
    "contact number": "contactNumber",
    "website": "website",
    "profile name": "profileName",
    "profile outcome": "profileOutcome",
    "learner level": "learnerLevel",
    "image": "image",
    "description": "description",
    "organization": "organization",
    "organization image": "organization image",
    "interests": "interests",
    "delete status": "deleteStatus",
    "status": "status", // Record process status. Set at the time of sending response.
    "error comments": "errorLog"
}

exports.exportCSV = function(json, res, errors) {
    var jsonCSV = require('json-csv');
    var jsonArray = [];
    for (k in json) {
        if (k != 'index') {
            jsonArray.push(json[k]);
        }
    }
    var jsonFields = [];
    for (k in headerFields) {
        jsonFields.push({
            name: headerFields[k],
            label: k
        });
    }
    var args = {
        data: jsonArray,
        fields: jsonFields
    }
    jsonCSV.toCSV(args, function(err, csv) {
        res.set('Content-Type', 'text/plain');
        res.write(csv);
        if (errors) {
            res.write(JSON.stringify(errors));
        }
        res.end();
    });
}

/**
 * Bulk create/update of Users using CSV import.
 *   - If a record is with email column value empty or delete status column set as delete then, the record won't be consider.
 *
 */

exports.importUsersCSV = function(req, res) {

    console.log('Import Users CSV...');
    var now = new Date();
    var file = req.files.importFile;
    var header = {};
    var json = {};
    var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        type: CSVImportUtil.USER_IMPORT
    };
    csv()
    .from.stream(fs.createReadStream(file.path))
    .on('record', function(row, index) {
        if (index == 0) {
            header = row;
        } else {
            var object = new Object();
            for (k in row) {
                var objKey = getObjectKey(header[k].toLowerCase());
                object[objKey] = row[k];
            }
            if(!object.deleteStatus) object.deleteStatus = '';
            var uniqueId = object.uniqueId || object.email;
            if (uniqueId != "" && object.deleteStatus.toLowerCase() != 'delete') {
                statistics.total++;
                object.errorLog = '';
                if (json.hasOwnProperty(uniqueId)) {
                    statistics.duplicate++;
                    object.errorLog += 'Had duplicate. ';
                }
                json[uniqueId] = object; // If a duplicate is there, The last record in CSV will be considered finally.
            }
        }
    })
    .on('end', function(count) {
        promise_lib.resolve()
            .then(function() {
                return CSVImportUtil.initalizeCSVImport(file, statistics);
            })
            .then(function() {
                return UserImportUtil.validate(json);
            })
            .then(function() { // Copy file.
                var deferred = promise_lib.defer();
                var fileName = Date.parse(now)+'.json';
                var filePath = appConfig.CSV_UPLOAD_DIR + fileName;
                fs.writeFile(filePath, JSON.stringify(json), function(err) {
                    if(err) console.log("File write error:"+err);
                });
                return filePath;
            })
            .then(function(filePath) { // Create Queue record.
                statistics.filepath = filePath;
                statistics.logFile = 'userimport_' + Date.parse(now) + '.log';
                console.log("createCSVImportQueueRecord...");
                return CSVImportUtil.createCSVImportQueueRecord(statistics);
            })
            .done(function(logRecord) {
                res.send(JSON.stringify(logRecord));
            });
    })
    .on('error', function(error) {
        console.log('error', error);
        res.send(error);
    });
}

exports.deleteUsersCSV = function(req, res) {
    console.log('Import Users CSV for Soft Delete...');
    csvDeleteUsers(false, req, res);
}

exports.cleanupUsersCSV = function(req, res) {
    console.log('Import Users CSV for Cleanup...');
    csvDeleteUsers(true, req, res);
}

function csvDeleteUsers(isRemove, req, res) {
    var file = req.files.importFile;
    // var isRemove = (req.body.isRemove && req.body.isRemove.toLowerCase() == 'true')?true:false;
    var header = {};
    var json = {};
    var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        type: CSVImportUtil.USER_DELETE
    };
    csv()
        .from.stream(fs.createReadStream(file.path))
        .on('record', function(row, index) {
            if (index == 0) {
                header = row;
            } else {
                var object = new Object();
                for (k in row) {
                    var objKey = getObjectKey(header[k].toLowerCase());
                    object[objKey] = row[k];
                }
                if (object.email != "" && object.deleteStatus.toLowerCase() == 'delete') {
                    statistics.total++;
                    object.errorLog = '';
                    object.isRemove = isRemove;
                    if (json.hasOwnProperty(object.email)) {
                        statistics.duplicate++;
                        object.errorLog += 'Had duplicate. ';
                    }
                    json[object.email] = object; // If a duplicate is there, The last record in CSV will be considered finally.
                }
            }
        })
        .on('end', function(count) {
            console.log("No of records:"+JSON.stringify(json));
            promise_lib.resolve()
            .then(function() {
                return CSVImportUtil.initalizeCSVImport(file, statistics);
            })
            .then(function() {
                return UserImportUtil.validate(json);
            })
            .then(function(logRecord) { // Copy file.
                var fileName = Date.parse(new Date())+'.json';
                var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
                fs.writeFile(filePath, JSON.stringify(json), function(err) {
                    if(err) console.log("File write error:"+err);
                });
                return filePath;
            })
            .then(function(filePath) { // Create Queue record.
                statistics.filepath = filePath;
                console.log("createCSVImportQueueRecord...");
                return CSVImportUtil.createCSVImportQueueRecord(statistics);
            })
            .done(function(logRecord) {
                res.send(JSON.stringify(logRecord));
            });
        })
        .on('error', function(error) {
            console.log('error', error);
            res.send(error);
        });
}

exports.saveUsers = function(json, statistics) {
    var logger = LoggerUtil.getFileLogger(statistics.logFile);
    logger.info('UserImportHelper:saveUsers() - User Import - START');
    var errors = [], identifiers = [], userIds = [];
    statistics.startTime = new Date();
    promise_lib.resolve()
    .then(function() {
        var promises = [];
        identifiers = setIdentifiers(json);
        logger.info('UserImportHelper:saveUsers() - Identifiers have been set');
        for (k in json) {
            if (json[k].isValid) {

                promises.push(_saveUser(json[k], identifiers, logger, userIds));
            } else {
                json[k].status = UserImportUtil.FAIL;
                promises.push(json[k]);
            }
        }
        return promise_lib.all(promises);
    })
    // TODO: uncomment this once the mail template is finalized.
    // .then(function(users) {
    //     return _sendInvitationMail(users);
    // })
    .then(function() {
        return UserViewHelper.bulkUpdateLearnerInfo(userIds, logger);
    })
    .then(function() {
        logger.info('UserImportHelper:saveUsers() - User Import Completed Successfully');
        var fileName = statistics["identifier"]+'.csv';
        var filePath = appConfig.CSV_UPLOAD_DIR + fileName;
        return saveJsonAsCSV(json, filePath, headerFields);
    })
    .catch(function(err) {
        logger.error('UserImportHelper:saveUsers() - User Import Failed - ' + err);
        statistics.status = CSVImportUtil.FAIL;
        errors.push('User Import Failed' + err);
        setTimeout(function() {
            sesWrapper.sendSupportMail('User Import - Failed', statistics.logFile, 'User import failed. Please check the attached log file for errors.');
        }, 5000);
    })
    .done(function(filePath) {
        var jsonFilePath = statistics.filepath;
        CSVImportUtil.deleteFile(jsonFilePath);
        statistics.filepath = filePath;
        statistics.endTime = new Date();
        statistics.exeTime = statistics.endTime.getTime() - statistics.startTime.getTime();
        if(errors.length > 0) {
            statistics.status = CSVImportUtil.FAIL;
        } else {
            statistics.status = CSVImportUtil.COMPLETE;
        }
        statistics = updateStatistics(json, statistics);
        logger.info('UserImportHelper:saveUsers() - Updating CSVImportQueueRecord - ' + JSON.stringify(statistics));
        CSVImportUtil.updateCSVImportQueueRecord(statistics);
    });
}

function _saveUser(jsonObject, identifiers, logger, userIds) {

    var deferred = promise_lib.defer();
    var errors = [];
    var object = null;
    var userAuth = {'userId': jsonObject.identifier, 'password': jsonObject.password};
    promise_lib.resolve()
    .then(function() {
        object = getUserReqObject(jsonObject);
        logger.info('UserImportHelper:_saveUser() - Importing user - ' + object.user.uniqueId);
    })
    .then(function() {
        return getUserName(object.user.identifier, identifiers);
    })
    .then(function(userName) {
        object.user.identifier = userName;
        object.user.inboxEmailId = userName + appConfig.USER_INBOX_DOMAIN;
        var role = '';
        if (object.type == UserImportUtil.STUDENT) {
            role = 'student';
        } else if (object.type == UserImportUtil.TUTOR || object.type == UserImportUtil.COACH) {
            role = 'tutor';
        } else if (object.type == UserImportUtil.FACULTY) {
            role = 'faculty';
        } else if (object.type == UserImportUtil.FACULTY_OBSERVER) {
            role = 'faculty_observer';
        } else {
            errors.push('Invalid user type');
        }
        return UserViewHelper.upsertUser(object.user, role, logger);
    })
    .then(function(resp) {
        userIds.push(resp.user.identifier);
        jsonObject.saveType = resp.saveType;
        if (object.type == UserImportUtil.STUDENT) {
            return object.student;
        } else if (object.type == UserImportUtil.TUTOR || object.type == UserImportUtil.COACH || object.type == UserImportUtil.FACULTY) {
            return instructorViewHelper.updateInstructor(resp.user);
        } else {
            return object.student;
        }
    })
    .then(function() {
        logger.info('UserViewHelper:_saveUser() - User import success for ' + object.user.uniqueId);
    })
    .catch(function(err) {
        logger.error('UserViewHelper:_saveUser() - User imported failed for ' + object.user.uniqueId + '. Error - ' + err);
        errors.push('Error importing user - ' + err);
    })
    .done(function(student) {
        if (errors.length > 0) {
            jsonObject.status = UserImportUtil.FAIL;
            jsonObject.errorLog = JSON.stringify(errors);
        } else {
            jsonObject.status = UserImportUtil.SUCCESS;
        }
        jsonObject.password = userAuth.password;
        deferred.resolve(jsonObject);
    });
    return deferred.promise;
}

function _sendInvitationMail(users) {
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        var invitees = [];
        for (k in users) {
            var user = users[k];
            if ("success" == user.status) {
                var displayName = user.givenName;
                var userPassword = user.password;
                if (user.middleName && user.middleName != '') {
                    displayName += ' ' + user.middleName;
                }
                if (user.familyName && user.familyName != '') {
                    displayName += ' ' + user.familyName;
                }
                invitees.push({'displayName': displayName, 'userEmail': user.email, 'userPassword': userPassword, 'email': user.email});
            }
        }
        return invitees;
    })
    .then(function(invitees) {
        console.log("_sendInvitationMail - users:", invitees);
        var promises = [];
        for (k in invitees) {
            promises.push(emailNotificationHelper.sendInvitationMail(invitees[k]));
        }
        return promise_lib.all(promises);
    })
    .done(function(student) {
        deferred.resolve()
    });
    return deferred.promise;
}

exports.deleteUsers = function(json, statistics) {
    var errors = [];
    statistics.startTime = new Date();
    promise_lib.resolve()
    .then(function() {
        var promises = [];
        for (k in json) {
            promises.push(_deleteUser(json[k]));
        }
        return promise_lib.all(promises);
    })
    .then(function(jsonWithStates) {
        json = jsonWithStates;
        var fileName = statistics["identifier"]+'.csv';
        var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
        return saveJsonAsCSV(jsonWithStates, filePath, headerFields);
    })
    .catch(function(err) {
        console.log('Error in save users - ', err);
        if(err) errors.push(err);
    })
    .done(function(filePath) {
        var jsonFilePath = statistics.filepath;
        CSVImportUtil.deleteFile(jsonFilePath);
        statistics.filepath = filePath;
        statistics.endTime = new Date();
        statistics.exeTime = statistics.endTime.getTime() - statistics.startTime.getTime();
        if(errors.length > 0) {
            statistics.status = CSVImportUtil.FAIL;
        } else {
            statistics.status = CSVImportUtil.COMPLETE;
        }
        statistics = updateStatistics(json, statistics);
        console.log("Completed Processing Queue record for delete: "+statistics.identifier);
        console.log("Statistics: "+statistics);
        CSVImportUtil.updateCSVImportQueueRecord(statistics);
    });
}

function _deleteUser(jsonObject) {
    var deferred = promise_lib.defer();
    var errors = [];
    promise_lib.resolve()
    .then(function() {

    })
    .then(function() {
      return UserViewHelper.deleteUser(jsonObject.email, jsonObject.isRemove);
    })
    .then(function(deleteResp) {
      jsonObject.saveType = deleteResp.saveType;
      var type = jsonObject.type.toLowerCase();
      if(type == UserImportUtil.STUDENT) {
        studentViewHelper.deleteStudent(jsonObject.email, jsonObject.isRemove);
      } else if(type == UserImportUtil.TUTOR) {
        instructorViewHelper.deleteInstructor(jsonObject.email, jsonObject.isRemove);
      }
    })
    .catch(function(err) {
        if (err) errors = err;
    })
    .done(function() {
        if (errors.length > 0) {
            jsonObject.status = UserImportUtil.FAIL;
            jsonObject.errorLog = errors;
        } else {
            jsonObject.status = UserImportUtil.SUCCESS;
        }
        deferred.resolve(jsonObject);
    });
    return deferred.promise;
}

function getObjectKey(csvKey) {
    return S(csvKey).camelize().s;
}

function getUserName(identifier, identifiers) {
    var defer = promise_lib.defer();
    MongoHelper.find('UserModel', {identifier: { $regex: new RegExp(identifier) }}, {identifier: 1}).toArray(function(err, users) {
        if(err || users == null || typeof users == 'undefined' || users.length == 0) {
            defer.resolve(identifier);
        } else {
            var tmpArray = [];
            users.forEach(function(user) {
                tmpArray.push(user.identifier);
            });
            if(tmpArray.indexOf(identifier) == -1) {
                defer.resolve(identifier);
            } else {
                while(identifiers.indexOf(identifier) != -1 && tmpArray.indexOf(identifier) != -1) {
                    console.log('Identifier exists. create new one', identifier);
                    identifier = identifier + '' + Math.floor((Math.random() * 1000) + 1);
                }
                defer.resolve(identifier);
            }
        }
    });
    return defer.promise;
}

function generateIdentifier(givenName, middleName, familyName) {
    var userName = givenName.toLowerCase();
    if(middleName) {
        userName += middleName.toLowerCase().substr(0,1);
    }
    if(familyName) {
        userName += familyName.toLowerCase().substr(0,1);
    }
    userName = S(userName).strip(' ', '_', '-').s;
    return userName;
}

function setIdentifiers(json) {
    var userNames = [];
    for (k in json) {
        var row = json[k]
        if (row.isValid) {
            var identifier = generateIdentifier(row.givenName, row.middleName, row.familyName);
            while(userNames.indexOf(identifier) != -1) {
                console.log('Identifier exists. create new one', identifier);
                identifier = identifier + '' + Math.floor((Math.random() * 1000) + 1);
            }
            row.identifier = identifier;
            userNames.push(identifier);
        }
    }
    return userNames;
}

var dateFields = ['joiningDate'];

function getUserReqObject(row) {
    for(k in row) {
        if(dateFields.indexOf(k) != -1) {
            row[k] = row[k].date();
        }
    }
    var object = new Object();
    object.type = row.type.toLowerCase();
    row.email = validator.normalizeEmail(row.email);
    var user = {};
    user.email = row.email;
    user.password = row.password;
    var name = {};
    name.givenName = row.givenName;
    name.familyName = row.familyName;
    name.middleName = row.middleName;
    user.name = name;
    user.metadata = row;
    user.local = {};
    user.local.email = row.email;
    user.local.password = row.password;
    user.social_info = {};
    user.social_info.linkedin = row.linkedin;
    user.social_info.facebook = row.facebook;
    user.social_info.twitter = row.twitter;
    user.social_info.github = row.github;
    user.identifier = row.identifier;
    user.uniqueId = row.uniqueId || row.email;
    user.registered = true;
    object.user = user;
    if (object.type == UserImportUtil.STUDENT) {
        object.user.userType = UserImportUtil.STUDENT;
        object.student = {};
    } else if (object.type == UserImportUtil.TUTOR || object.type == UserImportUtil.COACH) {
        object.user.userType = UserImportUtil.COACH;
        object.tutor = {};
    } else {
        object.user.userType = object.type;
    }
    return object;
}

function updateStatistics(json, statistics) {
    for (k in json) {
        var object = json[k];
        if (object.saveType == UserImportUtil.INSERT) statistics.inserted++;
        if (object.saveType == UserImportUtil.UPDATE) statistics.updated++;
        if (object.saveType == UserImportUtil.DELETE) statistics.deleted++;
        if (object.status == UserImportUtil.FAIL) statistics.failed++;
    }
    return statistics;
}

function saveJsonAsCSV(jsonWithStates, filePath, headerFields) {
    var deferred = promise_lib.defer();
    var jsonCSV = require('json-csv');
    var jsonFields = [];
    for (k in headerFields) {
        jsonFields.push({
            name: headerFields[k],
            label: k
        });
    }
    var args = {
        data: jsonWithStates,
        fields: jsonFields
    }
    jsonCSV.toCSV(args, function(err, csv) {
        if(err) {
            deferred.reject(err);
        } else {
            fs.writeFile(filePath,csv, function(err) {
                deferred.resolve(filePath);
                console.log(filePath+" file created...");
            });
        }
    });
    return deferred.promise;
}