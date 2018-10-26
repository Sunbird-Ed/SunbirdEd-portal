const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const configHelper = require('../helpers/config/configHelper.js')

module.exports = function (app) {
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

  app.post('/learner/user/v1/create', function (req, res, next) {
   let config_key_allow_signup = 'ENABLE_SIGNUP'
   let allow_signup = configHelper.getConfig(config_key_allow_signup) 
      if (allow_signup !== undefined) {
        if (allow_signup === 'false') {
          res.sendStatus(403)
        } else {
          next()
        }
      } else {
        res.sendStatus(403)
      }
  })

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
              if(req.method === 'GET' && proxyRes.statusCode === 404) res.redirect('/')
              return proxyResData;
          }
        }))
}
