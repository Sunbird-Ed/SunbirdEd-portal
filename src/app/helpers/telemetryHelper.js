const request = require('request')
const parser = require('ua-parser-js')
const _ = require('lodash')
const uuidv1 = require('uuid/v1')
const dateFormat = require('dateformat')
const envHelper = require('./environmentVariablesHelper.js')
const appId = envHelper.APPID
const contentURL = envHelper.CONTENT_URL
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
const md5 = require('js-md5')
const telemetryPacketSize = envHelper.PORTAL_TELEMETRY_PACKET_SIZE

module.exports = {
  logSessionStart: function (req, callback) {
    var ua = parser(req.headers['user-agent'])
    req.session.orgs = _.compact(req.session.orgs)
    req.session.save()
    var channel = req.session.rootOrghashTagId
    var dims = _.clone(req.session.orgs)
    dims = _.concat(dims, channel)
    var event = {
      'ver': '2.1',
      'uid': req.kauth.grant.access_token.content.sub,
      'did': '',
      'edata': {
        'eks': {
          'authprovider': 'keycloak',
          'uaspec': {
            'agent': ua['browser']['name'],
            'ver': ua['browser']['version'],
            'system': ua['os']['name'],
            'platform': ua['engine']['name'],
            'raw': ua['ua']
          }
        }
      },
      'context': {
        'sid': req.sessionID
      },
      'eid': 'CP_SESSION_START',
      'channel': channel,
      'cdata': [{
        'id': '',
        'type': ''
      }],
      'etags': {
        'app': [],
        'partner': [],
        'dims': dims
      },
      'pdata': { 'id': appId, 'ver': '1.0' },
      'ets': new Date().getTime()
    }
    event.mid = 'SB:' + md5(JSON.stringify(event))
    this.sendTelemetry(req, [event], function (err, status) {
      callback(err, status)
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
