/**
 * @name : healthCheckService.js
 * @description :: Responsible for check content service health
 * @author      :: Rajath V B
 */

var async = require('async')
var request = require('request')
var uuidv1 = require('uuid/v1')
var envHelper = require('./environmentVariablesHelper.js')
var cassandra = require('cassandra-driver')
var contactPoints = envHelper.PORTAL_CASSANDRA_URLS
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
  delete rsp.responseCode
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
    url: envHelper.content_Service_Local_BaseUrl + '/health',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(options, function (error, response, body) {
    if (!error && body && body.responseCode === 'OK') {
      console.log('response', response)
      callback(null, true)
    } else {
      callback(error, false)
    }
  })
}
function learnerServiceHealthCheck (callback) {
  var options = {
    method: 'GET',
    url: envHelper.learner_Service_Local_BaseUrl + '/health',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  request(options, function (error, response, body) {
    if (!error && body && body.responseCode === 'OK') {
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
  var checksArrayObj = []
  var isCSHealthy
  var isLSHealthy
  var isDbConnected
  async.parallel([
    function (CB) {
      checkCassandraDBHealth(function (err, res) {
        if (err || res === false) {
          isDbConnected = false
          checksArrayObj.push(getHealthCheckObj(hcMessages.CASSANDRA_DB.NAME, isDbConnected,
            hcMessages.CASSANDRA_DB.FAILED_CODE, hcMessages.CASSANDRA_DB.FAILED_MESSAGE))
        } else {
          isDbConnected = true
          checksArrayObj.push(getHealthCheckObj(hcMessages.CASSANDRA_DB.NAME, isDbConnected, '', ''))
        }
        CB()
      })
    },
    function (CB) {
      learnerServiceHealthCheck(function (err, res) {
        if (err) {
          isLSHealthy = false
          checksArrayObj.push(getHealthCheckObj(hcMessages.LEARNER_SERVICE.NAME,
            isLSHealthy, hcMessages.LEARNER_SERVICE.FAILED_CODE, hcMessages.LEARNER_SERVICE.FAILED_MESSAGE))
        } else if (res && res.result && res.result.response && res.result.response.healthy) {
          isLSHealthy = true
          checksArrayObj.push(getHealthCheckObj(hcMessages.LEARNER_SERVICE.NAME, isLSHealthy, '', ''))
        } else {
          isLSHealthy = false
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
          checksArrayObj.push(getHealthCheckObj(hcMessages.CONTENT_SERVICE.NAME,
            isLSHealthy, hcMessages.CONTENT_SERVICE.FAILED_CODE, hcMessages.CONTENT_SERVICE.FAILED_MESSAGE))
        } else if (res && res.result && res.result.response && res.result.response.healthy) {
          isCSHealthy = true
          checksArrayObj.push(getHealthCheckObj(hcMessages.CONTENT_SERVICE.NAME, isLSHealthy, '', ''))
        } else {
          isCSHealthy = false
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

module.exports.checkHealth = checkHealth
module.exports.createAndValidateRequestBody = createAndValidateRequestBody
