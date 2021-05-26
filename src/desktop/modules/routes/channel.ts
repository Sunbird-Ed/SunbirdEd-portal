import { Channel } from "./../controllers/channel";
import { manifest } from "./../manifest";
const proxy = require('express-http-proxy');
import { containerAPI } from '@project-sunbird/OpenRAP/api';

export default (app, proxyURL) => {
    const channel = new Channel(manifest);
    const standardLog = containerAPI.getStandardLoggerInstance();
    app.get(
        "/api/channel/v1/read/:id",
        proxy(proxyURL, {
            proxyReqPathResolver(req) {
                return `/api/channel/v1/read/${req.params.id}`;
            },
            proxyErrorHandler: function (err, res, next) {
                standardLog.warn({ id: 'CHANNEL_READ_FAILED', message: 'Error while getting channel data from online', error: err });
                next();
            },
            userResDecorator: function (proxyRes, proxyResData) {
                return new Promise(function (resolve) {
                    try {
                        const channelResponse = JSON.parse(proxyResData.toString('utf8'));
                        channel.upsert(channelResponse);
                    } catch (error) {
                        standardLog.error({ id: 'CHANNEL_PARSE_FAILED', message: 'Unable to parse or do DB update of channel data after fetching from online', error });
                    }
                    resolve(proxyResData);
                });
            }
        }),
        (req, res, next) => {
            standardLog.debug({ id: 'CHANNEL_API_REQUEST', message: `Received API call to get channel data for channel with Id: ${req.params.id}`, mid: req.headers["X-msgid"] });
                return channel.get(req, res);
        },

    );
}