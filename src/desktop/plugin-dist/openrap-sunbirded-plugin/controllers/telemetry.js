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
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const typescript_ioc_1 = require("typescript-ioc");
const database_1 = require("../sdk/database");
const telemetryImport_1 = require("./../manager/telemetryImportManager/telemetryImport");
const telemetryImportManager_1 = require("./../manager/telemetryImportManager/telemetryImportManager");
const response_1 = require("./../utils/response");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class Telemetry {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.telemetrySDK = api_1.containerAPI.getTelemetrySDKInstance();
        this.telemetryImportManager.initialize();
        this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest.id);
        this.networkQueue = api_1.containerAPI.getNetworkQueueInstance();
    }
    addEvents(req, res) {
        const events = req.body.events;
        if (_.isArray(events) && events.length) {
            logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": telemetry service is called to add telemetryEvents`);
            this.telemetrySDK
                .send(events)
                .then((data) => {
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Telemetry events added successfully ${data}`);
                return res.send(response_1.default.success("api.telemetry", {}, req));
            })
                .catch((err) => {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while inserting events to telemetry db and err.message: ${err.message} `);
                res.status(500);
                return res.send(response_1.default.error("api.telemetry", 500));
            });
        }
        else {
            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received err and err.res.status: 400`);
            res.status(400);
            return res.send(response_1.default.error("api.telemetry", 400));
        }
    }
    getInfo(req, res) {
        this.telemetrySDK.info((err, data) => {
            if (err) {
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.telemetry.info", err.status || 500, err.errMessage || err.message, err.code));
            }
            res.status(200);
            res.send(response_1.default.success(`api.telemetry.info`, {
                response: data,
            }, req));
        });
    }
    getTelemetrySyncSetting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const telemetryConfigData = yield this.telemetrySDK.getTelemetrySyncSetting();
                res.status(200);
                return res.send(response_1.default.success("api.telemetry.config.info", telemetryConfigData, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting telemetry config and err.message: ${err.message} ${err}`);
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.telemetry.config.info", err.status || 500, err.errMessage || err.message, err.code));
            }
        });
    }
    setTelemetrySyncSetting(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const enable = _.get(req, "body.request.enable");
                if (enable === undefined || typeof enable !== "boolean") {
                    res.status(400);
                    return res.send(response_1.default.error("api.telemetry.set.config", 400, "Enable key should exist and it should be boolean"));
                }
                const resp = yield this.telemetrySDK.setTelemetrySyncSetting(enable);
                res.status(200);
                return res.send(response_1.default.success("api.telemetry.set.config", { response: resp }, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while setting telemetry config and err.message: ${err.message} ${err}`);
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.telemetry.set.config", err.status || 500, err.errMessage || err.message, err.code));
            }
        });
    }
    sync(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const type = _.get(req, "body.request.type");
                if (type === undefined || !_.isArray(type)) {
                    res.status(400);
                    return res.send(response_1.default.error("api.desktop.sync", 400, "Type key should exist and it should be an array"));
                }
                const data = yield this.networkQueue.forceSync(type);
                res.status(200);
                return res.send(response_1.default.success("api.desktop.sync", { response: data }, req));
            }
            catch (err) {
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.desktop.sync", err.status || 500, err.errMessage || err.message, err.code));
            }
        });
    }
    export(req, res) {
        const destFolder = req.query.destFolder;
        this.telemetrySDK.export(destFolder, (err, data) => {
            if (err) {
                res.status(err.status || 500);
                return res.send(response_1.default.error("api.telemetry.export", err.status || 500, err.errMessage
                    || err.message, err.code));
            }
            res.status(200);
            res.send(response_1.default.success(`api.telemetry.export`, {
                response: data,
            }, req));
        });
    }
    import(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePaths = req.body;
            if (!filePaths) {
                return res.status(400).send(response_1.default.error(`api.telemetry.import`, 400, "MISSING_FILE_PATHS"));
            }
            this.telemetryImportManager.add(filePaths).then((jobIds) => {
                res.send(response_1.default.success("api.telemetry.import", {
                    importedJobIds: jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.telemetry.import`, 500, err.errMessage || err.message, err.code));
            });
        });
    }
    retryImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            this.telemetryImportManager.retryImport(req.params.importId).then((jobIds) => {
                res.send(response_1.default.success("api.telemetry.import.retry", {
                    jobIds,
                }, req));
            }).catch((err) => {
                res.status(500);
                res.send(response_1.default.error(`api.telemetry.import.retry`, 400, err.message));
            });
        });
    }
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbData = yield this.systemQueue.query({ type: telemetryImport_1.ImportTelemetry.taskType });
                dbData = _.map(dbData.docs, (data) => ({
                    id: _.get(data, "_id"),
                    name: _.get(data, "name"),
                    progress: _.get(data, "progress"),
                    failedCode: _.get(data, "failedCode"),
                    failedReason: _.get(data, "failedReason"),
                    addedUsing: _.toLower(_.get(data, "type")),
                    totalSize: _.get(data, "metaData.fileSize"),
                    createdOn: _.get(data, "createdOn"),
                    status: _.get(data, "status"),
                }));
                return res.send(response_1.default.success("api.telemetry.list", {
                    response: {
                        count: dbData.length,
                        items: _.orderBy(dbData, ["createdOn"], ["desc"]),
                    },
                }, req));
            }
            catch (error) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Error while processing the telemetry import list request and err.message: ${error.message}`);
                res.status(500);
                return res.send(response_1.default.error("api.telemetry.list", 500));
            }
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], Telemetry.prototype, "databaseSdk", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryImportManager_1.TelemetryImportManager)
], Telemetry.prototype, "telemetryImportManager", void 0);
exports.default = Telemetry;
