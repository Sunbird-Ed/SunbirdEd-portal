/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * View Helper for Assessment Functionality
 *
 * @author ravitejagarlapati
 */

var errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var fs = require('fs');
var csv = require('csv');
var mongoose = require('mongoose');

exports.importAssessmentItems = function(req, res) {
    var file = req.files.importFile;
    var learningElementsIndex = -1;
    var leMap = {};
    fs.readFile(file.path, 'utf8', function (err,data) {
        if (err) {
            res.send(err);
        } else {
            csv()
                .from(data)
                .on('record', function(row, index) {
                    if (index == 0) {
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
                                leMap[leListForRow[i]]=leListForRow[i];
                                //Do something
                            }

                            // console.log(row[learningElementsIndex]);
                        }
                    }
                })
                .on('end', function(count) {
                    // console.log(JSON.stringify(leMap));
                    var loModel = mongoose.model('LearningObjectModel');
                    var lsModel = mongoose.model('LearningResourceModel');
                    var promises = [];
                    for (k in leMap) {
                        promises.push(getIdentifier(k,loModel));
                        promises.push(getIdentifier(k,lsModel));
                    }
                    promise_lib.all(promises).then(function(value) {
                        var leMapIndex = 0;
                        // console.log(data);
                        for (k in leMap) {
                            if (value[leMapIndex*2] && value[leMapIndex*2].length > 0) {
                                data = replaceAll(data,k,value[leMapIndex*2]);
                                // console.log(replaceAll(data,k,value[leMapIndex]));
                                // console.log(k + " " + value[leMapIndex]);
                            } else
                            if (value[(leMapIndex*2)+1] && value[(leMapIndex*2)+1].length > 0) {
                                data = replaceAll(data,k,value[(leMapIndex*2)+1]);
                                // console.log(replaceAll(data,k,value[leMapIndex]));
                                // console.log(k + " " + value[leMapIndex]);
                            }
                            leMapIndex++;
                        }
                    })
                    .catch(function(err){
                        console.log("Error fetching learning element ids",err);
                    })
                    .done(function(){
                        console.log("Done fetching learning element ids.");
                        var reqData = {};
                        reqData.CSV = {};
                        reqData.CSV.id = data;
                        if (req.body.QUESTION_SUBTYPE) {
                            reqData.QUESTION_SUBTYPE = {};
                            reqData.QUESTION_SUBTYPE.id = req.body.QUESTION_SUBTYPE;
                        }
                        if (req.body.COURSE_ID) {
                            reqData.COURSE_ID = {};
                            reqData.COURSE_ID.id = req.body.COURSE_ID;
                        }
                        var MWServiceProvider = require("../../commons/MWServiceProvider");
                        MWServiceProvider.callServiceStandardWithUser("assessmentService", "saveAssessmentItemCSV", reqData, req.user, function(mwerr, mwData) {
                            if (mwerr) {
                                console.log("Error in Response from MW saveAssessmentItemCSV: " + mwerr);
                                res.send(mwerr);
                            } else {
                                res.send(mwData);
                            }
                        });
                    });

                })
                .on('error', function(error) {
                    console.log('error', error);
                    res.send(error);
                });

        }
        
    });

};

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

            