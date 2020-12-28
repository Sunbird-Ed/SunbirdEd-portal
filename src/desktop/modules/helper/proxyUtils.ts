import * as _ from "lodash";
const { logger } = require('@project-sunbird/logger');
const http = require('http');
const https = require('https');
const httpAgent = new http.Agent({ keepAlive: true, });
const httpsAgent = new https.Agent({ keepAlive: true, });
import { containerAPI } from "@project-sunbird/OpenRAP/api";

export const decorateRequestHeaders = function (upstreamUrl = "") {
  return async function (proxyReqOpts, srcReq) {
    const userSDK: any = containerAPI.getUserSdkInstance();
    const loggedInUserSession: any = await userSDK.getUserSession().catch(error => { logger.debug("User not logged in", error);})
    var userId;
    var channel = _.get(srcReq, 'headers.X-Channel-Id') || process.env.CHANNEL
    var sessionId = _.get(loggedInUserSession, 'userid') || "";
    proxyReqOpts.headers['X-Session-Id'] = sessionId;
    if (channel && !srcReq.get('X-Channel-Id')) {
      proxyReqOpts.headers['X-Channel-Id'] = channel
    }
    
    if (loggedInUserSession) {
      userId =loggedInUserSession.userId
      if (userId) { 
        proxyReqOpts.headers['X-Authenticated-Userid'] = userId 
      }
    }
    if(!srcReq.get('X-App-Id')){
      proxyReqOpts.headers['X-App-Id'] = process.env.APP_VERSION
    }
    // if (srcReq.session.managedToken) {
    //   proxyReqOpts.headers['x-authenticated-for'] = srcReq.session.managedToken
    // }
    const userToken: any = await userSDK.getUserToken().catch(error => { logger.debug("Unable to get the user token", error);})
    if (userToken) {
      proxyReqOpts.headers['x-authenticated-user-token'] = userToken
    }
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      logger.error(`Received error while fetching device token with error: ${err}`);
    });
    proxyReqOpts.headers.Authorization = 'Bearer ' + apiKey;
    proxyReqOpts.rejectUnauthorized = false
    proxyReqOpts.agent = upstreamUrl.startsWith('https') ? httpsAgent : httpAgent;
    proxyReqOpts.headers['connection'] = 'keep-alive';

    return proxyReqOpts;
  }
}
