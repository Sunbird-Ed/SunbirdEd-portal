import Content from "./../controllers/content/content";
import ContentDelete from "./../controllers/content/contentDelete";
import { manifest } from "./../manifest";
import { logger } from "@project-sunbird/logger";
import * as url from "url";
const proxy = require('express-http-proxy');
import * as _ from "lodash";
import config from "./../config";
import TelemetryHelper from "./../helper/telemetryHelper";
import { customProxy } from '../helper/proxyHandler';
import { containerAPI } from '@project-sunbird/OpenRAP/api';

export default (app, proxyURL, contentDownloadManager) => {
    const content = new Content(manifest);
    const defaultProxyConfig = { 
        isUserTokenRequired: true, 
        isAuthTokenRequired: true, 
        bypassLearnerRoute: true 
    };
    const standardLog = containerAPI.getStandardLoggerInstance();
    app.get(
      "/api/content/v1/read/:id",
      async (req, res, next) => {
        standardLog.debug({ id: 'CONTENT_API_REQUEST', message: `Received API call to read Content: ${req.params.id}` });
        const offlineData = await content.getOfflineContents([req.params.id], req.headers["X-msgid"]).catch(error => {
          standardLog.error({ id: 'CONTENT_DB_SEARCH_FAILED', message: `Received error while getting data from course read`, mid: req.headers["X-msgid"], error });
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
      proxy(proxyURL, {
        proxyReqPathResolver(req) {
          const query = require('url').parse(req.url).query;
          return `/api/content/v1/read/${req.params.id}?${query}`;
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
                  standardLog.error({id: 'CONTENT_READ_FAILED', message: `Received error`, error: err, mid: req.headers["X-msgid"] });
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
          standardLog.error({id: 'CONTENT_GET_HIERARCHY_FAILED', message: `Received ERROR while getting data from course hierarchy`, error, mid: req.headers["X-msgid"] });
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
      proxy(proxyURL, {
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
                  standardLog.error({id: 'CONTENT_GET_ONLINE_HIERARCHY_FAILED', message: `Received ERROR while getting data from course hierarchy`, error: err, mid: req.headers["X-msgid"] });
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

    app.post(
        "/api/content/v1/search",
        (req, res, next) => {
          logger.debug(`Received API call to search content`);
          logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
  
          const online = Boolean(_.get(req, "query.online") && req.query.online.toLowerCase() === "true");
          if (enableProxy(req)) {
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
        proxy(proxyURL, {
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
                    standardLog.error({id: 'CONTENT_SEARCH_ONLINE_FAILED', message: `Received ERROR while searching content online`, error: err, mid: req.headers["X-msgid"] });
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
        setConnectionTimeout(1200000),
        content.export.bind(content),
      );
  
      app.post("/api/content/v1/download/list", (req, res) => {
        content.list(req, res);
      });
      app.post("/api/content/v1/download/:id", contentDownloadManager.download.bind(contentDownloadManager));
      app.post("/api/content/v1/download/pause/:downloadId",
      contentDownloadManager.pause.bind(contentDownloadManager));
  
      app.post("/api/content/v1/download/resume/:downloadId",
      contentDownloadManager.resume.bind(contentDownloadManager));
  
      app.post("/api/content/v1/download/cancel/:downloadId",
      contentDownloadManager.cancel.bind(contentDownloadManager));
  
      app.post("/api/content/v1/download/retry/:downloadId",
      contentDownloadManager.retry.bind(contentDownloadManager));
  
      app.post("/api/content/v1/update/:id", contentDownloadManager.update.bind(contentDownloadManager));
  
      const contentDelete = new ContentDelete(manifest);
      app.post("/api/content/v1/delete", contentDelete.delete.bind(contentDelete));

      app.post("/content/composite/v1/search", customProxy(proxyURL, { bypassContentRoute: true }), (req, res) => {
          res.status(res.statusCode).send(res.body);
      });

      app.post("/certreg/v1/certs/search", customProxy(proxyURL), (req, res) => {
          res.status(res.statusCode).send(res.body);
      });
}

const enableProxy = (req) => {
    logger.debug(`ReqId = "${req.headers["X-msgid"]}": Checking the proxy`);
    let flag = false;
    if (req.get("referer")) {
        const refererUrl = new url.URL(req.get("referer"));
        const pathName = refererUrl.pathname;
        flag = !_.startsWith(pathName, "/mydownloads");
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

const setConnectionTimeout = (time: number) => {
    return (req, res, next) => {
      req.connection.setTimeout(time);
      next();
    };
  }

  const telemetryHelper = new TelemetryHelper();
  const constructSearchEdata = (req, proxyData) => {
    const edata = {
      type: "content",
      query: _.get(req, "body.request.query"),
      filters: _.get(req, "body.request.filters"),
      correlationid: _.get(proxyData, "params.msgid"),
      size: _.get(proxyData, "result.count"),
    };
    telemetryHelper.logSearchEvent(edata, "Content");
  };