var AdmZip = require('adm-zip');
var MWServiceProvider = require("../commons/MWServiceProvider");
var promise_lib = require('when');
var ViewHelperUtil = require('../commons/ViewHelperUtil');
var mongoose = require('mongoose');
var fse = require('fs-extra');
var CSVImportUtil = require('../commons/CSVImportUtil');
var csv = require('csv');
var parse = require('csv-parse');
var transform = require('stream-transform');
var stringify = require('csv-stringify');

exports.exportAssessmentData = function(req, res) {
    var courseId = req.params.id;
    var error = [];
    var reqData = {};
    reqData.COURSE_ID = courseId;
	var zip = new AdmZip();
    var learningElementMap = {};
    var assessmentData = null;
	
    console.log('Exporting assessment data for course ' + courseId);
	promise_lib.resolve()
        .then(ViewHelperUtil.promisifyWithArgs(MWServiceProvider.callServiceStandardWithUser, 
        	MWServiceProvider, ["assessmentService", "getAssessmentDataForCourse", reqData, req.user]))	
        .then (function (mwdata) {
            if (!mwdata || !mwdata.responseValueObjects || !mwdata.responseValueObjects.STATUS 
                || mwdata.responseValueObjects.STATUS.statusType != "SUCCESS") {
                error.push(mwdata);  
                console.log(mwdata.responseValueObjects.STATUS.statusMessage);
                throw  mwdata.responseValueObjects.STATUS.statusMessage;
            }
            return mwdata;
        })   
        .then(function(value) {
            console.log('Fetched Assessment data. Applying learning element transformations for course ' + courseId);

            assessmentData = value;

            learningElementMap[courseId] = courseId;
            
            // var deferred = promise_lib.defer();

            var promises = [];
            var csvMap = assessmentData.responseValueObjects.ASSESSMENT_ITEMS.valueMap;
            for (questionSubtype in csvMap) {
                promises.push(readLEsFromCSV(questionSubtype, csvMap[questionSubtype], learningElementMap));
            }
            
            return promise_lib.all(promises)
            .then(function(values) {
                // var objectList = assessmentData.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList;
                // var arrayLength = objectList.length;
                // for (var i = 0; i < arrayLength; i++) {
                //     if (objectList[i].learningElements) {
                //         var jLength = objectList[i].learningElements.length;
                //         for (var j = 0; j < jLength; j++) {
                //             learningElementMap[objectList[i].learningElements[j]] = objectList[i].learningElements[j];
                //         }
                //     }
                // }

                // Questions Sets
                var objectList = assessmentData.responseValueObjects.ITEM_SETS.valueObjectList;
                var arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].metadata.learningElement) {
                        learningElementMap[objectList[i].metadata.learningElement] = objectList[i].metadata.learningElement;
                    }
                    if (objectList[i].criteria) {
                        var jLength = objectList[i].criteria.length;
                        for (var j = 0; j < jLength; j++) {
                            if (objectList[i].criteria[j].name == "learningElement") {
                                var kLength = objectList[i].criteria[j].valueList.length;
                                for (var k = 0; k < kLength; k++) {
                                    learningElementMap[objectList[i].criteria[j].valueList[k]] = objectList[i].criteria[j].valueList[k];
                                }                            
                            }
                        }
                    }
                }

                // Questions Papers
                objectList = assessmentData.responseValueObjects.QUESTION_PAPERS.valueObjectList;
                arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].context) {
                        learningElementMap[objectList[i].context] = objectList[i].context;
                    }
                }
            })
            .then(function() {
                console.log('Fetching mappings for learning elements...'); 
                    // + JSON.stringify(learningElementMap));
                var loModel = mongoose.model('LearningObjectModel');
                var lsModel = mongoose.model('LearningResourceModel');
                var promises = [];
                for (k in learningElementMap) {
                    promises.push(getExternalIdentifier(k,loModel));
                    promises.push(getExternalIdentifier(k,lsModel));
                }
                return promise_lib.all(promises);
            })
            .then(function(values) {
                console.log('Fetched mappings for learning elements.');
                var leMapIndex = 0;
                // console.log(data);
                for (k in learningElementMap) {
                    if (values[leMapIndex*2] && values[leMapIndex*2].length > 0) {
                        learningElementMap[k] = values[leMapIndex*2];
                    } else
                    if (values[(leMapIndex*2)+1] && values[(leMapIndex*2)+1].length > 0) {
                        learningElementMap[k] = values[(leMapIndex*2)+1];
                    }
                    leMapIndex++;
                }
                // console.log('Learning elements: ' + JSON.stringify(learningElementMap));
                return learningElementMap;
            });


        })
        .then(function() {

            var csvMap = assessmentData.responseValueObjects.ASSESSMENT_ITEMS.valueMap;
            // for (k in learningElementMap) {
            //     for (questionSubtype in csvMap) {
            //         csvMap[questionSubtype] = replaceAll(csvMap[questionSubtype],k,learningElementMap[k]);

            //     }
            // }

            var promises = [];
            for (questionSubtype in csvMap) {
                promises.push(replaceLEsinCSV(csvMap[questionSubtype], learningElementMap, questionSubtype));
            }
            
            return promise_lib.all(promises)
            .then(function(csvs) {
                var index = 0;
                for (questionSubtype in csvMap) {
                    csvMap[questionSubtype] = csvs[index];
                    index++;
                }
            })
            .then(function() {

                // Questions
                // var objectList = assessmentData.responseValueObjects.ASSESSMENT_ITEM_LIST.valueObjectList;
                // var arrayLength = objectList.length;
                // for (var i = 0; i < arrayLength; i++) {
                //     if (objectList[i].learningElements) {
                //         var externalLEIds = [];
                //         var jLength = objectList[i].learningElements.length;
                //         for (var j = 0; j < jLength; j++) {
                //             externalLEIds.push(learningElementMap[objectList[i].learningElements[j]]);
                //         }
                //         objectList[i].learningElements = externalLEIds;
                //     }
                //     objectList[i].courseId = learningElementMap[courseId];
                // }

                // Questions Sets
                var objectList = assessmentData.responseValueObjects.ITEM_SETS.valueObjectList;
                var arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].metadata.learningElement) {
                        objectList[i].metadata.learningElement = learningElementMap[objectList[i].metadata.learningElement];
                    }
                    if (objectList[i].criteria) {
                        var jLength = objectList[i].criteria.length;
                        for (var j = 0; j < jLength; j++) {
                            if (objectList[i].criteria[j].name == "learningElement") {
                                var externalLEIds = [];
                                var kLength = objectList[i].criteria[j].valueList.length;
                                for (var k = 0; k < kLength; k++) {
                                    externalLEIds.push(learningElementMap[objectList[i].criteria[j].valueList[k]]);
                                } 
                                objectList[i].criteria[j].valueList = externalLEIds;
                            } else if (objectList[i].criteria[j].name == "courseId") {
                                objectList[i].criteria[j].value = learningElementMap[courseId];
                            } 
                        }
                    }
                    objectList[i].metadata.courseId = learningElementMap[courseId];
                }

                // Questions Papers
                objectList = assessmentData.responseValueObjects.QUESTION_PAPERS.valueObjectList;
                arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].context) {
                        objectList[i].context = learningElementMap[objectList[i].context];
                    }
                    objectList[i].courseId = learningElementMap[courseId];
                }

                // Tests
                objectList = assessmentData.responseValueObjects.ASSESSMENT_TESTS.valueObjectList;
                arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    objectList[i].courseId = learningElementMap[courseId];
                }
                // console.log('Applied learning element transformations for course ' + courseId);

                console.log('Applied learning element transformations for course ' + courseId);
                return assessmentData;
            });
        })
        .then(function(value) {
	        
            var csvMap = value.responseValueObjects.ASSESSMENT_ITEMS.valueMap;
            for (questionSubtype in csvMap) {
                zip.addFile(questionSubtype + "Questions.csv", 
                    new Buffer(csvMap[questionSubtype]));
            }
          //   zip.addFile("Questions.json", 
	        	// new Buffer(JSON.stringify({ASSESSMENT_ITEM_LIST:value.responseValueObjects.ASSESSMENT_ITEM_LIST})));
	        zip.addFile("QuestionSets.json", 
	        	new Buffer(JSON.stringify({ITEM_SETS:value.responseValueObjects.ITEM_SETS})));
	        zip.addFile("QuestionPapers.json", 
	        	new Buffer(JSON.stringify({QUESTION_PAPERS:value.responseValueObjects.QUESTION_PAPERS})));
            zip.addFile("ConcretePapers.json", 
                new Buffer(JSON.stringify({CONCRETE_PAPERS:value.responseValueObjects.CONCRETE_PAPERS})));
	        zip.addFile("Tests.json", 
	        	new Buffer(JSON.stringify({ASSESSMENT_TESTS:value.responseValueObjects.ASSESSMENT_TESTS})));

            console.log('Constructing assessment data zip file for course ' + courseId);
            return value;
        })
        .catch(function(err) {
            console.log('err', err);
            error.push(err);
        })
        .done(function(value) {
            // console.log(JSON.stringify(value));
            if (error.length > 0) {
                console.log('error importing assessment data for course ' + courseId);
                console.log('error: ' + error);
                res.send(error);
            } else {
	            var willSendthis = zip.toBuffer();
	            res.setHeader('Content-disposition', 'attachment; filename=course_' + Date.parse(new Date()) + '.zip');
	            res.set('Content-Type', 'application/zip');
	            res.write(willSendthis);
	            res.end();            	
                console.log('Done sending assessment data for ' + courseId);
            }
        });


}

