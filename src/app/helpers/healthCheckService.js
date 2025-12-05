/**
 * @name : healthCheckService.js
 * @description :: Responsible for check content service health
 * @author      :: Rajath V B
 */

const { logger } = require('@project-sunbird/logger');
var async = require('async')
var request = require('request')
var { v1: uuidv1 } = require('uuid')
var envHelper = require('./environmentVariablesHelper.js')
var cassandra = require('cassandra-driver')
var fs = require('fs');
var path = require('path');
var dateFormat = require('dateformat')
var contactPoints = envHelper.PORTAL_CASSANDRA_URLS
var checksArrayObj = []
var hcMessages = {
  LEARNER_SERVICE: {
    NAME: 'learnerservice.api',
    FAILED_CODE: 'LEARNER_SERVICE_HEALTH_FAILED',
    FAILED_MESSAGE: 'Learner service is not healthy'
  },
  CONTENT_SERVICE: {
    NAME: 'contentservice.api',
    FAILED_CODE: 'CONTENT_SERVICE_HEALTH_FAILED',
    FAILED_MESSAGE: 'content service is not healthy'
  },
  CASSANDRA_DB: {
    NAME: 'cassandra.db',
    FAILED_CODE: 'CASSANDRA_HEALTH_FAILED',
    FAILED_MESSAGE: 'Cassandra db is not connected'
  },
  NAME: 'PortalHealthCheckService',
  API_VERSION: '1.0'
}
// Function return to get health check object
function getHealthCheckObj (name, healthy, err, errMsg) {
  return {
    name: name,
    healthy: healthy,
    err: err,
    errmsg: errMsg
  }
};

// Function help to get health check response
function getHealthCheckResp (rsp, healthy, checksArrayObj) {
  rsp.result = {}
  rsp.result.name = hcMessages.NAME
  rsp.result.version = hcMessages.API_VERSION
  rsp.result.healthy = healthy
  rsp.result.check = checksArrayObj
  return rsp
}

function createAndValidateRequestBody (req, res, next) {
  req.body = req.body || {}
  req.body.ts = new Date()
  req.body.url = req.url
  req.body.path = req.route.path
  req.body.params = req.body.params ? req.body.params : {}
  req.body.params.msgid = req.headers['msgid'] || req.body.params.msgid || uuidv1()

  var rspObj = {
    apiId: 'portal.Health.API',
    path: req.body.path,
    apiVersion: '1.0',
    msgid: req.body.params.msgid,
    result: {},
    startTime: new Date(),
    method: req.originalMethod
  }
  req.rspObj = rspObj
  next()
}
function successResponse (data) {
  var response = {}
  response.id = data.apiId
  response.ver = data.apiVersion
  response.ts = new Date()
  response.params = getParams(data.msgid, 'successful', null, null)
  response.responseCode = data.responseCode || 'OK'
  response.result = data.result
  return response
}

function getParams (msgId, status, errCode, msg) {
  var params = {}
  params.resmsgid = uuidv1()
  params.msgid = msgId || null
  params.status = status
  params.err = errCode
  params.errmsg = msg

  return params
}

