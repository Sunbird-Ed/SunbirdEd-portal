import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import { Inject } from "typescript-ioc";
import TelemetryHelper from "../helper/telemetryHelper";
import DatabaseSDK from "../sdk/database/index";
import Response from "../utils/response";
import { ILocation } from "./ILocation";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,
})*/
export class Location {
    @Inject private databaseSdk: DatabaseSDK;
    @Inject private telemetryHelper: TelemetryHelper;
    @Inject private standardLog: StandardLogger;
    private fileSDK;
    private settingSDK;
    constructor(manifest) {
        this.databaseSdk.initialize(manifest.id);
        this.fileSDK = containerAPI.getFileSDKInstance(manifest.id);
        this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
        this.standardLog = containerAPI.getStandardLoggerInstance();
    }

    // Inserting states and districts data from files

    public async insert() {
        try {
            const filesPath = this.fileSDK.getAbsPath(path.join("data", "location", "/"));
            const stateFile = await this.fileSDK.readJSON(filesPath + "state.json");
            const states = _.get(stateFile, "result.response");
            const allStates: ILocation[] = [];
            const allDocs = await this.databaseSdk.list("location", { include_docs: true, startkey: "design_\uffff" });
            if (allDocs.rows.length === 0) {
                for (const state of states) {
                    state._id = state.id;
                    const districtFile = await this.fileSDK.readJSON(filesPath + "district-" + state._id + ".json");
                    state.data = _.get(districtFile, "result.response") || [];
                    allStates.push(state);
                }
                logger.debug("Inserting location data in locationDB");
                await this.databaseSdk.bulk("location", allStates).catch((err) => {
                    this.standardLog.error({id: 'LOCATION_DB_INSERT_FAILED', message: 'While inserting location data in locationDB', error: err});
                });
            }
            return;
        } catch (err) {
            this.standardLog.error({id: 'LOCATION_DB_INSERT_FAILED', message: 'While inserting location data in locationDB', error: err});
            return;
        }
    }

