const jwt = require('jsonwebtoken')
const async = require('async')
const request = require('request')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
const uuidv1 = require('uuid/v1')
const dateFormat = require('dateformat')
const CassandraStore = require('cassandra-session-store')
const _ = require('lodash')
const permissionsHelper = require('./permissionsHelper.js')
const telemetryHelper = require('./telemetryHelper.js')
const envHelper = require('./environmentVariablesHelper.js')
const userHelper = require('./userHelper.js')
const echoAPI = envHelper.PORTAL_ECHO_API_URL
const createUserFlag = envHelper.PORTAL_AUTOCREATE_TRAMPOLINE_USER
const learnerURL = envHelper.LEARNER_URL
const trampolineClientId = envHelper.PORTAL_TRAMPOLINE_CLIENT_ID
const trampolineServerUrl = envHelper.PORTAL_AUTH_SERVER_URL
const trampolineRealm = envHelper.PORTAL_REALM
const trampolineSecret = envHelper.PORTAL_TRAMPOLINE_SECRET
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
let cassandraCP = envHelper.PORTAL_CASSANDRA_URLS
let memoryStore = null

if (envHelper.PORTAL_SESSION_STORE_TYPE === 'in-memory') {
  memoryStore = new session.MemoryStore()
} else {
  memoryStore = new CassandraStore({
    'table': 'sessions',
    'client': null,
    'clientOptions': {
      'contactPoints': cassandraCP,
      'keyspace': 'portal',
      'queryOptions': {
        'prepare': true
      }
    }
  }, function () {})
}

let keycloak = new Keycloak({ store: memoryStore }, {
  clientId: trampolineClientId,
  bearerOnly: true,
  serverUrl: trampolineServerUrl,
  realm: trampolineRealm,
  credentials: {
    secret: trampolineSecret
  }
})

