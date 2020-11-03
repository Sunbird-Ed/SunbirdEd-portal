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
const hardDiskInfo_1 = require("../../utils/hardDiskInfo");
const childProcess = require("child_process");
const IContentImport_1 = require("./IContentImport");
const typescript_ioc_1 = require("typescript-ioc");
const path = require("path");
const database_1 = require("../../sdk/database");
const logger_1 = require("@project-sunbird/logger");
const api_1 = require("OpenRAP/dist/api");
const manifest_1 = require("../../manifest");
const IContent_1 = require("../../controllers/content/IContent");
const _ = require("lodash");
const telemetryHelper_1 = require("../../helper/telemetryHelper");
const contentLocation_1 = require("../../controllers/contentLocation");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class ImportContent {
    constructor() {
        this.dbSDK.initialize(manifest_1.manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id);
        this.contentLocation = new contentLocation_1.default(manifest_1.manifest.id);
        this.getDeviceId();
    }
    getDeviceId() {
        return __awaiter(this, void 0, void 0, function* () {
            this.deviceId = yield api_1.containerAPI.getSystemSDKInstance(manifest_1.manifest.id).getDeviceId();
        });
    }
    status() {
        return this.contentImportData;
    }
    start(contentImportData, observer) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentLocationPath = yield this.contentLocation.get();
            this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id, contentLocationPath);
            this.contentImportData = contentImportData;
            this.observer = observer;
            this.contentFolderPath = yield this.contentLocation.get();
            this.workerProcessRef = childProcess.fork(path.join(__dirname, "contentImportHelper"));
            this.handleChildProcessMessage();
            this.handleWorkerCloseEvents();
            switch (this.contentImportData.metaData.step) {
                case IContentImport_1.ImportSteps.copyEcar: {
                    const availableDiskSpace = yield hardDiskInfo_1.default.getAvailableDiskSpace();
                    this.workerProcessRef.send({
                        message: this.contentImportData.metaData.step,
                        contentImportData: this.contentImportData,
                        availableDiskSpace,
                    });
                    break;
                }
                case IContentImport_1.ImportSteps.parseEcar: {
                    this.workerProcessRef.send({
                        message: this.contentImportData.metaData.step,
                        contentImportData: this.contentImportData,
                        contentFolder: this.contentFolderPath,
                    });
                    break;
                }
                case IContentImport_1.ImportSteps.extractEcar: {
                    this.extractEcar();
                    break;
                }
                case IContentImport_1.ImportSteps.processContents: {
                    this.processContents();
                    break;
                }
                default: {
                    this.handleChildProcessError({ errCode: "UNHANDLED_IMPORT_STEP", errMessage: "unsupported import step" });
                    break;
                }
            }
            return true;
        });
    }
    cleanUpAfterErrorOrCancel() {
        const fileSDKEcarInstance = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id);
        fileSDKEcarInstance.remove(path.join("ecars", this.contentImportData._id + ".ecar")).catch((err) => logger_1.logger.debug(`Error while deleting file ${path.join("ecars", this.contentImportData._id + ".ecar")}`));
        this.fileSDK.remove(path.join(this.contentFolderPath, this.contentImportData._id)).catch((err) => logger_1.logger.debug(`Error while deleting folder ${path.join("content", this.contentImportData._id)}`));
        // TODO: delete content folder if there"s no record in db;
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.interrupt = true; // to stop message from child process
            if (this.contentImportData.metaData.step === IContentImport_1.ImportSteps.processContents) {
                return false;
            }
            this.workerProcessRef.send({ message: "KILL" });
            this.cleanUpAfterErrorOrCancel();
            yield this.handleKillSignal();
            // this.observer.next(this.contentImportData);
            return true;
        });
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            this.interrupt = true; // to stop message from child process
            if (this.contentImportData.metaData.step === IContentImport_1.ImportSteps.processContents) {
                return false;
            }
            this.workerProcessRef.send({ message: "KILL" });
            yield this.handleKillSignal();
            // this.observer.next(this.contentImportData);
            return true;
        });
    }
    saveDataFromWorker(contentImportData) {
        this.contentImportData.metaData = contentImportData.metaData;
        this.contentImportData.progress = contentImportData.progress;
    }
    extractEcar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.contentImportData.metaData.step !== IContentImport_1.ImportSteps.extractEcar) {
                    this.contentImportData.metaData.step = IContentImport_1.ImportSteps.extractEcar;
                    this.observer.next(this.contentImportData);
                }
                const contentIds = [this.contentImportData.metaData.contentId];
                if (this.contentImportData.metaData.childNodes) {
                    contentIds.push(...this.contentImportData.metaData.childNodes);
                }
                const dbContents = yield this.getContentsFromDB(contentIds);
                const availableDiskSpace = yield hardDiskInfo_1.default.getAvailableDiskSpace();
                this.workerProcessRef.send({
                    message: this.contentImportData.metaData.step,
                    contentImportData: this.contentImportData,
                    dbContents,
                    contentFolder: this.contentFolderPath,
                    availableDiskSpace,
                });
            }
            catch (err) {
                this.observer.next(this.contentImportData);
                this.observer.error(err);
                this.cleanUpAfterErrorOrCancel();
            }
        });
    }
    processContents() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.contentImportData.metaData.step !== IContentImport_1.ImportSteps.processContents) {
                    this.contentImportData.metaData.step = IContentImport_1.ImportSteps.processContents;
                    this.observer.next(this.contentImportData);
                }
                const contentIds = [this.contentImportData.metaData.contentId];
                if (this.contentImportData.metaData.childNodes) {
                    contentIds.push(...this.contentImportData.metaData.childNodes);
                }
                const dbContents = yield this.getContentsFromDB(contentIds);
                yield this.saveContentsToDb(dbContents);
                this.contentImportData.metaData.step = IContentImport_1.ImportSteps.complete;
                // Adding telemetry share event
                this.constructShareEvent(this.contentImportData);
                logger_1.logger.info("--------import complete-------", JSON.stringify(this.contentImportData));
                this.observer.next(this.contentImportData);
                this.observer.complete();
            }
            catch (err) {
                this.contentImportData.metaData.step = IContentImport_1.ImportSteps.copyEcar;
                this.contentImportData.failedCode = err.errCode || "CONTENT_SAVE_FAILED";
                this.contentImportData.failedReason = err.errMessage;
                this.observer.next(this.contentImportData);
                this.observer.error(err);
                this.cleanUpAfterErrorOrCancel();
            }
            finally {
                this.workerProcessRef.kill();
            }
        });
    }
    constructShareEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    saveContentsToDb(dbContents) {
        return __awaiter(this, void 0, void 0, function* () {
            this.manifestJson = yield this.fileSDK.readJSON(path.join(path.join(this.fileSDK.getAbsPath(""), this.contentImportData.metaData.contentId), "manifest.json"));
            const resources = _.reduce(_.get(this.manifestJson, "archive.items"), (acc, item) => {
                const parentContent = item.identifier === this.contentImportData.metaData.contentId;
                if (item.mimeType === "application/vnd.ekstep.content-collection" && !parentContent) {
                    logger_1.logger.info("Skipped writing to db for content", item.identifier, "reason: collection and not parent");
                    return acc; // db entry not required for collection which are not parent
                }
                const dbResource = _.find(dbContents, { identifier: item.identifier });
                const isAvailable = parentContent ? true :
                    _.includes(this.contentImportData.metaData.contentAdded, item.identifier);
                if ((dbResource && _.get(dbResource, "desktopAppMetadata.isAvailable") && !isAvailable)) {
                    logger_1.logger.info("Skipped writing to db for content", item.identifier, "reason: content already added to db and no changes required or artifact not present", parentContent, isAvailable, !dbResource);
                    // content added with artifact already or added without artifact but ecar has no artifact for this content
                    return acc; // then return
                }
                item._id = item.identifier;
                item.baseDir = `content/${item.identifier}`;
                item.desktopAppMetadata = {
                    addedUsing: IContent_1.IAddedUsingType.import,
                    createdOn: Date.now(),
                    updatedOn: Date.now(),
                    isAvailable,
                };
                if (dbResource) {
                    item._rev = dbResource._rev;
                    item.desktopAppMetadata.createdOn = dbResource.desktopAppMetadata.createdOn;
                }
                else {
                    delete item._rev; // if field exist insertion will fail
                }
                item.visibility = parentContent ? "Default" : item.visibility;
                if (parentContent && item.mimeType === "application/vnd.ekstep.content-collection") {
                    const itemsClone = _.cloneDeep(_.get(this.manifestJson, "archive.items"));
                    item.children = this.createHierarchy(itemsClone, item);
                }
                acc.push(item);
                logger_1.logger.info("Writing to db for content", { id: item.identifier, parentContent, isAvailable,
                    notInDb: !dbResource });
                return acc;
            }, []);
            if (!resources.length) {
                logger_1.logger.info("Skipping bulk update for ImportId", this.contentImportData._id);
                return true;
            }
            yield this.dbSDK.bulk("content", resources);
        });
    }
    copyEcar() {
        return __awaiter(this, void 0, void 0, function* () {
            this.contentImportData.metaData.step = IContentImport_1.ImportSteps.parseEcar;
            this.observer.next(this.contentImportData);
            this.workerProcessRef.send({
                message: this.contentImportData.metaData.step,
                contentImportData: this.contentImportData,
                contentFolder: this.contentFolderPath,
            });
        });
    }
    handleChildProcessMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.workerProcessRef.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                if (data.contentImportData && (data && data.message !== "LOG")) {
                    this.saveDataFromWorker(data.contentImportData); // save only required data from child,
                }
                if (this.interrupt) { // stop import progress when status changes like pause or cancel
                    return;
                }
                if (data.message === IContentImport_1.ImportSteps.copyEcar) {
                    this.copyEcar();
                }
                else if (data.message === IContentImport_1.ImportSteps.parseEcar) {
                    this.extractEcar();
                }
                else if (data.message === IContentImport_1.ImportSteps.extractEcar) {
                    this.processContents();
                }
                else if (data.message === "DATA_SYNC") {
                    this.observer.next(this.contentImportData);
                }
                else if (data.message === "LOG") {
                    if (logger_1.logger[data.logType]) {
                        logger_1.logger[data.logType]("Log from import worker: ", ...data.logBody);
                    }
                }
                else if (data.message === "IMPORT_ERROR") {
                    this.handleChildProcessError(data.err);
                }
                else {
                    this.handleChildProcessError({ errCode: "UNHANDLED_WORKER_MESSAGE", errMessage: "unsupported import step" });
                }
            }));
        });
    }
    handleWorkerCloseEvents() {
        this.workerProcessRef.on("exit", (code, signal) => {
            if (this.interrupt || this.contentImportData.metaData.step === IContentImport_1.ImportSteps.complete) {
                return;
            }
            if (!this.interrupt) {
                this.handleUnexpectedChildProcessExit(code, signal);
            }
        });
    }
    handleUnexpectedChildProcessExit(code, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contentImportData.metaData.step = IContentImport_1.ImportSteps.copyEcar;
            this.observer.next(this.contentImportData);
            this.observer.error({
                code: "WORKER_UNHANDLED_EXCEPTION",
                message: "Import Worker exited while processing ECar",
            });
            this.cleanUpAfterErrorOrCancel();
        });
    }
    handleChildProcessError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contentImportData.metaData.step = IContentImport_1.ImportSteps.copyEcar;
            this.observer.next(this.contentImportData);
            this.observer.error({
                code: err.errCode,
                message: err.errMessage,
            });
            this.cleanUpAfterErrorOrCancel();
        });
    }
    getContentsFromDB(contentIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResults = yield this.dbSDK.find("content", {
                selector: {
                    identifier: {
                        $in: contentIds,
                    },
                },
            }).catch((err) => undefined);
            return _.get(dbResults, "docs") ? dbResults.docs : [];
        });
    }
    handleKillSignal() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.workerProcessRef.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                    if (data.message === "DATA_SYNC_KILL") {
                        this.workerProcessRef.kill();
                        resolve();
                    }
                }));
            });
        });
    }
    createHierarchy(items, parent, tree) {
        tree = typeof tree !== "undefined" ? tree : [];
        parent = typeof parent !== "undefined" ? parent : { visibility: "Default" };
        if (parent.children && parent.children.length) {
            let children = [];
            _.forEach(items, (child) => {
                const childWithIndex = _.find(parent.children, { identifier: child.identifier });
                if (!_.isEmpty(childWithIndex)) {
                    child.index = childWithIndex.index;
                    children.push(child);
                }
            });
            if (!_.isEmpty(children)) {
                children = _.sortBy(children, "index");
                if (parent.visibility === "Default") {
                    tree = children;
                }
                else {
                    parent.children = children;
                }
                _.each(children, (child) => this.createHierarchy(items, child));
            }
        }
        return tree;
    }
}
ImportContent.taskType = "IMPORT";
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], ImportContent.prototype, "dbSDK", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryHelper_1.default)
], ImportContent.prototype, "telemetryHelper", void 0);
exports.ImportContent = ImportContent;
