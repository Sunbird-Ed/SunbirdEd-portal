var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@project-sunbird/ext-framework-server/api");
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
const api_2 = require("OpenRAP/dist/api");
const os = require("os");
const path = require("path");
class ContentLocation {
    constructor(manifestId) {
        this.manifestID = manifestId;
        this.fileSDK = api_2.containerAPI.getFileSDKInstance(manifestId);
        this.settingSDK = api_2.containerAPI.getSettingSDKInstance(manifestId);
    }
    set(contentPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                contentPath = path.join(contentPath, process.env.APP_NAME);
                const response = yield this.settingSDK.get(`content_storage_location`).catch((error) => { logger_1.logger.error("Error while getting content storage location", error); });
                const contentLocation = { location: [] };
                if (_.get(response, "location")) {
                    response.location.push(contentPath);
                    contentLocation.location = response.location;
                }
                else {
                    contentLocation.location = [contentPath];
                }
                const status = yield this.settingSDK.put(`content_storage_location`, contentLocation)
                    .catch((error) => { logger_1.logger.error("Error while adding data to setting SDK", error); });
                if (status) {
                    this.setContentStaticRoute(contentPath);
                    const fileSDKContentInstance = api_2.containerAPI.getFileSDKInstance(this.manifestID, contentPath);
                    yield fileSDKContentInstance.mkdir("content")
                        .catch((error) => { logger_1.logger.error("Error creating directory", error); });
                }
                return status;
            }
            catch (error) {
                logger_1.logger.error("Error while setting content storage location", error);
                throw new error(error);
            }
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (os.platform() === "win32") {
                try {
                    const contentDirPath = yield this.settingSDK.get(`content_storage_location`);
                    if (_.get(contentDirPath, "location.length")) {
                        return path.join(contentDirPath.location[contentDirPath.location.length - 1], "content");
                    }
                    else {
                        return this.fileSDK.getAbsPath("content");
                    }
                }
                catch (error) {
                    logger_1.logger.error("Error while getting content storage location", error);
                    return this.fileSDK.getAbsPath("content");
                }
            }
            else {
                return this.fileSDK.getAbsPath("content");
            }
        });
    }
    setContentStaticRoute(contentPath) {
        api_1.frameworkAPI.registerStaticRoute(path.join(contentPath, "content"), "/content");
        api_1.frameworkAPI.registerStaticRoute(path.join(contentPath, "content"), "/contentPlayer/preview/content");
        api_1.frameworkAPI.registerStaticRoute(path.join(contentPath, "content"), "/contentPlayer/preview");
        api_1.frameworkAPI.registerStaticRoute(path.join(contentPath, "content"), "/contentPlayer/preview/content/*/content-plugins");
    }
}
exports.default = ContentLocation;
