/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Enrollment import.
 *
 * @author Santhosh
 */
var csv = require('csv');
var fs = require('fs');
var mongoose = require('mongoose');
var promise_lib = require('when');
var learnerEnrollmentHelper = require('./player/LearnerEnrollmentHelper');
var instructorHelper = require('./InstructorViewHelper');
var CSVImportUtil = require('../commons/CSVImportUtil');
var validator = require('validator');
var pumpUtil = require('../coaching/util/PumpIOUtil');
var pumpConfig = require('../coaching/config/pumpConfig.json');
var S = require('string');
var adminVH = require('./AdminViewHelper');
var pumpHelper = require('../coaching/util/PumpHelper');
var sesWrapper = require('../interactions/wrappers/ses/sesWrapper');

var headerFields = {
    "course id": "courseNodeId",
    "uniqueid": "uniqueId",
    "unique id": "uniqueId",
    "type": "type",
    "batch": "batch",
    "status": "status", // Record process status. Set at the time of sending response.
    "error comments": "errorLog"
}

function getObjectKey(csvKey) {
    if (headerFields[csvKey]) {
        return headerFields[csvKey];
    } else {
        return csvKey.replace(/\s+/g, '_');
    }
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
 * Bulk enroll of students/coach to a course using CSV import.
 * Course id, user email id are required. Type defaults to student
 */

exports.importEnrollmentCSV = function(req, res) {

    console.log('###### Import Enrollment CSV ######');
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
        type: CSVImportUtil.ENROLLMENT_IMPORT,
        courseId: req.body.courseId,
        courseName: req.body.courseName
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
            if (object.uniqueId != '') {
                statistics.total++;
                object.errorLog = '';
                if (json.hasOwnProperty(object.uniqueId)) {
                    statistics.duplicate++;
                    object.errorLog += 'Had duplicate. ';
                }
                json[object.uniqueId] = object; // If a duplicate is there, The last record in CSV will be considered finally.
            }
        }
    })
    .on('end', function(count) {
        promise_lib.resolve()
        .then(function() {
            return CSVImportUtil.initalizeCSVImport(file, statistics);
        })
        .then(function() {
            return validate(json);
        })
        .then(function() { // Copy file.
            var deferred = promise_lib.defer();
            var fileName = Date.parse(now)+'.json';
            var filePath = appConfig.CSV_UPLOAD_DIR+fileName;
            fs.writeFile(filePath, JSON.stringify(json), function(err) {
                if(err) console.log("File write error:"+err);
            });
            return filePath;
        })
        .then(function(filePath) { // Create Queue record.
            statistics.filepath = filePath;
            statistics.logFile = 'enrollment_' + Date.parse(now) + '.log';
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

function validate(jsonArray) {
    var promises = [];
    for( k in jsonArray) {
        jsonArray[k].isValid = true;
        promises.push(validateJson(jsonArray[k]));
    }
    return promise_lib.all(promises);
}

function validateJson(json) {
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        if(!json.uniqueId || json.uniqueId == '') {
            json.isValid = false;
            json.errorLog += 'unique id is invalid. ';
        }
        if(json.type && ['student', 'tutor', 'coach', 'faculty', 'faculty_observer'].indexOf(json.type.toLowerCase()) == -1) {
            json.isValid = false;
            json.errorLog = 'type is invalid. ';
        }
    })
    .done(function() {
        deferred.resolve(json);
    });
    return deferred.promise;
}

exports.importEnrollment = function(json, statistics) {

    var logger = LoggerUtil.getFileLogger(statistics.logFile);
    logger.info('EnrollmentImportHelper:importEnrollment() - Enroll Import - START for courseId ' + statistics.courseId);
    var errors = [], time1 = undefined;
    statistics.startTime = new Date();
    promise_lib.resolve()
    .then(function() {
        var validRecords = [];
        var failed = 0;
        for (k in json) {
            if (json[k].isValid) {
                validRecords.push(json[k]);
            } else {
                failed++;
                json[k].status = CSVImportUtil.FAIL;
            }
        }
        logger.info('EnrollmentImportHelper:importEnrollment() - Validation: Invalid Records count - ' + failed);
        logger.info('EnrollmentImportHelper:importEnrollment() - Validation: Valid Records count - ' + validRecords.length);
        time1 = (new Date()).getTime();
        return enroll(validRecords, statistics.courseId, logger);
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:importEnrollment() - Enrollment Complete. Time taken - ' + ((new Date()).getTime() - time1));
        return allocateCoach(statistics.courseId, logger);
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:importEnrollment() - Coach allocation complete...');
        return courseCommunity(statistics.courseId, logger);
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:importEnrollment() - Course community complete.');
        logger.info('EnrollmentImportHelper:importEnrollment() - Enrollment import completed successfully.');
        return CSVImportUtil.finishImport(json, headerFields, statistics, errors);
    })
    .catch(function(err) {
        logger.error('EnrollmentImportHelper:importEnrollment() - Enrollment Failed - ' + err);
        statistics.status = CSVImportUtil.FAIL;
        if(err) errors.push(err);
        setTimeout(function() {
            sesWrapper.sendSupportMail('Enrollment Import - Failed', statistics.logFile, 'Enrollment import failed for the course <b>' + statistics.courseName + '</b>. <br> Please check the attached log file for errors.');
        }, 5000);
        return CSVImportUtil.finishImport(json, headerFields, statistics, errors);
    })
    .done();
}

function enroll(records, courseId, logger) {
    logger.info('EnrollmentImportHelper:enroll() - Enrolling valid users');
    var uniqueIds = [], learners = [], instructors = [];
    records.forEach(function(record) {
        uniqueIds.push(record.uniqueId);
    })
    var deferred = promise_lib.defer();
    var courseId, courseName, userId, displayName;
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.find('UserModel', {'uniqueId':{$in:uniqueIds}}, {identifier: 1, uniqueId: 1}).toArray(function(err, users) {
            if(null == users) users =[];
            defer.resolve(users);
        });
        return defer.promise;
    })
    .then(function(users) {
        var idMapping = {};
        users.forEach(function(user) {
            idMapping[user.uniqueId] = user.identifier;
        });
        records.forEach(function(record) {
            record.errorLog = [];
            if(validator.isNull(record.type) || validator.equals(record.type, '')) {
                record.type = 'student';
            }
            var learnerId = idMapping[record.uniqueId];
            if(null == learnerId || typeof learnerId == 'undefined') {
                record.saveType = CSVImportUtil.INSERT;
                record.status = CSVImportUtil.FAIL;
                record.errorLog.push('Learner does not exist as an user');
                logger.error('EnrollmentImportHelper:enroll() - ' + record.uniqueId + ' does not exist as an user in the system');
            } else {
                record.learnerId = learnerId;
                if(validator.equals(record.type, 'student') || validator.equals(record.type, 'faculty_observer')) {
                    learners.push(record);
                } else {
                    instructors.push(record);
                }
            }
        });
        logger.info('EnrollmentImportHelper:enroll() - Enrolling all learners. Count - ' + learners.length);
        if(learners.length > 0) {
            return learnerEnrollmentHelper.enrollLearnersToCourse(courseId, learners, logger);
        }
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:enroll() - All learners enrolled.');
        logger.info('EnrollmentImportHelper:enroll() - Enrolling all instructors. Count - ' + instructors.length);
        if(instructors.length > 0) {
            var promises = [];
            instructors.forEach(function(user) {
                promises.push(instructorHelper.enrollCoach(courseId, user.learnerId, user.type));
            });
            return promise_lib.all(promises);
        }
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:enroll() - All instructors enrolled.');
        deferred.resolve();
    })
    .catch(function(err) {
        logger.error('EnrollmentImportHelper:enroll() - User Enrollment failed. Error - ' + err);
        deferred.reject(err);
    }).done();
    return deferred.promise;
}

