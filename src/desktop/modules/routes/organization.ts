import { Organization } from "./../controllers/organization";
import { manifest } from "./../manifest";
import { logger } from "@project-sunbird/logger";
import { containerAPI } from '@project-sunbird/OpenRAP/api';
const proxy = require('express-http-proxy');

export default (app, proxyURL) => {
    const standardLog = containerAPI.getStandardLoggerInstance();
    const organization = new Organization(manifest);
    app.post(
        "/api/org/v1/search",
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/org/v1/search`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`While getting organization data from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const orgResponse = JSON.parse(proxyResData.toString('utf8'));
                        organization.upsert(orgResponse);
                    } catch (error) {
                        standardLog.error({ id: 'ORGANIZATION_SEARCH_FAILED', message: `Unable to parse or do DB update of organization data after fetching from online`, error });
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res) => {
            logger.debug(`Received API call to search organisations`);
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
                return organization.search(req, res);
        }
    );
    app.post(
        "/api/org/v2/search",
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/org/v2/search`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`While getting organization data from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const orgResponse = JSON.parse(proxyResData.toString('utf8'));
                        organization.upsert(orgResponse);
                    } catch (error) {
                        standardLog.error({ id: 'ORGANIZATION_SEARCH_FAILED', message: `Unable to parse or do DB update of organization data after fetching from online`, error });
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res) => {
            logger.debug(`Received API call to search organisations`);
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
                return organization.search(req, res);
        }
    );
}