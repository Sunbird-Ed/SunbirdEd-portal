Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
const path = require("path");
const ILogSync_1 = require("./ILogSync");
const MAX_LOG_LENGTH = 30; // Number of entries
const MAX_DAYS_TO_TRACE_TIMESTAMP = 10 * 24 * 60 * 60 * 1000; // 10 days
const getAllLogs = () => {
    logger_1.enableLogger({
        logBasePath: path.join(process.env.FILES_PATH, "logs"),
        logLevel: process.env.LOG_LEVEL,
        context: { src: "desktop" },
        adopterConfig: {
            adopter: "winston",
        },
    });
    const date = new Date();
    const fromDay = new Date(date.getTime() - MAX_DAYS_TO_TRACE_TIMESTAMP);
    const options = {
        fields: ["message", "timestamp", "src", "level"],
        from: fromDay,
        until: new Date(),
        start: 0,
        order: "desc",
    };
    if (process.env.LOG_LEVEL === "error") {
        options.rows = MAX_LOG_LENGTH;
        options.limit = MAX_LOG_LENGTH;
    }
    if (logger_1.getLogs) {
        logger_1.getLogs(options)
            .then((logs) => {
            if (_.get(logs, "dailyRotateFile.length")) {
                const errorLogs = formatLogs(logs.dailyRotateFile);
                sendMessage("SYNC_LOGS", errorLogs);
            }
            else {
                sendMessage("SYNC_LOGS");
            }
        })
            .catch((error) => {
            sendMessage("ERROR_LOG_SYNC_ERROR", [], ILogSync_1.getErrorObj(error, "UNHANDLED_ERROR_LOG_SYNC_ERROR"));
        });
    }
};
const formatLogs = (logs) => {
    const errorLogs = _.filter(logs, (item) => item.level === "error").slice(0, MAX_LOG_LENGTH);
    const logList = _.map(errorLogs, (log) => {
        return {
            appver: process.env.APP_VERSION,
            pageid: log.src,
            ts: new Date(log.timestamp).getTime(),
            log: log.message,
        };
    });
    return logList;
};
const sendMessage = (message, logs = [], err) => {
    const messageObj = { message, logs };
    if (err) {
        messageObj.err = err;
    }
    process.send(messageObj);
};
process.on("message", (data) => {
    if (data.message === "GET_LOGS") {
        getAllLogs();
    }
    else if (data.message === "KILL") {
        sendMessage("LOG_SYNC_KILL");
    }
});
