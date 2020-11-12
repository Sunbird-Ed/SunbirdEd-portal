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
const childProcess = require("child_process");
const typescript_ioc_1 = require("typescript-ioc");
const path = require("path");
const logger_1 = require("@project-sunbird/logger");
const api_1 = require("OpenRAP/dist/api");
const manifest_1 = require("../../manifest");
const _ = require("lodash");
const telemetryHelper_1 = require("../../helper/telemetryHelper");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class ImportTelemetry {
    constructor() {
        this.progress = 0;
        this.skippedFiles = [];
        this.networkQueue = api_1.containerAPI.getNetworkQueueInstance();
        this.getDeviceId();
    }
    getDeviceId() {
        return __awaiter(this, void 0, void 0, function* () {
            this.deviceId = yield api_1.containerAPI.getSystemSDKInstance(manifest_1.manifest.id).getDeviceId();
        });
    }
    status() {
        return this.telemetryImportData;
    }
    start(telemetryImportData, observer) {
        return __awaiter(this, void 0, void 0, function* () {
            this.telemetryImportData = telemetryImportData;
            this.observer = observer;
            this.workerProcessRef = childProcess.fork(path.join(__dirname, "telemetryImportHelper"));
            this.handleChildProcessMessage();
            this.handleWorkerCloseEvents();
            this.parseFile();
            return true;
        });
    }
    parseFile() {
        this.workerProcessRef.send({
            message: "PARSE_FILE",
            telemetryImportData: this.telemetryImportData,
        });
    }
    saveDataFromWorker(telemetryImportData) {
        this.telemetryImportData.metaData = telemetryImportData.metaData;
    }
    saveToDB(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.updateProgress(_.get(item, "size"));
                // Check in DB if same id exist - then skip
                const dbData = yield this.networkQueue.getByQuery({ selector: { _id: _.get(item, "mid") } });
                if (_.isEmpty(dbData)) {
                    const headers = {
                        "Content-Type": "application/json",
                        "Content-Encoding": "gzip",
                        "did": this.deviceId,
                        "msgid": _.get(item, "mid"),
                    };
                    const insertDbData = {
                        pathToApi: `${process.env.APP_BASE_URL}/api/data/v1/telemetry`,
                        requestHeaderObj: headers,
                        requestBody: _.get(item, "requestBody"),
                        subType: "TELEMETRY",
                        size: _.get(item, "size"),
                        count: _.get(item, "eventsCount"),
                        bearerToken: true,
                    };
                    yield this.networkQueue.add(insertDbData, _.get(item, "mid"));
                }
                else {
                    this.skippedFiles.push({ id: _.get(item, "mid"), reason: "ARTIFACT_MISSING" });
                    this.telemetryImportData.metaData.skippedFiles = this.skippedFiles;
                    this.observer.next(this.telemetryImportData);
                }
            }
            catch (err) {
                logger_1.logger.error(this.telemetryImportData._id, "Error while saving to db ", err);
                this.observer.next(this.telemetryImportData);
                this.observer.error(err);
            }
        });
    }
    updateProgress(size) {
        const percentage = (size * 100) / this.telemetryImportData.metaData.fileSize;
        this.progress = this.progress + percentage;
        this.telemetryImportData.progress = this.progress;
        this.observer.next(this.telemetryImportData);
    }
    handleChildProcessMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            this.workerProcessRef.on("message", (data) => __awaiter(this, void 0, void 0, function* () {
                if (data.telemetryImportData && (data && data.message !== "LOG")) {
                    this.saveDataFromWorker(data.telemetryImportData); // save only required data from child,
                }
                if (this.interrupt) {
                    return;
                }
                if (data.message === "SAVE_TO_DB") {
                    this.saveToDB(data.dbData);
                }
                else if (data.message === "COMPLETE") {
                    // Adding telemetry share event
                    this.constructShareEvent();
                    logger_1.logger.info("--------Telemetry import complete-------", JSON.stringify(this.telemetryImportData));
                    this.observer.complete();
                }
                else if (data.message === "LOG") {
                    if (logger_1.logger[data.logType]) {
                        logger_1.logger[data.logType]("Log from telemetry import worker: ", ...data.logBody);
                    }
                }
                else if (data.message === "TELEMETRY_IMPORT_ERROR") {
                    this.handleChildProcessError(data.err);
                }
                else {
                    this.handleChildProcessError({ errCode: "UNHANDLED_WORKER_MESSAGE", errMessage: "Unhandled worker message" });
                }
            }));
        });
    }
    handleWorkerCloseEvents() {
        this.workerProcessRef.on("exit", (code, signal) => {
            logger_1.logger.info(this.telemetryImportData._id, "Child process exited with", code, signal);
            if (this.interrupt) {
                return;
            }
            if (!this.interrupt) {
                this.handleUnexpectedChildProcessExit(code, signal);
            }
        });
    }
    handleUnexpectedChildProcessExit(code, signal) {
        return __awaiter(this, void 0, void 0, function* () {
            this.skippedFiles = [];
            this.observer.next(this.telemetryImportData);
            this.observer.error({
                code: "WORKER_UNHANDLED_EXCEPTION",
                message: "Import Worker exited while processing file",
            });
        });
    }
    handleChildProcessError(err) {
        return __awaiter(this, void 0, void 0, function* () {
            this.observer.next(this.telemetryImportData);
            this.observer.error({
                code: err.errCode,
                message: err.errMessage,
            });
        });
    }
    constructShareEvent() {
        return __awaiter(this, void 0, void 0, function* () {
            const telemetryShareItems = [{
                    id: this.telemetryImportData._id,
                    type: "File",
                    to: {
                        id: this.deviceId,
                        type: "Device",
                    },
                }];
            this.telemetryHelper.logShareEvent(telemetryShareItems, "In", "Telemetry");
        });
    }
}
ImportTelemetry.taskType = "TELEMETRY_IMPORT";
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryHelper_1.default)
], ImportTelemetry.prototype, "telemetryHelper", void 0);
exports.ImportTelemetry = ImportTelemetry;