function allocateCoach(courseId, logger) {
    var deferred = promise_lib.defer();
    logger.info('EnrollmentImportHelper:allocateCoach() - Allocating coach for students in ' + courseId);
    var coaches = [];
    var students = [];
    promise_lib.resolve()
    .then(function() {
        return getCoaches(courseId);
    })
    .then(function(coachesObj) {
        coaches = coachesObj || [];
        logger.info('EnrollmentImportHelper:allocateCoach() - Fetched coaches information ' + coaches.length);
    })
    .then(function() {
        return getUnallocatedStudents(courseId);
    })
    .then(function(studentsObj) {
        students = studentsObj || [];
        logger.info('EnrollmentImportHelper:allocateCoach() - Fetched unallocated students information ' + students.length);
    })
    .then(function() {
        if(null != coaches && coaches.length > 0 && null != students && students.length > 0) {
            coaches = autoAllocation(courseId, coaches, students);
            logger.info('EnrollmentImportHelper:allocateCoach() - Coach auto allocated ');
            return saveAllocations(courseId, coaches, students, logger);
        }
    })
    .then(function() {
        deferred.resolve();
    })
    .catch(function(err) {
        logger.error('EnrollmentImportHelper:allocateCoach() - Error - ' + err);
        deferred.reject(err);
    })
    .done();
    return deferred.promise;
}

