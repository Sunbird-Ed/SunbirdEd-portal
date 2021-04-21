import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import * as url from "url";
import * as uuid from "uuid";
import { ContentDownloadManager } from "./manager/contentDownloadManager";
import contentRoutes from './routes/content';
import dataRoutes from './routes/data';
import formRoutes from './routes/forms';
import orgRoutes from './routes/organization'
import channelRoutes  from './routes/channel';
import frameworkRoutes from './routes/framework'
import desktopRoutes from './routes/desktop';
import playerProxyRoutes from './routes/playerProxy';
import staticRoutes from './routes/static';
import courseRoutes from './routes/course';
import telemetryRoutes from './routes/telemetry';
import authRoutes from './routes/auth';
import Device from './controllers/device';
import { manifest } from "./manifest";
import Response from './utils/response';
import { addPerfLogForAPICall } from './loaders/logger';
import { StandardLogger } from '@project-sunbird/OpenRAP/services/standardLogger';
const proxy = require('express-http-proxy');

export class Router {
  @Inject private contentDownloadManager: ContentDownloadManager;
  @Inject private standardLog: StandardLogger = containerAPI.getStandardLoggerInstance();

  public init(app: any) {

    const proxyUrl = process.env.APP_BASE_URL;
    this.contentDownloadManager.initialize();
    const telemetryInstance = containerAPI
      .getTelemetrySDKInstance()
      .getInstance();
    const logTelemetryEvent = (req, res, next) => {
      const startHrTime = process.hrtime();
      res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTime =
          (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6) / 1000;
        if (elapsedTime > 1) {
          logger.warn(
            `${req.headers["X-msgid"] || ""} path: ${req.path
            } took ${elapsedTime}s`,
          );
        }

        if (res.statusCode >= 200 && res.statusCode <= 300) {
          const params: object[] = [
            {
              duration: parseFloat(elapsedTime.toFixed(3)),
            },
            {
              protocol: _.toUpper(req.protocol),
            },
            {
              method: req.method,
            },
            {
              url: req.originalUrl,
            },
            {
              status: res.statusCode,
            },
          ];
          const rid = _.get(req, "rid");
          if (rid) {
            params.push({ rid });
          }
          const size = parseInt(res.getHeader("Content-Length"));
          if (size) {
            params.push({ size });
          }

          const xhr = _.get(req, 'headers.accept');
          if (xhr && xhr.indexOf('json') > -1) {
            let apiUrl;
            let routePath = _.get(req, 'route.path');

            if (_.isArray(routePath)) {
             let path = req.path;
             routePath.forEach((item) => {
               const result = item.split(":");

               if (path.startsWith(result[0]) && _.has(req.params, result[1])) {
                apiUrl = result[0];
               }
             }); 
            } else {
              apiUrl = req.path;
            } 

            if (apiUrl) {
              const perfData = {
                time: elapsedTime,
                metaData: { url: apiUrl }
              }
              addPerfLogForAPICall(perfData);
            }
          }
          const logEvent = {
            context: {
              env: "openrap-sunbirded-plugin",
            },
            edata: {
              level: "INFO",
              type: "api_access",
              message: `The api is successfully processed with url ${req.originalUrl} and method ${req.method}`,
              params,
            },
          };
          telemetryInstance.log(logEvent);
        }
      });
      next();
    };
    app.use(logTelemetryEvent);
    const addRequestId = (req, res, next) => {
      req.headers["X-msgid"] = req.get("X-msgid") || uuid.v4();
      next();
    };
    app.use(addRequestId);

    staticRoutes(app, 'content', 'ecars');

    app.get("/device/profile/:id", async (req, res, next) => {
      this.standardLog.debug({ id: 'ROUTES_GET_DEVICE_PROFILE', message: 'Received API call to get device profile data' });
      try {
        const deviceProfile = new Device(manifest);
        const locationData: any = await deviceProfile.getDeviceProfile();
        // set Default state value if offline location data is not available
        let responseObj = { userDeclaredLocation: { 'state': '', 'district': '' } }
        if (locationData) {
          responseObj.userDeclaredLocation.state = _.get(locationData, 'state');
          responseObj.userDeclaredLocation.district = _.get(locationData, 'district');
          return res.send(Response.success("offline.device-profile", responseObj, req));
        } else {
          next();
        }
      } catch (error) {
        next();
      }
    }, proxy(proxyUrl, {
        proxyReqPathResolver(req) { return `/device/profile/:id` },
    }));
    
    app.post(`/device/register/:id`, async(req, res, next) => {
      this.standardLog.debug({ id: 'ROUTES_REGISTER_DEVICE_PROFILE', message: `Received API call to update device profile`, mid: _.get(req, 'params.id')});
      const locationData = _.get(req, "body.request.userDeclaredLocation");
      if (locationData && _.isObject(locationData.state) || !_.isObject(locationData.city)) {
        const deviceProfile = new Device(manifest);
        deviceProfile.updateDeviceProfile(req.body.request);
        containerAPI.getDeviceSdkInstance().register();
        res.status(200).send(Response.success('analytics.device-register', { status: 'success' }, req));
      } else {
        this.standardLog.debug({ id: 'ROUTES_REGISTER_DEVICE_PROFILE_FAILED', message: `Received error while saving in location database`, mid: req.headers["X-msgid"], error: "Invalid location Data" });
        const status = 500;
        res.status(status);
        return res.send(Response.error('analytics.device-register', status));
      }
    });
      
    authRoutes(app, proxyUrl);
    contentRoutes(app, proxyUrl, this.contentDownloadManager)
    dataRoutes(app, proxyUrl);
    formRoutes(app, proxyUrl);
    orgRoutes(app, proxyUrl);
    channelRoutes(app, proxyUrl);
    frameworkRoutes(app, proxyUrl);
    desktopRoutes(app, proxyUrl);
    courseRoutes(app, proxyUrl);
    telemetryRoutes(app)
    playerProxyRoutes(app, proxyUrl);

    app.all("*", (req, res) => res.redirect("/"));
  }
}
