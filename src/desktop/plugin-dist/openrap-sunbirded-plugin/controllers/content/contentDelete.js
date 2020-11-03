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
const path = require("path");
const TreeModel = require("tree-model");
const typescript_ioc_1 = require("typescript-ioc");
const database_1 = require("../../sdk/database");
const response_1 = require("../../utils/response");
const contentDeleteHelper_1 = require("./contentDeleteHelper");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class ContentDelete {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.systemQueue = api_1.containerAPI.getSystemQueueInstance(manifest.id);
        this.systemQueue.register(contentDeleteHelper_1.ContentDeleteHelper.taskType, contentDeleteHelper_1.ContentDeleteHelper);
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqId = req.headers["X-msgid"];
            const contentIDS = _.get(req.body, "request.contents");
            if (!contentIDS) {
                logger_1.logger.error(`${reqId}: Error: content Ids not found`);
                return res.status(400).send(response_1.default.error(`api.content.delete`, 400, "MISSING_CONTENTS"));
            }
            try {
                const failed = [];
                const dbFilter = {
                    selector: {
                        _id: {
                            $in: contentIDS,
                        },
                    },
                };
                let contentsToDelete = yield this.databaseSdk.find("content", dbFilter).catch((error) => {
                    logger_1.logger.error(`Received Error while finding contents (isAvailable : false) Error: ${error.stack}`);
                });
                contentsToDelete = yield this.getContentsToDelete(contentsToDelete.docs);
                let deleted = yield this.databaseSdk.bulk("content", contentsToDelete).catch((err) => {
                    failed.push(err.message || err.errMessage);
                });
                deleted = _.map(deleted, (content) => content.id);
                const contentPaths = _.map(deleted, (id) => {
                    if (id) {
                        return path.join("content", id);
                    }
                });
                if (contentPaths) {
                    yield this.add(contentPaths, contentsToDelete[0]["name"]);
                }
                res.send(response_1.default.success("api.content.delete", { deleted, failed }, req));
            }
            catch (err) {
                logger_1.logger.error(`Received Error while Deleting content `, err);
                res.status(500);
                res.send(response_1.default.error(`api.content.delete`, 500, err.errMessage || err.message, err.code));
            }
        });
    }
    add(contentDeletePaths, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const insertData = {
                type: contentDeleteHelper_1.ContentDeleteHelper.taskType,
                name,
                metaData: {
                    filePaths: contentDeletePaths,
                },
            };
            const ids = yield this.systemQueue.add(insertData);
            return ids;
        });
    }
    getContentsToDelete(contentsToDelete) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteContents = [];
            for (const content of contentsToDelete) {
                content.desktopAppMetadata.isAvailable = false;
                deleteContents.push(content);
                if (content.mimeType === "application/vnd.ekstep.content-collection") {
                    const children = yield this.getResources(content);
                    for (const child of children["docs"]) {
                        child.desktopAppMetadata.isAvailable = false;
                        deleteContents.push(child);
                    }
                }
            }
            return deleteContents;
        });
    }
    getResources(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const resourceIds = [];
            const model = new TreeModel();
            let treeModel;
            treeModel = model.parse(content);
            treeModel.walk((node) => {
                if (node.model.mimeType !== "application/vnd.ekstep.content-collection") {
                    resourceIds.push(node.model.identifier);
                }
            });
            const dbFilter = {
                selector: {
                    $and: [
                        {
                            _id: {
                                $in: resourceIds,
                            },
                        },
                        {
                            mimeType: {
                                $nin: ["application/vnd.ekstep.content-collection"],
                            },
                        },
                        {
                            visibility: {
                                $eq: "Parent",
                            },
                        },
                    ],
                },
            };
            logger_1.logger.info(`finding all child contents of a collection`);
            return yield this.databaseSdk.find("content", dbFilter);
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", database_1.default)
], ContentDelete.prototype, "databaseSdk", void 0);
exports.default = ContentDelete;
