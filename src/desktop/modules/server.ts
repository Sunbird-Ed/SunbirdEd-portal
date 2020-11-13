import * as os from "os";
import * as path from "path";
import { Inject } from "typescript-ioc";
import { Framework } from "./controllers/framework";
import { Faqs } from "./controllers/faqs";
import { Organization } from "./controllers/organization";
import { ResourceBundle } from "./controllers/resourceBundle";
import { Channel } from "./controllers/channel";
import { Form } from "./controllers/form";
import { Location } from './controllers/location';
import DatabaseSDK from "./sdk/database";
import { logger } from "@project-sunbird/logger";
import { containerAPI, ISystemQueue } from "@project-sunbird/OpenRAP/api";
import  ContentDelete from "./controllers/content/contentDelete";
import * as _ from "lodash";
import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";
import ContentLocation from "./controllers/contentLocation";
import { LogSyncManager } from "./manager/logSyncManager";
import { manifest } from "./manifest";
import { Router } from "./routes"
const express = require("express");

const REQUIRED_SYSTEM_QUEUE_TASK = ["IMPORT", "DOWNLOAD", "DELETE"];
const LOG_SYNC_INTERVAL_TIMESTAMP = 2 * 60 * 60 * 1000; // Triggers on every 2 hrs
export class Server {
  private sunbirded_plugin_initialized = false;
  private ecarsFolderPath: string = "ecars";
  private contentFilesPath: string = "content";

  @Inject
  private databaseSdk: DatabaseSDK;

  @Inject
  private router: Router;

  @Inject
  private fileSDK;

  @Inject
  private contentDelete: ContentDelete;
  @Inject private logSyncManager: LogSyncManager
  private settingSDK;
  private perfLogger;
  constructor(app) {
    this.perfLogger = containerAPI.getPerfLoggerInstance();
    // Added timeout since db creation is async and it is taking time and insertion is failing
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
    this.handleSystemQueueTaskCompletionEvents();
    this.initialize(app)
      .then(() => {
        this.sunbirded_plugin_initialized = true;
        EventManager.emit(`${manifest.id}:initialized`, {});
      })
      .catch(err => {
        logger.error(
          "Error while initializing open rap sunbird ed plugin",
          err
        );
        this.sunbirded_plugin_initialized = true;
        EventManager.emit(`${manifest.id}:initialized`, {});
      });
  }
  public handleSystemQueueTaskCompletionEvents() {
    EventManager.subscribe("SystemQueue:TASK_COMPLETE",
      (data: ISystemQueue) => {
      if (!_.includes(REQUIRED_SYSTEM_QUEUE_TASK, data.type)) {
          return;
      }
      if (_.includes(["IMPORT", "DOWNLOAD"], data.type)) {
        this.addPerfLogForImportAndDownload(data);
      } else if (data.type === "DELETE") {
        this.addPerfLogForDelete(data);
      }
    });
  }
  private addPerfLogForDelete(data: ISystemQueue) {
    //TODO: need to be implemented
  }
  private addPerfLogForImportAndDownload(data: ISystemQueue) {
    let runTime: number = data.runTime;
    const contentSizeInMb: number = data.metaData.contentSize / 1e+6;
    runTime = runTime / contentSizeInMb;
    this.perfLogger.log({
      type: data.type,
      time: runTime,
      metaData: {},
    });
  }
  async initialize(app) {
    //registerAcrossAllSDKS()
    this.databaseSdk.initialize(manifest.id);
    this.contentDelete = new ContentDelete(manifest);
    app.set("view engine", "ejs");
    app.use("/contentPlayer/preview/content",express.static(this.fileSDK.getAbsPath(this.contentFilesPath)));
    app.use( "/contentPlayer/preview", express.static(this.fileSDK.getAbsPath(this.contentFilesPath)));
    app.use("/contentPlayer/preview/content/*/content-plugins", express.static(this.fileSDK.getAbsPath(this.contentFilesPath)));
    app.use("/contentPlayer/preview", express.static(path.join(__dirname, "..", "public", "contentPlayer", "preview")));
    app.use("/content", express.static(this.fileSDK.getAbsPath(this.contentFilesPath)));
    app.use( "/ecars", express.static(this.fileSDK.getAbsPath(this.ecarsFolderPath)));
    app.use(express.static(path.join(__dirname, "..", "public", "portal")));
    app.use("/sunbird-plugins", express.static(path.join(__dirname, "..", "public", "sunbird-plugins")));

    await this.setContentStorageLocations(app);
    const response = await this.settingSDK.get(`${process.env.APP_VERSION}_configured`)
    .catch((err) => {
      logger.info(`${manifest.id} not configured for version`, `${process.env.APP_VERSION}`, err);
    });
    if (!response) {
      await this.insertConfig();    // insert meta data for app
      this.settingSDK.put(`${process.env.APP_VERSION}_configured`, { dataInserted: true});
      logger.info(`${manifest.id} configured for version ${process.env.APP_VERSION} and settingSdk updated`);
    } else {
      logger.info(`${manifest.id} configured for version ${process.env.APP_VERSION}, skipping configuration`);
    }
    const pluginConfig = {
      pluginVer: manifest.version,
      apiToken: "",
      apiBaseURL: process.env.APP_BASE_URL,
      apiTokenRefreshFn: "refreshToken"
    };
    await containerAPI.register(manifest.id, pluginConfig);

    await this.fileSDK.mkdir(this.contentFilesPath);
    await this.fileSDK.mkdir(this.ecarsFolderPath);
    //- reIndex()
    //- reConfigure()
   await this.syncLogs();
    setInterval(async () => {
      await this.syncLogs();
    }, LOG_SYNC_INTERVAL_TIMESTAMP);
    this.router.init(app);
  }

  private async setContentStorageLocations(app) {
    if (os.platform() === "win32") {
      try {
        const locationList: any = await this.settingSDK.get(`content_storage_location`);
        if (_.get(locationList, "location.length")) {
          const contentLocation = new ContentLocation(manifest.id);
          locationList.location.map((item) => {
            contentLocation.setContentStaticRoute(app, item);
          });
        }
      } catch (error) {
        logger.error("Error while fetching content storage location", error);
      }
    }
  }

  private async syncLogs() {
    try {
      await this.logSyncManager.start();
    } catch (error) {
      logger.error("Error while syncing error logs", error);
    }
  }

  private async insertConfig() {
    const framework = new Framework(manifest);
    const faqs = new Faqs(manifest);
    const organization = new Organization(manifest);
    const resourceBundle = new ResourceBundle(manifest);
    const channel = new Channel(manifest);
    const form = new Form(manifest);
    const location = new Location(manifest);
    return Promise.all([organization.insert(), resourceBundle.insert(),
      framework.insert(), faqs.insert(),
      channel.insert(), form.insert(),
      form.insert(), location.insert()]);
  }
}

process
  .on("unhandledRejection", (reason, p) => {
    logger.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", err => {
    logger.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });
