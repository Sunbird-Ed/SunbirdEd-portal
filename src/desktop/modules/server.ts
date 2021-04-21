import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";
import * as _ from "lodash";
import * as os from "os";
import { Inject } from "typescript-ioc";
import { Channel } from "./controllers/channel";
import ContentDelete from "./controllers/content/contentDelete";
import ContentLocation from "./controllers/contentLocation";
import { Faqs } from "./controllers/faqs";
import { Form } from "./controllers/form";
import { Framework } from "./controllers/framework";
import { Location } from './controllers/location';
import { Organization } from "./controllers/organization";
import { ResourceBundle } from "./controllers/resourceBundle";
import perfLoggerInit from "./loaders/logger";
import { LogSyncManager } from "./manager/logSyncManager";
import { manifest } from "./manifest";
import { Router } from "./routes";
import DatabaseSDK from "./sdk/database";
import { GeneralizedResources } from './controllers/generalizedResources';
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

const LOG_SYNC_INTERVAL_TIMESTAMP = 2 * 60 * 60 * 1000; // Triggers on every 2 hrs
export class Server {
  private ecarsFolderPath: string = "ecars";
  private contentFilesPath: string = "content";

  @Inject private databaseSdk: DatabaseSDK;
  @Inject private router: Router;
  @Inject private fileSDK;
  @Inject private contentDelete: ContentDelete;
  @Inject private logSyncManager: LogSyncManager
  @Inject private standardLog: StandardLogger = containerAPI.getStandardLoggerInstance();
  private settingSDK;
  constructor(app) {
    this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
    this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
    perfLoggerInit();
    this.initialize(app)
      .then(() => {
        this.standardLog.info({ id: `SERVER_${manifest.id}_INITIALIZED`, message: `${manifest.id}:initialized successfully` });
        EventManager.emit(`${manifest.id}:initialized`, {});
      })
      .catch(err => {
        this.standardLog.error({ id: `SERVER_INITIALIZED_FAILED`, message: 'Error while initializing server', error: err });
        EventManager.emit(`${manifest.id}:initialized`, {});
      });
  }
  
  async initialize(app) {
    //registerAcrossAllSDKS()
    await this.databaseSdk.initializeAndCreateIndex(manifest.id);
    this.contentDelete = new ContentDelete(manifest);
    await this.setContentStorageLocations(app);
    const response = await this.settingSDK.get(`${process.env.APP_VERSION}_configured`)
    .catch((err) => {
      this.standardLog.info({ id: `${manifest.id}_CONFIGURATION_MISSING`, message: `${manifest.id} not configured for version ${process.env.APP_VERSION}`, error: err });
    });
    if (!response) {
      this.standardLog.debug({ id: 'SERVER_DEVICE_TOKEN_REMOVE', message: "removing old device_token" });
      await this.settingSDK.delete('device_token').catch(error => 
        this.standardLog.error({ id: 'SERVER_DEVICE_TOKEN_DELETE_FAILED', message: 'Error while deleting device_token from setting', error }));
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
        this.standardLog.error({ id: `SERVER_DB_READ_FAILED`, message: `Error while fetching content storage location`, error });
      }
    }
  }

  private async syncLogs() {
    try {
      await this.logSyncManager.start();
    } catch (error) {
      this.standardLog.error({ id: `SERVER_ERROR_LOGS_SYNC_FAILED`, message: `Error while syncing error logs`, error });
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
    const generalizedResources = new GeneralizedResources(manifest);
    return Promise.all([organization.insert(), resourceBundle.insert(),
      framework.insert(), faqs.insert(),
      channel.insert(), form.insert(),
      form.insert(), location.insert(), generalizedResources.insert()]);
  }
}


