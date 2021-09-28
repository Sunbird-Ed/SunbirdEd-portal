const mapping = { 'config_userType_v2_app': { type: 'config', subType: 'userType_v2_ios' } };
const { logger } = require('@project-sunbird/logger');
const { request } = require('express');

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description Middleware is responsible to modify Form API Calls for the IOS Platform
 */
const IOSFormMiddleware = (req, res, next) => {
    const platform = req.get('X-Platform-Id');
    logger.info({
        msg: 'IOSFormMiddleware Before ::', payload: {
            ...req.body.request,
            platform
        }
    })
    if (platform && typeof (platform) == 'string' && platform.toLowerCase() === 'ios') {
        const { body } = req;
        if (body) {
            const { type, subType, component } = body.request || {};
            const key = `${type}_${subType}_${component}`;
            const hasMapping = key in mapping;
            if (hasMapping) {
                req.body.request = {
                    ...req.body.request,
                    ...mapping[key]
                }
            }
            logger.info({
                msg: 'IOSFormMiddleware After ::', payload: {
                    ...req.body.request,
                    platform
                }
            })
        }
    }
    next();
}

module.exports = { IOSFormMiddleware }