function autoAllocation(courseId, coaches, students) {
    coaches.forEach(function(coach) {
        coach.learners = [];
    })

    sortCoaches(coaches);
    students.forEach(function(student) {
        student.coach = coaches[0].identifier; // Coach with least learner count
        coaches[0].learnerCount++;
        sortCoaches(coaches);
    });
    return coaches;
}

function saveAllocations(courseId, coaches, students, logger) {

    logger.info('EnrollmentImportHelper:saveAllocations() - Saving all coach allocations for ' + courseId);
    var learnerCoaches = [];
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        logger.info('EnrollmentImportHelper:saveAllocations() - Assigning coach to learners in mongo and learner following coach in pump');
        var promises = [];
        students.forEach(function(student) {
            learnerCoaches.push({learnerId: student.student_id, coachId: student.coach});
            promises.push(assignCoachToStudent(courseId, student, logger));
        });
        return promise_lib.all(promises);
    })
    .then(function() {
        if(learnerCoaches.length > 0) {
            logger.info('EnrollmentImportHelper:saveAllocations() - Updating learner to coach allocations in MW - ' + learnerCoaches.length);
            return learnerEnrollmentHelper.assignCoaches(courseId, learnerCoaches);
        }
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:saveAllocations() - Allocations saved successfully');
        deferred.resolve();
    })
    .catch(function(err) {
        logger.error('EnrollmentImportHelper:saveAllocations() - Allocations save failed - ' + err);
        deferred.reject(err);
    })
    .done();
    return deferred.promise;
}

function assignCoachToStudent(courseId, student, logger) {

    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.update('LearnerStateModel',{courseId: courseId, student_id: student.student_id},{$set:{'tutor': student.coach}},
            function(err, obj) {
                defer.resolve();
            }
        );
        return defer.promise;
    })
    .then(function() {
        // Student to follow coach
        var defer = promise_lib.defer();
        pumpUtil.follow(student.coach, student.student_id, function(err, data) {
            defer.resolve();
        });
        return defer.promise;
    })
    .then(function() {
        deferred.resolve();
    })
    .catch(function(err) {
        logger.error('EnrollmentImportHelper:assignCoachToStudent() - Coach allocation failed for ' + student.student_id + '. Coach to be allocated is ' + student.coach + '. Error - ' + err);
        deferred.reject(err);
    })
    .done();
    return deferred.promise;
}

function courseCommunity(courseId, logger) {
    if(!logger) {
        logger = LoggerUtil.getConsoleLogger();
    }
    logger.info('EnrollmentImportHelper:courseCommunity() - Process Course Community for - ' + courseId);
    var deferred = promise_lib.defer();
    var batches = [];
    promise_lib.resolve()
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.distinct('LearnerStateModel', 'batch', {courseId: courseId}, function(err, distinctBatches) {
            if(err || distinctBatches == null) {
                defer.resolve([]);
            } else {
                batches = distinctBatches;
                defer.resolve();
            }
        });
        return defer.promise;
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:courseCommunity() - Fetched distinct batches - ' + batches.length);
        var defer = promise_lib.defer();
        MongoHelper.find('InstructorCoursesModel', {'courseId': courseId}).toArray(function(err, coaches) {
            defer.resolve(coaches);
        });
        return defer.promise;
    })
    .then(function(coaches) {
        var promises = [];
        coaches.forEach(function(coach) {
            promises.push(coachCommunity(coach, batches, logger));
        });
        return promise_lib.all(promises);
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:courseCommunity() - Community has been processed for all coaches.');
        logger.info('EnrollmentImportHelper:courseCommunity() - About to create course community user and groups.');
        return adminVH.addCommunityToCourse(courseId, logger);
    })
    .then(function(community) {
        logger.info('EnrollmentImportHelper:courseCommunity() - Created course community user and groups.');
        deferred.resolve(community);
    })
    .catch(function(err) {
        logger.info('EnrollmentImportHelper:courseCommunity() - Error processing couse community for - ' + courseId);
        deferred.reject(err);
    }).done();
    return deferred.promise;
}

