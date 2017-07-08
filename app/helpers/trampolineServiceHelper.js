const jwt = require('jsonwebtoken');
async = require('async')
request = require('request'),
    Keycloak = require('keycloak-connect'),
    session = require('express-session'),
    uuidv1 = require('uuid/v1');
echoAPI = process.env['sunbird_echo_api_url'] || "https://sunbird-1b.centralindia.cloudapp.azure.com/api/echo/",
    learnerURL = process.env.sunbird_learner_player_url || 'http://52.172.36.121:9000/v1/';
let memoryStore = new session.MemoryStore();
var keycloak = new Keycloak({ store: memoryStore }, {
    clientId: 'trampoline',
    bearerOnly: true,
    serverUrl: 'https://keycloakidp-coacher.rhcloud.com/auth',
    realm: 'sunbird',
    credentials: {
        secret: "36c4277f-d59b-4ea2-b788-964b96bd47d1"
    }
});

module.exports = {
    handleRequest: function(req, res) {
        var self = this,
            payload;
        async.series({
                verifySignature: function(callback) {
                    var options = {
                        method: 'GET',
                        url: echoAPI + 'test',
                        "rejectUnauthorized": false,
                        headers: {
                            'cache-control': 'no-cache',
                            authorization: 'Bearer '+req.query['token']
                        }
                    };
                    request(options, function(error, response, body) {
                        if (error) {
                            callback(error, response);
                        } else if (body === '/test') {
                            callback(null, response);
                        } else {
                            callback(body, response);
                        }

                    });
                },
                verifyRequest: function(callback) {
                    self.payload = jwt.decode(req.query['token']);
                    var timeInSeconds = parseInt(Date.now() / 1000);
                    if (!(self.payload['iat'] && self.payload['iat'] < timeInSeconds)) {
                        callback('Token issued time is not available or it is in future', null)
                    } else if (!(self.payload['exp'] && self.payload['exp'] > timeInSeconds)) {
                        callback('Token expired time is not available or it is expired', null)
                    } else if (!self.payload['sub']) {
                        callback('user id not present', null)
                    } else {
                        callback(null, {});
                    }
                },
                verifyUser: function(callback) {
                    //check user exists
                    //TODO: get USER and create USER implementation 

                    callback(null, {})
                },
                getGrantFromUserName: function(callback) {
                    keycloak.grantManager.obtainDirectly(self.payload['sub'])
                        .then(function(grant) {
                                keycloak.storeGrant(grant, req, res);
                                req.kauth.grant = grant;
                                try {
                                    keycloak.authenticated(req);
                                } catch (err) {
                                    console.log(err);
                                };
                                callback(null, grant);
                            },
                            function(err) {
                                callback(err, null)
                            });
                }
            },
            function(err, results) {
                if (err) {
                    res.redirect((req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host'));
                } else {
                    if (self.payload['redirect_url']) {
                        res.redirect(self.payload['redirect_url'])
                    } else {
                        res.redirect((req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/private/index');
                    }
                }
            });
    }
}
