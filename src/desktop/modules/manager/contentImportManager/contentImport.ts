import HardDiskInfo from "../../utils/hardDiskInfo";
import * as childProcess from "child_process";
import { ErrorObj, ImportSteps } from "./IContentImport";
import { Inject } from "typescript-ioc";
import * as path from "path";
import DatabaseSDK from "../../sdk/database";
import { logger } from "@project-sunbird/logger";
import { containerAPI, ISystemQueue, ITaskExecuter } from "@project-sunbird/OpenRAP/api";
import { manifest } from "../../manifest";
import { IAddedUsingType } from "../../controllers/content/IContent";
import * as  _ from "lodash";
import { Observer } from "rxjs";
import TelemetryHelper from "../../helper/telemetryHelper";
import ContentLocation from "../../controllers/contentLocation";

export class ImportContent implements ITaskExecuter {
  private deviceId: string;
  public static taskType = "IMPORT";
  private workerProcessRef: childProcess.ChildProcess;
  private fileSDK: any;
  @Inject private dbSDK: DatabaseSDK;
  @Inject private telemetryHelper: TelemetryHelper;
  private manifestJson: any;
  private interrupt;
  private contentImportData: ISystemQueue;
  private observer: Observer<ISystemQueue>;
  private contentLocation: any;
  private contentFolderPath: string;
  @Inject private standardLog = containerAPI.getStandardLoggerInstance();
  constructor() {
    this.dbSDK.initialize(manifest.id);
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.contentLocation = new ContentLocation(manifest.id);
    this.getDeviceId();
  }
  public async getDeviceId() {
    this.deviceId = await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
  }
  public status() {
    return this.contentImportData;
  }
  public async start(contentImportData: ISystemQueue, observer: Observer<ISystemQueue>) {
    const contentLocationPath = await this.contentLocation.get();
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id, contentLocationPath);
    this.contentImportData = contentImportData;
    this.observer = observer;
    this.contentFolderPath = await this.contentLocation.get();
    if(process.env.IS_PACKAGED_APP === 'true') {
      this.workerProcessRef = childProcess.fork(path.join(__dirname, "contentImportHelper"));
    } else {
      this.workerProcessRef = childProcess.fork(path.join(__dirname, "contentImportHelper"), [], { execArgv: ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register'] });
    }
    this.handleChildProcessMessage();
    this.handleWorkerCloseEvents();
    switch (this.contentImportData.metaData.step) {
      case ImportSteps.copyEcar: {
        const availableDiskSpace = await HardDiskInfo.getAvailableDiskSpace();
        this.workerProcessRef.send({
          message: this.contentImportData.metaData.step,
          contentImportData: this.contentImportData,
          availableDiskSpace,
        });
        break;
      }
      case ImportSteps.parseEcar: {
        this.workerProcessRef.send({
          message: this.contentImportData.metaData.step,
          contentImportData: this.contentImportData,
          contentFolder: this.contentFolderPath,
        });
        break;
      }
      case ImportSteps.extractEcar: {
        this.extractEcar();
        break;
      }
      case ImportSteps.processContents: {
        this.processContents();
        break;
      }
      default: {
        this.handleChildProcessError({ errCode: "UNHANDLED_IMPORT_STEP", errMessage: "unsupported import step" });
        break;
      }
    }
    return true;
  }

  public cleanUpAfterErrorOrCancel() {
    const fileSDKEcarInstance = containerAPI.getFileSDKInstance(manifest.id);
    fileSDKEcarInstance.remove(path.join("ecars", this.contentImportData._id + ".ecar")).catch((err) => {
      this.standardLog.debug({ id: 'CONTENT_IMPORT_FILE_DELETE_FAILED', message: `Error while deleting file ${path.join("ecars", this.contentImportData._id + ".ecar")}`, error: err });
    });

    this.fileSDK.remove(path.join(this.contentFolderPath, this.contentImportData._id)).catch((err) => {
      this.standardLog.debug({ id: 'CONTENT_IMPORT_FOLDER_DELETE_FAILED', message: `Error while deleting folder ${path.join("content", this.contentImportData._id)}`, error: err });
    });
    // TODO: delete content folder if there"s no record in db;
  }

  public async cancel() {
    this.interrupt = true; // to stop message from child process
    if (this.contentImportData.metaData.step === ImportSteps.processContents) {
      return false;
    }
    this.workerProcessRef.send({ message: "KILL" });
    this.cleanUpAfterErrorOrCancel();
    await this.handleKillSignal();
    // this.observer.next(this.contentImportData);
    return true;
  }

  public async pause() {
    this.interrupt = true; // to stop message from child process
    if (this.contentImportData.metaData.step === ImportSteps.processContents) {
      return false;
    }
    this.workerProcessRef.send({ message: "KILL" });
    await this.handleKillSignal();
    // this.observer.next(this.contentImportData);
    return true;
  }

  private saveDataFromWorker(contentImportData: ISystemQueue) {
    this.contentImportData.metaData = contentImportData.metaData;
    this.contentImportData.progress = contentImportData.progress;
  }

  private async extractEcar() {
    try {
      if (this.contentImportData.metaData.step !== ImportSteps.extractEcar) {
        this.contentImportData.metaData.step = ImportSteps.extractEcar;
        this.observer.next(this.contentImportData);
      }
      const contentIds = [this.contentImportData.metaData.contentId];
      if (this.contentImportData.metaData.childNodes) {
        contentIds.push(...this.contentImportData.metaData.childNodes);
      }
      const dbContents = await this.getContentsFromDB(contentIds);
      const availableDiskSpace = await HardDiskInfo.getAvailableDiskSpace();
      this.workerProcessRef.send({
        message: this.contentImportData.metaData.step,
        contentImportData: this.contentImportData,
        dbContents,
        contentFolder: this.contentFolderPath,
        availableDiskSpace,
      });
    } catch (err) {
      this.observer.next(this.contentImportData);
      this.observer.error(err);
      this.cleanUpAfterErrorOrCancel();
    }
  }

  private async processContents() {
    try {
      if (this.contentImportData.metaData.step !== ImportSteps.processContents) {
        this.contentImportData.metaData.step = ImportSteps.processContents;
        this.observer.next(this.contentImportData);
      }
      const contentIds = [this.contentImportData.metaData.contentId];
      if (this.contentImportData.metaData.childNodes) {
        contentIds.push(...this.contentImportData.metaData.childNodes);
      }
      const dbContents = await this.getContentsFromDB(contentIds);
      await this.saveContentsToDb(dbContents);
      this.contentImportData.metaData.step = ImportSteps.complete;
      // Adding telemetry share event
      this.constructShareEvent(this.contentImportData);
      logger.info("--------import complete-------", JSON.stringify(this.contentImportData));
      this.observer.next(this.contentImportData);
      this.observer.complete();
    } catch (err) {
      this.contentImportData.metaData.step = ImportSteps.copyEcar;
      this.contentImportData.failedCode = err.errCode || "CONTENT_SAVE_FAILED";
      this.contentImportData.failedReason = err.errMessage;
      this.observer.next(this.contentImportData);
      this.observer.error(err);
      this.cleanUpAfterErrorOrCancel();
    } finally {
      this.workerProcessRef.kill();
    }
  }

  private async constructShareEvent(data) {
    const telemetryShareItems = [{
      id: _.get(data, "metaData.contentId"),
      type: _.get(data, "metaData.contentType"),
      ver: _.toString(_.get(data, "metaData.pkgVersion")),
      origin: {
        id: this.deviceId,
        type: "Device",
      },
    }];
    this.telemetryHelper.logShareEvent(telemetryShareItems, "In", "Content");
  }

  private async saveContentsToDb(dbContents) {
    let hierarchy;
    this.manifestJson = await this.fileSDK.readJSON(
      path.join(path.join(this.fileSDK.getAbsPath(""), this.contentImportData.metaData.contentId), "manifest.json"));
    try {
      hierarchy = await this.fileSDK.readJSON(
        path.join(path.join(this.fileSDK.getAbsPath(""), this.contentImportData.metaData.contentId), "hierarchy.json"));
      hierarchy = _.get(hierarchy, 'content');
    } catch (error) {
      this.standardLog.debug({ id: 'CONTENT_IMPORT_HIERARCHY_READ_FAILED', message: 'Error while reading Hierarchy', error });
    }
    const resources = _.reduce(_.get(this.manifestJson, "archive.items"), (acc, item) => {
      const parentContent = item.identifier === this.contentImportData.metaData.contentId;
      if (item.mimeType === "application/vnd.ekstep.content-collection" && !parentContent) {
        logger.info("Skipped writing to db for content", item.identifier, "reason: collection and not parent");
        return acc; // db entry not required for collection which are not parent
      }
      if (item.mimeType === "application/vnd.ekstep.content-collection" && parentContent && hierarchy) {
        item = hierarchy;
      }
      const dbResource: any = _.find(dbContents, { identifier: item.identifier });
      const isAvailable = parentContent ? true :
          _.includes(this.contentImportData.metaData.contentAdded, item.identifier);
      if ((dbResource && _.get(dbResource, "desktopAppMetadata.isAvailable") && !isAvailable)) {
        logger.info("Skipped writing to db for content", item.identifier, "reason: content already added to db and no changes required or artifact not present",
        parentContent, isAvailable, !dbResource);
        // content added with artifact already or added without artifact but ecar has no artifact for this content
        return acc; // then return
      }
      _.forEach(['subject', 'gradeLevel', 'medium'], (data) => {
        if(item[data] && _.isString(item[data])) {
          item[data] = item[data].split(',');
        }
      })
      item._id = item.identifier;
      item.baseDir = `content/${item.identifier}`;
      item.desktopAppMetadata = {
        addedUsing: IAddedUsingType.import,
        createdOn: Date.now(),
        updatedOn: Date.now(),
        isAvailable,
      };
      if (dbResource) {
        item._rev = dbResource._rev;
        item.desktopAppMetadata.createdOn = dbResource.desktopAppMetadata.createdOn;
      } else {
        delete item._rev; // if field exist insertion will fail
      }
      item.visibility = parentContent ? "Default" : item.visibility;
      if (parentContent && item.mimeType === "application/vnd.ekstep.content-collection") {
        const itemsClone = _.cloneDeep(_.get(this.manifestJson, "archive.items"));
        item.children = this.createHierarchy(itemsClone, item);
      }
      acc.push(item);
      logger.info("Writing to db for content", { id: item.identifier, parentContent, isAvailable,
        notInDb: !dbResource});
      return acc;
    }, []);
    if (!resources.length) {
      logger.info("Skipping bulk update for ImportId", this.contentImportData._id);
      return true;
    }
    await this.dbSDK.bulk("content", resources);
  }

  private async copyEcar() {
    this.contentImportData.metaData.step = ImportSteps.parseEcar;
    this.observer.next(this.contentImportData);
    this.workerProcessRef.send({
      message: this.contentImportData.metaData.step,
      contentImportData: this.contentImportData,
      contentFolder: this.contentFolderPath,
    });
  }

  private async handleChildProcessMessage() {
    this.workerProcessRef.on("message", async (data) => {
      if (data.contentImportData && (data && data.message !== "LOG")) {
        this.saveDataFromWorker(data.contentImportData); // save only required data from child,
      }
      if (this.interrupt) { // stop import progress when status changes like pause or cancel
        return;
      }
      if (data.message === ImportSteps.copyEcar) {
        this.copyEcar();
      } else if (data.message === ImportSteps.parseEcar) {
        this.extractEcar();
      } else if (data.message === ImportSteps.extractEcar) {
        this.processContents();
      } else if (data.message === "DATA_SYNC") {
        this.observer.next(this.contentImportData);
      } else if (data.message === "LOG") {
        if (logger[data.logType]) {
          logger[data.logType]("Log from import worker: ", ...data.logBody);
        }
      } else if (data.message === "IMPORT_ERROR") {
        this.handleChildProcessError(data.err);
      } else {
        this.handleChildProcessError({ errCode: "UNHANDLED_WORKER_MESSAGE", errMessage: "unsupported import step" });
      }
    });
  }

  private handleWorkerCloseEvents() {
    this.workerProcessRef.on("exit", (code, signal) => {
      if (this.interrupt || this.contentImportData.metaData.step === ImportSteps.complete) {
        return;
      }
      if (!this.interrupt) {
        this.handleUnexpectedChildProcessExit(code, signal);
      }
    });
  }

  private async handleUnexpectedChildProcessExit(code, signal) {
    this.contentImportData.metaData.step = ImportSteps.copyEcar;
    this.observer.next(this.contentImportData);
    this.observer.error({
      code: "WORKER_UNHANDLED_EXCEPTION",
      message: "Import Worker exited while processing ECar",
    });
    this.cleanUpAfterErrorOrCancel();
  }

  private async handleChildProcessError(err: ErrorObj) {
    this.contentImportData.metaData.step = ImportSteps.copyEcar;
    this.observer.next(this.contentImportData);
    this.observer.error({
      code: err.errCode,
      message: err.errMessage,
    });
    this.cleanUpAfterErrorOrCancel();
  }

  private async getContentsFromDB(contentIds: string[]) {
    const dbResults = await this.dbSDK.find("content", {
      selector: {
        identifier: {
          $in: contentIds,
        },
      },
    }).catch((err) => undefined);
    return _.get(dbResults, "docs") ? dbResults.docs : [];
  }

  private async handleKillSignal() {
    return new Promise<void>((resolve, reject) => {
      this.workerProcessRef.on("message", async (data) => {
        if (data.message === "DATA_SYNC_KILL") {
          this.workerProcessRef.kill();
          resolve();
        }
      });
    });
  }

  private createHierarchy(items: any[], parent: any, tree?: any[]): any {
    tree = typeof tree !== "undefined" ? tree : [];
    parent = typeof parent !== "undefined" ? parent : { visibility: "Default" };
    if (parent.children && parent.children.length) {
      let children = [];
      _.forEach(items, (child) => {
        const childWithIndex: any = _.find(parent.children, { identifier: child.identifier });
        if (!_.isEmpty(childWithIndex)) {
          child.index = childWithIndex.index;
          children.push(child);
        }
      });
      if (!_.isEmpty(children)) {
        children = _.sortBy(children, "index");
        if (parent.visibility === "Default") {
          tree = children;
        } else {
          parent.children = children;
        }
        _.each(children, (child) => this.createHierarchy(items, child));
      }
    }
    return tree;
  }
}
