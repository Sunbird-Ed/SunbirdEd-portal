var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const fs = require("fs");
const _ = require("lodash");
const typescript_ioc_1 = require("typescript-ioc");
const path = require("path");
const ITelemetryImport_1 = require("./ITelemetryImport");
const logger_1 = require("@project-sunbird/logger");
const api_1 = require("OpenRAP/dist/api");
const manifest_1 = require("../../manifest");
const telemetryImport_1 = require("./telemetryImport");
// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
let TelemetryImportManager = class TelemetryImportManager {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest_1.manifest.id);
            this.systemQueue.register(telemetryImport_1.ImportTelemetry.taskType, telemetryImport_1.ImportTelemetry);
        });
    }
    add(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            paths = yield this.getUnregisteredPaths(paths);
            logger_1.logger.info("Unregistered telemetry import paths:", paths);
            if (!paths || !paths.length) {
                throw {
                    errCode: "TELEMETRY_IMPORT_PATH_ADDED_ALREADY",
                    errMessage: "All telemetry import paths are added",
                };
            }
            const queueReq = [];
            for (const data of paths) {
                const fileSize = yield this.getFileSize(data).catch(ITelemetryImport_1.handelError("TELEMETRY_IMPORT_PATH_NOT_EXIST"));
                const insertData = {
                    type: telemetryImport_1.ImportTelemetry.taskType,
                    name: path.basename(data),
                    metaData: {
                        fileSize,
                        sourcePath: data,
                    },
                };
                queueReq.push(insertData);
            }
            const ids = yield this.systemQueue.add(queueReq);
            return ids;
        });
    }
    retryImport(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.systemQueue.retry(importId);
        });
    }
    getFileSize(filePath) {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(stats.size);
            });
        });
    }
    getUnregisteredPaths(paths) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredJobs = yield this.systemQueue.query({
                type: telemetryImport_1.ImportTelemetry.taskType,
                name: { $in: paths.map((data) => path.basename(data)) },
                isActive: true,
            });
            if (!registeredJobs) {
                return paths;
            }
            logger_1.logger.debug("---paths--", paths);
            paths = _.filter(paths, (filePath) => {
                if (this.findPath(registeredJobs.docs, filePath)) {
                    logger_1.logger.info("skipping telemetry import for ", filePath, " as its already registered");
                    return false;
                }
                else {
                    return true;
                }
            });
            return paths;
        });
    }
    findPath(docs, filePath) {
        const exist = _.find(docs, (o) => {
            return o.metaData.sourcePath === filePath;
        });
        if (exist) {
            return true;
        }
        return false;
    }
};
TelemetryImportManager = __decorate([
    typescript_ioc_1.Singleton
], TelemetryImportManager);
exports.TelemetryImportManager = TelemetryImportManager;
