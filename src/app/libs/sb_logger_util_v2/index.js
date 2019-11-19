const log4js = require('log4js');
const mkdirp = require('mkdirp');
const path = require('path');
const _ = require('lodash');
let loggerInitialized = false;
let config;

const init = (appConfig) => {
    const defaultConfig = {
        path: './logs/microservice.log',
        logLevel: 'error'
    }
    config = _.merge(defaultConfig, appConfig)
    if (config.path) {
        mkdirp.sync(path.dirname(config.path));
    }
 
    log4js.configure({
        appenders: {
            console: {
                'type': 'console'
            }
        },
        categories: {
            default: { appenders: ['console'], level: config.logLevel }
        }
    });
    loggerInitialized = true;
 }

var processRequestObject = request => (request && request.id) ? { id: request.id } : {};

const logger = log4js.getLogger('api');

var info = function (data, request) {
    if (loggerInitialized) {
        logger.info(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

var debug = function (data, request) {
    if (loggerInitialized) {
        logger.debug(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

var fatal = function (data, request) {
    if (loggerInitialized) {
        logger.fatal(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

var mark = function (data, request) {
    if (loggerInitialized) {
        logger.mark(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

var error = function (data, request) {
    if (loggerInitialized) {
        logger.error(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

var warn = function (data, request) {
    if (loggerInitialized) {
        logger.warn(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

var trace = function (data, request) {
    if (loggerInitialized) {
        logger.trace(JSON.stringify(_.merge(processRequestObject(request), data)))
    }
}

module.exports = {
    info, error, warn, trace, debug, mark, fatal, logger, init
}
