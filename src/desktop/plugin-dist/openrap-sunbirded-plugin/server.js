var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@project-sunbird/ext-framework-server/models");
const api_1 = require("@project-sunbird/ext-framework-server/api");
const os = require("os");
const path = require("path");
const typescript_ioc_1 = require("typescript-ioc");
const framework_1 = require("./controllers/framework");
const faqs_1 = require("./controllers/faqs");
const organization_1 = require("./controllers/organization");
const resourceBundle_1 = require("./controllers/resourceBundle");
const channel_1 = require("./controllers/channel");
const form_1 = require("./controllers/form");
const location_1 = require("./controllers/location");
const database_1 = require("./sdk/database");
const logger_1 = require("@project-sunbird/logger");
const api_2 = require("OpenRAP/dist/api");
const contentDelete_1 = require("./controllers/content/contentDelete");
const _ = require("lodash");
const EventManager_1 = require("@project-sunbird/ext-framework-server/managers/EventManager");
const contentLocation_1 = require("./controllers/contentLocation");
const logSyncManager_1 = require("./manager/logSyncManager");
const REQUIRED_SYSTEM_QUEUE_TASK = ["IMPORT", "DOWNLOAD", "DELETE"];
const LOG_SYNC_INTERVAL_TIMESTAMP = 2 * 60 * 60 * 1000; // Triggers on every 2 hrs
class Server extends models_1.BaseServer {
    constructor(manifest) {
        super(manifest);
        this.sunbirded_plugin_initialized = false;
        this.ecarsFolderPath = "ecars";
        this.contentFilesPath = "content";
        this.perfLogger = api_2.containerAPI.getPerfLoggerInstance();
        // Added timeout since db creation is async and it is taking time and insertion is failing
        this.fileSDK = api_2.containerAPI.getFileSDKInstance(manifest.id);
        this.settingSDK = api_2.containerAPI.getSettingSDKInstance(manifest.id);
        this.handleSystemQueueTaskCompletionEvents();
        this.initialize(manifest)
            .then(() => {
            this.sunbirded_plugin_initialized = true;
            EventManager_1.EventManager.emit(`${manifest.id}:initialized`, {});
        })
            .catch(err => {
            logger_1.logger.error("Error while initializing open rap sunbird ed plugin", err);
            this.sunbirded_plugin_initialized = true;
            EventManager_1.EventManager.emit(`${manifest.id}:initialized`, {});
        });
    }
    handleSystemQueueTaskCompletionEvents() {
        EventManager_1.EventManager.subscribe("SystemQueue:TASK_COMPLETE", (data) => {
            if (!_.includes(REQUIRED_SYSTEM_QUEUE_TASK, data.type)) {
                return;
            }
            if (_.includes(["IMPORT", "DOWNLOAD"], data.type)) {
                this.addPerfLogForImportAndDownload(data);
            }
            else if (data.type === "DELETE") {
                this.addPerfLogForDelete(data);
            }
        });
    }
    addPerfLogForDelete(data) {
        //TODO: need to be implemented
    }
    addPerfLogForImportAndDownload(data) {
        let runTime = data.runTime;
        const contentSizeInMb = data.metaData.contentSize / 1e+6;
        runTime = runTime / contentSizeInMb;
        this.perfLogger.log({
            type: data.type,
            time: runTime,
            metaData: {},
        });
    }
    initialize(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            //registerAcrossAllSDKS()
            this.databaseSdk.initialize(manifest.id);
            this.contentDelete = new contentDelete_1.default(manifest);
            api_1.frameworkAPI.registerStaticRoute(this.fileSDK.getAbsPath(this.contentFilesPath), "/contentPlayer/preview/content");
            api_1.frameworkAPI.registerStaticRoute(this.fileSDK.getAbsPath(this.contentFilesPath), "/contentPlayer/preview");
            api_1.frameworkAPI.registerStaticRoute(this.fileSDK.getAbsPath(this.contentFilesPath), "/contentPlayer/preview/content/*/content-plugins");
            api_1.frameworkAPI.registerStaticRoute(path.join(__dirname, "..", "..", "public", "contentPlayer", "preview"), "/contentPlayer/preview");
            api_1.frameworkAPI.registerStaticRoute(this.fileSDK.getAbsPath(this.contentFilesPath), "/content");
            api_1.frameworkAPI.registerStaticRoute(this.fileSDK.getAbsPath(this.ecarsFolderPath), "/ecars");
            api_1.frameworkAPI.registerStaticRoute(path.join(__dirname, "..", "..", "public", "portal"));
            api_1.frameworkAPI.registerStaticRoute(path.join(__dirname, "..", "..", "public", "sunbird-plugins"), "/sunbird-plugins");
            if (os.platform() === "win32") {
                try {
                    const locationList = yield this.settingSDK.get(`content_storage_location`);
                    if (_.get(locationList, "location.length")) {
                        const contentLocation = new contentLocation_1.default(manifest.id);
                        locationList.location.map((item) => {
                            contentLocation.setContentStaticRoute(item);
                        });
                    }
                }
                catch (error) {
                    logger_1.logger.error("Error while fetching content storage location", error);
                }
            }
            api_1.frameworkAPI.setStaticViewEngine("ejs");
            const response = yield this.settingSDK.get(`${process.env.APP_VERSION}_configured`)
                .catch((err) => {
                logger_1.logger.info(`${manifest.id} not configured for version`, `${process.env.APP_VERSION}`, err);
            });
            if (!response) {
                yield this.insertConfig(manifest); // insert meta data for app
                this.settingSDK.put(`${process.env.APP_VERSION}_configured`, { dataInserted: true });
                logger_1.logger.info(`${manifest.id} configured for version ${process.env.APP_VERSION} and settingSdk updated`);
            }
            else {
                logger_1.logger.info(`${manifest.id} configured for version ${process.env.APP_VERSION}, skipping configuration`);
            }
            const pluginConfig = {
                pluginVer: manifest.version,
                apiToken: "",
                apiBaseURL: process.env.APP_BASE_URL,
                apiTokenRefreshFn: "refreshToken"
            };
            yield api_2.containerAPI.register(manifest.id, pluginConfig);
            yield this.fileSDK.mkdir(this.contentFilesPath);
            yield this.fileSDK.mkdir(this.ecarsFolderPath);
            //- reIndex()
            //- reConfigure()
            yield this.syncLogs();
            setInterval(() => __awaiter(this, void 0, void 0, function* () {
                yield this.syncLogs();
            }), LOG_SYNC_INTERVAL_TIMESTAMP);
        });
    }
    syncLogs() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.logSyncManager.start();
            }
            catch (error) {
                logger_1.logger.error("Error while syncing error logs", error);
            }
        });
    }
    insertConfig(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            const framework = new framework_1.Framework(manifest);
            const faqs = new faqs_1.Faqs(manifest);
            const organization = new organization_1.Organization(manifest);
            const resourceBundle = new resourceBundle_1.ResourceBundle(manifest);
            const channel = new channel_1.Channel(manifest);
            const form = new form_1.Form(manifest);
            const location = new location_1.Location(manifest);
            return Promise.all([organization.insert(), resourceBundle.insert(),
                framework.insert(), faqs.insert(),
                channel.insert(), form.insert(),
                form.insert(), location.insert()]);
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], Server.prototype, "databaseSdk", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", Object)
], Server.prototype, "fileSDK", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", contentDelete_1.default)
], Server.prototype, "contentDelete", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", logSyncManager_1.LogSyncManager)
], Server.prototype, "logSyncManager", void 0);
exports.Server = Server;
process
    .on("unhandledRejection", (reason, p) => {
    logger_1.logger.error(reason, "Unhandled Rejection at Promise", p);
})
    .on("uncaughtException", err => {
    logger_1.logger.error(err, "Uncaught Exception thrown");
    process.exit(1);
});