function coachCommunity(coach, batches, logger) {

    logger.info('EnrollmentImportHelper:coachCommunity() - Process Coach Community for - ' + coach.identifier);
    var pumpAddList = [];
    if(!coach.batches) coach.batches = [];
    var deferred = promise_lib.defer();
    promise_lib.resolve()
    .then(function() {
        return createAllStudentsList(coach);
    })
    .then(function() {
        var batchesToCreate = getBatchesToCreate(coach.batches, batches);
        if(batchesToCreate && batchesToCreate.length > 0) {
            var promises = [];
            batchesToCreate.forEach(function(batchId) {
                promises.push(createBatchInPump(batchId, coach));
            });
            return promise_lib.all(promises);
        }
    })
    .then(function() {
        if(coach.batches.length > 0) {
            var promises = [];
            coach.batches.forEach(function(batch) {
                promises.push(addUsersToBatch(coach, batch, pumpAddList));
            });
            return promise_lib.all(promises);
        }
    })
    .then(function() {
        var defer = promise_lib.defer();
        MongoHelper.update(
            'InstructorCoursesModel',
            {identifier: coach.identifier, courseId: coach.courseId},
            {$set:{batches: coach.batches}},
            function(err, obj) {
                defer.resolve();
            }
        );
        return defer.promise;
    })
    .then(function() {
        var query = {
            courseId: coach.courseId,
            student_id: {$nin: coach.learners},
            roles: {$nin:['tutor', 'faculty']}
        }
        if(coach.role == 'coach') query['tutor'] = coach.identifier;
        var defer = promise_lib.defer();
        MongoHelper.find('LearnerStateModel', query, {student_id: 1}).toArray(function(err, learners) {
            if(err || learners == null) {
                defer.resolve();
            } else {
                defer.resolve(learners);
            }
        });
        return defer.promise;
    })
    .then(function(learnersToAdd) {
        if(learnersToAdd && learnersToAdd.length > 0) {
            var newLearners = [];
            learnersToAdd.forEach(function(learner) {
                pumpAddList.push({userId: coach.identifier, learnerId: learner.student_id, groupId: coach.allStudentsList});
                newLearners.push(learner.student_id);
            });
            var defer = promise_lib.defer();
            MongoHelper.update(
                'InstructorCoursesModel',
                {identifier: coach.identifier, courseId: coach.courseId},
                {
                    $inc:{'learnerCount': newLearners.length},
                    $pushAll: {'learners': newLearners}
                },
                function(err, inst) {
                    defer.resolve();
                }
            );
            return defer.promise;
        }
    })
    .then(function() {
        if(pumpAddList && pumpAddList.length > 0) {
            var promises = [];
            pumpAddList.forEach(function(item) {
                promises.push(addMemberToGroup(item.userId, item.learnerId, item.groupId));
            });
            return promise_lib.all(promises);
        }
    })
    .then(function() {
        logger.info('EnrollmentImportHelper:coachCommunity() - Coach Community processed for - ' + coach.identifier);
        deferred.resolve();
    })
    .catch(function(err) {
        logger.info('EnrollmentImportHelper:coachCommunity() - Error in process coach Community for - ' + coach.identifier + '. Error - ' + err);
        deferred.reject(err);
    }).done();
    return deferred.promise;
}

