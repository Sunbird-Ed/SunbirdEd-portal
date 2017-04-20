/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Util for CSV import/export.
 *
 * @author Mahesh
 */

var mongoose = require('mongoose');
var promise_lib = require('when');
var fs = require('fs');
MongoHelper = require('./MongoHelper');
var UserImportHelper = require('../view_helpers/UserImportHelper');
var enrollmentHelper = require('../view_helpers/EnrollmentImportHelper');
var CourseImportHelper = require('../view_helpers/studio/CourseImportHelper');
var ViewHelperUtil = require('./ViewHelperUtil');
var assessmentsImportExportViewHelper = require('../view_helpers/AssessmentsImportExportViewHelper');
require('date-format-lite');

// Import types.
exports.USER_IMPORT = 'user-import';
exports.USER_DELETE = 'user-delete';
exports.CONTENT_DELETE = 'content-delete';
exports.CONTENT_IMPORT = 'content-import';
exports.CONCEPT_IMPORT = 'concept-import';
exports.ENROLLMENT_IMPORT = 'enroll-import';
exports.COURSE_CONTENT_UPLOAD = 'course-content-upload';
exports.QUESTIONS_IMPORT = 'questions-import';

// Import status
exports.PENDING = 'pending';
exports.PROCESSING = 'processing';
exports.COMPLETE = 'complete';
exports.FAIL = 'fail';
exports.SUCCESS = 'success';
exports.INSERT = 'insert';
exports.UPDATE = 'update';
exports.DELETE = 'delete';

var synchronousTypes = ['concept-import', 'content-import'];

exports.initalizeCSVImport = function(file, importObject) {
	var deferred = promise_lib.defer();
	importObject.importFilename = file.name;
	importObject.importFileType = file.type;
    importObject.importFilePath = appConfig.CSV_UPLOAD_DIR + Date.parse(new Date()) + '_' + importObject.importFilename;
	fs.readFile(file.path, function (err, data) {
	  	fs.writeFile(importObject.importFilePath, data, function (err) {
	  		deferred.resolve();
	  	});
	});
	return deferred.promise;
}

