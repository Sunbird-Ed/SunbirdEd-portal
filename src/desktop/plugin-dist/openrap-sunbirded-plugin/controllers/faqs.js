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
const services_1 = require("@project-sunbird/ext-framework-server/services");
const logger_1 = require("@project-sunbird/logger");
const _ = require("lodash");
const api_1 = require("OpenRAP/dist/api");
const path = require("path");
const typescript_ioc_1 = require("typescript-ioc");
const index_1 = require("../sdk/database/index");
const response_1 = require("./../utils/response");
const FAQS_DB = "faqs";
const FAQ_BLOB_URL = `${process.env.FAQ_BLOB_URL}`;
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class Faqs {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest.id);
        this.faqsBasePath = this.fileSDK.getAbsPath(path.join("data", "faqs"));
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield this.fileSDK.readdir(path.join("data", "faqs"));
                const dbData = yield this.databaseSdk.list(FAQS_DB, { limit: 1 });
                logger_1.logger.info("--Inserting faqs to db--", dbData.total_rows, files.length);
                if (!dbData.total_rows && files.length) {
                    const bulkDocs = [];
                    for (const file of files) {
                        const data = yield this.fileSDK.readJSON(path.join(this.faqsBasePath, file));
                        bulkDocs.push({
                            _id: path.basename(file, path.extname(file)),
                            data,
                        });
                    }
                    yield this.databaseSdk.bulk(FAQS_DB, bulkDocs);
                }
            }
            catch (err) {
                logger_1.logger.error({
                    msg: "faqs:insert caught exception while inserting faqs with error",
                    errorMessage: err.message,
                    error: err,
                });
            }
        });
    }
    read(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = req.params.language;
            const faqs = (yield this.fetchOnlineFaqs(language, req)) || (yield this.fetchOfflineFaqs(language, req));
            if (faqs) {
                res.send(response_1.default.success("api.faqs.read", { faqs }, req));
            }
            else {
                logger_1.logger.error(`FAQ not found for language: `, language, `for ReqId: ${req.get("x-msgid")} `);
                res.status(404).send(response_1.default.error("api.faqs.read", 404));
            }
        });
    }
    fetchOfflineFaqs(language, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let faqsData = yield this.databaseSdk.get(FAQS_DB, language).then((doc) => doc.data).catch((err) => {
                logger_1.logger.error(`Got error while reading Faq from DB for language`, language, `for ReqId: ${req.get("x-msgid")}, error message `, err.message);
                return undefined;
            });
            if (!faqsData) { // Load from files. Not needed as we have inserted all faqs json on app start.
                logger_1.logger.info(`Getting faqs from file system for language:`, language, `for ReqId: ${req.get("x-msgid")}`);
                faqsData = yield this.fileSDK.readJSON(path.join(this.faqsBasePath, language + ".json")).catch((err) => {
                    logger_1.logger.error(`Got error while reading Faq from file for language`, language, `for ReqId: ${req.get("x-msgid")}, error message `, err.message);
                    return undefined;
                });
            }
            return faqsData;
        });
    }
    fetchOnlineFaqs(language, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = {
                headers: {
                    "content-type": "application/json",
                },
            };
            return yield services_1.HTTPService.get(`${FAQ_BLOB_URL}faq-${language}.json`, config).toPromise()
                .then((data) => {
                const faqsData = _.get(data, "data");
                if (faqsData) {
                    this.addToDb(language, faqsData);
                }
                return faqsData;
            }).catch((err) => {
                logger_1.logger.error(`Got error while reading Faq from blob for language`, language, `for ReqId: ${req.get("x-msgid")}, error message `, err.message);
                return undefined;
            });
        });
    }
    addToDb(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.databaseSdk.upsert(FAQS_DB, id, { data })
                .catch((err) => logger_1.logger.error(`Received error while insert/updating faqs for language: ${id} to faqs database and err.message: ${err.message}`));
        });
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.default)
], Faqs.prototype, "databaseSdk", void 0);
exports.Faqs = Faqs;
