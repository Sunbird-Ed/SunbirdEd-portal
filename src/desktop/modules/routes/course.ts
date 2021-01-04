import * as _ from "lodash";
import Response from "./../utils/response";
import { containerAPI } from '@project-sunbird/OpenRAP/api';
import { logger } from '@project-sunbird/logger';
const proxy = require('express-http-proxy');
import { decorateRequestHeaders, handleSessionExpiry } from "../helper/proxyUtils";

export default (app, proxyURL) => {

    app.get("/learner/course/v1/user/enrollment/list/:courseId", proxy(proxyURL, {
            proxyReqOptDecorator: decorateRequestHeaders(proxyURL),
            proxyReqPathResolver(req) {
                return `${proxyURL}${req.originalUrl.replace('/learner/', '/api/')}`;
            },
            userResDecorator: function (proxyRes, proxyResData, req, res) {
                try {
                    const data = JSON.parse(proxyResData.toString('utf8'));
                    if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                    else return handleSessionExpiry(proxyRes, proxyResData, req, res, data);
                } catch (err) {
                    logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
                    return handleSessionExpiry(proxyRes, proxyResData, req, res);
                }
            }
        })
    );

}