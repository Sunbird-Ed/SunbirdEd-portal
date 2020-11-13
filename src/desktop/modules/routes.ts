import { ContentDownloadManager } from "./manager/contentDownloadManager";
import { Inject } from "typescript-ioc";
import { logger } from "@project-sunbird/logger";
import * as cheerio  from "cheerio";
const proxy = require('express-http-proxy');
import * as _ from "lodash";
import { containerAPI } from "@project-sunbird/OpenRAP/api";
import * as path from "path";
import * as url from "url";
import * as uuid from "uuid";
import * as inline from "web-resource-inliner";
import config from "./config";
import DesktopAppUpdate from "./controllers/appUpdate";
import { Channel } from "./controllers/channel";
import Content from "./controllers/content/content";
import ContentDelete from "./controllers/content/contentDelete";
import ContentLocation from "./controllers/contentLocation";
import { Faqs } from "./controllers/faqs";
import { Form } from "./controllers/form";
import { Framework } from "./controllers/framework";
import { Location } from "./controllers/location";
import { Organization } from "./controllers/organization";
import { ResourceBundle } from "./controllers/resourceBundle";
import Telemetry from "./controllers/telemetry";
import Tenant from "./controllers/tenant";
import User from "./controllers/user";
import TelemetryHelper from "./helper/telemetryHelper";
import Response from "./utils/response";
import { manifest }  from "./manifest";
let telemetry;

