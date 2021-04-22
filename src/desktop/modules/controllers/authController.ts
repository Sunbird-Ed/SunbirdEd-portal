import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as jwt from "jsonwebtoken";
import { ILoggedInUser } from '../../OpenRAP/interfaces/IUser';
import permissionsHelper from "../helper/permissionsHelper";
import Response from "../utils/response";
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";
import { Inject } from 'typescript-ioc';
const uuidv1 = require('uuid/v1');


// @ClassLogger({
//     logLevel: "debug",
//     logTime: true,
//     logMethods: ["getDeviceId", "getDesktopAppUpdate", "getAppInfo" ],
//   })
export default class AuthController {
    private deviceId;
    private userSDK;
    @Inject private standardLog: StandardLogger;
    constructor(manifest) {
        this.getDeviceId(manifest);
        this.userSDK = containerAPI.getUserSdkInstance();
        this.standardLog = containerAPI.getStandardLoggerInstance();
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
                    const managedUserDetails = { access_token: userAuthDetails.access_token, userId: managedUser.userId };
                    const userDetails = await permissionsHelper.getUser(managedUserDetails, true);
                    userDetails.accessToken = userAuthDetails.access_token;
                    await this.saveUserInDB(userDetails)
                });
            }

            EventManager.emit('user:switched', userId);
            return res.send({ status: 'success' });
        } catch (err) {
            this.standardLog.error({ id: 'AUTH_CONTROLLER_USER_SESSION_INITIALIZATION_FAILED', message: 'Error while start UserSession', error: err });
            let status = err.status || 500;
            res.status(status);
            return res.send(Response.error('api.user.read', status, err.message));
        }
    }

    public async saveUserInDB(user: ILoggedInUser) {
        const response = await this.userSDK.insertLoggedInUser(user);
        return response;
    }

    public async setUserSession(user: ILoggedInUser) {
        const sessionData = { userId: user.userId, sessionId: uuidv1() };
        await this.userSDK.setUserSession(sessionData);
    }

    public async endSession(req, res) {
        try {
            await this.userSDK.deleteAllLoggedInUsers().catch(error => { this.standardLog.error({ id: 'AUTH_CONTROLLER_USER_DELETE_FAILED', message: 'Unable to delete logged in user data', error }); });
            await this.userSDK.deleteUserSession().catch(error => { this.standardLog.error({id: 'AUTH_CONTROLLER_USER_SESSION_CLEAR_FAILED', message: 'Unable to clear logged in user session', error}); });
            EventManager.emit('user:switched', 'anonymous');
            return res.send({ status: 'success' });
        } catch(err) {
            let status = err.status || 500;
            res.status(status);
            return res.send(Response.error('api.user.endSession', status, err.message));
        }
    }
}