function checkCassandraDBHealth (callback) {
  const client = new cassandra.Client({ contactPoints: contactPoints })
  client.connect()
    .then(function () {
      client.shutdown()
      callback(null, true)
    })
    .catch(function (err) {
      console.log('cassandra err:', err)
      client.shutdown()
      callback(err, false)
    })
}
function contentServiceHealthCheck (callback) {
  var options = {
    method: 'GET',
  url: envHelper.sunbird_content_service_upstream_url + 'service/health',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(options, function (error, response, body) {
    try {
      if (typeof body === 'string') {
        body = JSON.parse(body)
      }
      body.responseCode = body.responseCode.toLowerCase()
    } catch (err) { }
    if (!error && body && body.responseCode === 'ok') {
      callback(null, true)
    } else {
      callback(error, false)
    }
  })
}
function learnerServiceHealthCheck (callback) {
  var options = {
    method: 'GET',
    url: envHelper.learner_Service_Local_BaseUrl + '/service/health',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(options, function (error, response, body) {
    try {
      if (typeof body === 'string') {
        body = JSON.parse(body)
      }
      body.responseCode = body.responseCode.toLowerCase()
    } catch (err) { }
    if (!error && body && body.responseCode === 'ok') {
      callback(null, true)
    } else {
      callback(error, false)
    }
  })
}
/**
 * This function is helps to check health of all dependencies
 * @param {Object} req
 * @param {Object} response
 */
function checkHealth (req, response) {
  var rspObj = req.rspObj
  checksArrayObj = []
  var isCSHealthy
  var isLSHealthy
  var isDbConnected
  async.parallel([
    function (CB) {
      checkCassandraDBHealth(function (err, res) {
        if (err || res === false) {
          isDbConnected = false
          envHelper.sunbird_portal_cassandra_db_health_status = 'false'
          checksArrayObj.push(getHealthCheckObj(hcMessages.CASSANDRA_DB.NAME, isDbConnected,
            hcMessages.CASSANDRA_DB.FAILED_CODE, hcMessages.CASSANDRA_DB.FAILED_MESSAGE))
        } else {
          isDbConnected = true
          envHelper.sunbird_portal_cassandra_db_health_status = 'true'
          checksArrayObj.push(getHealthCheckObj(hcMessages.CASSANDRA_DB.NAME, isDbConnected, '', ''))
        }
        CB()
      })
    },
    function (CB) {
      learnerServiceHealthCheck(function (err, res) {
        if (err) {
          isLSHealthy = false
          envHelper.sunbird_learner_service_health_status = 'false'
          checksArrayObj.push(getHealthCheckObj(hcMessages.LEARNER_SERVICE.NAME,
            isLSHealthy, hcMessages.LEARNER_SERVICE.FAILED_CODE, hcMessages.LEARNER_SERVICE.FAILED_MESSAGE))
        } else if (res && res === true) {
          isLSHealthy = true
          envHelper.sunbird_learner_service_health_status = 'true'
          checksArrayObj.push(getHealthCheckObj(hcMessages.LEARNER_SERVICE.NAME, isLSHealthy, '', ''))
        } else {
          isLSHealthy = false
          envHelper.sunbird_learner_service_health_status = 'false'
          checksArrayObj.push(getHealthCheckObj(hcMessages.LEARNER_SERVICE.NAME,
            isLSHealthy, hcMessages.LEARNER_SERVICE.FAILED_CODE, hcMessages.LEARNER_SERVICE.FAILED_MESSAGE))
        }
        CB()
      })
    },
    function (CB) {
      contentServiceHealthCheck(function (err, res) {
        if (err) {
          isCSHealthy = false
          envHelper.sunbird_content_service_health_status = 'false'
          checksArrayObj.push(getHealthCheckObj(hcMessages.CONTENT_SERVICE.NAME,
            isLSHealthy, hcMessages.CONTENT_SERVICE.FAILED_CODE, hcMessages.CONTENT_SERVICE.FAILED_MESSAGE))
        } else if (res && res === true) {
          isCSHealthy = true
          envHelper.sunbird_content_service_health_status = 'true'
          checksArrayObj.push(getHealthCheckObj(hcMessages.CONTENT_SERVICE.NAME, isLSHealthy, '', ''))
        } else {
          isCSHealthy = false
          envHelper.sunbird_content_service_health_status = 'false'
          checksArrayObj.push(getHealthCheckObj(hcMessages.CONTENT_SERVICE.NAME,
            isLSHealthy, hcMessages.CONTENT_SERVICE.FAILED_CODE, hcMessages.CONTENT_SERVICE.FAILED_MESSAGE))
        }
        CB()
      })
    }
  ], function () {
    var rsp = successResponse(rspObj)
    if (isCSHealthy && isDbConnected && isLSHealthy) {
      console.log('Portal service is healthy')
      return response.status(200).send(getHealthCheckResp(rsp, true, checksArrayObj))
    } else {
      console.log({ rsp: checksArrayObj })
      return response.status(200).send(getHealthCheckResp(rsp, false, checksArrayObj))
    }
  })
}

/**
 * This function helps to check health for sunbird portal and returns 200
 * @param {Object} req
 * @param {Object} response
 */
function checkSunbirdPortalHealth (req, response) {
  // fs.readFile(path.join(__dirname, '../client/src/assets/health-check.json'), (err, data) => {
  //   if (data) {
  //     var rspObj = req.rspObj
  //     var rsp = successResponse(rspObj)
  //     return response.status(200).send(getHealthCheckResp(rsp, true))
  //   }
  // });
  var rspObj = req.rspObj
  var rsp = successResponse(rspObj)
  return response.status(200).send(getHealthCheckResp(rsp, true))
}

/**
 * This function helps to check health of all dependency services of portal and returns 503 error if any service is down
 * @param {Array} dependancyServices
 */
function checkDependantServiceHealth (dependancyServices) {
  return function (req, res, next) {
    logger.info({ msg: 'health check called - ' + req.method + ' - ' + req.url });
    if (envHelper.sunbird_portal_health_check_enabled === 'false') {
      next()
    } else {
      var heathyServiceCount = 0
      dependancyServices.forEach(service => {
        if (service === 'LEARNER' && envHelper.sunbird_learner_service_health_status === 'true') {
          heathyServiceCount++
        } else if (service === 'CONTENT' && envHelper.sunbird_content_service_health_status === 'true') {
          heathyServiceCount++
        } else if (service === 'CASSANDRA' && envHelper.sunbird_portal_cassandra_db_health_status === 'true') {
          heathyServiceCount++
        }
      });

      if (dependancyServices.length !== heathyServiceCount) {
        logger.info({ msg: '❌ HEALTH CHECK FAILED'});
        res.status(503)
        res.send({
          'id': 'api.error',
          'ver': '1.0',
          'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
          'params': {
            'resmsgid': uuidv1(),
            'msgid': null,
            'status': 'failed',
            'err': 'SERVICE_UNAVAILABLE',
            'errmsg': 'Health Service is unavailable'
          },
          'responseCode': 'SERVICE_UNAVAILABLE',
          'result': { check: checksArrayObj}
        })
        res.end()
      } else {
        next()
      }
    }
  }
}

module.exports.checkHealth = checkHealth
module.exports.createAndValidateRequestBody = createAndValidateRequestBody
module.exports.checkSunbirdPortalHealth = checkSunbirdPortalHealth
module.exports.checkDependantServiceHealth = checkDependantServiceHealth