export class Router {
  @Inject private contentDownloadManager: ContentDownloadManager;
  public init(app: any) {
    const proxyUrl = process.env.APP_BASE_URL;
    this.contentDownloadManager.initialize();
    const telemetryInstance = containerAPI
      .getTelemetrySDKInstance()
      .getInstance();
    const enableProxy = (req) => {
      logger.debug(`ReqId = "${req.headers["X-msgid"]}": Checking the proxy`);
      let flag = false;
      if (req.get("referer")) {
        const refererUrl = new url.URL(req.get("referer"));
        const pathName = refererUrl.pathname;
        flag = _.startsWith(pathName, "/browse");
      }
      return flag;
    };

    const updateRequestBody = (req) => {
      logger.debug(
        `ReqId = "${req.headers["X-msgid"]}": Updating request body filters`,
      );
      if (_.get(req, "body.request.filters")) {
        req.body.request.filters.compatibilityLevel = {
          "<=": config.get("CONTENT_COMPATIBILITY_LEVEL"),
        };
      }
      return req;
    };

    const constructSearchEdata = (req, proxyData) => {
      const telemetryHelper = new TelemetryHelper();
      const edata = {
        type: "content",
        query: _.get(req, "body.request.query"),
        filters: _.get(req, "body.request.filters"),
        correlationid: _.get(proxyData, "params.msgid"),
        size: _.get(proxyData, "result.count"),
      };
      telemetryHelper.logSearchEvent(edata, "Content");
    };

    const logTelemetryEvent = (req, res, next) => {
      const startHrTime = process.hrtime();
      res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTime =
          (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6) / 1000;
        if (elapsedTime > 1) {
          logger.warn(
            `${req.headers["X-msgid"] || ""} path: ${
            req.path
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
    app.all(
      [
        "/",
        "/play/*",
        "/import/content",
        "/get",
        "/get/*",
        "/browse",
        "/browse/*",
        "/search/*",
        "/help-center",
        "/help-center/*",
        "/profile",
        "/profile/*",
      ],
      async (req, res) => {
        console.log('default path: ', path.join(__dirname, "..", "public", "portal", "index.ejs"))
        const locals = await this.getLocals(manifest);
        _.forIn(locals, (value, key) => {
          res.locals[key] = value;
        });
        res.render(
          path.join(__dirname, "..", "public", "portal", "index.ejs"),
        );
      },
    );

    // api's for portal

    const resourcebundle = new ResourceBundle(manifest);
    app.get("/resourcebundles/v1/read/:id", (req, res) => {
      resourcebundle.get(req, res);
    });

    const organization = new Organization(manifest);
    app.post(
      "/api/org/v1/search",
      (req, res, next) => {
        logger.debug(`Received API call to search organisations`);

        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
        if (enableProxy(req)) {
          logger.info(`Proxy is Enabled `);
          next();
        } else {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Search organisations`,
          );
          return organization.search(req, res);
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/org/v1/search`;
        },
      }),
    );

    const form = new Form(manifest);
    app.post(
      "/api/data/v1/form/read",
      (req, res, next) => {
        logger.debug(`Received API call to read formdata`);
        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
        if (enableProxy(req)) {
          logger.info(`Proxy is Enabled `);
          next();
        } else {
          logger.debug(`ReqId = "${req.headers["X-msgid"]}": Search form data`);
          return form.search(req, res);
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/data/v1/form/read`;
        },
      }),
    );

    const channel = new Channel(manifest);
    app.get(
      "/api/channel/v1/read/:id",
      (req, res, next) => {
        logger.debug(
          `Received API call to get channel data for channel with Id: ${req.params.id}`,
        );

        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
        if (enableProxy(req)) {
          logger.info(`Proxy is Enabled `);
          next();
        } else {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Get channel data for channel with Id:${req.params.id}`,
          );
          return channel.get(req, res);
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/channel/v1/read/${req.params.id}`;
        },
      }),
    );

    const faqs = new Faqs(manifest);
    app.get("/api/faqs/v1/read/:language", faqs.read.bind(faqs));
    const ticketSDK = containerAPI.getTicketSdkInstance();
    app.post("/api/help/v1/report/issue", async (req, res) => {
      ticketSDK.createTicket(req.body).then((successRes) => {
        res.send(Response.success("api.report.issue", successRes, req));
      }).catch((errorRes) => {
        res.status(errorRes.status || 500).send(Response.error("api.report.issue", errorRes.status, errorRes.message, errorRes.code));
      });
    });
    const framework = new Framework(manifest);
    app.get(
      "/api/framework/v1/read/:id",
      (req, res, next) => {
        logger.debug(
          `Received API call to get framework data for framework with Id: ${req.params.id}`,
        );

        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
        if (enableProxy(req)) {
          logger.info(`Proxy is Enabled `);
          next();
        } else {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Get Framework data for Framework with Id:${req.params.id}`,
          );
          return framework.get(req, res);
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/framework/v1/read/${req.params.id}`;
        },
      }),
    );

    const tenant = new Tenant();
    app.get(
      ["/v1/tenant/info/", "/v1/tenant/info/:id"],
      (req, res, next) => {
        logger.debug(
          `Received API call to get tenant data ${_.upperCase(
            _.get(req, "params.id"),
          )}`,
        );

        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
        if (enableProxy(req)) {
          logger.info(`Proxy is Enabled `);
          next();
        } else {
          logger.debug(`ReqId = "${req.headers["X-msgid"]}": Get tenant Info`);
          tenant.get(req, res);
          return;
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/v1/tenant/info/`;
        },
      }),
    );

    const content = new Content(manifest);
    app.get(
      "/api/content/v1/read/:id",
      async (req, res, next) => {
        logger.debug(`Received API call to read Content: ${req.params.id}`);
        const offlineData = await content.getOfflineContents([req.params.id], req.headers["X-msgid"]).catch(error => {
          logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while getting data from course read`, error)
        });
        if (enableProxy(req) && offlineData.docs.length <= 0 ) {
          logger.info(`Proxy is Enabled`);
          next();
        } else {
          logger.info(`ReqId = "${req.headers["X-msgid"]}": Proxy is disabled`);
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Calling Content get method to get Content: ${req.params.id} `,
          );
          content.get(req, res);
          return;
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/content/v1/read/${req.params.id}?fields=${req.query.fields}`;
        },
        userResDecorator(proxyRes, proxyResData, req) {
          return new Promise(function(resolve) {
            logger.info(`Proxy is Enabled for Content: ${req.params.id}`);
            logger.debug(
              `ReqId = "${req.headers["X-msgid"]}": Convert buffer data to json`,
            );
            const proxyData = content.convertBufferToJson(proxyResData, req);
            const contents = _.get(proxyData, "result.content");
            if (!_.isEmpty(contents)) {
              logger.debug(
                `ReqId = "${req.headers["X-msgid"]}": Calling decorateContent to decorate a content`,
              );
              content
                .decorateContentWithProperty([contents], req.headers["X-msgid"])
                .then((data) => {
                  logger.info(
                    `ReqId = "${req.headers["X-msgid"]}": Resolving Data after decorating content `,
                  );
                  proxyData.result.content = data[0];
                  resolve(proxyData);
                })
                .catch((err) => {
                  logger.error(
                    `ReqId = "${req.headers["X-msgid"]}": Received error err.message`,
                    err,
                  );
                  resolve(proxyData);
                });
            } else {
              logger.info(
                `ReqId = "${req.headers["X-msgid"]}": Resolving data if there in no content in request`,
              );
              resolve(proxyData);
            }
          });
        },
      }),
    );

    app.get(
      "/api/course/v1/hierarchy/:id",
      async (req, res, next) => {
        logger.debug(
          `Received API call to get Course hierarchy: ${req.params.id}`,
        );

        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
        const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
        const isProxyEnabled = _.has(req, "query.online") ? online : enableProxy(req);
        const offlineData = await content.getOfflineContents([req.params.id], req.headers["X-msgid"]).catch((error) => {
          logger.error(`ReqId = "${req.headers["X-msgid"]}": Received while getting data from course hierarchy`, error);
        });
        if (isProxyEnabled && offlineData.docs.length <= 0 ) {
          logger.info(`Proxy is Enabled`);
          next();
        } else {
          logger.info(`ReqId = "${req.headers["X-msgid"]}": Proxy is disabled`);
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Calling Content get method to get CourseHierarchy: ${req.params.id} `,
          );
          content.get(req, res);
          return;
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          const queryParams = req.url.split("?")[1];
          return queryParams ? `/api/course/v1/hierarchy/${req.params.id}?${queryParams}` : `/api/course/v1/hierarchy/${req.params.id}`;
        },
        userResDecorator(proxyRes, proxyResData, req) {
          return new Promise(function(resolve) {
            logger.info(`Proxy is Enabled for Content: ${req.params.id}`);
            logger.debug(
              `ReqId = "${req.headers["X-msgid"]}": Convert buffer data to json`,
            );
            const proxyData = content.convertBufferToJson(proxyResData, req);
            const contents = _.get(proxyData, "result.content");
            if (!_.isEmpty(contents)) {
              logger.debug(
                `ReqId = "${req.headers["X-msgid"]}": Calling decorateDialCodeContent to decorate a content`,
              );
              content
                .decorateDialCodeContents(contents, req.headers["X-msgid"])
                .then((data) => {
                  logger.info(
                    `ReqId = "${req.headers["X-msgid"]}": Resolving Data after decorating DialCodecontent `,
                  );
                  proxyData.result.content = data[0];
                  resolve(proxyData);
                })
                .catch((err) => {
                  logger.error(
                    `ReqId = "${req.headers["X-msgid"]}": Received error err.message`,
                    err,
                  );
                  resolve(proxyData);
                });
            } else {
              logger.info(
                `ReqId = "${req.headers["X-msgid"]}": Resolving data if there in no content in course hierarchy request`,
              );
              resolve(proxyData);
            }
          });
        },
      }),
    );

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

    app.post(`/api/data/v1/dial/assemble`,
      (req, res, next) => {
        const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
        if (online) {
          req = updateRequestBody(req);
          next();
        } else {
          content.searchDialCode(req, res);
          return;
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/data/v1/dial/assemble`;
        },
        userResDecorator(proxyRes, proxyResData, req) {
          return new Promise(function(resolve) {
            const proxyData = content.convertBufferToJson(proxyResData, req);
            const sections = _.get(proxyData, "result.response.sections");
            if (!_.isEmpty(_.get(sections[0], `contents`))) {
              content
                .decorateDialSearchContents(sections, req.headers["X-msgid"])
                .then((data) => {
                  proxyData.result.response.sections = data;
                  resolve(proxyData);
                })
                .catch((err) => {
                  resolve(proxyData);
                });
            } else {
              resolve(proxyData);
            }
          });
        },
      }));

    app.post(
      "/api/content/v1/search",
      (req, res, next) => {
        logger.debug(`Received API call to search content`);
        logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);

        const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");

        if (online) {
          logger.info(`Proxy is Enabled `);
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Update requestbody`,
          );
          req = updateRequestBody(req);
          logger.info(
            `ReqId = "${req.headers["X-msgid"]}": Request body filters updated successfully`,
          );
          next();
        } else {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Calling content search method`,
          );
          content.search(req, res);
          return;
        }
      },
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          return `/api/content/v1/search`;
        },
        userResDecorator(proxyRes, proxyResData, req) {
          return new Promise(function(resolve) {
            logger.info(`Proxy is Enabled for Content`);
            logger.debug(
              `ReqId = "${req.headers["X-msgid"]}": Convert buffer data to json`,
            );
            const proxyData = content.convertBufferToJson(proxyResData, req);
            constructSearchEdata(req, proxyData);

            const contents = _.get(proxyData, "result.content");
            if (!_.isEmpty(contents)) {
              logger.debug(
                `ReqId = "${req.headers["X-msgid"]}": Calling decorateContent to decorate contents in contentSearch`,
              );
              content
                .decorateContentWithProperty(contents, req.headers["X-msgid"])
                .then((data) => {
                  logger.info(
                    `ReqId = "${req.headers["X-msgid"]}": Resolving Data after decorating contents in contentSearch `,
                  );
                  proxyData.result.content = data;
                  resolve(proxyData);
                })
                .catch((err) => {
                  logger.error(
                    `ReqId = "${req.headers["X-msgid"]}": Received error err.message`,
                    err,
                  );
                  resolve(proxyData);
                });
            } else {
              logger.info(
                `ReqId = "${req.headers["X-msgid"]}": Resolving data if there in no content in contentSearch request`,
              );
              resolve(proxyData);
            }
          });
        },
      }),
    );

    app.post("/api/content/v1/import", content.import.bind(content));
    app.post(
      "/api/content/v1/import/pause/:importId",
      content.pauseImport.bind(content),
    );
    app.post(
      "/api/content/v1/import/resume/:importId",
      content.resumeImport.bind(content),
    );
    app.post(
      "/api/content/v1/import/cancel/:importId",
      content.cancelImport.bind(content),
    );
    app.post(
      "/api/content/v1/import/retry/:importId",
      content.retryImport.bind(content),
    );
    app.get(
      "/api/content/v1/export/:id",
      this.setConnectionTimeout(1200000),
      content.export.bind(content),
    );

    app.post("/api/content/v1/download/list", (req, res) => {
      content.list(req, res);
    });
    app.post("/api/content/v1/download/:id", this.contentDownloadManager.download.bind(this.contentDownloadManager));
    app.post("/api/content/v1/download/pause/:downloadId",
    this.contentDownloadManager.pause.bind(this.contentDownloadManager));

    app.post("/api/content/v1/download/resume/:downloadId",
    this.contentDownloadManager.resume.bind(this.contentDownloadManager));

    app.post("/api/content/v1/download/cancel/:downloadId",
    this.contentDownloadManager.cancel.bind(this.contentDownloadManager));

    app.post("/api/content/v1/download/retry/:downloadId",
    this.contentDownloadManager.retry.bind(this.contentDownloadManager));

    app.post("/api/content/v1/update/:id", this.contentDownloadManager.update.bind(this.contentDownloadManager));

    telemetry = new Telemetry(manifest);

    app.post(
      ["/content/data/v1/telemetry", "/action/data/v3/telemetry"],
      (req, res) => {
        telemetry.addEvents(req, res);
      },
    );

    const desktopAppUpdate = new DesktopAppUpdate(manifest);
    app.get("/api/desktop/v1/update",
      desktopAppUpdate.getDesktopAppUpdate.bind(desktopAppUpdate),
    );

    app.get("/api/app/v1/info",
      desktopAppUpdate.getAppInfo.bind(desktopAppUpdate),
    );

    app.get("/api/desktop/v1/system-info", async (req, res) => {
      try {
        const contentLocation = new ContentLocation(manifest.id);
        const contentBasePath = await contentLocation.get();
        const systemInfo: any = await containerAPI
          .getSystemSDKInstance(manifest.id)
          .getDeviceInfo();
        systemInfo.contentBasePath = contentBasePath;
        return res.send(Response.success("api.desktop.system-info", systemInfo, req));
      } catch (err) {
        logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while processing desktop app systemInfo request where err = ${err}`);
        res.status(500);
        return res.send(Response.error("api.desktop.system-info", 500));
      }
    });

    app.post("/api/desktop/v1/change-content-location", async (req, res) => {
      try {
        const contentPath = _.get(req.body, "request.path");
        const contentLocation = new ContentLocation(manifest.id);
        const status = contentLocation.set(app, path.join(contentPath));
        if (status) {
          return res.send(Response.success("api.desktop.change-content-location", status, req));
        } else {
          res.status(500);
          return res.send(Response.error("api.desktop.change-content-location", 500));
        }
      } catch (err) {
        logger.error(`ReqId = "${req.headers["X-msgid"]}": Received error while processing desktop app systemInfo request where err = ${err}`);
        res.status(500);
        return res.send(Response.error("api.desktop.change-content-location", 500));
      }
    });

    const user = new User(manifest);
    app.post("/api/desktop/user/v1/create",
      user.create.bind(user),
    );

    app.get("/api/desktop/user/v1/read",
      user.read.bind(user),
    );
    app.post(
      "/api/desktop/user/v1/update", user.update.bind(user),
    );

    const location = new Location(manifest);
    app.post(
      "/api/data/v1/location/search", location.proxyToAPI.bind(location), location.search.bind(location),
    );
    app.post(
      "/api/data/v1/location/save", location.saveLocation.bind(location),
    );
    app.get("/api/data/v1/location/read", location.get.bind(location));

    app.get("/learner/data/v1/system/settings/get/custodianOrgId", (req, res) => {
      const resObj = {
        response: {
          id: "custodianOrgId",
          field: "custodianOrgId",
          value: process.env.CUSTODIAN_ORG,
        },
      };

      return res.send(Response.success("api.system.settings.get.custodianOrgId", resObj, req));
    });
    const contentDelete = new ContentDelete(manifest);
    app.post("/api/content/v1/delete", contentDelete.delete.bind(contentDelete));

    app.get("/api/telemetry/v1/info", (req, res) => {
      if (_.get(req, "query.syncConfig") === "true") {
        telemetry.getTelemetrySyncSetting(req, res);
      } else {
        telemetry.getInfo(req, res);
      }
    });
    app.post("/api/telemetry/v1/export", telemetry.export.bind(telemetry));
    app.post("/api/telemetry/v1/import", telemetry.import.bind(telemetry));
    app.post("/api/telemetry/v1/import/retry/:importId", telemetry.retryImport.bind(telemetry));
    app.post("/api/telemetry/v1/list", telemetry.list.bind(telemetry));
    app.post("/api/telemetry/v1/config", telemetry.setTelemetrySyncSetting.bind(telemetry));
    app.post("/api/desktop/v1/sync", telemetry.sync.bind(telemetry));

    app.get("/api/app/v1/terms_of_use", proxy(`${proxyUrl}`, {
      proxyReqPathResolver() {
          return `/term-of-use.html`;
      }, userResDecorator(proxyRes, proxyResData) {
          return new Promise(function(resolve) {
            const proxyData = proxyResData.toString();
            inline.html({
                fileContent: proxyData,
                strict: false,
                relativeTo: process.env.APP_BASE_URL,
            }, function(err, result) {
                const $ = cheerio.load(result);
                $(`#header`).replaceWith(`<header id="header" style="display:none"></header>`);
                $(`#footer`).replaceWith(`<footer id="footer" style="display:none"></footer>`);
                $("#terms-of-use").removeClass("header-gap");
                resolve($.html());
            });
          });
      },
  }));

    app.use(
      "/content-plugins/*",
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Parsing content-plugin urls`,
          );
          return require("url").parse(proxyUrl + req.originalUrl).path;
        },
      }),
    );

    app.use(
      "/assets/public/*",
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Parsing assets/public urls`,
          );
          return require("url").parse(proxyUrl + req.originalUrl).path;
        },
      }),
    );

    app.use(
      "/contentPlayer/preview/*",
      proxy(proxyUrl, {
        proxyReqPathResolver(req) {
          logger.debug(
            `ReqId = "${req.headers["X-msgid"]}": Parsing contentPlayer/preview/ urls`,
          );
          return require("url").parse(proxyUrl + req.originalUrl).path;
        },
      }),
    );
  }

  public setConnectionTimeout(time: number) {
    return (req, res, next) => {
      req.connection.setTimeout(time);
      next();
    };
  }

  public async getLocals(manifest) {
    const deviceId = await containerAPI
      .getSystemSDKInstance(manifest.id)
      .getDeviceId();
    const locals: any = {};
    locals.userId = null;
    locals.sessionId = null;
    locals.cdnUrl = "";
    locals.theme = "";
    locals.defaultPortalLanguage = "en";
    locals.instance = process.env.APP_NAME;
    locals.appId = process.env.APP_ID;
    locals.defaultTenant = process.env.CHANNEL || "sunbird";
    locals.exploreButtonVisibility = "true";
    locals.helpLinkVisibility = null;
    locals.defaultTenantIndexStatus = null;
    locals.extContWhitelistedDomains = null;
    locals.buildNumber = process.env.APP_VERSION;
    locals.apiCacheTtl = "5";
    locals.cloudStorageUrls = null;
    locals.userUploadRefLink = null;
    locals.googleCaptchaSiteKey = null;
    locals.videoMaxSize = null;
    locals.reportsLocation = null;
    locals.deviceRegisterApi = "/api/v1/device/registry/";
    locals.playerCdnEnabled = "";
    locals.previewCdnUrl = "";
    locals.cdnWorking = null;
    locals.offlineDesktopAppTenant = "";
    locals.offlineDesktopAppVersion = "";
    locals.offlineDesktopAppReleaseDate = "";
    locals.offlineDesktopAppSupportedLanguage = "";
    locals.offlineDesktopAppDownloadUrl = "";
    locals.logFingerprintDetails = "";
    locals.deviceId = deviceId;
    locals.deviceProfileApi = "/api/v3/device/profile";
    locals.deviceApi = `${process.env.APP_BASE_URL}/api/`;
    locals.baseUrl = process.env.APP_BASE_URL;
    return locals;
  }
}
