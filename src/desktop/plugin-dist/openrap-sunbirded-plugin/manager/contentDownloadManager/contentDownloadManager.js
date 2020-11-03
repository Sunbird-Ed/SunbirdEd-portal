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
const _ = require("lodash");
const typescript_ioc_1 = require("typescript-ioc");
const database_1 = require("./../../sdk/database");
const logger_1 = require("@project-sunbird/logger");
const api_1 = require("OpenRAP/dist/api");
const manifest_1 = require("../../manifest");
const ContentDownloader_1 = require("./ContentDownloader");
const services_1 = require("@project-sunbird/ext-framework-server/services");
const response_1 = require("../../utils/response");
const uuid = require("uuid");
const ContentReadUrl = `${process.env.APP_BASE_URL}/api/content/v1/read`;
const ContentSearchUrl = `${process.env.APP_BASE_URL}/api/content/v1/search`;
const DefaultRequestOptions = { headers: { "Content-Type": "application/json" } };
const hardDiskInfo_1 = require("../../utils/hardDiskInfo");
// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
let ContentDownloadManager = class ContentDownloadManager {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest_1.manifest.id);
            this.systemQueue.register(ContentDownloader_1.ContentDownloader.taskType, ContentDownloader_1.ContentDownloader);
            this.dbSDK.initialize(manifest_1.manifest.id);
            this.systemSDK = api_1.containerAPI.getSystemSDKInstance(manifest_1.manifest.id);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = req.params.id;
            const reqId = req.headers["X-msgid"];
            let parentId = _.get(req.body, "request.parentId");
            try {
                const dbContentDetails = yield this.dbSDK.get("content", contentId);
                const apiContentResponse = yield services_1.HTTPService.get(`${ContentReadUrl}/${contentId}`, {}).toPromise();
                const apiContentDetail = apiContentResponse.data.result.content;
                if (apiContentDetail.pkgVersion <= dbContentDetails.pkgVersion) {
                    logger_1.logger.debug(`${reqId} Content update not available for contentId: ${contentId} with parentId: ${parentId}`, apiContentDetail.pkgVersion, dbContentDetails.pkgVersion);
                    res.status(400);
                    return res.send(response_1.default.error("api.content.update", 400, "Update not available"));
                }
                let contentSize = apiContentDetail.size;
                let contentToBeDownloadedCount = 1;
                const contentDownloadList = {
                    [apiContentDetail.identifier]: {
                        downloadId: uuid(),
                        identifier: apiContentDetail.identifier,
                        url: apiContentDetail.downloadUrl,
                        size: apiContentDetail.size,
                        step: "DOWNLOAD",
                    },
                };
                logger_1.logger.debug(`${reqId} Content mimeType: ${apiContentDetail.mimeType}`);
                if (apiContentDetail.mimeType === "application/vnd.ekstep.content-collection") {
                    logger_1.logger.debug(`${reqId} Content childNodes: ${apiContentDetail.childNodes}`);
                    const childNodeDetailFromApi = yield this.getContentChildNodeDetailsFromApi(apiContentDetail.childNodes);
                    const childNodeDetailFromDb = yield this.getContentChildNodeDetailsFromDb(apiContentDetail.childNodes);
                    const contentsToDownload = this.getAddedAndUpdatedContents(childNodeDetailFromApi, childNodeDetailFromDb);
                    for (const content of contentsToDownload) {
                        if (content.size && content.downloadUrl) {
                            contentToBeDownloadedCount += 1;
                            logger_1.logger.debug(`${reqId} Content childNodes: ${content.identifier} added to list`);
                            contentSize += content.size;
                            contentDownloadList[content.identifier] = {
                                downloadId: uuid(),
                                identifier: content.identifier,
                                url: content.downloadUrl,
                                size: content.size,
                                step: "DOWNLOAD",
                            };
                        }
                        else {
                            logger_1.logger.debug(`${reqId} Content childNodes: ${content.identifier} download skipped ${content.size}, ${content.downloadUrl}`);
                        }
                    }
                    let contentsToDelete = this.getDeletedContents(childNodeDetailFromDb, childNodeDetailFromApi);
                    for (const content of contentsToDelete) {
                        contentDownloadList[content.identifier] = {
                            downloadId: uuid(),
                            identifier: content.identifier,
                            url: content.downloadUrl,
                            size: content.size,
                            step: "DELETE",
                        };
                    }
                }
                yield this.checkDiskSpaceAvailability(contentSize, true);
                let queueMetaData = apiContentDetail;
                if (parentId) { // use parent name, mimeType, identifier in queue
                    const dbParentDetails = yield this.dbSDK.get("content", parentId);
                    if (!dbParentDetails) {
                        throw "PARENT_NOT_DOWNLOADED";
                    }
                    queueMetaData = dbParentDetails;
                }
                const insertData = {
                    type: ContentDownloader_1.ContentDownloader.taskType,
                    name: queueMetaData.name,
                    group: ContentDownloader_1.ContentDownloader.group,
                    metaData: {
                        downloadedSize: 0,
                        contentSize,
                        contentDownloadList,
                        contentId: queueMetaData.identifier,
                        mimeType: queueMetaData.mimeType,
                        contentType: queueMetaData.contentType,
                        pkgVersion: queueMetaData.pkgVersion,
                    },
                };
                const id = yield this.systemQueue.add(insertData);
                logger_1.logger.debug(`${reqId} Content update request added to queue`, insertData);
                return res.send(response_1.default.success("api.content.download", { downloadId: id }, req));
            }
            catch (error) {
                logger_1.logger.error(`Content update request failed for contentId: ${contentId} with error: ${error.message}`);
                if (_.get(error, "code") === "LOW_DISK_SPACE") {
                    res.status(507);
                    return res.send(response_1.default.error("api.content.update", 507, "Low disk space", "LOW_DISK_SPACE"));
                }
                res.status(500);
                return res.send(response_1.default.error("api.content.update", 500));
            }
        });
    }
    download(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = req.params.id;
            const reqId = req.headers["X-msgid"];
            try {
                const contentResponse = yield services_1.HTTPService.get(`${ContentReadUrl}/${contentId}`, {}).toPromise();
                const contentDetail = contentResponse.data.result.content;
                let contentSize = contentDetail.size;
                let contentToBeDownloadedCount = 1;
                const contentDownloadList = {
                    [contentDetail.identifier]: {
                        downloadId: uuid(),
                        identifier: contentDetail.identifier,
                        url: contentDetail.downloadUrl,
                        size: contentDetail.size,
                        step: "DOWNLOAD",
                    },
                };
                logger_1.logger.debug(`${reqId} Content mimeType: ${contentDetail.mimeType}`);
                if (contentDetail.mimeType === "application/vnd.ekstep.content-collection") {
                    logger_1.logger.debug(`${reqId} Content childNodes: ${contentDetail.childNodes}`);
                    const childNodeDetail = yield this.getContentChildNodeDetailsFromApi(contentDetail.childNodes);
                    for (const content of childNodeDetail) {
                        if (content.size && content.downloadUrl) {
                            contentToBeDownloadedCount += 1;
                            logger_1.logger.debug(`${reqId} Content childNodes: ${content.identifier} added to list`);
                            contentSize += content.size;
                            contentDownloadList[content.identifier] = {
                                downloadId: uuid(),
                                identifier: content.identifier,
                                url: content.downloadUrl,
                                size: content.size,
                                step: "DOWNLOAD",
                            };
                        }
                        else {
                            logger_1.logger.debug(`${reqId} Content childNodes: ${content.identifier} download skipped ${content.size}, ${content.downloadUrl}`);
                        }
                    }
                }
                yield this.checkDiskSpaceAvailability(contentSize, true);
                const insertData = {
                    type: ContentDownloader_1.ContentDownloader.taskType,
                    name: contentDetail.name,
                    group: ContentDownloader_1.ContentDownloader.group,
                    metaData: {
                        downloadedSize: 0,
                        contentSize,
                        contentDownloadList,
                        contentId,
                        mimeType: contentDetail.mimeType,
                        contentType: contentDetail.contentType,
                        pkgVersion: contentDetail.pkgVersion,
                    },
                };
                const id = yield this.systemQueue.add(insertData);
                logger_1.logger.debug(`${reqId} Content download request added to queue`, insertData);
                const contentsToBeDownloaded = _.map(insertData.metaData.contentDownloadList, (data) => {
                    return data.identifier;
                });
                return res.send(response_1.default.success("api.content.download", { downloadId: id, contentsToBeDownloaded }, req));
            }
            catch (error) {
                logger_1.logger.error(`Content download request failed for contentId: ${contentId} with error: ${error.message}`);
                if (_.get(error, "code") === "LOW_DISK_SPACE") {
                    res.status(507);
                    return res.send(response_1.default.error("api.content.download", 507, "Low disk space", "LOW_DISK_SPACE"));
                }
                res.status(500);
                return res.send(response_1.default.error("api.content.download", 500));
            }
        });
    }
    pause(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadId = req.params.downloadId;
            const reqId = req.headers["X-msgid"];
            try {
                yield this.systemQueue.pause(downloadId);
                return res.send(response_1.default.success("api.content.pause.download", downloadId, req));
            }
            catch (error) {
                const status = _.get(error, "status") || 500;
                res.status(status);
                return res.send(response_1.default.error("api.content.pause.download", status, _.get(error, "message"), _.get(error, "code")));
            }
        });
    }
    resume(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadId = req.params.downloadId;
            const reqId = req.headers["X-msgid"];
            try {
                yield this.systemQueue.resume(downloadId);
                return res.send(response_1.default.success("api.content.resume.download", downloadId, req));
            }
            catch (error) {
                const status = _.get(error, "status") || 500;
                res.status(status);
                return res.send(response_1.default.error("api.content.resume.download", status, _.get(error, "message"), _.get(error, "code")));
            }
        });
    }
    cancel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadId = req.params.downloadId;
            const reqId = req.headers["X-msgid"];
            try {
                yield this.systemQueue.cancel(downloadId);
                return res.send(response_1.default.success("api.content.pause.download", downloadId, req));
            }
            catch (error) {
                const status = _.get(error, "status") || 500;
                res.status(status);
                return res.send(response_1.default.error("api.content.cancel.download", status, _.get(error, "message"), _.get(error, "code")));
            }
        });
    }
    retry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadId = req.params.downloadId;
            const reqId = req.headers["X-msgid"];
            try {
                yield this.systemQueue.retry(downloadId);
                return res.send(response_1.default.success("api.content.retry.download", downloadId, req));
            }
            catch (error) {
                const status = _.get(error, "status") || 500;
                res.status(status);
                return res.send(response_1.default.error("api.content.retry.download", status, _.get(error, "message"), _.get(error, "code")));
            }
        });
    }
    getContentChildNodeDetailsFromApi(childNodes) {
        if (!childNodes || !childNodes.length) {
            return Promise.resolve([]);
        }
        const requestBody = {
            request: {
                filters: {
                    identifier: childNodes,
                    mimeType: { "!=": "application/vnd.ekstep.content-collection" },
                },
                limit: childNodes.length,
            },
        };
        return services_1.HTTPService.post(ContentSearchUrl, requestBody, DefaultRequestOptions).toPromise()
            .then((response) => _.get(response, "data.result.content") || []);
    }
    getContentChildNodeDetailsFromDb(childNodes) {
        if (!childNodes || !childNodes.length) {
            return Promise.resolve([]);
        }
        const selector = {
            selector: {
                $and: [
                    {
                        _id: {
                            $in: childNodes
                        }
                    },
                    {
                        mimeType: {
                            $nin: ["application/vnd.ekstep.content-collection"]
                        }
                    }
                ]
            }
        };
        return this.dbSDK.find("content", selector)
            .then((response) => _.get(response, "docs") || []);
    }
    checkDiskSpaceAvailability(zipSize, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const availableDiskSpace = yield hardDiskInfo_1.default.getAvailableDiskSpace();
            if (!collection && (zipSize + (zipSize * 1.5) > availableDiskSpace)) {
                throw { message: "Disk space is low, couldn't copy Ecar", code: "LOW_DISK_SPACE" };
            }
            else if (zipSize * 1.5 > availableDiskSpace) {
                throw { message: "Disk space is low, couldn't copy Ecar", code: "LOW_DISK_SPACE" };
            }
        });
    }
    getAddedAndUpdatedContents(liveContents, localContents) {
        const contents = _.filter(liveContents, data => {
            const found = _.find(localContents, {
                _id: data.identifier,
                pkgVersion: data.pkgVersion
            });
            return found ? false : true;
        });
        return contents;
    }
    getDeletedContents(localContents, liveContents) {
        const contents = _.filter(localContents, data => {
            const found = _.find(liveContents, { identifier: data._id });
            return found ? false : true;
        });
        return contents;
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], ContentDownloadManager.prototype, "dbSDK", void 0);
ContentDownloadManager = __decorate([
    typescript_ioc_1.Singleton
], ContentDownloadManager);
exports.ContentDownloadManager = ContentDownloadManager;
