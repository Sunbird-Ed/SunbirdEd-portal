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
const logger_1 = require("@project-sunbird/logger");
const childProcess = require("child_process");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const path = require("path");
const typescript_ioc_1 = require("typescript-ioc");
const manifest_1 = require("../../manifest");
const LAST_ERROR_LOG_SYNC_ON = "LAST_ERROR_LOG_SYNC_ON";
let LogSyncManager = class LogSyncManager {
    constructor() {
        this.isInProgress = false;
        this.networkQueue = api_1.containerAPI.getNetworkQueueInstance();
        this.settingSDK = api_1.containerAPI.getSettingSDKInstance(manifest_1.manifest.id);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInProgress) {
                yield this.checkPreviousLogSync();
            }
        });
    }
    checkPreviousLogSync() {
        return __awaiter(this, void 0, void 0, function* () {
            // check in the settingSDK if the LAST_ERROR_LOG_SYNC_ON is not today
            const errorLogDBData = yield this.settingSDK.get(LAST_ERROR_LOG_SYNC_ON).catch(() => undefined);
            const lastSyncDate = _.get(errorLogDBData, "lastSyncOn");
            if (!lastSyncDate || this.isLessThanToday(lastSyncDate)) {
                yield this.launchChildProcess();
            }
        });
    }
    launchChildProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isInProgress = true;
            yield this.getDeviceId();
            this.workerProcessRef = childProcess.fork(path.join(__dirname, "logSyncHelper"));
            this.handleChildProcessMessage();
            this.workerProcessRef.send({
                message: "GET_LOGS",
            });
        });
    }
    handleChildProcessMessage() {
        this.workerProcessRef.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
            if (data.message === "SYNC_LOGS" && _.get(data, "logs.length")) {
                this.killChildProcess();
                this.syncLogsToServer(data.logs);
                this.isInProgress = false;
            }
            else if (data.message === "ERROR_LOG_SYNC_ERROR") {
                this.handleChildProcessError(data.err);
                this.isInProgress = false;
            }
            else {
                this.handleChildProcessError({ errCode: "UNHANDLED_WORKER_MESSAGE", errMessage: "unsupported import step" });
                this.isInProgress = false;
            }
        }));
    }
    syncLogsToServer(logs) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                "Content-Type": "application/json",
                "did": this.deviceId,
            };
            const request = {
                bearerToken: true,
                pathToApi: `${process.env.APP_BASE_URL}/api/data/v1/client/logs`,
                requestHeaderObj: headers,
                subType: "LOGS",
                requestBody: this.buildRequestBody(logs),
            };
            this.networkQueue.add(request).then((data) => {
                logger_1.logger.info("Added in queue");
                this.updateLastSyncDate(Date.now());
            }).catch((error) => {
                logger_1.logger.error("Error while adding to Network queue", error);
            });
        });
    }
    buildRequestBody(logs = []) {
        return {
            request: {
                context: {
                    env: manifest_1.manifest.id,
                    did: this.deviceId,
                },
                pdata: {
                    id: process.env.APP_ID,
                    ver: process.env.APP_VERSION,
                    pid: "desktop.app",
                },
                logs,
            },
        };
    }
    killChildProcess() {
        try {
            this.workerProcessRef.kill();
        }
        catch (error) {
            logger_1.logger.error("Error while killing the logSyncHelper child process", error);
        }
    }
    handleChildProcessError(error) {
        this.killChildProcess();
        logger_1.logger.error(error.errMessage);
    }
    updateLastSyncDate(date) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.settingSDK.put(LAST_ERROR_LOG_SYNC_ON, { lastSyncOn: date });
        });
    }
    isLessThanToday(inputDate) {
        if (inputDate) {
            inputDate = new Date(inputDate).setHours(0, 0, 0, 0);
            const today = new Date().setHours(0, 0, 0, 0);
            return inputDate < today;
        }
        return false;
    }
    getDeviceId() {
        return __awaiter(this, void 0, void 0, function* () {
            this.deviceId = yield api_1.containerAPI.getSystemSDKInstance(manifest_1.manifest.id).getDeviceId();
        });
    }
};
LogSyncManager = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [])
], LogSyncManager);
exports.LogSyncManager = LogSyncManager;
