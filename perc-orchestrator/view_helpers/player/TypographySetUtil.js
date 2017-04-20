 /*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Typography Set Utility Helper
 *
 * @author Mahesh
 */

  var mongoose = require('mongoose')
, errorModule = require('../ErrorModule');
var ViewHelperUtil = require('../../commons/ViewHelperUtil');
var promise_lib = require('when');
var ViewHelperConstants = require('../ViewHelperConstants');
var PlayerUtil = require('./PlayerUtil');

exports.getTypographySet = function(currentObject, isSupplementaryContent) {
	LoggerUtil.setOperationName('getTypographySet');
	var typographySet = [];
	if(currentObject) {
		if(currentObject.metadata.extendedMaterial) {
			typographySet.push('subscribedContent');
		} else if (!isSupplementaryContent) {
			typographySet.push('baseContent');
		}

		if(typeof currentObject.metadata.setType != "undefined") {
			if(currentObject.metadata.setType == ViewHelperConstants.LEARNING_ACTIVITY) {
				typographySet.push('exerciseContent');
			}
		}

		if(typeof currentObject.metadata.owner != "undefined") {
			if(currentObject.metadata.owner && currentObject.metadata.owner.toLowerCase() != 'perceptron' && currentObject.metadata.owner.toLowerCase() != 'canopus consulting') {
				typographySet.push('externalContent');
			}
		}
	}
	if(isSupplementaryContent) {
		typographySet.push('supplementaryContent');
	}
	return typographySet;
};
