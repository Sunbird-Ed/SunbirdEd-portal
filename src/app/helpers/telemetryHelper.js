const request = require('request')
const jwt = require('jsonwebtoken')
const parser = require('ua-parser-js')
const _ = require('lodash')
const uuidv1 = require('uuid/v1')
const dateFormat = require('dateformat')
const envHelper = require('./environmentVariablesHelper.js')
const contentURL = envHelper.CONTENT_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
const md5 = require('js-md5')
const telemetryPacketSize = envHelper.PORTAL_TELEMETRY_PACKET_SIZE
const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const fs = require('fs')
const path = require('path')
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))

module.exports = {
  /**
   * This function helps to get user spec
   */
  getUserSpec: function (req) {
    var ua = parser(req.headers['user-agent'])
    return {
      'agent': ua['browser']['name'],
      'ver': ua['browser']['version'],
      'system': ua['os']['name'],
      'platform': ua['engine']['name'],
      'raw': ua['ua']
    }
  },

  /**
   * this function helps to generate session start event
   */
  logSessionStart: function (req, callback) {
    req.session.orgs = _.compact(req.session.orgs)
    req.session.save()
    var channel = req.session.rootOrghashTagId || md5('sunbird')
    var dims = _.clone(req.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel

    const edata = telemetry.startEventData('session')
    edata.uaspec = this.getUserSpec(req)
    const context = telemetry.getContextData({ channel: channel, env: 'user' })
    context.sid = req.sessionID
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(req.kauth.grant.access_token.content.sub, 'user')
    telemetry.start({
      edata: edata,
      context: context,
      actor: actor,
      tags: dims
    })
    return callback()
  },

  /**
   * this function helps to generate session end event
   */
  logSessionEnd: function (req) {
    const edata = telemetry.endEventData('session')
    const actor = telemetry.getActorData(req.kauth.grant.access_token.content.sub, 'user')
    var dims = _.clone(req.session.orgs || [])
    var channel = req.session.rootOrghashTagId || md5('sunbird')
    dims = dims ? _.concat(dims, channel) : channel
    telemetry.end({
      edata: edata,
      actor: actor,
      tags: dims
    })
  },

  /**
   * This function helps to generate SSO start event
   */
  logSSOStartEvent: function (req) {
    req.session.orgs = _.compact(req.session.orgs)
    var channel = req.session.rootOrghashTagId || md5('sunbird')
    var dims = _.clone(req.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const payload = jwt.decode(req.query['token'])

    const edata = telemetry.startEventData('sso')
    edata.uaspec = this.getUserSpec(req)
    const context = telemetry.getContextData({ channel: channel, env: 'sso', cdata: { id: 'sso', type: 'sso' } })
    context.sid = req.sessionID
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(payload.sub, 'user')
    console.log('logSSOStartEvent')
    telemetry.start({
      edata: edata,
      context: context,
      actor: actor,
      tags: dims
    })
  },

  /**
   * This function helps to generate SSO end event
   */
  logSSOEndEvent: function (req) {
    console.log('logSSOEndEvent')
    const payload = jwt.decode(req.query['token'])
    const edata = telemetry.endEventData('sso')
    const actor = telemetry.getActorData(payload.sub, 'user')
    var dims = _.clone(req.session.orgs || [])
    var channel = req.session.rootOrghashTagId || md5('sunbird')
    dims = dims ? _.concat(dims, channel) : channel
    telemetry.end({
      edata: edata,
      actor: actor,
      tags: dims
    })
  },

  /**
   * This function helps to get params data for log event
   */
  getParamsData: function (options, statusCode, resp, uri) {
    const apiConfig = telemtryEventConfig.URL[uri]
    let params = [
      { 'title': apiConfig && apiConfig.title },
      { 'category': apiConfig && apiConfig.category },
      { 'url': apiConfig && apiConfig.url },
      { 'duration': Date.now() - new Date(options.headers.ts) },
      { 'status': statusCode },
      { 'protocol': 'https' },
      { 'method': options.method },
      { 'req': options.body }
    ]
    if (resp) {
      params.push(
        { rid: resp.id },
        { size: resp.toString().length }
      )
    }
    return params
  },

  /**
   * This function helps to generate the api call event
   */
  logAPICallEvent: function (req) {
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}

    let object = {}
    const params = this.getParamsData(req.options, req.statusCode, req.resp, req.uri)
    const edata = telemetry.logEventData('api_call', 'INFO', apiConfig.message, params)
    if (req.id && req.type) {
      object = telemetry.getObjectData({ id: req.id, type: req.type, ver: req.version, rollup: req.rollup })
    }

    req.reqObj.session.orgs = _.compact(req.reqObj.session.orgs)
    var channel = req.reqObj.session.rootOrghashTagId || md5('sunbird')
    var dims = _.clone(req.reqObj.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const context = telemetry.getContextData({ channel: channel, env: apiConfig.env })
    if (req && req.reqObj && req.reqObj.sessionID) {
      context.sid = req.reqObj.sessionID
    }
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(req.userId, 'user')
    console.log('logAPICallEvent')
    telemetry.log({
      edata: edata,
      context: context,
      object: object,
      actor: actor,
      tags: dims
    })
  },

  /**
   * This function helps to generate keyclock grant log event
   */
  logGrantLogEvent: function (req) {
    const message = req.success ? 'Verified keyclock grant' : 'Keyclock grant failed'
    const error = req.success ? 'INFO' : 'ERROR'

    const edata = telemetry.logEventData('keyclock_grant', error, message)

    req.reqObj.session.orgs = _.compact(req.reqObj.session.orgs)
    var channel = req.reqObj.session.rootOrghashTagId || md5('sunbird')
    var dims = _.clone(req.reqObj.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const context = telemetry.getContextData({ channel: channel, env: 'sso' })
    if (req && req.reqObj && req.reqObj.sessionID) {
      context.sid = req.reqObj.sessionID
    }
    context.rollup = telemetry.getRollUpData(dims)
    const object = telemetry.getObjectData({ id: req.userId, type: 'user' })
    const actor = telemetry.getActorData(req.userId, 'user')
    console.log('logAPICallEvent')
    telemetry.log({
      edata: edata,
      context: context,
      object: object,
      actor: actor,
      tags: dims
    })
  },

  /**
   * This function helps to log API access event
   */
  logAPIAccessEvent: function (req) {
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}

    let object = {}
    let params = []
    if (req.options) {
      params = this.getParamsData(req.options, req.statusCode, req.resp, req.uri)
    }
    const edata = telemetry.logEventData('api_access', 'INFO', apiConfig.message, params)
    if (req.id && req.type) {
      object = telemetry.getObjectData({ id: req.id, type: req.type, ver: req.version, rollup: req.rollup })
    }

    var channel = (req.reqObj && req.reqObj.session && req.reqObj.session.rootOrghashTagId) ||
      req.channel || md5('sunbird')

    var dims = _.clone(req.reqObj.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const context = telemetry.getContextData({ channel: channel, env: apiConfig.env })
    if (req && req.reqObj && req.reqObj.sessionID) {
      context.sid = req.reqObj.sessionID
    }
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(req.userId, req.type)
    console.log('logAPIAccessEvent')
    telemetry.log({
      edata: edata,
      context: context,
      object: object,
      actor: actor,
      tags: dims
    })
  },

  /**
   * This function helps to log api error event
   */
  logAPIErrorEvent: function (req) {
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}

    let object = {}
    const err = (req.resp && req.resp.params && req.resp.params.err) || 'API_CALL_ERROR'
    const errCode = (req.resp && req.resp.responseCode) || 'SERVER_ERROR'
    const edata = telemetry.errorEventData(err, errCode, req.resp)
    if (req.id && req.type) {
      object = telemetry.getObjectData({ id: req.id, type: req.type, ver: req.version, rollup: req.rollup })
    }

    req.reqObj.session.orgs = _.compact(req.reqObj.session.orgs)
    var channel = req.reqObj.session.rootOrghashTagId || md5('sunbird')
    var dims = _.clone(req.reqObj.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const context = telemetry.getContextData({ channel: channel, env: apiConfig.env })
    if (req && req.reqObj && req.reqObj.sessionID) {
      context.sid = req.reqObj.sessionID
    }
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(req.userId, 'user')
    console.log('logAPIErrorEvent')
    telemetry.log({
      edata: edata,
      context: context,
      object: object,
      actor: actor,
      tags: dims
    })
  },

  logSessionEvents: function (req, res) {
    if (req.body && req.body.event) {
      req.session['sessionEvents'] = req.session['sessionEvents'] || []
      req.session['sessionEvents'].push(JSON.parse(req.body.event))
      if (req.session['sessionEvents'].length >= parseInt(telemetryPacketSize, 10)) {
        module.exports.sendTelemetry(req, req.session['sessionEvents'], function (err, status) {
          req.session['sessionEvents'] = err ? req.session['sessionEvents'] : []
          req.session.save()
        })
      }
    }
    res.end()
  },
  prepareTelemetryRequestBody: function (req, eventsData) {
    var data = {
      'id': 'ekstep.telemetry',
      'ver': '3.0',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'requesterId': req.kauth.grant.access_token.content.sub,
        'did': telemtryEventConfig.default_did,
        'key': '13405d54-85b4-341b-da2f-eb6b9e546fff',
        'msgid': uuidv1()
      },
      'events': eventsData
    }
    return data
  },
  sendTelemetry: function (req, eventsData, callback) {
    if (!eventsData || eventsData.length === 0) {
      if (_.isFunction(callback)) {
        callback(null, true)
      }
    }
    var data = this.prepareTelemetryRequestBody(req, eventsData)
    var options = {
      method: 'POST',
      url: contentURL + 'data/v1/telemetry',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + learnerAuthorization
      },
      body: data,
      json: true
    }
    request(options, function (error, response, body) {
      if (_.isFunction(callback)) {
        if (error) {
          callback(error, false)
        } else if (body && body.params && body.params.err) {
          callback(body, false)
        } else {
          callback(null, true)
        }
      }
    })
  },

  /**
   * This function helps to get actor data for telemetry
   */
  getTelemetryActorData: function (req) {
    var actor = {}
    if (req.session && req.session.userId) {
      actor.id = req.session && req.session.userId
      actor.type = 'user'
    } else {
      actor.id = req.headers['x-consumer-id'] || telemtryEventConfig.default_userid
      actor.type = req.headers['x-consumer-username'] || telemtryEventConfig.default_username
    }
    return actor
  },

  /**
   * This function helps to generate telemetry for proxy api's
   */
  generateTelemetryForProxy: function (req, res, next) {
    let params = [
      { 'url': req.originalUrl },
      { 'protocol': 'https' },
      { 'method': req.method },
      { 'req': req.body }
    ]
    const edata = telemetry.logEventData('api_access', 'INFO', '', params)

    var channel = (req.session && req.session.rootOrghashTagId) || md5('sunbird')
    var dims = _.clone(req.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel

    const context = telemetry.getContextData({ channel: channel, env: telemtryEventConfig.env })
    if (req.session && req.session.sessionID) {
      context.sid = req.session.sessionID
    }
    context.rollup = telemetry.getRollUpData(dims)
    console.log('generateTelemetryForProxy')
    telemetry.log({
      edata: edata,
      context: context,
      actor: module.exports.getTelemetryActorData(req),
      tags: dims
    })
    next()
  }
}
