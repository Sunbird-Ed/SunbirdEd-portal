"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log4js_1 = require("log4js");
const path = require("path");
const logger = log4js_1.getLogger();
exports.logger = logger;
logger.level = 'off';
log4js_1.configure({
    "appenders": {
        "access": {
            "type": "dateFile",
            "filename": "log/access.log",
            "pattern": "-yyyy-MM-dd",
            "category": "http"
        },
        "app": {
            "type": "file",
            "filename": "log/app.log",
            "maxLogSize": 10485760,
            "numBackups": 3
        },
        "errorFile": {
            "type": "file",
            "filename": "log/errors.log"
        },
        "errors": {
            "type": "logLevelFilter",
            "level": "ERROR",
            "appender": "errorFile"
        },
        "console": {
            "type": "console",
            "layout": {
                "type": "coloured"
            }
        }
    },
    "categories": {
        "default": { "appenders": ["app", "errors", "console"], "level": "DEBUG" },
        "http": { "appenders": ["access"], "level": "DEBUG" }
    }
});
function enableLogger(level) {
    try {
        require('fs').mkdirSync(path.join(__dirname, 'log'));
    }
    catch (e) {
        if (e.code !== 'EEXIST') {
            console.error("Could not set up log directory, error was: ", e);
            process.exit(1);
        }
    }
    logger.level = level || 'debug';
}
exports.enableLogger = enableLogger;
