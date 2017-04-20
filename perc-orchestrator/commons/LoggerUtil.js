/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Util class for orchestrator logger
 *
 * @author Santhosh
 */

var fs = require('fs');
var util = require('util');
/** Define the loggers used in orchestrator */
var logger;
var errorLogger;
var loggerType = appConfig.DEFAULT_LOGGER; // TODO: Fetch from a configuration

// Logger configuration code
if(loggerType == 'fluentd') {
	logger = require('fluent-logger');
	logger.configure('performance', {
	   host: 'localhost',
	   port: 24224,
	   timeout: 3.0
	});
} else if(loggerType == 'log4js') {
	if (!fs.existsSync('logs/')) {
		fs.mkdirSync('logs/');
	}
	var log4js = require('log4js');
	log4js.configure({
	  	appenders: [
	  		{ type: 'file', filename: 'logs/error.log', category: 'error' },
		    { type: 'file', filename: 'logs/orchestrator.log', category: 'orchestrator' },
		    { type: 'file', filename: 'logs/assessments_mw.log', category: 'assessments_mw' },
		    { type: 'file', filename: 'logs/interactions_mw.log', category: 'interactions_mw' },
		    { type: 'file', filename: 'logs/dashboard_mw.log', category: 'dashboard_mw' },
		    { type: 'file', filename: 'logs/learner_info_mw.log', category: 'learner_info_mw' },
		    { type: 'file', filename: 'logs/ontology_mgr_mw.log', category: 'ontology_mgr_mw' }
	  	]
	});
	logger = log4js.getLogger('orchestrator');
	errorLogger = log4js.getLogger('error');
	logger.setLevel(appConfig.LOG_LEVEL);
}

exports.getConsoleLogger = function() {
    return {
        info: function(msg) {
            console.log(msg);
        },
        error: function(msg) {
            console.log(msg);
        },
        debug: function(msg) {
            console.log(msg);
        }
    }
}

exports.getFileLogger = function(logFileName) {
	console.log('getFileLogger', logFileName, fs.existsSync('logs/import/'));
	if (!fs.existsSync('logs/import/')) {
		fs.mkdirSync('logs/import/');
	}
	var log4js2 = require('log4js');
	log4js2.configure({
	  	appenders: [
	  		{ type: 'file', filename: 'logs/import/' + logFileName, category: 'enrollment' }
	  	]
	});
	return log4js2.getLogger('enrollment');
}

exports.error = function(er) {
	errorLogger.error(er);
}

exports.log = function(level, data) {
	var msg = data;
	if(typeof data == 'object') msg = JSON.stringify(data);
	if(loggerType == 'fluentd') {
		logger.emit(level, msg);
	} else if(loggerType == 'log4js') {
		if(level == LogLevel.FATAL)
			logger.fatal(msg);
		else if(level == LogLevel.ERROR)
			logger.error(msg);
		else if(level == LogLevel.WARN)
			logger.warn(msg);
		else if(level == LogLevel.INFO)
			logger.info(msg);
		else if(level == LogLevel.DEBUG)
			logger.debug(msg);
		else if(level == LogLevel.TRACE)
			logger.trace(msg);
	}
}

/** Following log functions are generally used for performance engineering: Start */

/**
 * Log performance logs.
 * @param  {String} layer     The layer the log is invoked
 * @param  {Object} domain    Domain from the process object
 * @param  {String} startTime Start time of the function
 * @param  {String} endTime   End time of the function
 * @param  {String} data      Optional data
 */
exports.perfLog = function(layer, domain, startTime, endTime, data) {
	if(!appConfig.PERFORMANCE_LOG) { // Flag to check if performance log is enabled
		return;
	}
	var logObject = domain.logObject;
	logObject['layer'] = layer;
	logObject['startTimestamp'] = '' + startTime;
	logObject['endTimestamp'] = '' + endTime;
	logObject['deltaTimestamp'] = (endTime - startTime);
	logObject['data'] = (data || '');
	if(loggerType == 'fluentd') {
		logger.emit('log', logObject);
	} else if(loggerType == 'log4js') {
		logger.debug(JSON.stringify(logObject));
	}
}

exports.setOperationName = function(opName) {
	process.domain.viewHelperMethod = opName;
}

exports.logOrchestrator = function(domain, startTime, endTime, data) {
	domain.logObject['requestPath'] = domain.logObject.operationId;
	exports.perfLog('orchestrator', domain, startTime, endTime, data);
}

exports.logViewHelper = function(domain, startTime, endTime, data) {
	domain.logObject['requestPath'] = domain.logObject.operationId;
	exports.perfLog('ViewHelper', domain, startTime, endTime, data);
}

exports.logMongo = function(domain, startTime, endTime, data) {
	domain.logObject['requestPath'] = domain.logObject.operationId + '/' + domain.viewHelperMethod;
	exports.perfLog('mongo', domain, startTime, endTime, data);
}

exports.logMw = function(domain, startTime, endTime, data) {
	domain.logObject['requestPath'] = domain.logObject.operationId + '/' + domain.viewHelperMethod;
	exports.perfLog('mw', domain, startTime, endTime, data);
}

function getLogger(service) {
	var mwLogger;
	switch(service) {
		case 'interactionService':
		mwLogger = log4js.getLogger('interactions_mw');
		break;
		case 'learnerService':
		mwLogger = log4js.getLogger('learner_info_mw');
		break;
		case 'assessmentService':
		mwLogger = log4js.getLogger('assessments_mw');
		break;
		case 'dashboardService':
		mwLogger = log4js.getLogger('dashboard_mw');
		break;
		default:
		mwLogger = log4js.getLogger('ontology_mgr_mw');
		break;
	}
	return mwLogger;
}

function logMiddleware(loggerObj, object) {
	loggerObj.info(JSON.stringify(object));
}

exports.logMwReq = function(service, command, req, transactionId) {
	logMiddleware(getLogger(service), {service: service, commmand: command, transactionId: transactionId, type: 'REQUEST', data: util.inspect(req)});
}

exports.logMwRes = function(service, command, res, transactionId, time) {
	logMiddleware(getLogger(service), {service: service, commmand: command, transactionId: transactionId, type: 'RESPONSE', data: util.inspect(res), requestTime: time});
}

exports.logMwErr = function(service, command, err, transactionId, time) {
	logMiddleware(getLogger(service), {service: service, commmand: command, transactionId: transactionId, type: 'ERROR', data: util.inspect(err), requestTime: time});
}

/* End */