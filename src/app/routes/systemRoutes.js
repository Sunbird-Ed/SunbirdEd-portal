/**
 * @file
 * @description - Content routes handler
 * @version 1.0
 */

const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const contentURL = envHelper.CONTENT_URL
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const _ = require('lodash')
const logger = require('sb_logger_util_v2')

module.exports = (app) => {
    
    app.all('/system/v3/content/update',
        proxy('http://localhost:3000', {
            limit: reqDataLimitOfContentUpload,
            proxyReqOptDecorator: proxyUtils.decorateRequestHeaders("http://localhost:3000"),
            proxyReqPathResolver: (req) => {
                logger.info({ msg: 'system/v3/content/update called' });
                return require('url').parse("http://localhost:3000/system/v3/content/update").path
            }
        })
    )
    
}