const request = require('request')
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

module.exports = {
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

  logSessionStart: function (req, callback) {
    req.session.orgs = _.compact(req.session.orgs)
    req.session.save()
    var channel = req.session.rootOrghashTagId
    var dims = _.clone(req.session.orgs)
    dims = dims ? _.concat(dims, channel) : channel

    const edata = telemetry.startEventData('session')
    edata.uaspec = this.getUserSpec(req)
    const context = telemetry.getContextData({ channel: channel, env: 'user' })
    context.sid = req.sessionID
    const actor = telemetry.getActorData(req.kauth.grant.access_token.content.sub, 'user')
    telemetry.start({
      edata: edata,
      context: context,
      actor: actor,
      tags: dims
    })
    return callback()
  },
  logSessionEnd: function (req) {
    const edata = telemetry.endEventData('session')
    const actor = telemetry.getActorData(req.kauth.grant.access_token.content.sub, 'user')
    var dims = _.clone(req.session.orgs)
    var channel = req.session.rootOrghashTagId || md5('sunbird')
    dims = dims ? _.concat(dims, channel) : channel
    telemetry.end({
      edata: edata,
      actor: actor,
      tags: dims
    })
  },

  logSessionEvents: function (req, res) {
    if (req.body && req.body.event) {
      req.session['sessionEvents'] = req.session['sessionEvents'] || []
      req.session['sessionEvents'].push(JSON.parse(req.body.event))
      if (req.session['sessionEvents'].length >= telemetryPacketSize) {
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
      'ver': '2.1',
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'params': {
        'requesterId': req.kauth.grant.access_token.content.sub,
        'did': 'portal',
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
  }
}
