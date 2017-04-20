 /*
  * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
  *
  * This code is intellectual property of Canopus Consulting. The intellectual and technical
  * concepts contained herein may be covered by patents, patents in process, and are protected
  * by trade secret or copyright law. Any unauthorized use of this code without prior approval
  * from Canopus Consulting is prohibited.
  */

 /**
  * CSV Validation Helper for course import.
  *
  * @author Mahesh
  */

 var promise_lib = require('when');
 var ViewHelperConstants = require('../ViewHelperConstants');
 var ViewHelperUtil = require('../../commons/ViewHelperUtil');


 /**
  *	This method validate node and return with valid state,message, node with valid values.
  *
  */
 exports.validateNode = function(node) {
     var validatedNode = {};
     validatedNode.isValid = true;
     validatedNode.node = node;
     validatedNode.messages = [];
     if(node.nodeType == ViewHelperConstants.COURSE) {
         validatedNode = validateCourse(validatedNode);
     } else if (node.nodeType == ViewHelperConstants.LEARNING_RESOURCE) {
         validatedNode = validateLearningResource(validatedNode);
     } else if (node.nodeType == ViewHelperConstants.LEARNING_ACTIVITY) {
         validatedNode = validateLearningActivity(validatedNode);
     } else if (node.nodeType == ViewHelperConstants.CONTENT) {
         validatedNode = validateContent(validatedNode);
     } else if (node.nodeClass == ViewHelperConstants.LEARNING_OBJECT || node.nodeClass == ViewHelperConstants.COLLECTION) {
         validatedNode = validateLearningObject(validatedNode);
     } else if (node.nodeType == ViewHelperConstants.MEDIA) {
         validatedNode = validateMedia(validatedNode);
     }

     // Global validation
     validatedNode = validateDescriptionVerified(validatedNode);

     return validatedNode;
 }

 /**
  * method to validate Course and update defalut values.
  *
  */

 function validateCourse(validatedNode) {
     validatedNode = validateOrderValue(validatedNode, '1');
     return validatedNode;
 }

 /**
  *	method to validate LearningResource and update defalut values.
  *
  */

 function validateLearningResource(validatedNode) {
     validatedNode = validateIsMandatory(validatedNode);
     validatedNode = validateMinProficiency(validatedNode);
     validatedNode = validateProficiencyWeightage(validatedNode);
     validatedNode = validateInstructionUsage(validatedNode);
     validatedNode = validateLearningTime(validatedNode);

     return validatedNode;
 }


 /**
  *	method to validate LearningActivity and update defalut values.
  *
  */

 function validateLearningActivity(validatedNode) {
     validatedNode = validateIsMandatory(validatedNode);
     validatedNode = validateMinProficiency(validatedNode);
     validatedNode = validateProficiencyWeightage(validatedNode);
     validatedNode = validateInstructionUsage(validatedNode);
     validatedNode = validateLearningTime(validatedNode);

     return validatedNode;
 }

 /**
  *	method to validate Content and update defalut values.
  *
  */

 function validateContent(validatedNode) {
     validatedNode = validateExtendedMaterial(validatedNode);
     validatedNode = validateContentElementType(validatedNode);
     validatedNode = validateLearningTime(validatedNode);
     validatedNode = validateOrderValue(validatedNode, '0');

     return validatedNode;
 }


 function validateLearningObject(validatedNode) {
     validatedNode = validateEntryCriteria(validatedNode);
     return validatedNode;
 }


 function validateMedia(validatedNode) {
     validatedNode = validateMediaType(validatedNode);
     validatedNode = validateLocation(validatedNode);
     validatedNode = validateFormat(validatedNode);
     return validatedNode;
 }

 /**
  *
  *	All Below method are helper methods for validation and get default value.
  */

 function validateIsMandatoryOld(validatedNode) {
     validatedNode.node.isMandatory = (validatedNode.node.isMandatory) ? (((validatedNode.node.isMandatory.trim().toLowerCase() == 'n' || validatedNode.node.isMandatory.trim().toLowerCase() == 'no' || validatedNode.node.isMandatory.trim().toLowerCase() == 'false')) ? false : true) : true;
     return validatedNode;
 }

 function validateIsMandatory(validatedNode) {
   // console.log("ISMANDATORY TYPE", typeof validatedNode.node.isMandatory, " ",validatedNode.node.isMandatory );
     var isMandatory = String(validatedNode.node.isMandatory);
     validatedNode.node.isMandatory = (isMandatory) ? (((isMandatory.trim().toLowerCase() == 'n' || isMandatory.trim().toLowerCase() == 'no' || isMandatory.trim().toLowerCase() == 'false')) ? false : true) : true;
     return validatedNode;
 }

 function validateMinProficiency(validatedNode) {
     if (validatedNode.node.minProficiency == '' || isNaN(validatedNode.node.minProficiency)) {
         validatedNode.node.minProficiency = 100;
         validatedNode.messages.push('Mim Proficiency is empty/not a number for node Id:' + validatedNode.node.nodeId);
     }
     return validatedNode;
 }

 function validateProficiencyWeightage(validatedNode) {
     if (validatedNode.node.proficiencyWeightage == '' || isNaN(validatedNode.node.proficiencyWeightage)) {
         validatedNode.node.proficiencyWeightage = 1;
         validatedNode.messages.push('Proficiency Weightage is empty/not a number for node Id:' + validatedNode.node.nodeId);
     }
     return validatedNode;
 }

 function validateExtendedMaterial(validatedNode) {
     validatedNode.node.extendedMaterial = (validatedNode.node.extendedMaterial) ? (((validatedNode.node.extendedMaterial.trim().toLowerCase() == 'y' || validatedNode.node.extendedMaterial.trim().toLowerCase() == 'yes' || validatedNode.node.extendedMaterial.trim().toLowerCase() == 'true')) ? true : false) : false;
     return validatedNode;
 }

 function validateContentElementType(validatedNode) {
     if (validatedNode.node.elementType) {
         validatedNode.node.elementType = validatedNode.node.elementType.trim().toLowerCase()
         if (validatedNode.node.elementType == ViewHelperConstants.LECTURE) {
             validatedNode.node.contentType = ViewHelperConstants.LECTURE;
             validatedNode.node.contentSubType = ViewHelperConstants.LECTURE;
         } else if (validatedNode.node.elementType == ViewHelperConstants.QUIZ) {
             validatedNode.node.contentType = ViewHelperConstants.LEARNING_ACTIVITY;
             validatedNode.node.contentSubType = ViewHelperConstants.QUIZ;
         } else if (validatedNode.node.elementType == ViewHelperConstants.PROGRAM) {
             validatedNode.node.contentType = ViewHelperConstants.LEARNING_ACTIVITY;
             validatedNode.node.contentSubType = ViewHelperConstants.PROGRAM;
         } else if (validatedNode.node.elementType == ViewHelperConstants.EXERCISE) {
             validatedNode.node.contentType = ViewHelperConstants.LEARNING_ACTIVITY;
             validatedNode.node.contentSubType = ViewHelperConstants.EXERCISE;
         } else if (validatedNode.node.elementType == ViewHelperConstants.ASSESSMENT) {
             validatedNode.node.contentType = ViewHelperConstants.LEARNING_ACTIVITY;
             validatedNode.node.contentSubType = ViewHelperConstants.ASSESSMENT;
         } else if (validatedNode.node.elementType == ViewHelperConstants.PRACTICE) {
             validatedNode.node.contentType = ViewHelperConstants.LEARNING_ACTIVITY;
             validatedNode.node.contentSubType = ViewHelperConstants.PRACTICE;
         } else {
             //validatedNode.isValid = false;
             validatedNode.messages.push('learning element type is invalid for node type content and node Id:' + validatedNode.node.nodeId);
         }
     } else {
         //validatedNode.isValid = false;
         validatedNode.messages.push('learning element type is empty for node type content and node Id:' + validatedNode.node.nodeId);
     }
     return validatedNode;
 }

 function validateInstructionUsage(validatedNode) {
     var useDefault = false;
     if (validatedNode.node.instructionUsage) {
         validatedNode.node.instructionUsage = validatedNode.node.instructionUsage.trim().toLowerCase().replace(" ", "_");
         if (ViewHelperConstants.INSTRUCTION_USAGE[validatedNode.node.nodeType].indexOf(validatedNode.node.instructionUsage) == -1) {
             useDefault = true;
         }
     } else {
         useDefault = true;
     }
     if (useDefault) {
         // validatedNode.isValid = false;
         validatedNode.messages.push('instruction usage is empty for node Id:' + validatedNode.node.nodeId + ". default value is set.");
         if (validatedNode.node.nodeType == ViewHelperConstants.LEARNING_RESOURCE) {
             validatedNode.node.instructionUsage = "lecture";
         } else if (validatedNode.node.nodeType == ViewHelperConstants.LEARNING_ACTIVITY) {
             validatedNode.node.instructionUsage = "exercise";
         }
     }
     return validatedNode;
 }