    // Searching location data in DB (if user is in online get online data and insert in db)
    public async search(req, res) {
        const locationType = _.get(req.body, "request.filters.type");
        const parentId = _.get(req.body, "request.filters.parentId");
        logger.debug(`ReqId = '${req.headers["X-msgid"]}': Finding the data from location database`);
        if (_.isEmpty(locationType)) {
            res.status(400);
            return res.send(Response.error("api.location.search", 400, "location Type is missing"));
        }
        if (locationType === "district" && _.isEmpty(parentId)) {
            logger.error(
                `ReqId = '${req.headers[
                "X-msgid"
                ]}': Error Received while searching ${req.body} data error`,
            );
            res.status(400);
            return res.send(Response.error("api.location.search", 400, "parentId is missing"));
        }

        logger.debug(`ReqId = ${req.headers["X-msgid"]}: getLocationData method is calling`);
        const request = _.isEmpty(parentId) ? { selector: {} } : { selector: { id: parentId } };
        await this.databaseSdk.find("location", request).then((response) => {
            response = _.map(response.docs, (doc) => {
               return locationType === "state" ? _.omit(doc, ["_id", "_rev", "data"]) : doc.data;
            });
            const resObj = {
                response: locationType === "district" ? response[0] : response,
            };
            logger.info(`ReqId =  ${req.headers["X-msgid"]}: got data from db`);
            const responseObj = Response.success("api.location.search", resObj, req);
            this.constructSearchEdata(req, responseObj);
            return res.send(responseObj);
        }).catch((err) => {
            this.standardLog.error({ id: 'LOCATION_DB_SEARCH_FAILED', mid: req.headers["X-msgid"], message: 'Received error while searching in location database', error: err });
            if (err.status === 404) {
                res.status(404);
                return res.send(Response.error("api.location.search", 404));
            } else {
                const status = err.status || 500;
                res.status(status);
                return res.send(Response.error("api.location.search", status));
            }
        });
    }
    public async proxyToAPI(req, res, next) {
        const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
            logger.error(`Received error while fetching api key in location search with error: ${err}`);
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
            logger.debug(`ReqId =  ${req.headers["X-msgid"]}}: getting location data from online`);
            const responseData = await HTTPService.post(
                `${process.env.APP_BASE_URL}/api/data/v1/location/search`,
                requestParams,
                config,
            ).toPromise();

            let response = _.get(responseData.data, "result.response");
            requestObj.type === "state" ? await this.insertStatesDataInDB(response, req.headers["X-msgid"]) :
            await this.updateStateDataInDB(response, req.headers["X-msgid"]);
            response = _.map(response, (data) => _.omit(data, ["_id", "data"]));
            const resObj = {
                response,
            };

            logger.debug(`ReqId =  ${req.headers["X-msgid"]}: fetchLocationFromOffline method is calling `);
            const responseObj = Response.success("api.location.search", resObj, req);
            this.constructSearchEdata(req, responseObj);
            return res.send(responseObj);
        } catch (err) {
            const traceId = _.get(err, 'data.params.msgid');
            logger.error(`ReqId =  ${req.headers["X-msgid"]}: Error Received while getting data from Online ${err}, with trace Id= ${traceId}`);
            next();
        }
    }

    public async insertStatesDataInDB(onlineStates, msgId) {

        try {
            const bulkInsert = [];
            const bulkUpdate = [];
            const allDocs = await this.databaseSdk.find("location", { selector: {} });
            const ids = _.map(allDocs.docs, (doc) =>  doc.id);
            if (!_.isEmpty(onlineStates)) {
                for (const state of onlineStates) {
                    if (_.includes(ids, state.id)) {
                        state._id = state.id;
                        bulkUpdate.push(state);
                    } else {
                        state._id = state.id;
                        _.has(state, "data") ? state.data = state.data : state.data = [];
                        bulkInsert.push(state);
                    }
                }
                if (bulkInsert.length > 0) {
                    logger.info(`ReqId =  ${msgId}: bulkInsert in LocationDB`);
                    await this.databaseSdk.bulk("location", bulkInsert);
                }
                if (bulkUpdate.length > 0) {
                    logger.info(`ReqId =  ${msgId}: bulkUpdate in LocationDB`);
                    await this.databaseSdk.bulk("location", bulkUpdate);
                }
            } else {
                logger.info(`ReqId =  ${msgId}: state data is empty`);
                return;
            }
        } catch (err) {
            this.standardLog.error({ id: 'LOCATION_DB_INSERT_FAILED', mid: msgId, message: 'Failed to insert states in database', error: err });
            return;
        }
    }
    public async updateStateDataInDB(district, msgId) {

        try {
            const id = district[0].parentId;
            logger.info(`ReqId =  ${msgId}: getting data from LocationDB`);
            const state = await this.databaseSdk.get("location", id);
            if (!_.isEmpty(district)) {
                state.data = district;
                logger.info(`ReqId =  ${msgId}: updating data in LocationDB`);
                await this.databaseSdk.update("location", state.id, state);
            } else {
                logger.info(`ReqId =  ${msgId}: district data is empty`);
                return;
            }

        } catch (err) {
            this.standardLog.error({ id: 'LOCATION_DB_UPDATE_FAILED', mid: msgId, message: 'Failed to update states in database', error: err });
            return;
        }
    }

    public async saveLocation(req, res) {
        const locationData = _.get(req.body, "request");
        try {
            if (!_.isObject(locationData.state) || !_.isObject(locationData.city)) {
                throw new Error("State and district should be an object");
            }
            const resObj = locationData;
            logger.info(`ReqId =  ${req.headers["X-msgid"]}: saving userlocation data in settingsSdk`);
            const response = await this.settingSDK.put("location", resObj);
            res.status(200);
            return res.send(Response.success("api.location.save", response, req));
        } catch (err) {
            this.standardLog.error({ id: 'LOCATION_DB_INSERT_FAILED', mid: req.headers["X-msgid"], message: 'Received error while saving in location database', error: err });
            if (err.status === 404) {
                res.status(404);
                return res.send(Response.error("api.location.save", 404));
            } else {
                const status = err.status || 500;
                res.status(status);
                return res.send(Response.error("api.location.save", status));
            }
        }
    }

    public async get(req, res) {
        try {
            logger.info(`ReqId = "${req.headers["X-msgid"]}": Getting location from location DB`);
            const locationData = await this.settingSDK.get("location");
            return res.send(Response.success("api.location.read", locationData, req));
        } catch (err) {
            this.standardLog.error({ id: 'LOCATION_DB_READ_FAILED', mid: req.headers["X-msgid"], message: 'Received error while getting location from location database', error: err });
            const status = err.status || 500;
            res.status(status);
            return res.send(Response.error("api.location.read", status));
        }
    }
    private constructSearchEdata(req, res) {
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
