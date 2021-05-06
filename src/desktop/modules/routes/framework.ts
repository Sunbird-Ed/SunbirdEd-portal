import { Framework } from "./../controllers/framework";
import { logger } from "@project-sunbird/logger";
import { manifest } from "./../manifest";
import { containerAPI } from '@project-sunbird/OpenRAP/api';
const proxy = require('express-http-proxy');

export default (app, proxyURL) => {
    const standardLog = containerAPI.getStandardLoggerInstance();
    const framework = new Framework(manifest);
    app.get(
        "/api/framework/v1/read/:id",
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/framework/v1/read/${req.params.id}`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`While getting framework data from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const frameworkResponse = JSON.parse(proxyResData.toString('utf8'));
                        framework.upsert(frameworkResponse);
                    } catch (error) {
                        standardLog.error({ id: 'FRAMEWORK_READ_FAILED', message: `Unable to parse or do DB update of framework data after fetching from online`, error });
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res, next) => {
            logger.debug(
                `Received API call to get framework data for framework with Id: ${req.params.id}`,
            );
            logger.debug(
                `ReqId = "${req.headers["X-msgid"]}": Get Framework data for Framework with Id:${req.params.id}`,
            );
            return framework.get(req, res);
        },

    );
}