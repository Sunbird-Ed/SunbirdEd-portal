'use strict'
const express = require('express')
const app = express()
const proxy = require('express-http-proxy')
const Keycloak = require('keycloak-connect')
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')
const async = require('async')
const helmet = require('helmet')
const CassandraStore = require('cassandra-session-store')
const _ = require('lodash')
const compression = require('compression')
const trampolineServiceHelper = require('./helpers/trampolineServiceHelper.js')
const telemetryHelper = require('./helpers/telemetryHelper.js')
const permissionsHelper = require('./helpers/permissionsHelper.js')
const tenantHelper = require('./helpers/tenantHelper.js')
const envHelper = require('./helpers/environmentVariablesHelper.js')
const userHelper = require('./helpers/userHelper.js')
const proxyUtils = require('./proxy/proxyUtils.js')
const healthService = require('./helpers/healthCheckService.js')
const fs = require('fs')
const reqDataLimitOfContentEditor = '50mb'
const reqDataLimitOfContentUpload = '50mb'
const portal = this
const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'helpers/telemetryEventConfig.json')))
const oneDayMS = 86400000;
const request = require('request');
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
let memoryStore = null

if (envHelper.PORTAL_SESSION_STORE_TYPE === 'in-memory') {
  memoryStore = new session.MemoryStore()
} else {
  memoryStore = new CassandraStore({
    'table': 'sessions',
    'client': null,
    'clientOptions': {
      'contactPoints': envHelper.PORTAL_CASSANDRA_URLS,
      'keyspace': 'portal',
      'queryOptions': {
        'prepare': true
      }
    }
  }, function () { })
}

let keycloak = new Keycloak({ store: memoryStore }, {
  'realm': envHelper.PORTAL_REALM,
  'auth-server-url': envHelper.PORTAL_AUTH_SERVER_URL,
  'ssl-required': 'none',
  'resource': envHelper.PORTAL_AUTH_SERVER_CLIENT,
  'public-client': true
})

app.use(helmet())
app.use(session({
  secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
  resave: false,
  saveUninitialized: false,
  store: memoryStore
}))

app.use(keycloak.middleware({ admin: '/callback', logout: '/logout' }))

app.set('view engine', 'ejs')

app.get(['/dist/*.js', '/dist/*.css', '/dist/*.ttf', '/dist/*.woff2',
  '/dist/*.woff', '/dist/*.eot', '/dist/*.svg'],
  compression(), function (req, res, next) {
    res.setHeader("Cache-Control", "public, max-age=" + oneDayMS * 30);
    res.setHeader("Expires", new Date(Date.now() + oneDayMS * 30).toUTCString());
    next();
  });

app.all(['/server.js', '/helpers/*.js', '/helpers/**/*.js'], function (req, res) {
  res.sendStatus(404);
})

app.get('/assets/images/*', function (req, res, next) {
  res.setHeader("Cache-Control", "public, max-age=" + oneDayMS);
  res.setHeader("Expires", new Date(Date.now() + oneDayMS).toUTCString());
  next();
});

app.use(express.static(path.join(__dirname, 'dist'), { extensions: ['ejs'], index: false }))

// Announcement routing
app.use('/announcement/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '10mb' }), require('./helpers/announcement')(keycloak))

app.all('/logoff', endSession, function (req, res) {
  res.cookie('connect.sid', '', { expires: new Date() })
  res.redirect('/logout')
})

// healthcheck
app.get('/health', healthService.createAndValidateRequestBody, healthService.checkHealth)

// client app routes
require('./routes/clientRoutes.js')(app, keycloak)

app.all('/content-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents)

app.all('/collection-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents)

// learner Api routes 
require('./routes/learnerRoutes.js')(app)

app.all('/content/data/v1/telemetry',
  proxy(envHelper.TELEMETRY_SERVICE_LOCAL_URL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      return require('url').parse(envHelper.TELEMETRY_SERVICE_LOCAL_URL + telemtryEventConfig.endpoint).path
    }
  }))

app.all('/action/data/v3/telemetry',
  proxy(envHelper.TELEMETRY_SERVICE_LOCAL_URL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      return require('url').parse(envHelper.TELEMETRY_SERVICE_LOCAL_URL + telemtryEventConfig.endpoint).path
    }
  }))

