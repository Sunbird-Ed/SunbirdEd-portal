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
const telemetryHelper_1 = require("../helper/telemetryHelper");
const index_1 = require("../sdk/database/index");
const response_1 = require("./../utils/response");
/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
class Location {
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = api_1.containerAPI.getFileSDKInstance(manifest.id);
        this.settingSDK = api_1.containerAPI.getSettingSDKInstance(manifest.id);
    }
    // Inserting states and districts data from files
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filesPath = this.fileSDK.getAbsPath(path.join("data", "location", "/"));
                const stateFile = yield this.fileSDK.readJSON(filesPath + "state.json");
                const states = _.get(stateFile, "result.response");
                const allStates = [];
                const allDocs = yield this.databaseSdk.list("location", { include_docs: true, startkey: "design_\uffff" });
                if (allDocs.rows.length === 0) {
                    for (const state of states) {
                        state._id = state.id;
                        const districtFile = yield this.fileSDK.readJSON(filesPath + "district-" + state._id + ".json");
                        state.data = _.get(districtFile, "result.response") || [];
                        allStates.push(state);
                    }
                    logger_1.logger.debug("Inserting location data in locationDB");
                    yield this.databaseSdk.bulk("location", allStates).catch((err) => {
                        logger_1.logger.error(`while inserting location data in locationDB  ${err}`);
                    });
                }
                return;
            }
            catch (err) {
                logger_1.logger.error(`while inserting location data in locationDB  ${err}`);
                return;
            }
        });
    }
    // Searching location data in DB (if user is in online get online data and insert in db)
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationType = _.get(req.body, "request.filters.type");
            const parentId = _.get(req.body, "request.filters.parentId");
            logger_1.logger.debug(`ReqId = '${req.headers["X-msgid"]}': Finding the data from location database`);
            if (_.isEmpty(locationType)) {
                res.status(400);
                return res.send(response_1.default.error("api.location.search", 400, "location Type is missing"));
            }
            if (locationType === "district" && _.isEmpty(parentId)) {
                logger_1.logger.error(`ReqId = '${req.headers["X-msgid"]}': Error Received while searching ${req.body} data error`);
                res.status(400);
                return res.send(response_1.default.error("api.location.search", 400, "parentId is missing"));
            }
            logger_1.logger.debug(`ReqId = ${req.headers["X-msgid"]}: getLocationData method is calling`);
            const request = _.isEmpty(parentId) ? { selector: {} } : { selector: { id: parentId } };
            yield this.databaseSdk.find("location", request).then((response) => {
                response = _.map(response.docs, (doc) => {
                    return locationType === "state" ? _.omit(doc, ["_id", "_rev", "data"]) : doc.data;
                });
                const resObj = {
                    response: locationType === "district" ? response[0] : response,
                };
                logger_1.logger.info(`ReqId =  ${req.headers["X-msgid"]}: got data from db`);
                const responseObj = response_1.default.success("api.location.search", resObj, req);
                this.constructSearchEdata(req, responseObj);
                return res.send(responseObj);
            }).catch((err) => {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while searching in location database and err.message: ${err.message} ${err}`);
                if (err.status === 404) {
                    res.status(404);
                    return res.send(response_1.default.error("api.location.search", 404));
                }
                else {
                    const status = err.status || 500;
                    res.status(status);
                    return res.send(response_1.default.error("api.location.search", status));
                }
            });
        });
    }
    proxyToAPI(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiKey = yield api_1.containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
                logger_1.logger.error(`Received error while fetching api key in location search with error: ${err}`);
            });
            const requestObj = {
                type: _.get(req.body, "request.filters.type"),
                parentId: _.get(req.body, "request.filters.parentId"),
            };
            const config = {
                headers: {
                    "authorization": `Bearer ${apiKey}`,
                    "content-type": "application/json",
                },
            };
            const filter = _.isEmpty(requestObj.parentId)
                ? { filters: { type: requestObj.type } }
                : { filters: { type: requestObj.type, parentId: requestObj.parentId } };
            const requestParams = {
                request: filter,
            };
            try {
                logger_1.logger.debug(`ReqId =  ${req.headers["X-msgid"]}}: getting location data from online`);
                const responseData = yield services_1.HTTPService.post(`${process.env.APP_BASE_URL}/api/data/v1/location/search`, requestParams, config).toPromise();
                let response = _.get(responseData.data, "result.response");
                requestObj.type === "state" ? yield this.insertStatesDataInDB(response, req.headers["X-msgid"]) :
                    yield this.updateStateDataInDB(response, req.headers["X-msgid"]);
                response = _.map(response, (data) => _.omit(data, ["_id", "data"]));
                const resObj = {
                    response,
                };
                logger_1.logger.debug(`ReqId =  ${req.headers["X-msgid"]}: fetchLocationFromOffline method is calling `);
                const responseObj = response_1.default.success("api.location.search", resObj, req);
                this.constructSearchEdata(req, responseObj);
                return res.send(responseObj);
            }
            catch (err) {
                logger_1.logger.error(`ReqId =  ${req.headers["X-msgid"]}: Error Received while getting data from Online ${err}`);
                next();
            }
        });
    }
    insertStatesDataInDB(onlineStates, msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bulkInsert = [];
                const bulkUpdate = [];
                const allDocs = yield this.databaseSdk.find("location", { selector: {} });
                const ids = _.map(allDocs.docs, (doc) => doc.id);
                if (!_.isEmpty(onlineStates)) {
                    for (const state of onlineStates) {
                        if (_.includes(ids, state.id)) {
                            state._id = state.id;
                            bulkUpdate.push(state);
                        }
                        else {
                            state._id = state.id;
                            _.has(state, "data") ? state.data = state.data : state.data = [];
                            bulkInsert.push(state);
                        }
                    }
                    if (bulkInsert.length > 0) {
                        logger_1.logger.info(`ReqId =  ${msgId}: bulkInsert in LocationDB`);
                        yield this.databaseSdk.bulk("location", bulkInsert);
                    }
                    if (bulkUpdate.length > 0) {
                        logger_1.logger.info(`ReqId =  ${msgId}: bulkUpdate in LocationDB`);
                        yield this.databaseSdk.bulk("location", bulkUpdate);
                    }
                }
                else {
                    logger_1.logger.info(`ReqId =  ${msgId}: state data is empty`);
                    return;
                }
            }
            catch (err) {
                logger_1.logger.error(`ReqId =  ${msgId}: updateStateDataInDB method is called ${err}`);
                return;
            }
        });
    }
    updateStateDataInDB(district, msgId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = district[0].parentId;
                logger_1.logger.info(`ReqId =  ${msgId}: getting data from LocationDB`);
                const state = yield this.databaseSdk.get("location", id);
                if (!_.isEmpty(district)) {
                    state.data = district;
                    logger_1.logger.info(`ReqId =  ${msgId}: updating data in LocationDB`);
                    yield this.databaseSdk.update("location", state.id, state);
                }
                else {
                    logger_1.logger.info(`ReqId =  ${msgId}: district data is empty`);
                    return;
                }
            }
            catch (err) {
                logger_1.logger.error(`ReqId =  ${msgId}: updateStateDataInDB method is called ${err}`);
                return;
            }
        });
    }
    saveLocation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locationData = _.get(req.body, "request");
            try {
                if (!_.isObject(locationData.state) || !_.isObject(locationData.city)) {
                    throw new Error("State and district should be an object");
                }
                const resObj = locationData;
                logger_1.logger.info(`ReqId =  ${req.headers["X-msgid"]}: saving userlocation data in settingsSdk`);
                const response = yield this.settingSDK.put("location", resObj);
                res.status(200);
                return res.send(response_1.default.success("api.location.save", response, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while saving in location database and err.message: ${err.message} ${err}`);
                if (err.status === 404) {
                    res.status(404);
                    return res.send(response_1.default.error("api.location.save", 404));
                }
                else {
                    const status = err.status || 500;
                    res.status(status);
                    return res.send(response_1.default.error("api.location.save", status));
                }
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`ReqId = "${req.headers["X-msgid"]}": Getting location from location DB`);
                const locationData = yield this.settingSDK.get("location");
                return res.send(response_1.default.success("api.location.read", locationData, req));
            }
            catch (err) {
                logger_1.logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting location from location database and err.message: ${err.message} ${err}`);
                const status = err.status || 500;
                res.status(status);
                return res.send(response_1.default.error("api.location.read", status));
            }
        });
    }
    constructSearchEdata(req, res) {
        const edata = {
            type: "location",
            query: _.get(req, "body.request.query"),
            filters: _.get(req, "body.request.filters"),
            correlationid: _.get(res, "params.msgid"),
            size: _.get(res, "result.response").length,
        };
        this.telemetryHelper.logSearchEvent(edata, "Location");
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.default)
], Location.prototype, "databaseSdk", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", telemetryHelper_1.default)
], Location.prototype, "telemetryHelper", void 0);
exports.Location = Location;
