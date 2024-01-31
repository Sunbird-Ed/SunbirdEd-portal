import * as _ from "lodash";
import Response from "./../utils/response";
import { manifest } from "./../manifest";
import AuthController from "../controllers/authController";
import { containerAPI } from '@project-sunbird/OpenRAP/api';
const uuidv1 = require('uuid/v1');
import { ILoggedInUser } from '../../OpenRAP/interfaces/IUser';
import { customProxy } from '../helper/proxyHandler';
import { EventManager } from "@project-sunbird/OpenRAP/managers/EventManager";

export default (app, proxyURL) => {

    const authController = new AuthController(manifest);
    const defaultProxyConfig = { 
        isUserTokenRequired: true, 
        isAuthTokenRequired: true, 
        bypassLearnerRoute: true 
    };
    const standardLog = containerAPI.getStandardLoggerInstance();
    app.post("/api/user/v1/startSession", authController.startUserSession.bind(authController));
    
    app.get("/endSession", authController.endSession.bind(authController));

    app.get(["/learner/user/v3/read/:id", "/learner/user/v4/read/:id", "/learner/user/v5/read/:id"  ], customProxy(proxyURL, defaultProxyConfig), async (req, res) => {
            const userSDK = containerAPI.getUserSdkInstance();
            let user = _.get(res, 'body.result.response');
            if (user) {
                try {
                    const userToken = await userSDK.getUserToken();
                    user.accessToken = userToken;
                    if(user.managedBy) {
                        const allmanagedUser = await userSDK.getAllManagedUsers();
                        const managedUser = allmanagedUser.find((mUser:any) => mUser.identifier === user.identifier)
                        user.managedToken = managedUser.managedToken;
                    }
                    await userSDK.insertLoggedInUser(user);
                    res.status(res.statusCode).send(res.body);
                } catch (err) {
                    standardLog.debug({ id: 'AUTH_DB_READ_FAILED', message: 'Unable to get the user token', error: err });
                    await userSDK.updateLoggedInUser(user);
                    res.status(res.statusCode).send(res.body);
                }
            } else {
                const storedUser = await userSDK.getLoggedInUser(req.params.id);
                res.status(200).send(Response.success("api.user.read", { response: storedUser }, req));
            }
        });

    app.get([
        "/learner/user/v1/feed/:userId", 
        "/learner/notification/v1/feed/read/:id",
        "/learner/certreg/v2/certs/download/:id"
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/certreg/v1/certs/download", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/user/v1/feed/delete", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post("/learner/notification/v1/feed/delete", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });
   
    app.patch("/learner/user/v1/feed/update", customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.patch([
        '/learner/user/v1/update',
        '/learner/user/v3/update',
        "/learner/notification/v1/feed/update",
        '/learner/user/v1/declarations'
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.get("/learner/user/v1/managed/*", customProxy(proxyURL, defaultProxyConfig), async (req, res) => {
        const response = _.get(res, 'body.result.response');
        if (response) {
            _.forEach(_.get(res, 'body.result.response.content'), (managedUser, index) => {
                if (managedUser.managedToken) {
                    delete res.body.result.response.content[index].managedToken
                }
            });
            res.status(res.statusCode).send(res.body);
        } else {
            const userSDK = containerAPI.getUserSdkInstance();
            let users: any = await userSDK.getAllManagedUsers();
            users = _.orderBy(users, ['createdDate'], ['desc'])
            res.status(200).send(Response.success("api.user.managed", { response: { content: users, count: users.length } }, req));
        }
    });

    app.get([
        "/learner/isUserExists/user/v1/get/phone/*",
        "/learner/isUserExists/user/v1/get/email/*",
    ], (req, res, next) => {
        if (req.url.indexOf('isUserExists') > -1) {
            req.originalUrl = req.originalUrl.replace('isUserExists/', '');
        }
        next();
    }, customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        const response = _.get(res, 'body.result.response');
        if (response) {
            res.body.result.response = { id: '', rootOrgId: '', isUserExists: '' };
            if (_.get(res, 'body.responseCode') === 'OK') {
                res.body.result.response.id = response.id;
                res.body.result.response.rootOrgId = response.rootOrgId;
                res.body.result.response.isUserExists = true;
            }
        }
        res.status(res.statusCode).send(res.body);
    });

    app.post([
        "/learner/otp/v1/generate", 
        "/learner/otp/v1/verify", 
        "/learner/user/v1/consent/read",
        "/learner/user/v1/consent/update",
        "/learner/user/v1/tnc/accept",
        "/learner/user/v1/delete"
    ], customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });

    app.post(["/learner/user/v4/create", "/learner/user/v5/create", "/learner/user/v1/managed/create"], customProxy(proxyURL, defaultProxyConfig),async (req, res) => {
        const userSDK: any = containerAPI.getUserSdkInstance();
        const userId = _.get(res, 'body.result.userId');
        const userToken: string = await userSDK.getUserToken().catch(error => { 
            standardLog.debug({ id: 'AUTH_DB_READ_FAILED', message: 'Unable to get the user token', error });
        });
        const user: ILoggedInUser = {
            id: userId,
            userId,
            identifier: userId,
            firstName: _.get(req, 'body.request.firstName'),
            accessToken: userToken
        }
        await authController.saveUserInDB(user);
        await authController.setUserSession(userId);
        res.status(res.statusCode).send(res.body);
    });


  app.get('/user/v1/switch/:userId', async (req, res) => {
    const userSDK = containerAPI.getUserSdkInstance();
    if (!req.params.userId) {
      standardLog.info({ id: 'AUTH_USER_SWITCH_FAILED', message: 'Switch user rejected missing userID' });
      res.status(400).send(Response.error("api.user.switch", 400, "failed to switch user", "BAD_REQUEST"));
    }

    try {
      const sessionData = { userId: req.params.userId, sessionId: uuidv1() };
      await userSDK.setUserSession(sessionData);
      const result = {
        response: "Success",
        userSid: sessionData.sessionId
      }
      
      EventManager.emit('user:switched', req.params.userId);
      res.status(200).send(Response.success("api.user.switch", result, req));
    } catch (error) {
      standardLog.error({ id: 'AUTH_USER_SWITCH_FAILED', message: 'Error while switching user', error });
      res.status(500).send(Response.error("api.user.switch", 500, "failed to switch user"));
    }
  });

    app.post(["/learner/anonymous/otp/v1/generate"], (req, res, next) => {
        if (req.url.indexOf('anonymous') > -1) {
            req.originalUrl = req.originalUrl.replace('anonymous/', '');
        }
        next();
    }, customProxy(proxyURL, defaultProxyConfig), (req, res) => {
        res.status(res.statusCode).send(res.body);
    });
}