function validateEntryCriteria(validatedNode) {

    if (!validatedNode.node.outcome) {
        validatedNode.messages.push('outcome is empty for learning object with nodeId:' + validatedNode.node.nodeId);
    }
    if (!validatedNode.node.learnerLevel) {
        validatedNode.messages.push('Learner Level is empty for learning object with nodeId:' + validatedNode.node.nodeId);
    }

    var entryCriteria = '';
    if(validatedNode.node.outcome && validatedNode.node.outcome.trim() != '') {
        validatedNode.node.outcome = validatedNode.node.outcome.trim();
        entryCriteria = "state.profile.outcome == '" + validatedNode.node.outcome + "'";
    }

    if(validatedNode.node.learnerLevel && validatedNode.node.learnerLevel.trim() != '') {
        validatedNode.node.learnerLevel = validatedNode.node.learnerLevel.trim().toLowerCase();
        if(entryCriteria != '') entryCriteria += " && ";
        entryCriteria += "state.profile.learnerLevel == '" + validatedNode.node.learnerLevel + "'";
    }

    if(entryCriteria != '') {
        validatedNode.node.entryCriteriaExpr = entryCriteria;
    }

    return validatedNode;
}


function validateLearningTimeOld(validatedNode) {
    var inSec = 0;
 //   console.log("type of learning time", typeof validatedNode.node.learningTime," ", validatedNode.node.learningTime );
    if (validatedNode.node.learningTime) {
        var newLT = String(validatedNode.node.learningTime);
        var ltArray = validatedNode.node.learningTime.split(':', 3);
        ltArray.reverse();

        for (i = 0; i < ltArray.length; i++) {
            if (isNaN(ltArray[i])) {
                inSec = 0;
                validatedNode.messages.push("Invalid learning time:" + validatedNode.node.learningTime + " for nodeId:" + validatedNode.node.nodeId);
                break;
            } else {
                inSec += ltArray[i] * Math.pow(60, i);
            }
        }
    } else {
        inSec = 0;
        validatedNode.messages.push("learning time is empty for nodeId:" + validatedNode.node.nodeId);
    }
    validatedNode.node.learningTime = inSec;

    return validatedNode;
}
function validateLearningTime(validatedNode) {
    var inSec = 0;
  //  console.log("type of learning time", typeof validatedNode.node.learningTime," ", validatedNode.node.learningTime );
    if (validatedNode.node.learningTime) {
        var newLT = String(validatedNode.node.learningTime);
        var ltArray = newLT.split(':', 3);
        ltArray.reverse();

        for (i = 0; i < ltArray.length; i++) {
            if (isNaN(ltArray[i])) {
                inSec = 0;
                validatedNode.messages.push("Invalid learning time:" + validatedNode.node.learningTime + " for nodeId:" + validatedNode.node.nodeId);
                break;
            } else {
                inSec += ltArray[i] * Math.pow(60, i);
            }
        }
    } else {
        inSec = 0;
        validatedNode.messages.push("learning time is empty for nodeId:" + validatedNode.node.nodeId);
    }
    validatedNode.node.learningTime = inSec;

    return validatedNode;
}


