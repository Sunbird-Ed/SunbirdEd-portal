import { Form } from "./../controllers/form";
import { logger } from "@project-sunbird/logger";
import { manifest } from "./../manifest";
const proxy = require('express-http-proxy');
import { containerAPI } from '@project-sunbird/OpenRAP/api';

export default (app, proxyURL) => {
const standardLog = containerAPI.getStandardLoggerInstance();
const form = new Form(manifest);
    app.post(["/api/data/v1/form/read", "/learner/data/v1/form/read" ],
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/data/v1/form/read`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`While getting form data from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const formResp = JSON.parse(proxyResData.toString('utf8'));
                        form.upsert(formResp);
                    } catch (error) {
                        standardLog.error({ id: 'FORM_READ_FAILED', message: `Unable to parse or do DB update of form data after fetching from online`, error });
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res) => {
            logger.debug(`Received API call to read formdata`);
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
            return form.search(req, res);
        }
    );
}