function createAllStudentsList(coach) {
    var defer = promise_lib.defer();
    if(!coach.allStudentsList || typeof coach.allStudentsList == 'undefined') {
        var listName = 'My students in ' + coach.courseName;
        var description = 'List of all students in ' + coach.courseName + ' where I am the coach.';
        if(validator.equals(coach.role, 'faculty')) {
            description = 'List of all students in ' + coach.courseName;
        }
        var context = {
            "objectType": "context",
            "courseId": coach.courseId,
            "listType": "system"
        }

        pumpUtil.createList(coach.identifier, listName, description, context, function(err, data) {
            if(!data.error) {
                coach.allStudentsList = pumpHelper.getListId(data.object.id);
                MongoHelper.update(
                    'InstructorCoursesModel',
                    {identifier: coach.identifier, courseId: coach.courseId},
                    {$set: {allStudentsList: pumpHelper.getListId(data.object.id)}},
                    function(err, inst) {
                        defer.resolve();
                    }
                );
            } else {
                defer.resolve();
            }
        });
    } else {
        defer.resolve();
    }
    return defer.promise;
}

function getBatchesToCreate(coachBatches, batches) {
    var batchesToCreate = [];
    var existingBatches = [];
    coachBatches.forEach(function(batch) {
        existingBatches.push(batch.batchId);
    });
    if(batches.length > 0) {
        batches.forEach(function(batchId) {
            if(existingBatches.indexOf(batchId) == -1) {
                batchesToCreate.push(batchId);
            }
        })
    }
    return batchesToCreate;
}

function createBatchInPump(batchId, coach) {
    var groupName = 'Students in batch ' + batchId + ' of ' + coach.courseName;
    var description = groupName;
    var context = {
        "objectType": "context",
        "courseId": coach.courseId,
        "listType": "system",
        "isBatch": true,
        "batch": batchId
    }
    var batch = {
        batchId: batchId,
        batchGroupId: groupName,
        groupName: groupName,
        groupCount: 0,
        learners: []
    }
    var deferred = promise_lib.defer();
    pumpUtil.createList(coach.identifier, groupName, description, context, function(err, data) {
        if(!data.error) {
            batch.batchGroupId = pumpHelper.getListId(data.object.id);
        }
        coach.batches.push(batch);
        deferred.resolve();
    });
    return deferred.promise;
}

function addUsersToBatch(coach, batch, pumpAddList) {

    var query = {
        courseId: coach.courseId,
        batch: batch.batchId,
        student_id: {$nin: batch.learners},
        roles: {$nin:['tutor', 'faculty']}
    };
    if(coach.role == 'coach') query['tutor'] = coach.identifier;
    var deferred = promise_lib.defer();
    MongoHelper.find('LearnerStateModel', query, {student_id: 1}).toArray(function(err, learners) {
        if(err || learners == null || learners.length == 0) {
            deferred.resolve();
        } else {
            learners.forEach(function(learner) {
                pumpAddList.push({userId: coach.identifier, learnerId: learner.student_id, groupId: batch.batchGroupId});
                batch.groupCount++;
                batch.learners.push(learner.student_id);
            });
            deferred.resolve();
        }
    });
    return deferred.promise;
}

function addMemberToGroup(userId, memberId, groupId) {

    var deferred = promise_lib.defer();
    pumpUtil.addMemberToList(userId, pumpHelper.getListId(groupId), memberId, function(err, data) {
        deferred.resolve();
    });
    return deferred.promise;
}

function sortCoaches(coaches) {
    coaches.sort(function(a, b){
        return a['learnerCount'] - b['learnerCount'];
    });
}

function getCoaches(courseId) {
    var deferred = promise_lib.defer();
    MongoHelper.find('InstructorCoursesModel', {'courseId': courseId, role: {$ne: 'faculty'}}).toArray(function(err, coaches) {
        deferred.resolve(coaches);
    });
    return deferred.promise;
}

function getUnallocatedStudents(courseId) {
    var deferred = promise_lib.defer();
    MongoHelper.find('LearnerStateModel', {courseId: courseId, roles: {$in:['student']}, $or:[{'tutor': { $exists: false }},{'tutor': null}]}, {student_id: 1, batch: 1}).toArray(function(err, students) {
        deferred.resolve(students);
    });
    return deferred.promise;
}

exports.clearCourseCommunity = function(req, res) {
    var courseId = req.body.courseId;
    promise_lib.resolve()
    .then(function() {
        return clearCourseCommunity(courseId, true);
    })
    .then(function() {
        res.send('Course community has been cleared');
    })
    .catch(function(err) {
        console.log('Error clearing up course community', err);
        res.send(err);
    }).done();
}

