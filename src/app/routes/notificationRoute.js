const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const utils = require('../helpers/utils.js');
const learnerURL  = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
const proxy = require('express-http-proxy')
const reqDataLimitOfContentUpload = '50mb'
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const { concatSeries } = require('async')

module.exports = function (app) {
    app.get('/learner/notification/v1/feed/read/:userId', proxyObject());
    app.get('/learner/notification/v1/feed/delete', proxyObject()),
    app.get('/learner/notification/v1/feed/update', proxyObject())
}
function proxyObject() {
    isAPIWhitelisted.isAllowed()
    return proxy(learnerURL, {
        proxyReqOptDecorator: addHeaders(),
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
                let data = JSON.parse(resData);
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
            } catch (err) {
                console.log('error', err);
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    });
}
/**
 * Notification service needs header content-type as 'text/plain' as 'application/json' not supported
 * @returns
 */
 function addHeaders() {
    return function(proxyReqOpts, srcReq) {
        proxyReqOpts.headers['content-type'] = 'text/plain';
        var decFunc = proxyUtils.decorateRequestHeaders(learnerURL);
        return decFunc(proxyReqOpts, srcReq);
    }
}