const request = require("request"),
    parser = require('ua-parser-js'),
    uuidv1 = require('uuid/v1'),
    contentURL = process.env.sunbird_content_player_url || 'http://localhost:5000/v1/';
module.exports = {
    logSessionStart: function(req) {
        var ua = parser(req.headers['user-agent']);
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
            "events": [{
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
            }]
        }

        var options = {
            method: 'POST',
            url: contentURL+'telemetry',
            headers: {
                'content-type': 'application/json'
            },
            body: data,
            json: true
        };
        request(options, function(error, response, body) {
        });
    }
}
