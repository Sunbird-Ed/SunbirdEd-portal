const request = require("request"),
    parser = require('ua-parser-js'),
    uuidv1 = require('uuid/v1'),
    contentURL = process.env.sunbird_content_player_url || 'http://localhost:5000/v1/';
telemetry_packet_size = process.env.sunbird_telemetry_packet_size || 2;

module.exports = {
    logSessionStart: function(req) {
        var ua = parser(req.headers['user-agent']);
        var event = [{
            "ver": "2.0",
            "uid": req.kauth.grant.access_token.content.sub,
            "sid": "",
            "did": "",
            "edata": {
                "eks": {
                    "authprovider": "Keycloak",
                    "uaspec": {
                        "agent": ua["browser"]["name"],
                        "ver": ua["browser"]["version"],
                        "system": ua["os"]["name"],
                        "platform": ua["engine"]["name"],
                        "raw": ua['ua']
                    }
                }
            },
            "eid": "CP_SESSION_START",
            "cdata": [{
                "id": "",
                "type": ""
            }],
            "ets": new Date().getTime()
        }];
        this.sendTelemetry(req, event, function(status) {})
    },
    logContentEditorEvents: function(req, res) {
        var self = this;
        if (req.body && req.body.event) {
            req.session['ceTelemetryEvents'] = req.session['ceTelemetryEvents'] || [];
            req.session['ceTelemetryEvents'].push(req.body.event);
            if (req.session['ceTelemetryEvents'].length >= telemetry_packet_size) {
                module.exports.sendTelemetry(req ,req.session['ceTelemetryEvents'], function(status) {
                });
            }
        }
        res.end();
    },
    prepareTelemetryRequestBody: function(req, eventsData) {
        var data = {
            "id": "ekstep.telemetry",
            "ver": "1.0",
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
        var data = this.prepareTelemetryRequestBody(req, eventsData)
        var options = {
            method: 'POST',
            url: contentURL + 'telemetry',
            headers: {
                'content-type': 'application/json'
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
