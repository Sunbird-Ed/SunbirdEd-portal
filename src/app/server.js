'use strict'
const express = require('express')
const proxy = require('express-http-proxy')
const session = require('express-session')
const path = require('path')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const uuid = require('uuid/v1')
const dateFormat = require('dateformat')
const _ = require('lodash')
const trampolineServiceHelper = require('./helpers/trampolineServiceHelper.js')
const telemetryHelper = require('./helpers/telemetryHelper.js')
const tenantHelper = require('./helpers/tenantHelper.js')
const envHelper = require('./helpers/environmentVariablesHelper.js')
const proxyUtils = require('./proxy/proxyUtils.js')
const healthService = require('./helpers/healthCheckService.js')
const { getKeyCloakClient, memoryStore } = require('./helpers/keyCloakHelper')
const fs = require('fs')
const request = require('request');
const reqDataLimitOfContentEditor = '50mb'
const reqDataLimitOfContentUpload = '50mb'
const portal = this
const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'helpers/telemetryEventConfig.json')))
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const { frameworkAPI } = require('@project-sunbird/ext-framework-server/api');
const frameworkConfig = require('./framework.config.js');
const configHelper = require('./helpers/configServiceSDKHelper.js')



const app = express()

let keycloak = getKeyCloakClient({
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

// announcement api routes
app.use('/announcement/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '10mb' }), require('./helpers/announcement')(keycloak))

app.all('/logoff', endSession, (req, res) => {
  res.cookie('connect.sid', '', { expires: new Date() })
  res.redirect('/logout')
})

// health check api
app.get('/health', healthService.createAndValidateRequestBody, healthService.checkHealth)

// check portal health and return 200
app.get('/service/health', healthService.createAndValidateRequestBody, healthService.checkSunbirdPortalHealth)

// client app routes
require('./routes/googleSignInRoutes.js')(app, keycloak)

// sso routes
require('./routes/ssoRoutes.js')(app, keycloak)

// client app routes
require('./routes/clientRoutes.js')(app, keycloak)

// report routes
require('./routes/reportRoutes.js')(app, keycloak)

app.all(['/content-editor/telemetry', '/collection-editor/telemetry'], bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents)

// learner api routes
require('./routes/learnerRoutes.js')(app)

app.all(['/content/data/v1/telemetry', '/action/data/v3/telemetry'],
  proxy(envHelper.TELEMETRY_SERVICE_LOCAL_URL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: (req) => require('url').parse(envHelper.TELEMETRY_SERVICE_LOCAL_URL + telemtryEventConfig.endpoint).path
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

// tenant api
app.get(['/v1/tenant/info', '/v1/tenant/info/:tenantId'], addCorsHeaders, tenantHelper.getInfo)

// public api routes
require('./routes/publicRoutes.js')(app)

// proxy urls
require('./proxy/contentEditorProxy.js')(app, keycloak)

// content api routes
require('./routes/contentRoutes.js')(app)

// Local proxy for content and learner service
require('./proxy/localProxy.js')(app)

app.all('/v1/user/session/create', (req, res) => trampolineServiceHelper.handleRequest(req, res, keycloak))

app.get('/v1/user/session/start/:deviceId', (req, res) => {
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


console.log('[Extensible framework]: Bootstrapping...')

const subApp = express()
subApp.use(bodyParser.json({ limit: '50mb' }))

// subApp.use('/plugin/review/comment/*', keycloak.protect()); // keycloak protection 

app.use('/plugin', subApp)
frameworkAPI.bootstrap(frameworkConfig, subApp).then(data => runApp())
  .catch(error => {
    runApp()   // if framework fails, do not stop the portal
  })

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

if (!process.env.sunbird_environment || !process.env.sunbird_instance) {
  console.error('please set environment variable sunbird_environment, ' +
    'sunbird_instance  start service Eg: sunbird_environment = dev, sunbird_instance = sunbird')
  process.exit(1)
}
function runApp() {

  // redirect to home if nothing found
  app.all('*', (req, res) => res.redirect('/'))
  // start server after building the configuration data and fetch default channel id

  configHelper.init().then(function (status) {
    fetchDefaultChannelDetails((channelError, channelRes, channelData) => {
      portal.server = app.listen(envHelper.PORTAL_PORT, () => {
        let defaultChannelId = _.get(channelData, 'result.response.content[0].hashTagId')
        envHelper.defaultChannelId = defaultChannelId; // needs to be added in envVariable file
        console.log(defaultChannelId, 'is set as default channel id in evnHelper');
        if (envHelper.PORTAL_CDN_URL) {
          const req = request
            .get(envHelper.PORTAL_CDN_URL + 'index.' + packageObj.version + '.' + packageObj.buildHash + '.ejs')
            .on('response', function (res) {
              if (res.statusCode === 200) {
                req.pipe(fs.createWriteStream(path.join(__dirname, 'dist', 'index.ejs')))
              } else {
                console.log('Error while fetching ' + envHelper.PORTAL_CDN_URL + 'index.' + packageObj.version + '.' + packageObj.buildHash + '.ejs file when CDN enabled');
              }
            })
        }
        console.log('app running on port ' + envHelper.PORTAL_PORT)
      })
    })
  }, function (error) {
    console.log('Error in loading configs ' + error)
  })
}
const fetchDefaultChannelDetails = async (callback) => {
  const options = {
    method: 'POST',
    url: envHelper.LEARNER_URL + '/org/v1/search',
    headers: {
      'x-msgid': uuid(),
      'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
      'content-type': 'application/json',
      'accept': 'application/json',
      'Authorization': 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
    },
    body: {
      request: {
        filters: { slug: envHelper.DEFAULT_CHANNEL }
      }
    },
    json: true
  }
  return request(options, callback)
}

exports.close = () => portal.server.close()

// Telemetry initialization
const telemetryConfig = {
  pdata: { id: envHelper.APPID, ver: packageObj.version },
  method: 'POST',
  batchsize: process.env.sunbird_telemetry_sync_batch_size || 200,
  endpoint: telemtryEventConfig.endpoint,
  host: envHelper.TELEMETRY_SERVICE_LOCAL_URL,
  authtoken: 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
}

process.on('unhandledRejection', function (reason, p) {
  console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
  // application specific logging here
});

telemetry.init(telemetryConfig)