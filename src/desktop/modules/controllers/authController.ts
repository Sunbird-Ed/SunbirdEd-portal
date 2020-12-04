import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import { logger } from "@project-sunbird/logger";
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as os from "os";
import config from "../config";
import Response from "../utils/response";
import * as jwt from "jsonwebtoken";
import permissionsHelper from "../helper/permissionsHelper";

import { ClassLogger } from "@project-sunbird/logger/decorator";

// @ClassLogger({
//     logLevel: "debug",
//     logTime: true,
//     logMethods: ["getDeviceId", "getDesktopAppUpdate", "getAppInfo" ],
//   })
export default class AuthController {
    private deviceId;

    constructor(manifest) {
        this.getDeviceId(manifest);
    }

    public async getDeviceId(manifest) {
        try {
            this.deviceId = await containerAPI.getSystemSDKInstance(manifest.id).getDeviceId();
        } catch (err) {
            logger.error({
                msg: "appUpdate:getDeviceId caught exception while fetching device id with error",
                errorMessage: err.message,
                error: err,
            });
        }
    }

    private async parseUserIdFromAccessToken(accessToken: string) {
        const payload: { sub: string } = jwt.decode(accessToken);
        return payload.sub.split(':').length === 3 ? <string>payload.sub.split(':').pop() : payload.sub;
    }

    public async resolvePasswordSession(req, res) {
        try {
            const body = new URLSearchParams({
                redirect_uri: process.env.AUTH_REDIRECT_URI,
                code: req.params.code,
                grant_type: process.env.AUTH_GRANT_TYPE,
                client_id: process.env.AUTH_CLIENT_ID
            }).toString()
            const appConfig = {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                },
            };
            const userToken = await HTTPService.post(`${process.env.AUTH_KC_URL}/token`, body, appConfig)
            .toPromise();
            const userId = await this.parseUserIdFromAccessToken(userToken.data.access_token);
            const userAuthDetails = {
                access_token: userToken.data.access_token,
                referesh_token: userToken.data.refresh_token,
                userId: userId
            }
            await permissionsHelper.getCurrentUserRoles(req, userAuthDetails);
            
        }catch (err) {
            logger.error(
                `While resolvePasswordSession ${err.message} ${err.stack}`,
            );
            let status = err.status || 500;
            res.status(status);
            return res.send(Response.error('api.user.read', status, err.message));
        }
        
    } 
  
}
