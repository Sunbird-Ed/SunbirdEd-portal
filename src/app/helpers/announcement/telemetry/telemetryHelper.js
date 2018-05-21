const md5 = require('js-md5')
const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const envHelper = require('./../../environmentVariablesHelper')
const appId = envHelper.APPID
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))
telemtryEventConfig['pdata']['id'] = appId
let telemetryData = {}

module.exports = {

  /**
   * This function helps to get context data
   */
  getTelemetryContextData: function (req) {
    const url = req.route.path
    const tags = this.getTags(req)
    var context = {
      channel: req.session && req.session.rootOrghashTagId,
      env: telemtryEventConfig[url] && telemtryEventConfig[url].env,
      sid: req.sessionID,
      rollup: telemetry.getRollUpData(tags)
    }
    return context
  },

  /**
   * This function helps to get actor data for telemetry
   */
  getTelemetryActorData: function (req) {
    var actor = {}
    if (req.session && req.session.userId) {
      actor.id = req.session && req.session.userId
      actor.type = 'user'
    } else if (_.get(req, 'headers.x-authenticated-user-token')) {
      var payload = jwt.decode(req['headers']['x-authenticated-user-token'])
      actor.id = _.toString(payload['sub'])
      actor.type = 'user'
    } else {
      actor.id = req.headers['x-consumer-id']
      actor.type = req.headers['x-consumer-username']
    }
    if (!actor['id'] || actor['id'] === '') {
      actor.id = _.toString(process.pid)
      actor.type = 'service'
    }
    return actor
  },

  /**
   * Return object data for telemetry envelop
   */
  getObjectData: function (id, type, ver, rollup) {
    return {
      id: id,
      type: type,
      ver: ver,
      rollup: rollup
    }
  },

  /**
   * This function helps to get tags.
   */
  getTags: function (req) {
    var channel = req.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')
    var dims = _.concat([], channel)
    return dims
  },

  /**
   * This function helps to store telemetry data with unique key.
   */
  storeTelemetryData: function (key, value) {
    telemetryData[key] = value
  },

  /**
   * This function helps to get telemetry data
   */
  getTelemetryData: function (key) {
    return telemetryData[key] || {}
  },

  /**
   * This function helps to update actor data
   */
  updateActorData: function (key, value) {
    telemetryData[key]['actor'] = Object.assign({}, value)
  },

  /**
   * This function helps to delete telemetry data
   */
  deleteTelemetryData: function (reqID) {
    delete telemetryData[reqID]
  },

  /**
   * This function helps to add message in edata of log event
   */
  addLogEventMessage: function (key, value) {
    telemetryData[key]['edata'] = telemetryData[key]['edata'] || {}
    telemetryData[key]['edata']['message'] = value
  },

  /**
   * This function helps to add object data
   */
  addObjectData: function (key, value) {
    telemetryData[key]['object'] = value
  },

  /**
 * This function helps to params data for log event
 * @param {*} data
 */
  getParamsDataForLogEvent: function (data) {
    if (!data) {
      return []
    }
    const url = data.path && data.path.split('/:')[0]
    const params = [
      { 'ts': data.startTime },
      { 'rid': telemtryEventConfig[url] && telemtryEventConfig[url].rid },
      { 'title': telemtryEventConfig[url] && telemtryEventConfig[url].title },
      { 'category': telemtryEventConfig[url] && telemtryEventConfig[url].category },
      { 'url': url },
      { 'method': data.method }
    ]
    return params
  },

  /**
   * This function helps to get params data for api call event
   */
  getParamsForAPICallEvent: function (data, url) {
    if (!data || !url) {
      return []
    }
    const params = [
      { 'ts': data.startTime },
      { 'rid': telemtryEventConfig[url] && telemtryEventConfig[url].rid },
      { 'title': telemtryEventConfig[url] && telemtryEventConfig[url].title },
      { 'category': telemtryEventConfig[url] && telemtryEventConfig[url].category },
      { 'url': data.url },
      { 'method': data.method },
      { 'req': data.body }
    ]
    return params
  },

  /**
 * This function helps to generate api_call log event
 */
  generateApiCallLogEvent: function (reqID, options, url) {
    if (!reqID || !options || !url) {
      console.log('Invalid params: generateApiCallLogEvent: ', url, reqID)
      return
    }
    const telemetryData = this.getTelemetryData(reqID)
    const params = this.getParamsForAPICallEvent(options, url)
    const message = telemetryData.message || 'Calling learner service api'
    const level = 'api_call'
    const edata = telemetry.logEventData('INFO', level, message, params)
    console.log('generateApiCallLogEvent: ')
    telemetry.log({
      edata: edata,
      context: telemetryData && telemetryData.context && telemetry.getContextData(telemetryData.context),
      actor: telemetryData && telemetryData.actor,
      tags: telemetryData && telemetryData.tags
    })
  },

  /**
 * This function used to generate api_access log event
 */
  generateApiAccessLogEvent: function (reqID) {
    if (!reqID) {
      console.log('Invalid params: generateApiAccessLogEvent: ', reqID)
      return
    }
    const telemetryData = this.getTelemetryData(reqID)
    const message = (telemetryData.edata && telemetryData.edata.message) || ''
    const level = 'api_access'
    const edata = telemetry.logEventData('INFO', level, message, telemetryData.params)
    console.log('generateApiAccessLogEvent: ')
    telemetry.log({
      edata: edata,
      context: telemetry.getContextData(telemetryData.context),
      actor: telemetryData && telemetryData.actor,
      tags: telemetryData && telemetryData.tags
    })
  },

  /**
 * This function used to generate error event
 */
  generateErrorEvent: function (reqID, errCode, responseCode, stacktrace) {
    if (!reqID || !errCode || !responseCode) {
      console.log('Invalid params: generateErrorEvent: ', reqID, JSON.stringify(stacktrace))
      return
    }
    const telemetryData = this.getTelemetryData(reqID)
    const trace = JSON.stringify(stacktrace)
    const edata = telemetry.errorEventData(errCode, responseCode, trace)
    console.log('generateErrorEvent: ')
    telemetry.error({
      edata: edata,
      context: telemetryData && telemetry.getContextData(telemetryData.context),
      actor: telemetryData && telemetryData.actor,
      tags: telemetryData && telemetryData.tags,
      object: telemetryData && telemetryData.object
    })
  }
}
