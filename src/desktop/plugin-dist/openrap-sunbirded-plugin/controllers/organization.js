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
// @ClassLogger({
//   logLevel: "debug",
//   logTime: true,
// })
class Organization {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest.id);
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield this.fileSDK.readdir(path.join("data", "organizations"));
                const oragnizationFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "organizations"));
                let organizationsList = yield this.databaseSdk.list("organization", { startkey: "_design0" });
                organizationsList = _.get(organizationsList, "rows");
                const organizationsListLength = organizationsList ? organizationsList.length : 0;
                const organizationDocs = [];
                for (const file of files) {
                    const id = path.basename(file, path.extname(file));
                    let isInserted = false;
                    if (organizationsListLength > 0) {
                        isInserted = _.find(organizationsList, { id });
                    }
                    if (!isInserted) {
                        logger_1.logger.info(`${id} is not inserted`);
                        const organization = yield this.fileSDK.readJSON(path.join(oragnizationFilesBasePath, file));
                        const doc = _.get(organization, "result.response.content[0]");
                        doc._id = id;
                        organizationDocs.push(doc);
                    }
                    else {
                        logger_1.logger.info(`${id} is inserted`);
                    }
                }
                if (organizationDocs.length) {
                    yield this.databaseSdk.bulk("organization", organizationDocs);
                }
            }
            catch (error) {
                logger_1.logger.error(`While inserting organization ${error.message} ${error.stack}`);
            }
        });
    }
    search(req, res) {
        const requestBody = req.body;
        const searchObj = {
            selector: _.get(requestBody, "request.filters"),
        };
        logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Finding the data from organization database`);
        this.databaseSdk
            .find("organization", searchObj)
            .then((data) => {
            data = _.map(data.docs, (doc) => _.omit(doc, ["_id", "_rev"]));
            const resObj = {
                response: {
                    content: data,
                    count: data.length,
                },
            };
            logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Received data from organization database`);
            return res.send(response_1.default.success("api.org.search", resObj, req));
        })
            .catch((err) => {
            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while searching in organization database and err.message: ${err.message} ${err}`);
            if (err.status === 404) {
                res.status(404);
                return res.send(response_1.default.error("api.org.search", 404));
            }
            else {
                const status = err.status || 500;
                res.status(status);
                return res.send(response_1.default.error("api.org.search", status));
            }
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.default)
], Organization.prototype, "databaseSdk", void 0);
exports.Organization = Organization;
