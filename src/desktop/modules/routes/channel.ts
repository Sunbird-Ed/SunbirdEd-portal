import { Channel } from "./../controllers/channel";
import { manifest } from "./../manifest";
const proxy = require('express-http-proxy');
import { logger } from "@project-sunbird/logger";

export default (app, proxyURL) => {
    const channel = new Channel(manifest);
    app.get(
        "/api/channel/v1/read/:id",
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/channel/v1/read/${req.params.id}`;
            },
            proxyErrorHandler: function (err, res, next) {
                logger.warn(`While getting channel data from online`, err);
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const channelResponse = JSON.parse(proxyResData.toString('utf8'));
                        channel.upsert(channelResponse);
                    } catch (error) {
                        logger.error(`Unable to parse or do DB update of channel data after fetching from online`, error)
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res, next) => {
            logger.debug(
                `Received API call to get channel data for channel with Id: ${req.params.id}`,
            );
            logger.debug(`ReqId = "${req.headers["X-msgid"]}": Check proxy`);
                return channel.get(req, res);
        },

    );
}