function replaceLEsinCSV(csvData, learningElementMap, questionSubtype){
    var deferred = promise_lib.defer();
    var rowIndex = 0;
    var learningElementsIndex = -1;
    var header = null;
    parse(csvData, function(err, data){
        if (err) {
            deferred.reject(err);
        } else {
            transform(data, function(row){
                // The actual transformation for each row
                if (rowIndex == 0) {
                    header = row;
                    for (k in header) {
                        if (header[k]=='learningElements') {
                            learningElementsIndex = k;
                        }
                    }
                } else {
                    if (learningElementsIndex > 0 && row[learningElementsIndex] && row[learningElementsIndex].length > 0) {
                        var leListForRow = row[learningElementsIndex].split("|");
                        
                        var arrayLength = leListForRow.length;
                        var replacedLE = '';
                        for (var i = 0; i < arrayLength; i++) {
                            if (i>0) {
                                replacedLE += '|';
                            }
                            replacedLE += learningElementMap[leListForRow[i]];
                            //Do something
                        }
                        row[learningElementsIndex] = replacedLE;
                        // console.log(row[learningElementsIndex]);
                    }
                }
                rowIndex++;
                return row;
            }, function(err, data){
                if (err) {
                    deferred.reject(err);
                } else {
                  stringify(data, function(err, data){
                    if (err) {
                        deferred.reject(err);
                    } else {
                        console.log('Finished replacing learning elements from CSV ' + questionSubtype);
                        deferred.resolve(data);
                    }
                  });
                }
            });
        }
    });
    return deferred.promise;
}

