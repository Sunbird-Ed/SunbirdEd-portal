var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@project-sunbird/ext-framework-server/services");
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const os = require("os");
const config_1 = require("../config");
const response_1 = require("../utils/response");
const systemInfo = {
    x32: "32bit",
    ia32: "32bit",
    x64: "64bit",
    ppc64: "64bit",
    s390: "64bit",
    s390x: "64bit",
    win32: "windows",
    linux: "linux",
};
// @ClassLogger({
//     logLevel: "debug",
//     logTime: true,
//     logMethods: ["getDeviceId", "getDesktopAppUpdate", "getAppInfo" ],
//   })
class Appupdate {
    constructor(manifest) {
        this.getDeviceId(manifest);
    }
    getDeviceId(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.deviceId = yield api_1.containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
            }
            catch (err) {
                logger_1.logger.error({
                    msg: "appUpdate:getDeviceId caught exception while fetching device id with error",
                    errorMessage: err.message,
                    error: err,
                });
            }
        });
    }
    getDesktopAppUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.checkForUpdate();
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": result: ${data} found from desktop app update api`);
                return res.send(response_1.default.success("api.desktop.update", _.get(data, "data.result"), req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while processing desktop app update request where err = ${err}`);
                res.status(500);
                return res.send(response_1.default.error("api.desktop.update", 500));
            }
        });
    }
    getAppInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.checkForUpdate().catch((error) => logger_1.logger.error(`error while checking for update ${error.message} ${error}`));
            return res.send(response_1.default.success("api.app.info", {
                termsOfUseUrl: `${process.env.APP_BASE_URL}/term-of-use.html`,
                version: process.env.APP_VERSION,
                releaseDate: process.env.RELEASE_DATE,
                deviceId: this.deviceId,
                languages: config_1.default.get("LANGUAGES"),
                updateInfo: _.get(data, "data.result"),
            }, req));
        });
    }
    checkForUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = yield api_1.containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
                logger_1.logger.error(`Received error while fetching api key in app update with error: ${err}`);
            });
            const body = {
                request: {
                    appVersion: process.env.APP_VERSION,
                    os: systemInfo[os.platform()],
                    arch: systemInfo[os.arch()],
                },
            };
            const appConfig = {
                headers: {
                    "authorization": `Bearer ${apiKey}`,
                    "content-type": "application/json",
                },
            };
            return services_1.HTTPService.post(`${process.env.APP_BASE_URL}/api/desktop/v1/update`, body, appConfig)
                .toPromise();
        });
    }
}
exports.default = Appupdate;
