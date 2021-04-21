import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import Response from "../utils/response";

import { ClassLogger } from "@project-sunbird/logger/decorator";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
import { Inject } from 'typescript-ioc';

/*@ClassLogger({
  logLevel: "debug",
  logTime: true,

})*/
export default class User {
    private userSDK;
    private settingSDK;
    @Inject private standardLog: StandardLogger;
    constructor(manifest) {
        this.userSDK = containerAPI.getUserSdkInstance();
        this.settingSDK = containerAPI.getSettingSDKInstance(manifest.id);
        this.standardLog = containerAPI.getStandardLoggerInstance();
    }

    public async create(req, res) {
        try {
            if (!_.get(req, "body.request")) {
                res.status(400);
                return res.send(
                    Response.error("api.desktop.user.read", 400, "Request object is required"),
                );
            }
            const createResp = await this.userSDK.create(_.get(req, "body.request"));
            logger.info(`ReqId = "${req.headers["X-msgid"]}": request: ${_.get(req, "body.request")} found from desktop app update api`);
            return res.send(Response.success("api.desktop.user.create", { id: createResp._id }, req));
        } catch (err) {
            this.standardLog.error({ id: 'USER_DB_INSERT_FAILED', mid: req.headers["X-msgid"], message: 'Received error while adding user', error: err });
            res.status(err.status || 500);
            return res.send(
                Response.error("api.desktop.user.create", err.status || 500, err.message || ""),
            );
        }
    }

    public async read(req, res) {
        try {
            const userData = await this.userSDK.read();
            const locationData = await this.settingSDK.get("location").catch((error) => { logger.error("Error while getting location data from setting SDK", error); });
            userData.location = locationData;
            logger.info(`ReqId = "${req.headers["X-msgid"]}": result: ${userData} found from desktop app update api`);
            return res.send(Response.success("api.desktop.user.read", userData, req));
        } catch (err) {
            logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting user,  where err = ${err}`);
            this.standardLog.error({ id: 'USER_DB_READ_FAILED', mid: req.headers["X-msgid"], message: 'Received error while getting user', error: err });
            res.status(err.status || 500);
            return res.send(
                Response.error("api.desktop.user.read", err.status || 500, err.message || ""),
            );
        }
    }
    public async update(req, res) {

        try {
            const reqObj = _.get(req.body, "request");
            reqObj._id = _.get(reqObj, "identifier");
            logger.info(`ReqId =  ${req.headers["X-msgid"]}: updating user  data in user Sdk`);
            await this.userSDK.update(reqObj);
            res.status(200);
            return res.send(Response.success("api.desktop.user.update", {identifier: reqObj._id}, req));
        } catch (err) {
            this.standardLog.error({ id: 'USER_DB_UPDATED_FAILED', mid: req.headers["X-msgid"], message: 'Received error while updating user database', error: err });
            if (err.status === 404) {
                res.status(404);
                return res.send(Response.error("api.desktop.user.update", 404));
            } else {
                const status = err.status || 500;
                res.status(status);
                return res.send(Response.error("api.desktop.user.update", status));
            }
        }
    }
}
