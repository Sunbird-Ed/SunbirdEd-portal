import { logger } from "@project-sunbird/logger";
import * as childProcess from "child_process";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { NetworkQueue } from "@project-sunbird/OpenRAP/services/queue";
import * as path from "path";
import { Singleton } from "typescript-ioc";
import { manifest } from "../../manifest";
import { ErrorObj } from "./ILogSync";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

const LAST_ERROR_LOG_SYNC_ON = "LAST_ERROR_LOG_SYNC_ON";

@Singleton
export class LogSyncManager {
  private deviceId: string;
  private networkQueue: NetworkQueue;
  private settingSDK;
  private workerProcessRef: childProcess.ChildProcess;
  private isInProgress = false;
  private standardLog: StandardLogger;

  constructor() {
    this.networkQueue = containerAPI.getNetworkQueueInstance();
    this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
    this.standardLog = containerAPI.getStandardLoggerInstance();
  }
  public async start() {
    if (!this.isInProgress) {
      await this.checkPreviousLogSync();
    }
  }

  private async checkPreviousLogSync() {
    // check in the settingSDK if the LAST_ERROR_LOG_SYNC_ON is not today
    const errorLogDBData = await this.settingSDK.get(LAST_ERROR_LOG_SYNC_ON).catch(() => undefined);
    const lastSyncDate = _.get(errorLogDBData, "lastSyncOn");
    if (!lastSyncDate || this.isLessThanToday(lastSyncDate)) {
      await this.launchChildProcess();
    }
  }

  private async launchChildProcess() {
    this.isInProgress = true;
    await this.getDeviceId();
    if(process.env.IS_PACKAGED_APP === 'true') {
      this.workerProcessRef = childProcess.fork(path.join(__dirname, "logSyncHelper"));
    } else {
      this.workerProcessRef = childProcess.fork(path.join(__dirname, "logSyncHelper"), [], { execArgv: ['-r', 'ts-node/register'] });
    }
    this.handleChildProcessMessage();
    this.workerProcessRef.send({
      message: "GET_LOGS",
    });
  }

  private handleChildProcessMessage() {
    this.workerProcessRef.on("message", async (data) => {
      if (data.message === "SYNC_LOGS" && _.get(data, "logs.length")) {
        this.killChildProcess();
        this.syncLogsToServer(data.logs);
        this.isInProgress = false;
      } else if (data.message === "ERROR_LOG_SYNC_ERROR") {
        this.handleChildProcessError(data.err);
        this.isInProgress = false;
      } else {
        this.handleChildProcessError({ errCode: "UNHANDLED_WORKER_MESSAGE", errMessage: "unsupported import step" });
        this.isInProgress = false;
      }
    });
  }

  private async syncLogsToServer(logs) {
    const headers = {
      "Content-Type": "application/json",
      "did": this.deviceId,
    };

    const request = {
      bearerToken: true,
      pathToApi: `${process.env.APP_BASE_URL}/api/data/v1/client/logs`,
      requestHeaderObj: headers,
      subType: "LOGS",
      requestBody: this.buildRequestBody(logs),
    };
    this.networkQueue.add(request).then((data) => {
      logger.info("Added in queue");
      this.updateLastSyncDate(Date.now());
    }).catch((error) => {
      this.standardLog.error({ id: 'LOG_SYNC_MANAGER_SYNC_FAILED', message: `Error while adding to Network queue`, error });
    });
  }

  private buildRequestBody(logs = []) {
    return {
      request: {
        context: {
          env: manifest.id,
          did: this.deviceId,
        },
        pdata: {
          id: process.env.APP_ID,
          ver: process.env.APP_VERSION,
          pid: "desktop.app",
        },
        logs,
      },
    };
  }

  private killChildProcess() {
    try {
      this.workerProcessRef.kill();
    } catch (error) {
      this.standardLog.error({ id: 'LOG_SYNC_MANAGER_CHILD_PROCESS_KILLED', message: `Error while killing the logSyncHelper child process`, error });
    }
  }

  private handleChildProcessError(error: ErrorObj) {
    this.killChildProcess();
    this.standardLog.error({ id: 'LOG_SYNC_MANAGER_CHILD_PROCESS_ERROR', message: `Error while processing child`, error });
  }

  private async updateLastSyncDate(date: number) {
    await this.settingSDK.put(LAST_ERROR_LOG_SYNC_ON, { lastSyncOn: date });
  }

  private isLessThanToday(inputDate: number) {
    if (inputDate) {
      inputDate = new Date(inputDate).setHours(0, 0, 0, 0);
      const today = new Date().setHours(0, 0, 0, 0);
      return inputDate < today;
    }
    return false;
  }

  private async getDeviceId() {
    this.deviceId = await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
  }
}
