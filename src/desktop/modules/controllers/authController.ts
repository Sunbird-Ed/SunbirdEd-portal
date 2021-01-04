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
import { ILoggedInUser } from '../../OpenRAP/interfaces/IUser';

// @ClassLogger({
//     logLevel: "debug",
//     logTime: true,
//     logMethods: ["getDeviceId", "getDesktopAppUpdate", "getAppInfo" ],
//   })
export default class AuthController {
    private deviceId;
    private userSDK;
    constructor(manifest) {
        this.getDeviceId(manifest);
        this.userSDK = containerAPI.getUserSdkInstance();
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

    public async startUserSession(req, res) {
        try {
            const userToken = req.body.access_token
            const userId = await this.parseUserIdFromAccessToken(userToken);
            const userAuthDetails = {
                access_token: userToken,
                userId: userId
            }

            const user = await permissionsHelper.getUser(userAuthDetails);
            const managedUsers: any = await permissionsHelper.getManagedUsers(userAuthDetails);

            // Save Logged-in User in DB
            user.accessToken = userAuthDetails.access_token;
            await this.saveUserInDB(user);
            await this.setUserSession(user);

            // Save managed users in DB
            if (managedUsers.count) {
                managedUsers.content.forEach(async (managedUser) => {
                    managedUser.accessToken = userAuthDetails.access_token;
                    await this.saveUserInDB(managedUser)
                });
            }

            return res.send({ status: 'success' });
        } catch (err) {
            logger.error(`While startUserSession ${err.message} ${err.stack}`);
            let status = err.status || 500;
            res.status(status);
            return res.send(Response.error('api.user.read', status, err.message));
        }
    }

    private async saveUserInDB(user: ILoggedInUser) {
        const response = await this.userSDK.insertLoggedInUser(user);
        return response;
    }

    private async setUserSession(user: ILoggedInUser) {
        const sessionData = { userId: user.userId };
        await this.userSDK.setUserSession(sessionData);
    }
}
