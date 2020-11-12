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
const typescript_ioc_1 = require("typescript-ioc");
const path = require("path");
const database_1 = require("../../sdk/database");
const logger_1 = require("@project-sunbird/logger");
const manifest_1 = require("../../manifest");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const StreamZip = require("node-stream-zip");
const telemetryHelper_1 = require("../../helper/telemetryHelper");
const hardDiskInfo_1 = require("../../utils/hardDiskInfo");
const contentLocation_1 = require("../../controllers/contentLocation");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class ContentDownloader {
    constructor() {
        this.downloadSDK = api_1.containerAPI.getDownloadSdkInstance();
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id);
        this.systemSDK = api_1.containerAPI.getSystemSDKInstance(manifest_1.manifest.id);
        this.ecarBasePath = this.fileSDK.getAbsPath("ecars");
        this.interrupt = false;
        this.downloadFailedCount = 0;
        this.extractionFailedCount = 0;
        this.downloadContentCount = 0;
        this.contentLocation = new contentLocation_1.default(manifest_1.manifest.id);
    }
    start(contentDownloadData, observer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.databaseSdk.initialize(manifest_1.manifest.id);
            const contentPath = yield this.contentLocation.get();
            this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id, contentPath);
            this.contentDownloadData = contentDownloadData;
            this.observer = observer;
            this.contentDownloadMetaData = this.contentDownloadData.metaData;
            _.forIn(this.contentDownloadMetaData.contentDownloadList, (value, key) => {
                this.downloadContentCount += 1;
                if (value.step === "DOWNLOAD") {
                    this.downloadSDK.queueDownload(value.downloadId, {
                        url: value.url,
                        savePath: path.join(this.ecarBasePath, value.downloadId),
                    }, this.getDownloadObserver(value.identifier));
                }
                else {
                    this.handleDownloadComplete(value.identifier, value);
                }
            });
            return true;
        });
    }
    status() {
        return this.contentDownloadData;
    }
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            this.interrupt = false;
            this.interruptType = "PAUSE";
            let pausedInQueue = false;
            _.forIn(this.contentDownloadMetaData.contentDownloadList, (value, key) => {
                if (value.step === "DOWNLOAD") {
                    const pauseRes = this.downloadSDK.cancel(value.downloadId);
                    if (pauseRes) {
                        pausedInQueue = true;
                    }
                }
            });
            if (pausedInQueue) {
                return true;
            }
            else {
                return {
                    code: "NO_FILES_IN_QUEUE",
                    status: 400,
                    message: `No files are in queue`,
                };
            }
        });
    }
    resume(contentDownloadData, observer) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.start(contentDownloadData, observer);
        });
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.interrupt = false;
            this.interruptType = "CANCEL";
            let cancelInQueue = false;
            _.forIn(this.contentDownloadMetaData.contentDownloadList, (value, key) => {
                if (value.step === "DOWNLOAD") {
                    const cancelRes = this.downloadSDK.cancel(value.downloadId);
                    if (cancelRes) {
                        cancelInQueue = true;
                    }
                }
            });
            if (cancelInQueue) {
                return true;
            }
            else {
                return {
                    code: "NO_FILES_IN_QUEUE",
                    status: 400,
                    message: `No files are in queue`,
                };
            }
        });
    }
    retry(contentDownloadData, observer) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.debug("ContentDownload executer retry method called", this.contentDownloadData._id, "calling retry method");
            return this.start(contentDownloadData, observer);
        });
    }
    getDownloadObserver(contentId) {
        const next = (downloadProgress) => {
            if (downloadProgress.total) {
                this.handleDownloadProgress(contentId, downloadProgress);
            }
        };
        const error = (downloadError) => {
            this.handleDownloadError(contentId, downloadError);
        };
        const complete = () => {
            logger_1.logger.debug(`${this.contentDownloadData._id}:Download complete event contentId: ${contentId}`);
            const contentDetails = this.contentDownloadMetaData.contentDownloadList[contentId];
            contentDetails.step = "EXTRACT";
            this.contentDownloadMetaData.downloadedSize += contentDetails.size;
            this.observer.next(this.contentDownloadData);
            this.handleDownloadComplete(contentId, contentDetails);
        };
        return { next, error, complete };
    }
    handleDownloadError(contentId, error) {
        this.downloadFailedCount += 1;
        if (_.includes(["ESOCKETTIMEDOUT"], _.get(error, 'code')) || this.downloadFailedCount > 1 || (this.downloadContentCount === 1)) {
            this.interrupt = false;
            this.observer.next(this.contentDownloadData);
            _.forIn(this.contentDownloadMetaData.contentDownloadList, (value, key) => {
                if (value.step === "DOWNLOAD") {
                    const cancelRes = this.downloadSDK.cancel(value.downloadId);
                }
            });
            this.observer.error({
                code: _.get(error, 'code') || "DOWNLOAD_FILE_FAILED",
                status: 400,
                message: `More than one content download failed`,
            });
        }
        else { // complete download task if all are completed
            this.checkForAllTaskCompletion();
        }
    }
    handleDownloadProgress(contentId, progress) {
        const contentDetails = this.contentDownloadMetaData.contentDownloadList[contentId];
        const downloadedSize = this.contentDownloadMetaData.downloadedSize
            + (contentDetails.size * (progress.total.percentage / 100));
        this.contentDownloadData.progress = downloadedSize;
        this.observer.next(this.contentDownloadData);
    }
    handleDownloadComplete(contentId, contentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.interrupt) {
                    return;
                }
                if (!_.includes(["EXTRACT", "INDEX", "COMPLETE", "DELETE"], contentDetails.step)) {
                    throw new Error("INVALID_STEP");
                }
                let itemsToDelete = [];
                if (contentDetails.step === "EXTRACT") {
                    const res = yield this.extractContent(contentId, contentDetails);
                    itemsToDelete = res.itemsToDelete || [];
                    contentDetails.step = "INDEX";
                    this.observer.next(this.contentDownloadData);
                }
                if (this.interrupt) {
                    return;
                }
                if (contentDetails.step === "INDEX") {
                    yield this.saveContentToDb(contentId, contentDetails);
                    contentDetails.step = "COMPLETE";
                    this.observer.next(this.contentDownloadData);
                }
                if (this.interrupt) {
                    return;
                }
                const fileSDKInstance = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id);
                for (const item of itemsToDelete) {
                    yield fileSDKInstance.remove(item).catch((error) => {
                        logger_1.logger.error(`Received error while deleting ecar path: ${path} and error: ${error}`);
                    });
                }
                this.checkForAllTaskCompletion();
            }
            catch (err) {
                logger_1.logger.error(`${this.contentDownloadData._id}:error while processing download complete event: ${contentId}`, err.message);
                this.extractionFailedCount += 1;
                if (this.extractionFailedCount > 1 || (this.downloadContentCount === 1)) {
                    this.interrupt = false;
                    this.observer.next(this.contentDownloadData);
                    this.observer.error({
                        code: "CONTENT_EXTRACT_FAILED",
                        status: 400,
                        message: `More than one content extraction after download failed`,
                    });
                }
            }
        });
    }
    extractZipEntry(zipHandler, entry, distFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                return zipHandler.extract(entry, distFolder, (err) => err ? reject(err) : resolve());
            }));
        });
    }
    extractContent(contentId, contentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemsToDelete = [];
            const zipHandler = yield this.loadZipHandler(path.join(this.ecarBasePath, contentDetails.downloadId));
            yield this.checkSpaceAvailability(path.join(this.ecarBasePath, contentDetails.downloadId), zipHandler);
            const entries = zipHandler.entries();
            const contentPath = yield this.contentLocation.get();
            yield this.fileSDK.mkdir(contentDetails.identifier);
            for (const entry of _.values(entries)) {
                yield this.extractZipEntry(zipHandler, entry.name, path.join(contentPath, contentDetails.identifier));
            }
            zipHandler.close();
            logger_1.logger.debug(`${this.contentDownloadData._id}:Extracted content: ${contentId}`);
            itemsToDelete.push(path.join("ecars", contentDetails.downloadId));
            const manifestJson = yield this.fileSDK.readJSON(path.join(contentPath, contentDetails.identifier, "manifest.json"));
            const metaData = _.get(manifestJson, "archive.items[0]");
            if (_.endsWith(metaData.artifactUrl, ".zip")) {
                yield this.checkSpaceAvailability(path.join(contentPath, contentDetails.identifier, path.basename(metaData.artifactUrl)));
                logger_1.logger.debug(`${this.contentDownloadData._id}:Extracting artifact url content: ${contentId}`);
                yield this.fileSDK.unzip(path.join(contentDetails.identifier, path.basename(metaData.artifactUrl)), contentDetails.identifier, false);
                itemsToDelete.push(path.join("content", contentDetails.identifier, path.basename(metaData.artifactUrl)));
            }
            contentDetails.step = "EXTRACT";
            this.observer.next(this.contentDownloadData);
            return { itemsToDelete };
        });
    }
    saveContentToDb(contentId, contentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentPath = yield this.contentLocation.get();
            const manifestJson = yield this.fileSDK.readJSON(path.join(contentPath, contentDetails.identifier, "manifest.json"));
            const metaData = _.get(manifestJson, "archive.items[0]");
            if (metaData.mimeType === "application/vnd.ekstep.content-collection") {
                metaData.children = this.createHierarchy(_.cloneDeep(_.get(manifestJson, "archive.items")), metaData);
            }
            metaData.baseDir = `content/${contentDetails.identifier}`;
            metaData.desktopAppMetadata = {
                "addedUsing": ContentDownloader.taskType,
                "createdOn": Date.now(),
                "updatedOn": Date.now(),
                "isAvailable": true,
            };
            if (contentId !== this.contentDownloadMetaData.contentId) {
                metaData.visibility = "Parent";
            }
            yield this.databaseSdk.upsert("content", metaData.identifier, metaData);
            contentDetails.step = "INDEX";
            this.observer.next(this.contentDownloadData);
        });
    }
    checkForAllTaskCompletion() {
        let totalContents = 0;
        let completedContents = 0;
        _.forIn(this.contentDownloadMetaData.contentDownloadList, (value, key) => {
            totalContents += 1;
            if (value.step === "COMPLETE" || value.step === "DELETE") { // delete content will be done async 
                completedContents += 1;
            }
        });
        if (totalContents === (completedContents + this.extractionFailedCount + this.downloadFailedCount)) {
            logger_1.logger.debug(`${this.contentDownloadData._id}:download completed`);
            this.constructShareEvent(this.contentDownloadData);
            this.deleteRemovedContent();
            this.observer.complete();
        }
        else {
            logger_1.logger.debug(`${this.contentDownloadData._id}:Extraction completed for ${completedContents},
      ${totalContents - completedContents}`);
        }
    }
    constructShareEvent(data) {
        const telemetryShareItems = [{
                id: _.get(data, "metaData.contentId"),
                type: _.get(data, "metaData.contentType"),
                ver: _.toString(_.get(data, "metaData.pkgVersion")),
            }];
        this.telemetryHelper.logShareEvent(telemetryShareItems, "In", "Content");
    }
    deleteRemovedContent() {
        const updateDoc = [];
        _.forIn(this.contentDownloadMetaData.contentDownloadList, (value, key) => {
            if (value.step === "DELETE") {
                updateDoc.push({
                    _id: value.identifier,
                    identifier: value.identifier,
                    visibility: "Default",
                    updatedOn: Date.now()
                });
            }
        });
        if (updateDoc.length) {
            this.databaseSdk.bulk("content", updateDoc).catch(error => {
                logger_1.logger.debug(`${this.contentDownloadData._id}: content visibility update failed for deleted content`, error.message);
            });
        }
    }
    checkSpaceAvailability(zipPath, zipHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            let closeZipHandler = true;
            if (zipHandler) {
                closeZipHandler = false;
            }
            zipHandler = zipHandler || (yield this.loadZipHandler(zipPath));
            const entries = zipHandler.entries();
            const availableDiskSpace = yield hardDiskInfo_1.default.getAvailableDiskSpace();
            let contentSize = 0; // size in bytes
            for (const entry of _.values(entries)) {
                contentSize += entry.size;
            }
            if (contentSize > availableDiskSpace) {
                throw { message: "Disk space is low, couldn't extract Ecar", code: "LOW_DISK_SPACE" };
            }
            if (closeZipHandler) {
                zipHandler.close();
            }
        });
    }
    loadZipHandler(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const zip = new StreamZip({ file: filePath, storeEntries: true, skipEntryNameValidation: true });
            return new Promise((resolve, reject) => {
                zip.on("ready", () => resolve(zip));
                zip.on("error", reject);
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
ContentDownloader.taskType = "DOWNLOAD";
ContentDownloader.group = "CONTENT_MANAGER";
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], ContentDownloader.prototype, "databaseSdk", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryHelper_1.default)
], ContentDownloader.prototype, "telemetryHelper", void 0);
exports.ContentDownloader = ContentDownloader;
