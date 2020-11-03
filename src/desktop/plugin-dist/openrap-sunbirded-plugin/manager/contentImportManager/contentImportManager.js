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
const fs = require("fs");
const _ = require("lodash");
const typescript_ioc_1 = require("typescript-ioc");
const path = require("path");
const IContentImport_1 = require("./IContentImport");
const database_1 = require("./../../sdk/database");
const logger_1 = require("@project-sunbird/logger");
const api_1 = require("OpenRAP/dist/api");
const manifest_1 = require("../../manifest");
const telemetryHelper_1 = require("../../helper/telemetryHelper");
const contentImport_1 = require("./contentImport");
const telemetryEnv = "Content";
const telemetryInstance = api_1.containerAPI.getTelemetrySDKInstance().getInstance();
// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
let ContentImportManager = class ContentImportManager {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest_1.manifest.id);
            this.systemQueue.register(contentImport_1.ImportContent.taskType, contentImport_1.ImportContent);
            this.dbSDK.initialize(manifest_1.manifest.id);
        });
    }
    add(ecarPaths) {
        return __awaiter(this, void 0, void 0, function* () {
            ecarPaths = yield this.getUnregisteredEcars(ecarPaths);
            logger_1.logger.info("Unregistered Ecars:", ecarPaths);
            if (!ecarPaths || !ecarPaths.length) {
                throw {
                    errCode: "ECARS_ADDED_ALREADY",
                    errMessage: "All ecar are added to content manager",
                };
            }
            const queueReq = [];
            for (const ecarPath of ecarPaths) {
                const contentSize = yield this.getEcarSize(ecarPath).catch(IContentImport_1.handelError("ECAR_NOT_EXIST"));
                const insertData = {
                    type: contentImport_1.ImportContent.taskType,
                    name: path.basename(ecarPath),
                    group: "CONTENT_MANAGER",
                    metaData: {
                        contentSize,
                        ecarSourcePath: ecarPath,
                        step: IContentImport_1.ImportSteps.copyEcar,
                        extractedEcarEntries: {},
                        artifactUnzipped: {},
                    },
                };
                queueReq.push(insertData);
            }
            const ids = yield this.systemQueue.add(queueReq);
            // _.forEach(ids, (id, index) => {
            //   this.logSubmitAuditEvent(id, queueReq[index].name, Object.keys(queueReq[index]));
            // });
            return ids;
        });
    }
    pauseImport(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.systemQueue.pause(importId);
        });
    }
    resumeImport(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.systemQueue.resume(importId);
        });
    }
    cancelImport(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.systemQueue.cancel(importId);
        });
    }
    retryImport(importId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.systemQueue.retry(importId);
        });
    }
    getEcarSize(filePath) {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    return reject(err);
                }
                resolve(stats.size);
            });
        });
    }
    getUnregisteredEcars(ecarPaths) {
        return __awaiter(this, void 0, void 0, function* () {
            const registeredJobs = yield this.systemQueue.query({
                type: contentImport_1.ImportContent.taskType,
                name: { $in: ecarPaths.map((ecarPath) => path.basename(ecarPath)) },
                isActive: true,
            });
            if (!registeredJobs) {
                return ecarPaths;
            }
            ecarPaths = _.filter(ecarPaths, (ecarPath) => {
                if (this.findPath(registeredJobs.docs, ecarPath)) {
                    return false;
                }
                else {
                    return true;
                }
            });
            return ecarPaths;
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
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], ContentImportManager.prototype, "dbSDK", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryHelper_1.default)
], ContentImportManager.prototype, "telemetryHelper", void 0);
ContentImportManager = __decorate([
    typescript_ioc_1.Singleton
], ContentImportManager);
exports.ContentImportManager = ContentImportManager;
