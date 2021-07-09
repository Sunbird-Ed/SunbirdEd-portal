import { enableLogger, getLogs, logLevels, logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as _ from "lodash";
import * as path from "path";
import { ErrorObj, getErrorObj, ILogAPIFormat } from "./ILogSync";
import { manifest } from "../../manifest";

const MAX_LOG_LENGTH = 30; // Number of entries
const MAX_DAYS_TO_TRACE_TIMESTAMP = 10 * 24 * 60 * 60 * 1000; // 10 days

const getAllLogs = async () => {
  const deviceId = await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId().catch(error => { logger.error('Error while getting deviceID'); });
  enableLogger({
    logBasePath: path.join(process.env.FILES_PATH, "logs"),
    logLevel: process.env.LOG_LEVEL as logLevels,
    context: {
      context: {
        channel: process.env.CHANNEL,
        env: 'desktop',
        did: deviceId,
        pdata: {
          id: process.env.APP_ID,
          ver: process.env.APP_VERSION,
          pid: 'sunbird-desktop'
        }
      }
    },
    adopterConfig: {
      adopter: 'winston'
    }
  });
  const date = new Date();
  const fromDay = new Date(date.getTime() - MAX_DAYS_TO_TRACE_TIMESTAMP);
  type OrderType = "asc" | "desc";
  const options: any = {
    fields: ["message", "timestamp", "src", "level"],
    from: fromDay, // 10 days back
    until: new Date(), // today
    start: 0,
    order: "desc" as OrderType,
  };
  if (process.env.LOG_LEVEL === "error") {
    options.rows = MAX_LOG_LENGTH;
    options.limit = MAX_LOG_LENGTH;
  }
  if (getLogs) {
    getLogs(options)
      .then((logs) => {
        if (_.get(logs, "dailyRotateFile.length")) {
          const errorLogs = formatLogs(logs.dailyRotateFile);
          sendMessage("SYNC_LOGS", errorLogs);
        } else {
          sendMessage("SYNC_LOGS");
        }
      })
      .catch((error) => {
        sendMessage("ERROR_LOG_SYNC_ERROR", [], getErrorObj(error, "UNHANDLED_ERROR_LOG_SYNC_ERROR"));
      });
  }
};

const formatLogs = (logs: any[]) => {
  const errorLogs = _.filter(logs, (item) => item.level === "error").slice(0, MAX_LOG_LENGTH);
  const logList: ILogAPIFormat[] = _.map(errorLogs, (log) => {
    return {
      appver: process.env.APP_VERSION,
      pageid: log.src,
      ts: new Date(log.timestamp).getTime(),
      log: log.message,
    };
  });

  return logList;
};

const sendMessage = (message: string, logs = [], err?: ErrorObj) => {
  const messageObj: any = { message, logs };
  if (err) {
    messageObj.err = err;
  }
  process.send(messageObj);
};

process.on("message", (data) => {
  if (data.message === "GET_LOGS") {
    getAllLogs();
  } else if (data.message === "KILL") {
    sendMessage("LOG_SYNC_KILL");
  }
});
