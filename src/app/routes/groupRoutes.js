const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const proxy = require('express-http-proxy')
const reqDataLimitOfContentUpload = '50mb'
const Telemetry = require('../libs/sb_telemetry_util/telemetryService.js')
const telemetry = new Telemetry()
const telemetryHelper = require('../helpers/telemetryHelper.js')
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const { logger } = require('@project-sunbird/logger');
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../helpers/telemetryEventConfig.json')))

module.exports = function (app) {
    app.get('/learner/group/v1/read/:groupId', proxyObj());
    // TODO: Commenting out the route to bypass through learner*,
    // app.get('/learner/user/v2/exists/:key/:value', proxyObj());
    app.get('/learner/data/v1/system/settings/get/groupsTnc', proxyObj());
    app.post('/learner/group/v1/create', proxyObj());
    app.post('/learner/group/v1/list', proxyObj());
    app.patch('/learner/group/v1/update', proxyObj());
    app.post('/learner/group/v1/delete', proxyObj());
    app.post('/learner/data/v1/group/activity/agg', proxyObj());
    app.patch('/learner/group/membership/v1/update', proxyObj());
}
function proxyObj() {
    isAPIWhitelisted.isAllowed()
    return proxy(learnerURL, {
        limit: reqDataLimitOfContentUpload,
        proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
        proxyReqPathResolver: function (req) {
            let urlParam = req.path.replace('/learner/', '')
            let query = require('url').parse(req.url).query
            if (query) {
                return require('url').parse(learnerURL + urlParam + '?' + query).path
            } else {
                return require('url').parse(learnerURL + urlParam).path
            }
        },
        userResDecorator: function (proxyRes, proxyResData, req, res) {
            let resData = proxyResData.toString('utf8');
            try {
                logger.info({ msg: 'proxyObj' });
                let response = data.result.response;
                let data = JSON.parse(resData);
                data.result.response = { id: '', rootOrgId: '' };
                if (data.responseCode === 'OK') {
                    data.result.response.id = response.id;
                    data.result.response.rootOrgId = response.rootOrgId;
                }
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
            } catch (err) {
                const uri = 'learner/group'
                const context = {
                    env: telemtryEventConfig.URL[uri].env || 'group'
                }
                const option = telemetry.getTelemetryAPIError(JSON.parse(resData),proxyRes, context);
                if (option) {
                telemetryHelper.logApiErrorEventV2(req, option);
                }
                logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData })
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    });
}
