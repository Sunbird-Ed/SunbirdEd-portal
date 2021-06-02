import * as childProcess from "child_process";
import { ErrorObj, ITelemetrySkipped } from "./ITelemetryImport";
import { Inject } from "typescript-ioc";
import * as path from "path";
import { logger } from "@project-sunbird/logger";
import { containerAPI, ISystemQueue, ITaskExecuter } from "@project-sunbird/OpenRAP/api";
import { manifest } from "../../manifest";
import * as  _ from "lodash";
import { Observer } from "rxjs";
import TelemetryHelper from "../../helper/telemetryHelper";
import { NetworkQueue } from "@project-sunbird/OpenRAP/services/queue";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
export class ImportTelemetry implements ITaskExecuter {
  public static taskType = "TELEMETRY_IMPORT";
  private deviceId: string;
  private workerProcessRef: childProcess.ChildProcess;
  @Inject private telemetryHelper: TelemetryHelper;
  private interrupt;
  private telemetryImportData: ISystemQueue;
  private observer: Observer<ISystemQueue>;
  private networkQueue: NetworkQueue;
  private progress: number = 0;
  private skippedFiles: ITelemetrySkipped[] = [];
  private standardLog: StandardLogger;
  constructor() {
    this.networkQueue = containerAPI.getNetworkQueueInstance();
    this.standardLog = containerAPI.getStandardLoggerInstance();
    this.getDeviceId();
  }
  public async getDeviceId() {
    this.deviceId = await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
  }
  public status() {
    return this.telemetryImportData;
  }
  public async start(telemetryImportData: ISystemQueue, observer: Observer<ISystemQueue>) {
    this.telemetryImportData = telemetryImportData;
    this.observer = observer;
    this.workerProcessRef = childProcess.fork(path.join(__dirname, "telemetryImportHelper"));
    this.handleChildProcessMessage();
    this.handleWorkerCloseEvents();
    this.parseFile();
    return true;
  }

  private parseFile() {
    this.workerProcessRef.send({
      message: "PARSE_FILE",
      telemetryImportData: this.telemetryImportData,
    });
  }

  private saveDataFromWorker(telemetryImportData: ISystemQueue) {
    this.telemetryImportData.metaData = telemetryImportData.metaData;
  }

  private async saveToDB(item) {
    try {
      this.updateProgress(_.get(item, "size"));
      // Check in DB if same id exist - then skip
      const dbData = await this.networkQueue.getByQuery({ selector: { _id: _.get(item, "mid") } });
      if (_.isEmpty(dbData)) {
        const headers = {
          "Content-Type": "application/json",
          "Content-Encoding": "gzip",
          "did": this.deviceId,
          "msgid": _.get(item, "mid"),
        };
        const insertDbData = {
          pathToApi: `${process.env.APP_BASE_URL}/api/data/v1/telemetry`,
          requestHeaderObj: headers,
          requestBody: _.get(item, "requestBody"),
          subType: "TELEMETRY",
          size: _.get(item, "size"),
          count: _.get(item, "eventsCount"),
          bearerToken: true,
        };
        await this.networkQueue.add(insertDbData, _.get(item, "mid"));
      } else {
        this.skippedFiles.push({ id: _.get(item, "mid"), reason: "ARTIFACT_MISSING" });
        this.telemetryImportData.metaData.skippedFiles = this.skippedFiles;
        this.observer.next(this.telemetryImportData);
      }
    } catch (err) {
      this.standardLog.error({ id: `TELEMETRY_IMPORT_DB_INSERTION_FAILED`, message: `Error while saving to db `, error: err });
      this.observer.next(this.telemetryImportData);
      this.observer.error(err);
    }
  }

  private updateProgress(size: number) {
    const percentage = (size * 100) / this.telemetryImportData.metaData.fileSize;
    this.progress = this.progress + percentage;
    this.telemetryImportData.progress = this.progress;
    this.observer.next(this.telemetryImportData);
  }

  private async handleChildProcessMessage() {
    this.workerProcessRef.on("message", async (data) => {
      if (data.telemetryImportData && (data && data.message !== "LOG")) {
        this.saveDataFromWorker(data.telemetryImportData); // save only required data from child,
      }
      if (this.interrupt) {
        return;
      }
      if (data.message === "SAVE_TO_DB") {
        this.saveToDB(data.dbData);
      } else if (data.message === "COMPLETE") {
        // Adding telemetry share event
        this.constructShareEvent();
        logger.info("--------Telemetry import complete-------", JSON.stringify(this.telemetryImportData));
        this.observer.complete();
      } else if (data.message === "LOG") {
        if (logger[data.logType]) {
          logger[data.logType]("Log from telemetry import worker: ", ...data.logBody);
        }
      } else if (data.message === "TELEMETRY_IMPORT_ERROR") {
        this.handleChildProcessError(data.err);
      } else {
        this.handleChildProcessError({ errCode: "UNHANDLED_WORKER_MESSAGE", errMessage: "Unhandled worker message" });
      }
    });
  }

  private handleWorkerCloseEvents() {
    this.workerProcessRef.on("exit", (code, signal) => {
      logger.info(this.telemetryImportData._id, "Child process exited with", code, signal);
      if (this.interrupt) {
        return;
      }
      if (!this.interrupt) {
        this.handleUnexpectedChildProcessExit(code, signal);
      }
    });
  }

  private async handleUnexpectedChildProcessExit(code, signal) {
    this.skippedFiles = [];
    this.observer.next(this.telemetryImportData);
    this.observer.error({
      code: "WORKER_UNHANDLED_EXCEPTION",
      message: "Import Worker exited while processing file",
    });
  }

  private async handleChildProcessError(err: ErrorObj) {
    this.observer.next(this.telemetryImportData);
    this.observer.error({
      code: err.errCode,
      message: err.errMessage,
    });
  }

  private async constructShareEvent() {
    const telemetryShareItems = [{
      id: this.telemetryImportData._id,
      type: "File",
      to: {
        id: this.deviceId,
        type: "Device",
      },
    }];
    this.telemetryHelper.logShareEvent(telemetryShareItems, "In", "Telemetry");
  }
}
