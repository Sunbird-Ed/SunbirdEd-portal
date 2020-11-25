import { logger } from "@project-sunbird/logger";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as _ from "lodash";
import { Inject } from "typescript-ioc";
import * as url from "url";
import * as uuid from "uuid";
import { ContentDownloadManager } from "./manager/contentDownloadManager";
import contentRoutes from './routes/content';
import dataRoutes from './routes/data';
import desktopRoutes from './routes/desktop';
import playerProxyRoutes from './routes/playerProxy';
import staticRoutes from './routes/static';
import telemetryRoutes from './routes/telemetry';
const proxy = require('express-http-proxy');

export class Router {
  @Inject private contentDownloadManager: ContentDownloadManager;
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
    // portal static routes
    staticRoutes(app, 'content', 'ecars');

    // api's for portal

    app.get(`/device/profile/:id`,
      async (req, res, next) => {
        logger.debug(`Received API call to get device profile`);
        const apiKey = await containerAPI.getDeviceSdkInstance().getToken().catch((err) => {
          logger.error(`Received error while fetching api key in device profile with error: ${err}`);
        });
        req.headers.Authorization = `Bearer ${apiKey}`;
        next();
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/v3/device/profile/:id`;
        },
      }));
      
    contentRoutes(app, proxyUrl, this.contentDownloadManager)
    dataRoutes(app, proxyUrl);
    desktopRoutes(app, proxyUrl);
    telemetryRoutes(app)
    playerProxyRoutes(app, proxyUrl);

    app.all("*", (req, res) => res.redirect("/"));
  }
}