function readLEsFromCSV(questionSubtype, csvData, learningElementMap){
    var deferred = promise_lib.defer();
    var rowIndex = 0;
    var learningElementsIndex = -1;
    var header = null;
    parse(csvData, function(err, data){
        if (err) {
            deferred.reject(err);
        } else {
            transform(data, function(row){
                // The actual transformation for each row
                if (rowIndex == 0) {
                    header = row;
                    for (k in header) {
                        if (header[k]=='learningElements') {
                            learningElementsIndex = k;
                        }
                    }
                } else {
                    if (learningElementsIndex > 0 && row[learningElementsIndex] && row[learningElementsIndex].length > 0) {
                        var leListForRow = row[learningElementsIndex].split("|");
                        
                        var arrayLength = leListForRow.length;
                        for (var i = 0; i < arrayLength; i++) {
                            learningElementMap[leListForRow[i]]=leListForRow[i];
                            //Do something
                        }
                  }
                }
                rowIndex++;
                return row;
            }, function(err, data){
                if (err) {
                    deferred.reject(err);
                } else {
                    console.log('Finished reading learning elements from CSV ' + questionSubtype);
                    deferred.resolve(data);
                }
            });
        }
    });
    return deferred.promise;
    // var deferred = promise_lib.defer();
    // var learningElementsIndex = -1;
    // var header = null;
    // csv()
    // .from(csvData)
    // .on('record', function(row, index) {
    //     if (index == 0) {
    //         header = row;
    //         for (k in header) {
    //             if (header[k]=='learningElements') {
    //                 learningElementsIndex = k;
    //             }
    //         }
    //     } else {
    //         if (learningElementsIndex > 0 && row[learningElementsIndex] && row[learningElementsIndex].length > 0) {
    //             var leListForRow = row[learningElementsIndex].split("|");
                
    //             var arrayLength = leListForRow.length;
    //             for (var i = 0; i < arrayLength; i++) {
    //                 learningElementMap[leListForRow[i]]=leListForRow[i];
    //                 //Do something
    //             }

    //             // console.log(row[learningElementsIndex]);
    //         }
    //     }
    //     console.log('Reading Record '+index+' from CSV ' + questionSubtype);
    // })
    // .on('end', function(count) {
    //     console.log('Finished reading learning elements from CSV ' + questionSubtype);
    //     deferred.resolve("");
    // })
    // .on('error', function(error) {
    //     console.log('error', error);
    //     deferred.reject(error);
    // });

    // deferred.promise;

}

