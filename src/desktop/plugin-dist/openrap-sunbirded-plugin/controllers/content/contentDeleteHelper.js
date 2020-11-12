var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const os = require("os");
const path = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const manifest_1 = require("../../manifest");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class ContentDeleteHelper {
    constructor() {
        this.concurrency = 1;
        this.queue = [];
        this.running = 0;
        this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest_1.manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id);
        this.settingSDK = api_1.containerAPI.getSettingSDKInstance(manifest_1.manifest.id);
        this.prefixPath = this.fileSDK.getAbsPath("");
    }
    start(contentDeleteData, observer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.observer = observer;
            _.forEach(contentDeleteData.metaData.filePaths, (filePath) => __awaiter(this, void 0, void 0, function* () {
                yield this.pushToQueue(filePath);
            }));
            return true;
        });
    }
    status() {
        return this.contentDeleteData;
    }
    pushToQueue(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.checkPath(filePath)) {
                this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest_1.manifest.id, this.prefixPath);
                this.queue.push(filePath);
                this.next();
            }
        });
    }
    next() {
        while (this.queue.length) {
            const filePath = this.queue.shift();
            const deleteSub = rxjs_1.of(this.fileSDK.remove(filePath)).pipe(operators_1.retry(5));
            const deleteSubscription = deleteSub.subscribe({
                next: (val) => {
                    if (this.queue.length === 0) {
                        this.observer.complete();
                    }
                },
                error: (err) => {
                    this.observer.error(err);
                    logger_1.logger.error(`error while deleting the content ${err.stack} and retried for 5 times`);
                },
            });
        }
    }
    checkPath(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = /^content/i;
            if (os.platform() === "win32") {
                if (filePath.match(regex)) {
                    try {
                        const locationList = yield this.settingSDK.get(`content_storage_location`);
                        let i = 0;
                        while (_.get(locationList, "location.length") && i < locationList.location.length) {
                            const folderPath = path.join(locationList.location[i], filePath);
                            const isDirExist = yield this.fileSDK.isDirectoryExists(folderPath).catch((err) => console.log("Error while checking directory path"));
                            if (isDirExist) {
                                this.prefixPath = locationList.location[i];
                                break;
                            }
                            i++;
                        }
                        return this.prefixPath && !_.includes(this.queue, filePath);
                    }
                    catch (error) {
                        return this.prefixPath && !_.includes(this.queue, filePath);
                    }
                }
                else {
                    return false;
                }
            }
            else {
                return filePath.match(regex) && !_.includes(this.queue, filePath);
            }
        });
    }
}
ContentDeleteHelper.taskType = "DELETE";
exports.ContentDeleteHelper = ContentDeleteHelper;
