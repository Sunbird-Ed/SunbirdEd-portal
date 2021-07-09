import { containerAPI } from "@project-sunbird/OpenRAP/api";
import { HTTPService } from "@project-sunbird/OpenRAP/services/httpService";
import * as _ from 'lodash';
import { defer, of } from 'rxjs';
import { delay, mergeMap, retryWhen, take, tap } from 'rxjs/operators';
import { IHttpRequestConfig } from '../../OpenRAP/dist/services/httpService/index';
import Response from "../utils/response";
const { logger } = require('@project-sunbird/logger');
const http = require('http');
const https = require('https');

const decorateRequest = async (request, options) => {
  const standardLog = containerAPI.getStandardLoggerInstance();
  const { headers } = request;
  const userSDK: any = containerAPI.getUserSdkInstance();
  const channel = _.get(headers, 'X-Channel-Id') || process.env.CHANNEL;

  if (channel && !_.get(headers, 'X-Channel-Id')) {
    headers['X-Channel-Id'] = channel;
  }
  if (!headers['X-App-Id']) {
    headers['X-App-Id'] = process.env.APP_VERSION;
  }

  if (options.isUserTokenRequired) {
    const loggedInUserSession: any = await userSDK.getUserSession().catch(error => { 
      standardLog.error({ id: 'PROXY_HANDLER_READ_USER_SESSION_FAILED', message: 'Received error while fetching current user session', error });
    });
    const userToken: any = await userSDK.getUserToken().catch(error => { 
      standardLog.error({ id: 'PROXY_HANDLER_READ_USER_TOKEN_FAILED', message: 'Received error while fetching current user token', error });
    })
    if (loggedInUserSession) {
      const userId = loggedInUserSession.userId;
      if (loggedInUserSession.userId) {
        headers['X-Authenticated-Userid'] = userId;
      }
      if (userToken) {
        headers['x-authenticated-user-token'] = userToken;
      }
    }
  }
  

  if (options.isAuthTokenRequired) {
    const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
      standardLog.error({ id: 'PROXY_HANDLER_AUTH_TOKEN_FETCH_FAILED', message: 'Received error while fetching api key in getUser', error: err });
    });
    headers.Authorization = `Bearer ${apiKey}`;
  }

  headers['connection'] = 'keep-alive';
  headers['Content-Type'] = 'application/json'
  return headers;
}

const resolveRequestPath = (host, request, options) => {
  if (_.get(options, 'bypassLearnerRoute') && request.originalUrl.includes('/learner')) {
    return `${host}${request.originalUrl.replace('/learner/', '/api/')}`
  }
  if (_.get(options, 'bypassContentRoute') && request.originalUrl.includes('/content')) {
    return `${host}${request.originalUrl.replace('/content/', '/api/')}`
  }
  return `${host}${request.originalUrl}`;
}

const getNewAuthToken = async () => {
  const standardLog = containerAPI.getStandardLoggerInstance();
  await containerAPI.getDeviceSdkInstance().clearToken();
  await containerAPI.getDeviceSdkInstance().getToken();
  return containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
    standardLog.error({ id: 'PROXY_HANDLER_AUTH_TOKEN_FETCH_FAILED', message: 'Received error while fetching api key in getUser', error: err });
  });
}

const addAgent = (proxyURL, config) => {
  if (proxyURL.startsWith('https')) {
    config.httpsAgent = new https.Agent({ rejectUnauthorized: false });
  } else {
    config.httpAgent = new http.Agent({ rejectUnauthorized: false });
  }

  return config;
}

// Error response for 404
const getErrorObj = () => {
  return {
    ts: new Date().toISOString(),
    params: {
      status: "failed",
      err: "ERR_DATA_NOT_FOUND",
      errmsg: "Data not found",
    },
    responseCode: "RESOURCE_NOT_FOUND",
    result: {},
  };
}

const getAPIId = (host, requestUrl) => {
  const url  = requestUrl.split('?')[0];
  return _.replace(url, `${host}/`, '').split('/').join('.');
}

export const customProxy = (host, options = {}) => {
  return async (req, res, next) => {
    const { method } = req;
    const headers = await decorateRequest(req, options);
    const proxyURL = resolveRequestPath(host, req, options);
    const apiId = getAPIId(host, proxyURL);

    let config: IHttpRequestConfig = {
      headers: headers,
      responseType: 'json'
    }

    config = addAgent(proxyURL, config);
    defer(() => {
      switch (method) {
        case "GET": return HTTPService.get(proxyURL, config)
        case "POST": return HTTPService.post(proxyURL, req.body, config)
        case "PUT": return HTTPService.put(proxyURL, req.body, config)
        case "PATCH": return HTTPService.patch(proxyURL, req.body, config)
        case "DELETE": return HTTPService.delete(proxyURL, config)
        default: {
          logger.debug("Invalid Method");
          next();
        }
      }
    }).pipe(retryWhen(errors =>
      errors.pipe(
        mergeMap(async (error) => {
          const { response } = error;
          // Handle Unauthorized AuthToken
          if (_.get(response, 'status') === 401 && _.lowerCase(_.get(response, 'data.message')) === 'unauthorized') {
            try {
              const apiKey = await getNewAuthToken();
              config.headers.Authorization = `Bearer ${apiKey}`;
              return of(error)
            } catch (err) {
              throw ({ response: error.response })
            }
          } else if (_.get(response, 'status') === 404) {
            response.data = response.data || getErrorObj();
            throw ({ response })
          } else {
            throw ({ response })
          }
        }),
        tap(val => logger.log("Retrying API request")),
        delay(1000),
        take(2)
      )
    )).subscribe((resp) => {
      res.body = resp.data;
      res.headers = resp.headers;
      next();
    }, error => {
      const response = _.get(error, 'response');
      res.body = _.get(response, 'data') || {};
      res.headers = _.get(response, 'headers');
      res.statusCode = _.get(response, 'status');
      res.ok = false;
      res.statusText = _.get(response, 'statusText');

      if (_.isEmpty(res.body) && !res.statusCode) {
        res.body = Response.error(apiId, 500);
        res.statusCode = 500;
      }
      next();
    });
  };
};
