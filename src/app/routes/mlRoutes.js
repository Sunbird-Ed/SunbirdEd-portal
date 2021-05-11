/**
 * @file
 * @description - ML routes handler
 * @version 1.0
 */
const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const mlURL = envHelper.ML_SERVICE_BASE_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const healthService = require('../helpers/healthCheckService.js')
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const reqDataLimitOfContentUpload = '50mb'
const { logger } = require('@project-sunbird/logger');

module.exports = function (app) {

  app.all('/kendra/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/kendra/api/')
  )

  app.all('/assessment/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/assessment/api/')
  )
}

function handleRequest(serviceUrl) {
  return proxy(mlURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(mlURL),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      logger.info({ msg: '==============================/ML_URL/* ===================================called - ' + req.method + ' - ' + req.url });
      if (query) {
        const url = require('url').parse(mlURL + serviceUrl + urlParam + '?' + query).path;
        return url
      } else {
        const url = require('url').parse(mlURL + serviceUrl + urlParam).path
        return url
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      try {
        const parsedData = JSON.parse(proxyResData.toString('utf8'));
        if (proxyRes.statusCode === 404) res.redirect('/')
        else {
          const data = proxyUtils.handleSessionExpiry(proxyRes, parsedData, req, res);
          data.status === 200 ? data.responseCode = "OK" : null;
          return data
        }
      } catch (err) {
        logger.error({ msg: 'ML route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  })
}
