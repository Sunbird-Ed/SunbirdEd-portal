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
const index_1 = require("../sdk/database/index");
const logger_1 = require("@project-sunbird/logger");
const hashids_1 = require("hashids");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const path = require("path");
const typescript_ioc_1 = require("typescript-ioc");
const response_1 = require("./../utils/response");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class Form {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest.id);
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield this.fileSDK.readdir(path.join("data", "forms"));
                const formsFilesBasePath = this.fileSDK.getAbsPath(path.join("data", "forms"));
                let formsList = yield this.databaseSdk.list("form", { startkey: "_design0" });
                formsList = _.get(formsList, "rows");
                const formsListLength = formsList ? formsList.length : 0;
                const formDocs = [];
                for (const file of files) {
                    const form = yield this.fileSDK.readJSON(path.join(formsFilesBasePath, file));
                    const doc = _.get(form, "result.form");
                    doc.rootOrgId = doc.rootOrgId || "*";
                    doc.component = doc.component || "*";
                    doc.framework = doc.framework || "*";
                    const idText = `${doc.type}_${doc.subtype}_${doc.action}_${doc.rootOrgId}_${doc.framework}_${doc.component}`;
                    const hash = new hashids_1.default(idText, 10);
                    const id = hash.encode(1).toLowerCase();
                    let isInserted = false;
                    if (formsListLength > 0) {
                        isInserted = _.find(formsList, { id });
                    }
                    if (!isInserted) {
                        logger_1.logger.info(`${id} is not inserted`);
                        doc._id = id;
                        formDocs.push(doc);
                    }
                    else {
                        logger_1.logger.info(`${id} is inserted`);
                    }
                }
                if (formDocs.length) {
                    yield this.databaseSdk.bulk("form", formDocs);
                }
            }
            catch (error) {
                logger_1.logger.error(`While inserting forms ${error.message} ${error.stack}`);
            }
        });
    }
    search(req, res) {
        const requestBody = req.body;
        let requestObj = _.get(requestBody, "request");
        requestObj = {
            type: requestObj.type,
            subtype: requestObj.subType,
            action: requestObj.action,
        };
        // TODO: Need tp handle all the cases with rootOrg and framework and component
        // requestObj.rootOrgId = requestObj.rootOrgId || '*';
        // requestObj.component = requestObj.component || '*';
        // requestObj.framework = requestObj.framework || '*';
        const searchObj = {
            selector: requestObj,
        };
        logger_1.logger.debug(`ReqId = "${req.headers["X-msgid"]}": Finding the data from Form database`);
        this.databaseSdk
            .find("form", searchObj)
            .then((data) => {
            data = _.map(data.docs, (doc) => _.omit(doc, ["_id", "_rev"]));
            if (data.length <= 0) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received empty data while searching with ${searchObj} in form database`);
                res.status(404);
                return res.send(response_1.default.error("api.form.read", 404));
            }
            const resObj = {
                form: data[0],
            };
            logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Received data  from - form database`);
            return res.send(response_1.default.success("api.form.read", resObj, req));
        })
            .catch((err) => {
            logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while searching in form database and err.message: ${err.message} ${err}`);
            if (err.status === 404) {
                res.status(404);
                return res.send(response_1.default.error("api.form.read", 404));
            }
            else {
                const status = err.status || 500;
                res.status(status);
                return res.send(response_1.default.error("api.form.read", status));
            }
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.default)
], Form.prototype, "databaseSdk", void 0);
exports.Form = Form;
