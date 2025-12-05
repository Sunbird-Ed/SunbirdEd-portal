const request = require('request')
const jwt = require('jsonwebtoken')
const parser = require('ua-parser-js')
const _ = require('lodash')
const { v1: uuidv1 } = require('uuid')
const dateFormat = require('dateformat')
const envHelper = require('./environmentVariablesHelper.js')
const apiToken = envHelper.PORTAL_API_AUTH_TOKEN
const telemetryPacketSize = envHelper.PORTAL_TELEMETRY_PACKET_SIZE
const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const appId = envHelper.APPID
const fs = require('fs')
const path = require('path')
const contentURL = envHelper.CONTENT_URL
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, './telemetryEventConfig.json')))
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));

telemtryEventConfig['pdata']['id'] = appId
telemtryEventConfig['pdata']['ver'] = packageObj.version
telemtryEventConfig['pdata']['pid'] = appId
// TODO: handle telemetry event config
const pdata = { id: envHelper.APPID, ver: packageObj.version, pid: 'sunbird-portal-backend' };
const { getBearerToken } = require('../helpers/kongTokenHelper')

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
  logSessionStart: function (req, cdata) {
    var channel = req.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')
    var dims = _.clone(req.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const edata = telemetry.startEventData('session')
    edata.uaspec = this.getUserSpec(req)
    const context = telemetry.getContextData({
      channel: channel, env: 'user', cdata: this.getTelemetryCdata(req, cdata),
      pdata: pdata
    });
    context.sid = req.sessionID
    context.did = req.session.deviceId
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(req.session.userId, 'user')
    console.log('logging session start event', context.did);
    telemetry.start({
      edata: edata,
      context: context,
      actor: actor,
      tags: _.concat([], channel)
    })
  },

  /**
   * this function helps to generate session end event
   */
  logSessionEnd: function (req, cdata) {
    const edata = telemetry.endEventData('session');
    const actor = telemetry.getActorData(req.session.userId, 'user');
    var dims = _.clone(req.session.orgs || []);
    var channel = req.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id');
    const context = telemetry.getContextData({
      channel: channel, env: 'user', cdata: this.getTelemetryCdata(req, cdata),
      pdata: pdata
    });
    context.sid = req.sessionID;
    context.did = req.session.deviceId;
    console.log('logging session end event', context.did);
    context.rollup = telemetry.getRollUpData(dims);
    telemetry.end({
      edata: edata,
      context: context,
      actor: actor,
      tags: _.concat([], channel)
    })
  },

  /**
   * This function helps to generate SSO start event
   */
  logSSOStartEvent: function (req) {
    req.session.orgs = _.compact(req.session.orgs)
    var channel = req.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')
    var dims = _.clone(req.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const payload = jwt.decode(req.query['token'])

    const edata = telemetry.startEventData('sso')
    edata.uaspec = this.getUserSpec(req)
    const context = telemetry.getContextData({ channel: channel, env: 'sso', cdata: [{ id: 'sso', type: 'sso' }] })
    context.sid = req.sessionID
    context.rollup = telemetry.getRollUpData(dims)
    const actor = telemetry.getActorData(payload.sub, 'user')
    console.log('logSSOStartEvent')
    telemetry.start({
      edata: edata,
      context: context,
      actor: actor,
      tags: _.concat(dims, channel)
    })
  },

  /**
   * This function helps to generate SSO end event
   */
  logSSOEndEvent: function (req) {
    console.log('logSSOEndEvent')
    const payload = jwt.decode(req.query['token'])
    const edata = telemetry.endEventData('sso')
    const actor = telemetry.getActorData(payload['sub'], 'user')
    var channel = req.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')
    telemetry.end({
      edata: edata,
      actor: actor,
      tags: _.concat([], channel)
    })
  },

  /**
   * This function helps to get params data for log event
   */
  getParamsData: function (options, statusCode, resp, uri, traceid) {
    const apiConfig = telemtryEventConfig.URL[uri]
    let params = [
      { 'title': apiConfig && apiConfig.title },
      { 'category': apiConfig && apiConfig.category },
      { 'url': options.path || apiConfig && apiConfig.url },
      { 'duration': Date.now() - new Date(options.headers.ts) },
      { 'status': statusCode },
      { 'protocol': 'https' },
      { 'method': options.method },
      { 'traceid': traceid }
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
  logAPICallEvent: function (req) { // function call is commented in all files    
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}
    
    let object = {}
    const params = this.getParamsData(req.options, req.statusCode, req.resp, req.uri)
    const edata = telemetry.logEventData('api_call', 'INFO', apiConfig.message, params)
    if (req.id && req.type) {
      object = telemetry.getObjectData({ id: req.id, type: req.type, ver: req.version, rollup: req.rollup })
    }
    req.reqObj.session.orgs = _.compact(req.reqObj.session.orgs)
    var channel = req.reqObj.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')
    if (channel) {
      var dims = _.clone(req.reqObj.session.orgs || [])
      dims = dims ? _.concat(dims, channel) : channel
      const context = telemetry.getContextData({ channel: channel, env: apiConfig.env })
      if (req && req.reqObj && req.reqObj.sessionID) {
        context.sid = req.reqObj.sessionID
      }
      context.rollup = telemetry.getRollUpData(dims)
      const actor = telemetry.getActorData(req.userId, 'user')
      telemetry.log({
        edata: edata,
        context: context,
        object: object,
        actor: actor,
        tags: _.concat([], channel)
      })
    }
  },

  /**
   * This function helps to generate keyclock grant log event
   */
  logGrantLogEvent: function (req) {
    const message = req.success ? 'Verified keyclock grant' : 'Keyclock grant failed'
    const error = req.success ? 'INFO' : 'ERROR'

    const edata = telemetry.logEventData('keyclock_grant', error, message)

    req.reqObj.session.orgs = _.compact(req.reqObj.session.orgs)
    var channel = req.reqObj.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')
    var dims = _.clone(req.reqObj.session.orgs || [])
    dims = dims ? _.concat(dims, channel) : channel
    const context = telemetry.getContextData({ channel: channel, env: 'sso' })
    if (req && req.reqObj && req.reqObj.sessionID) {
      context.sid = req.reqObj.sessionID
    }
    context.rollup = telemetry.getRollUpData(dims)
    const object = telemetry.getObjectData({ id: req.userId, type: 'user' })
    const actor = telemetry.getActorData(req.userId, 'user')
    telemetry.log({
      edata: edata,
      context: context,
      object: object,
      actor: actor,
      tags: _.concat([], channel)
    })
  },

  /**
   * This function helps to log API access event
   */
  logAPIAccessEvent: function (req, result, uri) {
    req = telemetry.getTelemetryAPISuceessData(req, result, uri)
    req.channel = req.channel ? req.channel : envHelper.DEFAULT_CHANNEL
    const apiConfig = telemtryEventConfig.URL[uri] || {}
    let object = {}
    let params = []
    if (req.reqObj) {
      params = this.getParamsData(req.reqObj, req.statusCode, req.resp, uri)
    }

    const edata = telemetry.logEventData('api_access', 'INFO', apiConfig.message,JSON.stringify(params))

    if (req.id && req.type) {
      object = telemetry.getObjectData({ id: req.id, type: req.type, ver: req.version, rollup: req.rollup })
    }

    var channel = (req.reqObj && req.reqObj.session && req.reqObj.session.rootOrghashTagId) ||
      req.channel || _.get(req, 'headers.X-Channel-Id')
    if (channel) {
      var dims = _.clone(_.get(req, 'reqObj.session.orgs') || [])
      dims = [...new Set(dims ? _.concat(dims, channel) : channel)]
      const context = telemetry.getContextData({ channel: channel, env: apiConfig.env })
      if (req && req.reqObj && req.reqObj.sessionID) {
        context.sid = req.reqObj.sessionID
      }

      context.rollup = telemetry.getRollUpData(dims)
      const actor = this.getTelemetryActorData(req.reqObj);

      telemetry.log({
        edata: edata,
        context: context,
        object: object,
        actor: actor,
        tags: _.concat([], channel)
      })
    }
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
    var channel = req.reqObj.session.rootOrghashTagId || _.get(req, 'headers.X-Channel-Id')

    if (channel) {
      var dims = _.clone(req.reqObj.session.orgs || [])
      dims = dims ? _.concat(dims, channel) : channel
      const context = telemetry.getContextData({ channel: channel, env: apiConfig.env })
      if (req && req.reqObj && req.reqObj.sessionID) {
        context.sid = req.reqObj.sessionID
      }
      context.rollup = telemetry.getRollUpData(dims)
      const actor = telemetry.getActorData(req.userId, 'user')
      telemetry.log({
        edata: edata,
        context: context,
        object: object,
        actor: actor,
        tags: _.concat([], channel)
      })
    }
  },
  logApiErrorEventV2: function (req, res, result, options) {
    const edata = telemetry.getTelemetryAPIError(result, res, req, options.edata);
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}
    let object = options.obj || {}

    let channel = req.session.rootOrghashTagId || req.get('x-channel-id') || envHelper.defaultChannelId

    let dims = [...new Set(_.compact(_.concat(req.session.orgs, channel)))]

    const context = {
      channel: options.context.channel || channel,
      env: options.context.env || apiConfig.env,
      cdata: options.context.cdata,
      rollup: options.context.rollup || telemetry.getRollUpData(dims),
      did: options.context.did || req.context.did,
      sid: req.sessionID || uuidv1()
    }

    const actor = this.getTelemetryActorData(req);
  
    /* istanbul ignore if  */
    if (!channel) {
      console.log('logApiErrorEventV2 failed due to no channel')
      return;
    }

    telemetry.error({
      edata: edata,
      context: _.pickBy(context, value => !_.isEmpty(value)),
      object: _.pickBy(object, value => !_.isEmpty(value)),
      actor: _.pickBy(actor, value => !_.isEmpty(value)),
      tags: _.concat([], dims)
    })
  },
  logAuditEvent: function (req, options) {
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}
    let object = options.obj || {}
    const edata = {
      props: options.edata.props,
      state: options.edata.state,
      prevstate: options.edata.prevstate
    }
    let channel = req.session.rootOrghashTagId || req.get('x-channel-id') || envHelper.defaultChannelId
    let dims = _.compact(_.concat(req.session.orgs, channel))
    const context = {
      channel: options.context.channel || channel,
      env: options.context.env || apiConfig.env,
      cdata: options.context.cdata,
      rollup: options.context.rollup || telemetry.getRollUpData(dims),
      did: options.context.did,
      sid: req.sessionID || uuidv1()
    }
    const actor = {
      id: req.userId ? req.userId.toString() : 'anonymous',
      type: 'user'
    }
    /* istanbul ignore if  */
    if (!channel) {
      console.log('logAuditEvent failed due to no channel')
      return;
    }
    telemetry.audit({
      edata: _.pickBy(edata, value => !_.isEmpty(value)),
      context: _.pickBy(context, value => !_.isEmpty(value)),
      object: _.pickBy(object, value => !_.isEmpty(value)),
      actor: _.pickBy(actor, value => !_.isEmpty(value)),
      tags: _.concat([], dims)
    })
  },
  logImpressionEvent: function (req, options) {
    const apiConfig = telemtryEventConfig.URL[req.uri] || {}
    let object = options.obj || {}
    const edata = {
      type: options.edata.type,
      subtype: options.edata.subtype,
      pageid: options.edata.pageid,
      uri: options.edata.uri,
      visits: options.edata.visits
    }
    let channel = req.session.rootOrghashTagId || req.get('x-channel-id') || envHelper.defaultChannelId
    let dims = _.compact(_.concat(req.session.orgs, channel))
    const context = {
      channel: options.context.channel || channel,
      env: options.context.env || apiConfig.env,
      cdata: options.context.cdata,
      rollup: options.context.rollup || telemetry.getRollUpData(dims),
      did: options.context.did,
      sid: req.sessionID || uuidv1()
    }
    const actor = {
      id: req.userId ? req.userId.toString() : 'anonymous',
      type: 'user'
    }
    if (!channel) {
      console.log('logAuditEvent failed due to no channel')
      return;
    }
    telemetry.impression({
      edata: _.pickBy(edata, value => !_.isEmpty(value)),
      context: _.pickBy(context, value => !_.isEmpty(value)),
      object: _.pickBy(object, value => !_.isEmpty(value)),
      actor: _.pickBy(actor, value => !_.isEmpty(value)),
      tags: _.concat([], dims)
    })
  },
  logSessionEvents: function (req, res) {
    if (req.body && req.body.event) {
      req.session['sessionEvents'] = req.session['sessionEvents'] || []
      req.session['sessionEvents'].push(JSON.parse(req.body.event))
      if (req.session['sessionEvents'].length >= parseInt(telemetryPacketSize, 10)) {
        /* istanbul ignore next  */
        module.exports.sendTelemetry(req, req.session['sessionEvents'], function (err, status) {
          if (err) {
            console.log('telemetry sync error from  portal', err)
          }
          req.session['sessionEvents'] = []
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
        'requesterId': req.session.userId,
        'did': telemtryEventConfig.default_did,
        'msgid': uuidv1()
      },
      'events': eventsData
    }
    return data
  },
  sendTelemetry: function (req, eventsData, callback) {
    /* istanbul ignore if  */
    if (!eventsData || eventsData.length === 0) {
      if (_.isFunction(callback)) {
        callback(null, true)
      }
    }
    var data = this.prepareTelemetryRequestBody(req, eventsData)
    var options = {
      method: 'POST',
      url: envHelper?.TELEMETRY_SERVICE_LOCAL_URL + 'v1/telemetry',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getBearerToken(req)
      },
      body: data,
      json: true
    }
    /* istanbul ignore next  */
    request(options, function (error, response, body) {
      if (_.isFunction(callback)) {
        /* istanbul ignore if  */
        if (error) {
          console.log('telemetry sync error while syncing  portal', error)
          callback(error, false)
        } else if (body && body.params && body.params.err) {
          /* istanbul ignore next  */
          console.log('telemetry sync error while syncing  portal', body.params.err)
          /* istanbul ignore next  */
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
      actor.type = 'User'
    } else {
      actor.id = req.headers['x-consumer-id'] || telemtryEventConfig.default_userid
      actor.type = req.headers['x-consumer-username'] || telemtryEventConfig.default_username
    }
    return actor
  },

  /**
   * This function helps to generate telemetry for proxy api's
   */
  generateTelemetryForLearnerService: function (req, res, next) {
    req.telemetryEnv = telemtryEventConfig.learnerServiceEnv
    next()
  },

  generateTelemetryForContentService: function (req, res, next) {
    req.telemetryEnv = telemtryEventConfig.contentServiceEnv
    next()
  },

  generateTelemetryForProxy: function (req, res, next) {
    let params = [
      { 'url': req.originalUrl },
      { 'protocol': 'https' },
      { 'method': req.method },
      { 'req': req.body }
    ]
    const edata = telemetry.logEventData('api_access', 'INFO', '', params)
    var channel = (req.session && req.session.rootOrghashTagId) || req.get('x-channel-id')
    if (channel) {
      var dims = req.session['rootOrgId'] || []
      dims = req.session.orgs ? _.concat(dims, req.session.orgs) : dims
      dims = _.concat(dims, channel)
      const context = telemetry.getContextData({ channel: channel, env: req.telemetryEnv })
      if (req.sessionID) {
        context.sid = req.sessionID
      }
      if (req.get('x-device-id')) {
        context.did = req.get('x-device-id')
      }
      context.rollup = telemetry.getRollUpData(dims)
      telemetry.log({
        edata: edata,
        context: context,
        actor: module.exports.getTelemetryActorData(req),
        tags: _.concat([], channel)
      })
    }

    next()
  },

  getTelemetryCdata: function (req, cdata = []) {
    cdata.push({
      id: req.session.userSid,
      type: 'UserSession'
    });
    return cdata;
  }
}