function clearCourseCommunity(courseId, clearFaculty) {

    console.log('#### Clear course community for - ', courseId, ' ####');
    var deferred = promise_lib.defer();
    var query = {courseId: courseId};
    if(!clearFaculty) {
        query = {courseId: courseId, role: {$ne: 'faculty'}};
    }
    promise_lib.resolve()
    .then(function() {
        console.log('#### Cleaning up instructor courses model ####');
        var defer = promise_lib.defer();

        MongoHelper.update(
            'InstructorCoursesModel',
            query,
            {$set: {learnerCount: 0, allStudentsList: null, learners: [], batches: []}},
            {multi: true},
            function(err, obj) {
                console.log('Updated records - ', obj, 'err', err);
                defer.resolve();
            }
        )
        return defer.promise;
    })
    .then(function() {
        console.log('#### Instructor courses model cleaned up. ####');
        var defer = promise_lib.defer();
        MongoHelper.find('InstructorCoursesModel', query, {identifier: 1}).toArray(function(err, coaches) {
            defer.resolve(coaches);
        });
        return defer.promise;
    })
    .then(function(coaches) {
        var userIds = [];
        coaches.forEach(function(coach) {
            userIds.push(coach.identifier);
        });
        return pumpHelper.deleteUserLists(userIds, courseId);
    })
    .then(function() {
        deferred.resolve();
    })
    .catch(function(err) {
        deferred.reject(err);
    }).done();
    return deferred.promise;
}

exports.resetCourseCommunity = function(req, res) {

    var courseId = req.body.courseId;
    promise_lib.resolve()
    .then(function() {
        return clearCourseCommunity(courseId, true);
    })
    .then(function() {
        console.log('#### Deleted all coaches groups in community ####');
        return courseCommunity(courseId);
    })
    .then(function(community) {
        res.json(community);
    })
    .catch(function(err) {
        console.log('Error resetting course community', err);
        res.send(err);
    }).done();
}

exports.syncPump = function(req, res) {
    var skip = parseInt(req.params.skip)||0;
    var limit = parseInt(req.params.limit)||3000;
    promise_lib.resolve()
    .then(function() {
        var deferred = promise_lib.defer();
        MongoHelper.find('UserModel', {}, {identifier: 1, displayName: 1, 'metadata.image': 1}).skip(skip).limit(limit).toArray(function(err, users) {
            if(err || users == null) {
                deferred.reject('No users found');
            } else {
                deferred.resolve(users);
            }
        });
        return deferred.promise;
    })
    .then(function(users) {
        console.log('Users list size:', users.length);
        var promises = [];
        users.forEach(function(user) {
            promises.push(createUserInPump(user, 'ilimi123$'));
        });
        return promise_lib.all(promises);
    })
    .then(function() {
        res.send('Users synced in pump');
        //TODO: Sync course communities
    })
    .catch(function(err) {
        console.log('Error resetting course community', err);
        res.send(err);
    }).done();
}

function createUserInPump(user, password) {
    var deferred = promise_lib.defer();
    pumpUtil.getUser(user.identifier, function(err, data) {
        var image = (user.metadata && user.metadata.image) ? user.metadata.image : '';
        if (err || data.error) {
            console.log('User does not exist in pump - create');
            // User doesnot exist in pump. Create one...
            pumpUtil.createUser(user.identifier, password, user.displayName, image, function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        } else {
            console.log('User exists in pump. Update profile...');
            pumpUtil.updateUserProfile(user.identifier, user.displayName, image, function(err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        }
    });
    return deferred.promise;
}

exports.resetCoachCommunities = function(courseId) {

    var deferred = promise_lib.defer();
    promise_lib.resolve()
    //.then(function() {
    //    return clearCourseCommunity(courseId, false);
    //})
    .then(function() {
        //console.log('#### Deleted all coaches groups in community ####');
        return courseCommunity(courseId);
    })
    .then(function() {
        deferred.resolve();
    })
    .catch(function(err) {
        deferred.reject('Error in resetCoachCommunities() - ', err);
    }).done();
    return deferred.promise;
}
exports.allocateCoach = allocateCoach;