// middleware to add CORS headers
function addCorsHeaders(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization,' +
    'cid, user-id, x-auth, Cache-Control, X-Requested-With, *')

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  };
}

// tenant Api's
app.get('/v1/tenant/info', addCorsHeaders, tenantHelper.getInfo)
app.get('/v1/tenant/info/:tenantId', addCorsHeaders, tenantHelper.getInfo)

// public Api routes 
require('./routes/publicRoutes.js')(app)

// proxy urls
require('./proxy/contentEditorProxy.js')(app, keycloak)

// content Api routes 
require('./routes/contentRoutes.js')(app)

// Local proxy for content and learner service
require('./proxy/localProxy.js')(app)

app.all('/v1/user/session/create', function (req, res) {
  trampolineServiceHelper.handleRequest(req, res, keycloak)
})

app.get('/v1/user/session/start/:deviceId', function (req, res) {
  if (req.session.logSession === false) {
    req.session.deviceId = req.params.deviceId
    telemetryHelper.logSessionStart(req)
    req.session.logSession = true
  }
  res.status(200)
  res.end()
})

// Resource bundles apis
app.use('/resourcebundles/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '50mb' }), require('./helpers/resourceBundles')(express))

// redirect to home if nothing found
app.all('*', function (req, res) {
  res.redirect('/')
})

/*
 * Method called after successful authentication and it will log the telemetry for CP_SESSION_START and updates the login time
 */
keycloak.authenticated = function (request) {
  request.session.logSession = false
  async.series({
    getUserData: function (callback) {
      permissionsHelper.getCurrentUserRoles(request, callback)
    },
    getPermissionData: function (callback) {
      permissionsHelper.getPermissions(request)
      callback()
    },
    updateLoginTime: function (callback) {
      userHelper.updateLoginTime(request, callback)
    }
  }, function (err, results) {
    if (err) {
      console.log('err', err)
    }
  })
}
function endSession(request, response, next) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  delete request.session['orgs']
  if (request.session) {
    if (_.get(request, 'kauth.grant.access_token.content.sub')) { telemetryHelper.logSessionEnd(request) }

    request.session.sessionEvents = request.session.sessionEvents || []
    delete request.session.sessionEvents
    delete request.session['deviceId']
  }
  next()
}

keycloak.deauthenticated = function (request) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  delete request.session['orgs']
  req.session.logSession = true
  if (request.session) {
    telemetryHelper.logSessionEnd(request)
    request.session.sessionEvents = request.session.sessionEvents || []
    delete request.session.sessionEvents
    delete request.session['deviceId']
  }
}

if (!process.env.sunbird_environment || !process.env.sunbird_instance) {
  console.error('please set environment variable sunbird_environment, ' +
    'sunbird_instance  start service Eg: sunbird_environment = dev, sunbird_instance = sunbird')
  process.exit(1)
}

portal.server = app.listen(envHelper.PORTAL_PORT, function () {
  if (envHelper.PORTAL_CDN_URL) {
    request(envHelper.PORTAL_CDN_URL + 'index_' + packageObj.version + '.' + packageObj.buildNumber + '.ejs').pipe(fs.createWriteStream(path.join(__dirname, 'dist', 'index.ejs')));
  }
  console.log('app running on port ' + envHelper.PORTAL_PORT)
})


exports.close = function () {
  portal.server.close()
}

// Telemetry initialization
const telemetryConfig = {
  pdata: { id: envHelper.APPID, ver: packageObj.version },
  method: 'POST',
  batchsize: process.env.sunbird_telemetry_sync_batch_size || 200,
  endpoint: telemtryEventConfig.endpoint,
  host: envHelper.TELEMETRY_SERVICE_LOCAL_URL,
  authtoken: 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
}

telemetry.init(telemetryConfig)
