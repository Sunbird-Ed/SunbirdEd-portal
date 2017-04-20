/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Common cache util where all the app specifc view helper methods are registered.
 *
 * @author Santhosh
 */
var conceptViewHelper = require('../view_helpers/studio/ConceptViewHelper');
var CSVImportUtil = require('../commons/CSVImportUtil');

/**
 * Initialize cache when nodejs starts. Any app level cache should be added to the below function
 * @return {[type]} [description]
 */
exports.initializeAppCache = function() {
	conceptViewHelper.cacheConceptMaps(); // Cache the concepts
}

/**
*	Fial the CSVImportQueue records which are in processing state. 
*/
exports.failCSVImportProcessingRecords = function() {
	CSVImportUtil.fialCSVImportProcessingRecords();
	// CSVImportUtil.autoStartPendingRecords();
}

exports.initializeListeners = function() {
	EventHelper.registerEventListener('updateConceptMap', conceptViewHelper.updateConceptMapCache);
	EventHelper.registerEventListener('processCSVImportQueueRecord', CSVImportUtil.processCSVImportQueueRecord);
}

exports.processClusterHubEvent = function(data) {
	console.log('processClusterHubEvent - data', data);
    if(data.type == 'cache' && data.action == 'clear') {
        NodeCacheUtil.clearCache(data.courseId);
    }
}