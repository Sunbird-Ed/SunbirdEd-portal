import { Channel } from "./../controllers/channel";
import { manifest } from "./../manifest";
const proxy = require('express-http-proxy');
import { logger } from "@project-sunbird/logger";
import { StandardLog } from '../utils/standardLog';

export default (app, proxyURL) => {
    const channel = new Channel(manifest);
    const standardLog = new StandardLog();
    app.get(
        "/api/channel/v1/read/:id",
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/channel/v1/read/${req.params.id}`;
            },
            proxyErrorHandler: function (err, res, next) {
                standardLog.warn({ id: 'channel_fetch_failed', message: 'Error while getting channel data from online', error: err });
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const channelResponse = JSON.parse(proxyResData.toString('utf8'));
                        channel.upsert(channelResponse);
                    } catch (error) {
                        standardLog.error({ id: 'parse_failed', message: 'Unable to parse or do DB update of channel data after fetching from online', error });
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res, next) => {
            standardLog.debug({ id: 'api_request', message: `Received API call to get channel data for channel with Id: ${req.params.id}`, mid: req.headers["X-msgid"] });
                return channel.get(req, res);
        },

    );
}