exports.importAssessmentData = function(req, res) {
    var file = req.files.importFile;
    var courseId = req.body.courseId;
    var json = {};

    var originalFileName = Date.parse(new Date())+ '_' + file.name;
    var originalFileCopyPath = appConfig.CSV_UPLOAD_DIR+originalFileName;
    json.originalFileCopyPath = originalFileCopyPath;
    json.courseId = courseId;
    json.user = req.user;

    var stagingFileName = Date.parse(new Date())+'.json';
    var stagingFilePath = appConfig.CSV_UPLOAD_DIR+stagingFileName;

    var statistics = {
        total: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        duplicate: 0,
        uploadedBy: req.user.identifier,
        importFilename: file.name,
        filepath: stagingFilePath,
        type: CSVImportUtil.QUESTIONS_IMPORT,
        startTime: new Date()
    };

    promise_lib.resolve()
    .then(function() {
        return CSVImportUtil.initalizeCSVImport(file, statistics);
    })
    .then(
        ViewHelperUtil.promisifyWithArgs(fse.copy,
            fse, [file.path, originalFileCopyPath])
    )
    .then (
        ViewHelperUtil.promisifyWithArgs(fse.writeFile,
            fse, [stagingFilePath, JSON.stringify(json)])
    )
    .then(function() {
        return CSVImportUtil.createCSVImportQueueRecord(statistics);
    })
    .done(function(logRecord){
        res.send(JSON.stringify(logRecord));
    });
}

