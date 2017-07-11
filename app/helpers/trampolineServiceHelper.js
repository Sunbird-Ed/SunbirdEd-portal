const jwt = require('jsonwebtoken');
async = require('async')
request = require('request'),
    Keycloak = require('keycloak-connect'),
    session = require('express-session'),
    uuidv1 = require('uuid/v1');
dateFormat = require('dateformat')
echoAPI = process.env['sunbird_echo_api_url'] || "https://sunbird-1b.centralindia.cloudapp.azure.com/api/echo/",
    createUserFlag = process.env['sunbird_autocreate_trampoline_user'] || true
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
                            authorization: 'Bearer ' + req.query['token']
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
                    //check user exist
                    self.checkUserExists(self.payload, function(err, status) {
                        if (err) {
                            callback(err, null);
                            return;
                        } else if (status) {
                            callback(null, status)
                            return;
                        } else {
                            //create User
                            if (createUserFlag) {
                                self.createUser(self.payload, function(error, status) {
                                    if (error) {
                                        callback(error, null);
                                        return;
                                    } else if (status) {
                                        callback(null, status)
                                        return;
                                    } else {
                                        callback('unable to create user', null);
                                        return;
                                    }
                                })
                            } else{
                                callback('user not found', null)
                            }

                        }
                    })
                },
                getGrantFromUserName: function(callback) {
                    var userName = self.payload['sub'] + (self.payload['iss'] ? '@' + self.payload['iss'] : '')
                    keycloak.grantManager.obtainDirectly(userName)
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
    },
    checkUserExists: function(payload, callback) {
        var loginId = payload['sub'] + (payload['iss'] ? '@' + payload['iss'] : '')
        var options = {
            method: 'POST',
            url: learnerURL + 'user/getuser',
            headers: {
                'x-device-id': 'trampoline',
                'x-msgid': uuidv1(),
                'ts': dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                'x-consumer-id': '7c03ca2e78326957afbb098044a3f60783388d5cc731a37821a20d95ad497ca8',
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: { params: {}, request: { loginId: loginId } },
            json: true
        };

        request(options, function(error, response, body) {
            if (error) {
                callback(error, null)
                return;
            }
            if (body.responseCode === 'RESOURCE_NOT_FOUND') {
                callback(null, false)
                return;
            } else if (body.responseCode === 'OK') {
                callback(null, true);
            }
        });
    },
    createUser: function(payload, callback) {
        var options = {
            method: 'POST',
            url: learnerURL + 'user/create',
            headers: {
                ts: dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
                'x-msgid': uuidv1(),
                'x-device-id': 'trampoline',
                'x-consumer-id': '7c03ca2e78326957afbb098044a3f60783388d5cc731a37821a20d95ad497ca8',
                id: 'id',
                'content-type': 'application/json',
                accept: 'application/json'
            },
            body: {
                params: {},
                request: {
                    firstName: payload['name'],
                    email: payload['email'],
                    emailVerified: payload['email_verified'],
                    userName: payload['sub'],
                    phone: payload['phone_number'],
                    phoneNumberVerified: payload['phone_number_verified'],
                    provider: payload['iss']
                }
            },
            json: true
        };
        request(options, function(error, response, body) {
            if (error) {
                callback(error, null)
                return;
            } else if (body.responseCode === 'OK') {
                callback(null, true);
            } else {
                callback(body.params.err, null);
            }
        });
    }
}
