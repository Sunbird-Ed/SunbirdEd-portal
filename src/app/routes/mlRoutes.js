/**
 * @file
 * @description - ML routes handler
 * @version 1.0
 */
const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const utils = require('../helpers/utils.js');
const mlURL  = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
const telemetryHelper = require('../helpers/telemetryHelper.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const healthService = require('../helpers/healthCheckService.js')
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const reqDataLimitOfContentUpload = '50mb'
const { logger } = require('@project-sunbird/logger');
const request = require('request');
const fs = require('fs');
const multiparty = require('multiparty');

module.exports = function (app) {

  app.all('/kendra/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/kendra/')
  )

  app.all('/dhiti/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/dhiti/')
  )

  app.all('/assessment/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth([]),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    handleRequest('/assessment/')
  )

  app.put('/cloudUpload/*', async (req, res) => {
    const form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      const fileStream = fs.readFileSync(files['file'][0]['path'])
      var options = {
        'method': 'PUT',
        'url': fields.url[0],
        'headers': {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': files['file'][0]['headers']['content-type']
        },
        body: fileStream
      };
      request(options, function (error, response) {
        const successStatusOptions = [200,201,202,'200','201','202'];
        if (successStatusOptions.includes(response.statusCode)) {
          res.send({ responseCode: "OK", status: 200 })
        } else {
          res.send({ status: response.statusCode })
        }
      });
    });
  })
}

function handleRequest(serviceUrl) {
  return proxy(mlURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(mlURL),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      logger.info({ msg: '==============================/ML_URL/* ===================================called - ' + mlURL + req.method + ' - ' + req.url });
      if (query) {
        const url = require('url').parse(mlURL + urlParam + '?' + query).path;
        return url
      } else {
        const url = require('url').parse(mlURL + urlParam).path
        return url
      }
    },
    userResDecorator: (proxyRes, proxyResData, req, res) => {
      try {
        const parsedData = JSON.parse(proxyResData.toString('utf8'));
        if (proxyRes.statusCode === 404) res.redirect('/')
        else {
          const data = proxyUtils.handleSessionExpiry(proxyRes, parsedData, req, res);
          (data.status === 200 || data.result || data.status) ? data.responseCode = "OK" : null;
          return data
        }
      } catch (err) {
        logger.error({ msg: 'ML route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  })
}