exports.createCSVImportQueueRecord = function(logData) {
	var deferred = promise_lib.defer();
	CSVImportQueueModel = mongoose.model('CSVImportQueueModel');
	promise_lib.resolve()
	.then(function() {
		return exports.PENDING;
	})
	.then(function(status) {
		// console.log("save record...");
		var deferred = promise_lib.defer();
		csvImportQueueModel = new CSVImportQueueModel();
		csvImportQueueModel.identifier = csvImportQueueModel._id;

		for(var k in logData) {
			if (k != "__v" && k != "_id") {
				csvImportQueueModel[k]=logData[k];
			}
		}
		csvImportQueueModel.uploadTime = new Date();
		csvImportQueueModel.status = status;
		csvImportQueueModel.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.then(function(object) {
		console.log('Import type', logData.type);
		console.log('Process import in parallel');
		EventHelper.emitEvent('processCSVImportQueueRecord', object.identifier);
		object.status = exports.PROCESSING;
		return object;
	})
	.done(function(object) {
		deferred.resolve(object);
	});

	return deferred.promise;

}

exports.updateCSVImportQueueRecord = function(logData) {
	var deferred = promise_lib.defer();
	CSVImportQueueModel = mongoose.model('CSVImportQueueModel');

	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(CSVImportQueueModel.findOne, CSVImportQueueModel, [{'identifier': logData.identifier}]))
	.then(function(record) {
		var deferred = promise_lib.defer();
		if(!record) {
			record = new CSVImportQueueModel();
			record.identifier = record._id;
		}

		for(var k in logData) {
			if (k != "__v" && k != "_id") {
				record[k]=logData[k];
			}
		}
		record.save(function(err, object) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.then(function(object) {
		if(object.status == exports.COMPLETE || object.status == exports.FAIL) {
			processPendingRecords();
		}
		return object;
	})
	.done(function(object) {
		deferred.resolve(object);
	});

	return deferred.promise;	
}

function getQueueRecord(identifier) {
	var deferred = promise_lib.defer();
	CSVImportQueueModel = mongoose.model('CSVImportQueueModel');
	promise_lib.resolve()
	.then(ViewHelperUtil.promisifyWithArgs(CSVImportQueueModel.findOne, CSVImportQueueModel, [{'identifier': identifier}]))
	.done(function(record) {
		deferred.resolve(record);
	});
	return deferred.promise;
}

exports.getCSVImportQueueRecord = function(req, res) {
	var errors = [];
	var identifier = req.params.queueRecordId;
	promise_lib.resolve()
	.then(function() {
		return getQueueRecord(identifier);
	})
	.catch(function(err) {
		console.log("Error:",err);
		if(err) errors.push(err);
	})
	.done(function(record){
		res.send(JSON.stringify(record));
	})
}

exports.getImportQueue = function(req, res) {
	var errors = [];
	CSVImportQueueModel = mongoose.model('CSVImportQueueModel');

	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		MongoHelper.find('CSVImportQueueModel', { $query: {}, $orderby: { 'uploadTime': -1 } }).toArray(function(err, queue) {
			if(err) {
				deferred.reject(err);
			} else {
				deferred.resolve(queue);
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		if(err) {
			// console.log("Error: "+err);
			errors.push(err);
		}
	})
	.done(function(queue) {
		res.send(queue);
	});
}

exports.autoStartPendingRecords = function() {
	console.log("Auto Started Pending Records......");
	processPendingRecords();
}

function processPendingRecords() {
	var errors = [];
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		CSVImportQueueModel.findOne({'status': exports.PENDING}, function(err, record) {
			if(err) {
				deferred.reject('Error:'+err);
			} else if(record) {
				EventHelper.emitEvent('processCSVImportQueueRecord', record.identifier);
				record.status = exports.PROCESSING;
				deferred.resolve(record);
			} else {
				deferred.resolve('No CSV Import records to process...');
			}
		});
		return deferred.promise;
	})
	.catch(function(err) {
		if(err) errors.push(err);
	})
	.done(function(message) {
		if(errors.length > 0) {
			console.log(errors);
		} else {
			console.log(message);
		}
	})
}

exports.processCSVImportQueueRecord = function(identifier) {
	var errors = [];
    var importRecord = null;
    promise_lib.resolve()
    .then(function() {
        return getQueueRecord(identifier);
    })
    .then(function(record) {
        var deferred = promise_lib.defer();
        record.status = exports.PROCESSING;
        record.save(function(err, record) {
            deferred.resolve(record);
        });
        return deferred.promise;
    })
    .then(function(record) {
        var deferred = promise_lib.defer();
        importRecord = record;
        fs.readFile(record.filepath, function(err, data) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(JSON.parse(data));
            }
        });
        return deferred.promise;
    })
    .then(function(json) {
        console.log("Processing record:", importRecord.type);
        if(importRecord.type == exports.USER_IMPORT) {
            UserImportHelper.saveUsers(json, importRecord);
        } else if(importRecord.type == exports.USER_DELETE) {
            UserImportHelper.deleteUsers(json, importRecord);
        } else if(importRecord.type == exports.CONTENT_DELETE) {
        	CourseImportHelper.deleteObjects(json, importRecord);
        } else if(importRecord.type == exports.CONTENT_IMPORT) {
        	CourseImportHelper.createGraph(json, importRecord);
        } else if(importRecord.type == exports.CONCEPT_IMPORT) {
        	CourseImportHelper.createConceptGraph(json, importRecord);
        } else if(importRecord.type == exports.ENROLLMENT_IMPORT) {
        	enrollmentHelper.importEnrollment(json, importRecord);
        } else if(importRecord.type == exports.QUESTIONS_IMPORT) {
        	assessmentsImportExportViewHelper.saveAssessmentData(json, importRecord);
        } else {
            console.log("Import type:"+importRecord.type+" is not found...");
        }
    })
    .catch(function(err) {
        console.log("Error: "+err);
        if(err) errors.push(err);
    })
    .done(function() {
        console.log("Processing: "+importRecord);
    });
}

exports.downloadOriginal = function(req, res) {
	var errors = [];
	var identifier = req.params.id;
 	var filePath, fileName, fileType;

 	promise_lib.resolve()
 	.then(function() {
 		var deferred = promise_lib.defer();
 		MongoHelper.findOne('CSVImportQueueModel', {"identifier": identifier}, function(err, object) {
 			if(object && object.importFilePath) {
 				fileName = object.importFilename;
 				filePath = object.importFilePath;
 				fileType = object.importFileType;
 			}
 			deferred.resolve();
 		});
 		return deferred.promise;
 	})
	.done(function() {
		var deferred = promise_lib.defer();
		fs.readFile(filePath, function read(err, data) {
		    if(err) {
				res.send("Error downloading file...");
			} else {
				var extension = filePath.substring(filePath.length-3, filePath.length);
				var contentType = 'text/plain';
				if (extension == 'zip') {
					contentType = 'application/zip';
				}
				res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
			    res.set('Content-Type', 'application/octet-stream');
			    res.set('Content-Type', (fileType ? fileType : contentType));
			    res.write(new Buffer(data));
			    if(errors.length > 0) {
			    	res.write(JSON.stringify(errors));
			    }
			    res.end();
			}
		});
	});
}

exports.downloadCSV = function(req, res) {
	var errors = [];
	var identifier = req.params.id;
 	var filePath = appConfig.CSV_UPLOAD_DIR+identifier+'.csv';

 	promise_lib.resolve()
 	.then(function() {
 		var deferred = promise_lib.defer();
 		MongoHelper.findOne('CSVImportQueueModel', {"identifier": identifier}, function(err, object) {
 			if(object && object.filepath) {
 				filePath = object.filepath;
 			}
 			deferred.resolve();
 		});
 		return deferred.promise;
 	})
	.done(function() {
		var deferred = promise_lib.defer();
		fs.readFile(filePath, function read(err, data) {
		    if(err) {
				res.send("Error downloading file...");
			} else {
				var extension = filePath.substring(filePath.length-3, filePath.length);
				var contentType = 'text/plain';
				if (extension == 'zip') {
					contentType = 'application/zip';
				}
				res.setHeader('Content-disposition', 'attachment; filename='+identifier+'.' + extension);
			    res.set('Content-Type', 'application/octet-stream');
			    res.set('Content-Type', contentType);
			    res.write(new Buffer(data));
			    if(errors.length > 0) {
			    	res.write(JSON.stringify(errors));
			    }
			    res.end();
			}
		});
	});
}

exports.fialCSVImportProcessingRecords = function(){
	CSVImportQueueModel = mongoose.model('CSVImportQueueModel');
	CSVImportQueueModel.find({'status': exports.PROCESSING}).exec(function(err, records) {
		if(err) {
			console.log('Error:'+err);
		} else if(records) {
			for(var key in records){
				records[key].status = exports.FAIL
				records[key].save();
			}
			//console.log(records);
			console.log(records.length + ' record(s) set to fail status...' )
		} else {
			console.log('No CSV Import records in progress state to fail...');
		}
	});
}

exports.deleteFile = function(filePath) {
	fs.unlink(filePath, function() {
		console.log("File deleted: "+filePath);
	});
}

exports.updateStatistics = function(json, statistics) {
    for (k in json) {
        var object = json[k];
        if (object.saveType == exports.INSERT) statistics.inserted++;
        if (object.saveType == exports.UPDATE) statistics.updated++;
        if (object.saveType == exports.DELETE) statistics.deleted++;
        if (object.status == exports.FAIL) statistics.failed++;
    }
    return statistics;
}

exports.saveJsonAsCSV = function(jsonWithStates, headerFields, statistics) {
    var filePath = appConfig.CSV_UPLOAD_DIR + statistics['identifier'] + '.csv';
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
            fs.writeFile(filePath, csv, function(err) {
                deferred.resolve(filePath);
            });
        }
    });
    return deferred.promise;
}

exports.finishImport = function(jsonWithStates, headerFields, statistics, errors) {
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		return exports.saveJsonAsCSV(jsonWithStates, headerFields, statistics);
	})
	.then(function(filePath) {
		var jsonFilePath = statistics.filepath;
        exports.deleteFile(jsonFilePath);
        statistics.filepath = filePath;
        statistics.endTime = new Date();
        statistics.exeTime = statistics.endTime.getTime() - statistics.startTime.getTime();
        if(errors.length > 0) {
            statistics.status = exports.FAIL;
        } else {
            statistics.status = exports.COMPLETE;
        }
        statistics = exports.updateStatistics(jsonWithStates, statistics);
        console.log("Completed Processing Queue record: "+statistics.identifier);
        console.log("Statistics: " + statistics);
        exports.updateCSVImportQueueRecord(statistics);
	})
	.then(function() {
		deferred.resolve();
	})
	.catch(function(err) {
		deferred.reject(err);
	})
	return deferred.promise;
}
