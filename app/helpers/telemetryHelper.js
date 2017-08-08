const request = require("request"),
  parser = require('ua-parser-js'),
  _ = require('lodash'),
  uuidv1 = require('uuid/v1'),
  envHelper = require('./environmentVariablesHelper.js'),
  appId = envHelper.APPID,
contentURL = envHelper.CONTENT_URL,
  learner_authorization = envHelper.PORTAL_API_AUTH_TOKEN,
  md5 = require('js-md5'),
telemetry_packet_size = envHelper.PORTAL_TELEMETRY_PACKET_SIZE;

module.exports = {
  logSessionStart: function(req, callback) {
    var ua = parser(req.headers['user-agent']);
    req.session.orgs.push(req.session.rootOrgId);
    req.session.orgs = _.compact(req.session.orgs);
    req.session.save();
    var dims = _.clone(req.session.orgs);
    dims.forEach(function(value, index, arr) {
      arr[index] = md5(value);
    });
    var channel = md5(req.session.rootOrgId || 'sunbird');
    var event = {
      "ver": "2.1",
      "uid": req.kauth.grant.access_token.content.sub,
      "did": "",
      "edata": {
        "eks": {
          "authprovider": "keycloak",
          "uaspec": {
            "agent": ua["browser"]["name"],
            "ver": ua["browser"]["version"],
            "system": ua["os"]["name"],
            "platform": ua["engine"]["name"],
            "raw": ua['ua']
          }
        }
      },
      "context": {
        "sid": req.sessionID
      },
      "eid": "CP_SESSION_START",
      "channel": channel,
      "cdata": [{
        "id": "",
        "type": ""
      }],
      "etags": {
        "app": [],
        "partner": [],
        "dims": dims
      },
      "pdata": { "id": appId, "ver": "1.0" },
      "ets": new Date().getTime()
    };
    event.mid = 'SB:' + md5(JSON.stringify(event));
    this.sendTelemetry(req, [event], function(status) {
      console.log(status)
      callback(null, status)
    })
  },
  logSessionEvents: function(req, res) {
    var self = this;
    if (req.body && req.body.event) {
      req.session['sessionEvents'] = req.session['sessionEvents'] || [];
      req.session['sessionEvents'].push(JSON.parse(req.body.event));
      if (req.session['sessionEvents'].length >= telemetry_packet_size) {
        module.exports.sendTelemetry(req, req.session['sessionEvents'], function(status) {
          req.session['sessionEvents'] = [];
          req.session.save();
        });
      }
    }
    res.end();
  },
  prepareTelemetryRequestBody: function(req, eventsData) {
    var data = {
      "id": "ekstep.telemetry",
      "ver": "2.1",
      "ts": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
      "params": {
        "requesterId": req.kauth.grant.access_token.content.sub,
        "did": "portal",
        "key": "13405d54-85b4-341b-da2f-eb6b9e546fff",
        "msgid": uuidv1()
      },
      "events": eventsData
    }
    return data
  },
  sendTelemetry: function(req, eventsData, callback) {
    if (!eventsData || eventsData.length == 0) {
      if (callback) {
        callback(true);
      }
    }
    var data = this.prepareTelemetryRequestBody(req, eventsData)
    var options = {
      method: 'POST',
      url: contentURL + 'data/v1/telemetry',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + learner_authorization
      },
      body: data,
      json: true
    };
    request(options, function(error, response, body) {
      if (callback) {
        if (error) {
          callback(false);
        } else if (body && body.params && body.params.err) {
          callback(false);
        } else {
          callback(true)
        }
      }
    });
  }
}
