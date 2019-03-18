const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const configHelper = require('../helpers/configServiceSDKHelper.js')
const healthService = require('../helpers/healthCheckService.js')

module.exports = function (app) {

  // helper route to enable enable admin to update user fields
  app.patch('/learner/portal/user/v1/update',
    proxyUtils.verifyToken(),permissionsHelper.checkPermission(),
    proxy(envHelper.learner_Service_Local_BaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: (req) => {
        return '/private/user/v1/update';
      }
  }))
  // Generate telemetry fot proxy service
  app.all('/learner/*', telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy)

  app.post('/learner/content/v1/media/upload',
    proxyUtils.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        return require('url').parse(learnerURL + '/content/v1/media/upload').path
      },
      userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
        let data = JSON.parse(proxyResData.toString('utf8'))
        if (data.responseCode === 'OK') {
          data.success = true
        }
        return JSON.stringify(data)
      }
    }))

  app.all('/learner/data/v1/role/read',
    proxyUtils.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/learner/', '')
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      }
    }))

  app.all('/learner/*',
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    proxyUtils.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.params['0']
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        const data = JSON.parse(proxyResData.toString('utf8'));
        if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        return proxyResData;
      }
    }))
}
