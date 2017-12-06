const jwt = require('jsonwebtoken')
const async = require('async')
const request = require('request')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
const uuidv1 = require('uuid/v1')
const dateFormat = require('dateformat')
const permissionsHelper = require('./permissionsHelper.js')
const telemetryHelper = require('./telemetryHelper.js')
const envHelper = require('./environmentVariablesHelper.js')
const echoAPI = envHelper.PORTAL_ECHO_API_URL
const createUserFlag = envHelper.PORTAL_AUTOCREATE_TRAMPOLINE_USER
const learnerURL = envHelper.LEARNER_URL
const trampolineClientId = envHelper.PORTAL_TRAMPOLINE_CLIENT_ID
const trampolineServerUrl = envHelper.PORTAL_AUTH_SERVER_URL
const trampolineRealm = envHelper.PORTAL_REALM
const trampolineSecret = envHelper.PORTAL_TRAMPOLINE_SECRET
const learnerAuthorization = envHelper.PORTAL_API_AUTH_TOKEN
let memoryStore = new session.MemoryStore()
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
    async.series({
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
        request(options, function (error, response, body) {
          self.errorMsg = 'Request credentials verification failed. Please try with valid credentials.'
          if (error) {
            console.log('echo API error', error)
            callback(error, response)
          } else if (body === '/test') {
            self.errorMsg = undefined
            console.log('echo API succesful')
            callback(null, response)
          } else {
            console.log('echo returned invalid response', body)
            callback(body, response)
          }
        })
      },
      verifyRequest: function (callback) {
        self.payload = jwt.decode(req.query['token'])
        var timeInSeconds = parseInt(Date.now() / 1000)
        self.errorMsg = 'Request credentials verification failed. Please try with valid credentials.'
        if (!(self.payload['iat'] && self.payload['iat'] < timeInSeconds)) {
          callback(new Error('Token issued time is not available or it is in future'), null)
        } else if (!(self.payload['exp'] && self.payload['exp'] > timeInSeconds)) {
          callback(new Error('Token expired time is not available or it is expired'), null)
        } else if (!self.payload['sub']) {
          callback(new Error('user id not present'), null)
        } else {
          self.errorMsg = undefined
          callback(null, {})
        }
      },
      verifyUser: function (callback) {
        // check user exist
        self.checkUserExists(self.payload, function (err, status) {
          self.errorMsg = 'Failed to create/authenticate user. Please try again with valid user data'
          if (err) {
            console.log('get user profile API error', err)
            callback(err, null)
          } else if (status) {
            self.errorMsg = undefined
            console.log('user already exists')
            callback(null, status)
          } else {
            // create User
            console.log('create User Flag', createUserFlag, 'type of', typeof createUserFlag)
            if (createUserFlag === 'true') {
              self.createUser(self.payload, function (error, status) {
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
            self.errorMsg = undefined
            callback(null, grant)
          },
          function (err) {
            console.log('grant failed', err)
            callback(err, null)
          })
      }
    },
    function (err, results) {
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
  checkUserExists: function (payload, callback) {
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
      console.log('check user exists', JSON.stringify(body))
      if (body.responseCode === 'RESOURCE_NOT_FOUND') {
        callback(null, false)
      } else if (body.responseCode === 'OK') {
        callback(null, true)
      } else if (error || response.statusCode !== 200) {
        var err = error || body
        callback(err, false)
      }
    })
  },
  createUser: function (payload, callback) {
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
    request(options, function (error, response, body) {
      console.log('create user', body)
      if (error || response.statusCode !== 200) {
        var err = error || body
        callback(err, null)
      } else if (body.responseCode === 'OK') {
        callback(null, true)
      } else {
        callback(body.params.err, null)
      }
    })
  }
}

// Method called after successful authentication and it will log the telemetry
// for CP_SESSION_START
keycloak.authenticated = function (request) {
  async.series({
    getUserData: function (callback) {
      permissionsHelper.getCurrentUserRoles(request, callback)
    },
    logSession: function (callback) {
      telemetryHelper.logSessionStart(request, callback)
    }
  }, function (err, results) {
    if (err) {} // not handling error for logging telemetry
    console.log('res', results)
  })
}

keycloak.deauthenticated = function (request) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    telemetryHelper.sendTelemetry(request, request.session.sessionEvents, function (err, status) {
      if (err) {} // nothing to do on error
      // remove session data
      delete request.session.sessionEvents
    })
  }
}