function validateDescriptionVerified(validatedNode) {
    validatedNode.node.descriptionVerified = (validatedNode.node.descriptionVerified) ? (((validatedNode.node.descriptionVerified.trim().toLowerCase() == 'y' || validatedNode.node.descriptionVerified.trim().toLowerCase() == 'yes' || validatedNode.node.descriptionVerified.trim().toLowerCase() == 'true')) ? true : false) : false;
    return validatedNode;
}

function validateMediaType(validatedNode) {
    if (validatedNode.node.mediaType) {
        validatedNode.node.mediaType = validatedNode.node.mediaType.trim().toLowerCase();
        var allMediaTypes = ViewHelperConstants.getAllMediaTypes();
        if (allMediaTypes.indexOf(validatedNode.node.mediaType) == -1) {
            validatedNode.isValid = false;
            validatedNode.messages.push('media type:' + validatedNode.node.mediaType + ' is invalid for node Id:' + validatedNode.node.nodeId);
        }
    }

    return validatedNode;
}

function validateLocation(validatedNode) {
    if (!validatedNode.node.location) {
        // validatedNode.isValid = false;
        validatedNode.messages.push("location is empty for media with node Id:" + validatedNode.node.nodeId);
    }
    return validatedNode;
}

function validateFormat(validatedNode) {
    if (validatedNode.node.format) {
        validatedNode.node.format = validatedNode.node.format.trim().toLowerCase();
        var allMimeTypes = ViewHelperConstants.getAllMimeTypes();
        if (allMimeTypes.indexOf(validatedNode.node.format) == -1) {
            validatedNode.isValid = false;
            validatedNode.messages.push("format:" + validatedNode.node.format + " is invalid for node Id:" + validatedNode.node.nodeId);
        }
    }
    return validatedNode;
}

function validateOrderValue(validatedNode, defaultValue) {
    defaultValue = defaultValue || '0';
     if (validatedNode.node.order == null || !validatedNode.node.order || validatedNode.node.order == '' || isNaN(validatedNode.node.order)) {
         validatedNode.node.order = defaultValue;
         // validatedNode.messages.push('Order is empty/not a number for node Id:' + validatedNode.node.nodeId);
     }
     return validatedNode;
 }