module.exports = {
  handleRequest: function (req, res) {
    let self = this
    var jwtPayload = jwt.decode(req.query['token'])

    async.series(
      {
        getChannel: function (callback) {
          self.getUserChannel(req, jwtPayload, callback)
        },
        logSSOStartEvent: function (callback) {
          console.log('SSO start event')
          telemetryHelper.logSSOStartEvent(req)
          callback()
        },
        verifySignature: function (callback) {
          console.log('echoAPI : ' + echoAPI)
          var options = {
            method: 'GET',
            url: echoAPI + '/test',
            'rejectUnauthorized': false,
            headers: {
              'cache-control': 'no-cache',
              authorization: 'Bearer ' + req.query['token']
            }
          }

          const telemetryData = {reqObj: req,
            options: options,
            uri: 'test',
            userId: jwt.decode(req.query['token']).sub || req.headers['x-consumer-userid']}
          // telemetryHelper.logAPICallEvent(telemetryData)

          request(options, function (error, response, body) {
            telemetryData.statusCode = response.statusCode
            self.errorMsg = 'Request credentials verification failed. Please try with valid credentials.'
            if (error) {
              telemetryData.resp = body
              telemetryHelper.logAPIErrorEvent(telemetryData)
              console.log('echo API error', error)
              callback(error, response)
            } else if (body === '/test') {
              self.errorMsg = undefined
              console.log('echo API succesful with token:', req.query['token'])
              callback(null, response)
            } else {
              telemetryData.resp = body
              telemetryHelper.logAPIErrorEvent(telemetryData)
              console.log('echo returned invalid response', body, ' for token ', req.query['token'])
              callback(body, response)
            }
          })
        },
        verifyRequest: function (callback) {
          self.payload = jwt.decode(req.query['token'])
          var timeInSeconds = parseInt(Date.now() / 1000)
          self.errorMsg = 'Request credentials verification failed. Please try with valid credentials.'
          if (!(self.payload['iat'] && self.payload['iat'] < timeInSeconds)) {
            callback(
              new Error('Token issued time is not available or it is in future, Token :', req.query['token'])
              , null)
          } else if (!(self.payload['exp'] && self.payload['exp'] > timeInSeconds)) {
            callback(new Error('Token expired time is not available or it is expired Token :',
              req.query['token']), null)
          } else if (!self.payload['sub']) {
            callback(new Error('user id not present Token :', req.query['token']), null)
          } else {
            self.errorMsg = undefined
            callback(null, {})
          }
        },
        verifyUser: function (callback) {
        // check user exist
          self.checkUserExists(req, self.payload, function (err, status) {
            self.errorMsg = 'Failed to create/authenticate user. Please try again with valid user data'
            if (!err) {
              self.errorMsg = undefined
              console.log('user already exists')
              callback(null, status)
            } else {
            // create User
              console.log('create User Flag', createUserFlag, 'type of', typeof createUserFlag)
              if (createUserFlag === 'true') {
                self.createUser(req, self.payload, function (error, status) {
                  if (error) {
                    console.log('create user failed', error)
                    callback(error, null)
                  } else if (status) {
                    self.errorMsg = undefined
                    console.log('create user successful')
                    callback(null, status)
                  } else {
                    console.log('unable to create user')
                    callback(new Error('unable to create user'), null)
                  }
                })
              } else {
                callback(new Error('user not found'), null)
              }
            }
          })
        },
        getGrantFromUserName: function (callback) {
          var userName = self.payload['sub'] + (self.payload['iss'] ? '@' + self.payload['iss'] : '')
          self.errorMsg = 'Request credentials verification failed. Please try with valid credentials.'
          keycloak.grantManager.obtainDirectly(userName)
            .then(function (grant) {
              keycloak.storeGrant(grant, req, res)
              req.kauth.grant = grant
              try {
                keycloak.authenticated(req)
              } catch (err) {
                console.log(err)
                callback(err, null)
                return
              };
              telemetryHelper.logGrantLogEvent({
                reqObj: req,
                userId: userName,
                success: grant})
              self.errorMsg = undefined
              callback(null, grant)
            },
            function (err) {
              telemetryHelper.logGrantLogEvent({
                reqObj: req,
                userId: userName,
                err: err})
              console.log('grant failed', err, userName)
              callback(err, null)
            })
        }
      },
      function (err, results) {
        telemetryHelper.logSSOEndEvent(req)
        console.log('logSSOEndEvent')
        if (err) {
          console.log('err', err)
          res.redirect((req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '?error=' + Buffer.from(self.errorMsg).toString('base64'))
        } else {
          console.log('grant successful')
          if (self.payload['redirect_uri']) {
            res.redirect(self.payload['redirect_uri'])
          } else {
            res.redirect((req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/private/index')
          }
        }
      })
  },
  checkUserExists: function (req, payload, callback) {
    var loginId = payload['sub'] + (payload['iss'] ? '@' + payload['iss'] : '')
    var options = {
      method: 'POST',
      url: learnerURL + 'user/v1/profile/read',
      headers: {
        'x-device-id': 'trampoline',
        'x-msgid': uuidv1(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'x-consumer-id': learnerAuthorization,
        'content-type': 'application/json',
        accept: 'application/json',
        'Authorization': 'Bearer ' + learnerAuthorization
      },
      body: { params: {}, request: { loginId: loginId } },
      json: true
    }

    const telemetryData = {reqObj: req,
      options: options,
      uri: 'user/v1/profile/read',
      type: 'user',
      id: loginId,
      userId: loginId}
    // telemetryHelper.logAPICallEvent(telemetryData)

    request(options, function (error, response, body) {
      telemetryData.statusCode = response.statusCode
      console.log('check user exists', response.statusCode, 'for Login Id :', loginId)
      if (body.responseCode === 'OK') {
        callback(null, true)
      } else {
        telemetryData.resp = body
        telemetryHelper.logAPIErrorEvent(telemetryData)
        var err = error || body || true
        callback(err, false)
      }
    })
  },
  createUser: function (req, payload, callback) {
    var options = {
      method: 'POST',
      url: learnerURL + 'user/v1/create',
      headers: {
        ts: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'x-msgid': uuidv1(),
        'x-device-id': 'trampoline',
        'x-consumer-id': learnerAuthorization,
        id: 'id',
        'content-type': 'application/json',
        accept: 'application/json',
        'Authorization': 'Bearer ' + learnerAuthorization
      },
      body: {
        params: {},
        request: {
          firstName: payload['name'],
          email: payload['email'],
          emailVerified: payload['email_verified'],
          userName: payload['sub'],
          phone: payload['phone_number'],
          phoneVerified: payload['phone_number_verified'],
          provider: payload['iss']
        }
      },
      json: true
    }
    const telemetryData = {reqObj: req,
      options: options,
      uri: 'user/v1/create',
      type: 'user',
      id: options.headers['x-consumer-id'],
      userId: options.headers['x-consumer-id']}
    // telemetryHelper.logAPICallEvent(telemetryData)

    request(options, function (error, response, body) {
      telemetryData.statusCode = response.statusCode
      if (error || response.statusCode !== 200) {
        telemetryData.resp = body
        telemetryHelper.logAPIErrorEvent(telemetryData)
        var err = error || body
        callback(err, null)
      } else if (body.responseCode === 'OK') {
        callback(null, true)
      } else {
        telemetryData.resp = body
        telemetryHelper.logAPIErrorEvent(telemetryData)
        callback(body.params.err, null)
      }
    })
  },
  getUserChannel: function (req, payload, callback) {
    var loginId = payload['sub'] + (payload['iss'] ? '@' + payload['iss'] : '')
    var options = {
      method: 'POST',
      url: learnerURL + 'user/v1/profile/read',
      headers: {
        'x-device-id': 'trampoline',
        'x-msgid': uuidv1(),
        'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
        'x-consumer-id': learnerAuthorization,
        'content-type': 'application/json',
        accept: 'application/json',
        'Authorization': 'Bearer ' + learnerAuthorization
      },
      body: { params: {}, request: { loginId: loginId } },
      json: true
    }

    request(options, function (error, response, body) {
      console.log('get user channel ', response.statusCode, 'for Login Id :', loginId, 'error', error)

      if (body.responseCode === 'OK') {
        req['headers']['X-Channel-Id'] = _.get(req, 'headers.X-Channel-Id') ||
         _.get(body, 'result.response.rootOrg.hashTagId')
        callback(null, _.get(body, 'result.response.rootOrg.hashTagId'))
      } else {
        callback(null, null)
      }
    })
  }
}

// Method called after successful authentication and it will log the telemetry
// for CP_SESSION_START
keycloak.authenticated = function (request) {
  permissionsHelper.getPermissions(request)
  async.series({
    getUserData: function (callback) {
      permissionsHelper.getCurrentUserRoles(request, callback)
    },
    updateLoginTime: function (callback) {
      userHelper.updateLoginTime(request, callback)
    },
    logSession: function (callback) {
      telemetryHelper.logSessionStart(request, callback)
    }
  }, function (err, results) {
    if (err) {
      console.log('err', err)
    }
  })
}

keycloak.deauthenticated = function (request) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    telemetryHelper.logSessionEnd(request)
    delete request.session.sessionEvents
  }
}
