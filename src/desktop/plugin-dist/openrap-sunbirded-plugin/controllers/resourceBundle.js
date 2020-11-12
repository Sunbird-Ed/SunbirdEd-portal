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
const typescript_ioc_1 = require("typescript-ioc");
const index_1 = require("../sdk/database/index");
const response_1 = require("./../utils/response");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
class ResourceBundle {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest.id);
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield this.fileSDK.readdir(path.join("data", "resourceBundles"));
                const resourceBundlesFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "resourceBundles"));
                let resourceBundlesList = yield this.databaseSdk.list("resource_bundle", { startkey: "_design0" });
                resourceBundlesList = _.get(resourceBundlesList, "rows");
                const resourceBundlesListLength = resourceBundlesList ? resourceBundlesList.length : 0;
                const resourceBundleDocs = [];
                for (const file of files) {
                    const id = path.basename(file, path.extname(file));
                    let docInfo;
                    if (resourceBundlesListLength > 0) {
                        docInfo = _.find(resourceBundlesList, { id });
                    }
                    const doc = yield this.fileSDK.readJSON(path.join(resourceBundlesFilesBasePath, file));
                    doc._id = id;
                    if (docInfo) {
                        doc._rev = _.get(docInfo, "value.rev");
                    }
                    resourceBundleDocs.push(doc);
                }
                if (resourceBundleDocs.length) {
                    yield this.databaseSdk.bulk("resource_bundle", resourceBundleDocs);
                }
            }
            catch (error) {
                logger_1.logger.error(`While inserting resource bundles ${error.message} ${error.stack}`);
            }
        });
    }
    get(req, res) {
        const id = req.params.id || "en";
        logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Getting the data from resource_bundle database with id: ${id}`);
        this.databaseSdk
            .get("resource_bundle", id)
            .then((data) => {
            data = _.omit(data, ["_id", "_rev"]);
            logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Received data with id: ${id} in resource_bundle database`);
            return res.send(response_1.default.success("api.resoucebundles.read", data, req));
        })
            .catch((err) => {
            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting the data from resource_bundle database with id: ${id} and err: ${err}`);
            if (err.status === 404) {
                res.status(404);
                return res.send(response_1.default.error("api.resoucebundles.read", 404));
            }
            else {
                const status = err.status || 500;
                res.status(status);
                return res.send(response_1.default.error("api.resoucebundles.read", status));
            }
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.default)
], ResourceBundle.prototype, "databaseSdk", void 0);
exports.ResourceBundle = ResourceBundle;