exports.saveAssessmentData = function(json, importRecord) {
    var courseId = json.courseId;
    console.log("File: "+ json.originalFileCopyPath);
    var error = [];
	var zip = new AdmZip(json.originalFileCopyPath);
	var reqObj = {
        ASSESSMENT_ITEMS:{valueMap:{}},
        // ASSESSMENT_ITEM_LIST:{valueObjectList:[]},
        ITEM_SETS:{valueObjectList:[]},
        QUESTION_PAPERS:{valueObjectList:[]},
        CONCRETE_PAPERS:{valueObjectList:[]},
        ASSESSMENT_TESTS:{valueObjectList:[]}
    };
    reqObj.COURSE_ID = courseId;

    var learningElementMap = {};
    var totalObjects = 0;

	promise_lib.resolve()
        .then(function() {
            console.log("Getting zip entries for " + importRecord.importFilename + " for course: " + courseId);
            var zipEntries = zip.getEntries();
            console.log("Number of files: " + zipEntries.length);
            zipEntries.forEach(function(zipEntry) {
                console.log('Reading file ' + zipEntry.entryName);
                if (zipEntry.entryName == "QuestionSets.json") {
                    try {
                        var obj = JSON.parse(zip.readAsText(zipEntry.entryName)); 
                        console.log("Parsed: " + zipEntry.entryName);
                        if (obj && obj.ITEM_SETS) {
                            console.log(obj.ITEM_SETS.valueObjectList.length + " objects in " + zipEntry.entryName);
                            reqObj.ITEM_SETS = obj.ITEM_SETS;
                            totalObjects += obj.ITEM_SETS.valueObjectList.length;
                        }
                    } catch (e) {
                            console.log("Error parsing " + zipEntry.entryName);
                            console.log(e);
                    }
                } else
                if (zipEntry.entryName == "QuestionPapers.json") {
                    try {
                        // console.log("Inside Question Paper parsing");
                        var text = zip.readAsText(zipEntry);
                        // console.log("Question Paper data: " + text);
                        var obj = JSON.parse(text); 
                        console.log("Parsed: " + zipEntry.entryName);
                        if (obj && obj.QUESTION_PAPERS) {
                            console.log(obj.QUESTION_PAPERS.valueObjectList.length + " objects in " + zipEntry.entryName);
                            reqObj.QUESTION_PAPERS = obj.QUESTION_PAPERS;
                            totalObjects += obj.QUESTION_PAPERS.valueObjectList.length;
                        }
                    } catch (e) {
                            console.log("Error parsing " + zipEntry.entryName);
                            console.log(e);
                    }
                } else
                if (zipEntry.entryName == "ConcretePapers.json") {
                    try {
                        var obj = JSON.parse(zip.readAsText(zipEntry.entryName)); 
                        console.log("Parsed: " + zipEntry.entryName);
                        if (obj && obj.CONCRETE_PAPERS) {
                            console.log(obj.CONCRETE_PAPERS.valueObjectList.length + " objects in " + zipEntry.entryName);
                            reqObj.CONCRETE_PAPERS = obj.CONCRETE_PAPERS;
                            totalObjects += obj.CONCRETE_PAPERS.valueObjectList.length;
                        }
                    } catch (e) {
                            console.log("Error parsing " + zipEntry.entryName);
                            console.log(e);
                    }
                } else
                if (zipEntry.entryName == "Tests.json") {
                    try {
                        var obj = JSON.parse(zip.readAsText(zipEntry.entryName)); 
                        console.log("Parsed: " + zipEntry.entryName);
                        if (obj && obj.ASSESSMENT_TESTS) {
                            console.log(obj.ASSESSMENT_TESTS.valueObjectList.length + " objects in " + zipEntry.entryName);
                            reqObj.ASSESSMENT_TESTS = obj.ASSESSMENT_TESTS;
                            totalObjects += obj.ASSESSMENT_TESTS.valueObjectList.length;
                        }
                    } catch (e) {
                            console.log("Error parsing " + zipEntry.entryName);
                            console.log(e);
                    }
                } else
                if (zipEntry.entryName.toLowerCase().indexOf("questions.csv")) {
                    try {
                        var subStrIndex = zipEntry.entryName.toLowerCase().indexOf("questions.csv");
                        var questionSubtype = zipEntry.entryName.substring(0,subStrIndex).toUpperCase();
                        if(questionSubtype.lastIndexOf("/") > -1 && questionSubtype.lastIndexOf("/")+1 < questionSubtype.length) {
                            questionSubtype = questionSubtype.substring(questionSubtype.lastIndexOf("/")+1, questionSubtype.length);
                        }
                        reqObj.ASSESSMENT_ITEMS.valueMap[questionSubtype] = zip.readAsText(zipEntry.entryName);
                    } catch (e) {
                            console.log("Error parsing " + zipEntry.entryName);
                            console.log(e);
                    }
                } 
            });
            // console.log(JSON.stringify(reqObj));
            return reqObj;
        })
        .then (function (reqObj) {

            learningElementMap[courseId] = courseId;

            // // Questions
            // var objectList = reqObj.ASSESSMENT_ITEM_LIST.valueObjectList;
            // var arrayLength = objectList.length;
            // for (var i = 0; i < arrayLength; i++) {
            //     if (objectList[i].learningElements) {
            //         var jLength = objectList[i].learningElements.length;
            //         for (var j = 0; j < jLength; j++) {
            //             learningElementMap[objectList[i].learningElements[j]] = objectList[i].learningElements[j];
            //         }
            //     }
            // }

            var promises = [];
            var csvMap = reqObj.ASSESSMENT_ITEMS.valueMap;
            for (questionSubtype in csvMap) {
                promises.push(readLEsFromCSV(questionSubtype, csvMap[questionSubtype], learningElementMap));
            }
            
            return promise_lib.all(promises)
            .then(function(values) {
                console.log('Reading Learing Elements from Question papers and sets...'); 

                // Get Questions object count and add it to total object count
                var csvObjsLength = values.length;
                for (var i = 0; i < csvObjsLength; i++) {
                    totalObjects += values[i].length - 1;
                }


                // Questions Sets
                var objectList = reqObj.ITEM_SETS.valueObjectList;
                var arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].metadata.learningElement) {
                        learningElementMap[objectList[i].metadata.learningElement] = objectList[i].metadata.learningElement;
                    }
                    if (objectList[i].criteria) {
                        var jLength = objectList[i].criteria.length;
                        for (var j = 0; j < jLength; j++) {
                            if (objectList[i].criteria[j].name == "learningElement") {
                                var kLength = objectList[i].criteria[j].valueList.length;
                                for (var k = 0; k < kLength; k++) {
                                    learningElementMap[objectList[i].criteria[j].valueList[k]] = objectList[i].criteria[j].valueList[k];
                                }                            
                            }
                        }
                    }
                }

                // Questions Papers
                objectList = reqObj.QUESTION_PAPERS.valueObjectList;
                arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].context) {
                        learningElementMap[objectList[i].context] = objectList[i].context;
                    }
                }

            })
            .then(function() {
                console.log('Fetching mappings for learning elements...'); 
                var loModel = mongoose.model('LearningObjectModel');
                var lsModel = mongoose.model('LearningResourceModel');
                var promises = [];
                for (k in learningElementMap) {
                    promises.push(getIdentifier(k,loModel));
                    promises.push(getIdentifier(k,lsModel));
                }
                return promise_lib.all(promises);
            })
            .then(function(values) {
                console.log('Fetched mappings for learning elements.');
                var leMapIndex = 0;
                // console.log(data);
                for (k in learningElementMap) {
                    if (values[leMapIndex*2] && values[leMapIndex*2].length > 0) {
                        learningElementMap[k] = values[leMapIndex*2];
                    } else
                    if (values[(leMapIndex*2)+1] && values[(leMapIndex*2)+1].length > 0) {
                        learningElementMap[k] = values[(leMapIndex*2)+1];
                    }
                    leMapIndex++;
                }
                return learningElementMap;
            });
        })
        .then(function(learningElementMap) {

            // Questions
            // var objectList = reqObj.ASSESSMENT_ITEM_LIST.valueObjectList;
            // var arrayLength = objectList.length;
            // for (var i = 0; i < arrayLength; i++) {
            //     if (objectList[i].learningElements) {
            //         var externalLEIds = [];
            //         var jLength = objectList[i].learningElements.length;
            //         for (var j = 0; j < jLength; j++) {
            //             externalLEIds.push(learningElementMap[objectList[i].learningElements[j]]);
            //         }
            //         objectList[i].learningElements = externalLEIds;
            //     }
            //     objectList[i].courseId = learningElementMap[courseId];
            // }

            var csvMap = reqObj.ASSESSMENT_ITEMS.valueMap;
            // for (k in learningElementMap) {
            //     for (questionSubtype in csvMap) {
            //         csvMap[questionSubtype] = replaceAll(csvMap[questionSubtype],k,learningElementMap[k]);

            //     }
            // }

            var promises = [];
            for (questionSubtype in csvMap) {
                promises.push(replaceLEsinCSV(csvMap[questionSubtype], learningElementMap, questionSubtype));
            }
            
            return promise_lib.all(promises)
            .then(function(csvs) {
                var index = 0;
                for (questionSubtype in csvMap) {
                    csvMap[questionSubtype] = csvs[index];
                    index++;
                }
            })
            .then(function() {
                // Questions Sets
                var objectList = reqObj.ITEM_SETS.valueObjectList;
                var arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].metadata.learningElement) {
                        objectList[i].metadata.learningElement = learningElementMap[objectList[i].metadata.learningElement];
                    }
                    if (objectList[i].criteria) {
                        var jLength = objectList[i].criteria.length;
                        for (var j = 0; j < jLength; j++) {
                            if (objectList[i].criteria[j].name == "learningElement") {
                                var externalLEIds = [];
                                var kLength = objectList[i].criteria[j].valueList.length;
                                for (var k = 0; k < kLength; k++) {
                                    externalLEIds.push(learningElementMap[objectList[i].criteria[j].valueList[k]]);
                                } 
                                objectList[i].criteria[j].valueList = externalLEIds;
                            } else if (objectList[i].criteria[j].name == "courseId") {
                                objectList[i].criteria[j].value = learningElementMap[courseId];
                            } 
                        }
                    }
                    objectList[i].metadata.courseId = learningElementMap[courseId];
                }

                // Questions Papers
                objectList = reqObj.QUESTION_PAPERS.valueObjectList;
                arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    if (objectList[i].context) {
                        objectList[i].context = learningElementMap[objectList[i].context];
                    }
                    objectList[i].courseId = learningElementMap[courseId];
                }

                // Tests
                objectList = reqObj.ASSESSMENT_TESTS.valueObjectList;
                arrayLength = objectList.length;
                for (var i = 0; i < arrayLength; i++) {
                    objectList[i].courseId = learningElementMap[courseId];
                }

                reqObj.COURSE_ID = learningElementMap[courseId];

                return reqObj;
            });
        })   
        .then (
            ViewHelperUtil.promisifyWithArgs(MWServiceProvider.callServiceStandardWithUser, 
            MWServiceProvider, ["assessmentService", "saveAssessmentDataForCourse", reqObj, json.user])
        )	
        .then (function (mwdata) {
            if (!mwdata || !mwdata.responseValueObjects || !mwdata.responseValueObjects.STATUS 
                || mwdata.responseValueObjects.STATUS.statusType != "SUCCESS") {
                console.log(mwdata.responseValueObjects.STATUS.statusMessage);
                error.push(mwdata);    
            }
        })   
        .catch(function(err) {
            console.log('err', err);
            error.push(err);
        })
        .done(function(value) {
            console.log("Completed Import for " + importRecord.importFilename);
            // if (error.length > 0) {
            //     res.send(error);
            // } else {
	           //  res.send("Success");            	
            // }
            var jsonFilePath = importRecord.filepath;
            CSVImportUtil.deleteFile(jsonFilePath);
            importRecord.filepath = json.originalFileCopyPath;
            importRecord.endTime = new Date();
            importRecord.exeTime = importRecord.endTime.getTime() - importRecord.startTime.getTime();
            console.log("Processing Errors:",error.length);
            importRecord.warning = error.length;
            importRecord.errorDetails = error;
            importRecord.total = totalObjects;
            importRecord.inserted = totalObjects;
            if(error.length) {
                importRecord.status = CSVImportUtil.FAIL;
            } else {
                importRecord.status = CSVImportUtil.COMPLETE;
            }
            // update importRecord is pending...
            console.log("Completed Processing Queue record: "+importRecord.identifier);
            console.log("Statistics: "+importRecord);
            CSVImportUtil.updateCSVImportQueueRecord(importRecord);
        });

}

function getExternalIdentifier(identifier, modelObject) {
    var deferred = promise_lib.defer();
    modelObject.findOne({"identifier": identifier},'metadata.nodeId').exec(function(err, object) {
        if(err) {
            deferred.reject(err);
        } else if(!object) {
            deferred.resolve("");
        } else {
            if(object.is_deleted) {
                deferred.resolve("");
            } else {
                deferred.resolve(object.metadata.nodeId);
            }
        }
    });
    return deferred.promise;
}

function getIdentifier(externalId, modelObject) {
    // console.log("externalId: ",externalId);
    var deferred = promise_lib.defer();
    modelObject.findOne({"metadata.nodeId": externalId},{identifier: 1}).exec(function(err, object) {
        if(err) {
            deferred.reject(err);
        } else if(!object) {
            deferred.resolve("");
        } else {
            if(object.is_deleted) {
                deferred.resolve("");
            } else {
                deferred.resolve(object.identifier);
            }
        }
    });
    return deferred.promise;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
