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
const latexService = require('./helpers/latexService.js')
const { getKeyCloakClient, memoryStore } = require('./helpers/keyCloakHelper')
const fs = require('fs')
const request = require('request-promise');
const portal = this
const telemetry = new (require('sb_telemetry_util'))()
const telemetryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'helpers/telemetryEventConfig.json')))
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const { frameworkAPI } = require('@project-sunbird/ext-framework-server/api');
const frameworkConfig = require('./framework.config.js');
const cookieParser = require('cookie-parser')
const logger = require('sb_logger_util_v2');
let keycloak = getKeyCloakClient({
  'realm': envHelper.PORTAL_REALM,
  'auth-server-url': envHelper.PORTAL_AUTH_SERVER_URL,
  'ssl-required': 'none',
  'resource': envHelper.PORTAL_AUTH_SERVER_CLIENT,
  'public-client': true
})
const logLevel = envHelper.sunbird_portal_log_level;

logger.init({
  logLevel
})

logger.debug({ msg: `logger initialized with LEVEL= ${logLevel}` })

const app = express()

app.use(cookieParser())
app.use(helmet())
app.use(session({
  secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
  resave: false,
  saveUninitialized: false,
  store: memoryStore
}))

app.use(keycloak.middleware({ admin: '/callback', logout: '/logout' }))

app.use('/announcement/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '10mb' }), require('./helpers/announcement')(keycloak)) // announcement api routes

app.all('/logoff', endSession, (req, res) => {
  res.cookie('connect.sid', '', { expires: new Date() }); res.redirect('/logout')
})

app.get('/health', healthService.createAndValidateRequestBody, healthService.checkHealth) // health check api

app.get('/service/health', healthService.createAndValidateRequestBody, healthService.checkSunbirdPortalHealth)

app.get("/latex/convert", latexService.convert);
app.post("/latex/convert", bodyParser.json({ limit: '1mb' }), latexService.convert);

require('./routes/desktopAppRoutes.js')(app) // desktop app routes

require('./routes/googleSignInRoutes.js')(app, keycloak) // google sign in routes

require('./routes/ssoRoutes.js')(app, keycloak) // sso routes

require('./routes/refreshTokenRoutes.js')(app, keycloak) // refresh token routes

require('./routes/accountMergeRoute.js')(app, keycloak) // refresh token routes

require('./routes/clientRoutes.js')(app, keycloak) // client app routes

require('./routes/reportRoutes.js')(app, keycloak) // report routes

app.all(['/content-editor/telemetry', '/collection-editor/telemetry'], bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '50mb' }), keycloak.protect(), telemetryHelper.logSessionEvents)

require('./routes/learnerRoutes.js')(app) // learner api routes

app.all(['/content/data/v1/telemetry', '/action/data/v3/telemetry'], proxy(envHelper.TELEMETRY_SERVICE_LOCAL_URL, {
  limit: '50mb',
  proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
  proxyReqPathResolver: req => require('url').parse(envHelper.TELEMETRY_SERVICE_LOCAL_URL + telemetryEventConfig.endpoint).path
}))

app.get(['/v1/tenant/info', '/v1/tenant/info/:tenantId'], proxyUtils.addCorsHeaders, tenantHelper.getInfo) // tenant api

require('./routes/publicRoutes.js')(app) // public api routes

require('./proxy/contentEditorProxy.js')(app, keycloak) // proxy api routes

require('./routes/contentRoutes.js')(app) // content api routes

require('./proxy/localProxy.js')(app) // Local proxy for content and learner service

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

app.use('/resourcebundles/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '50mb' }), require('./helpers/resourceBundles')(express)) // Resource bundles apis

const subApp = express()
subApp.use(bodyParser.json({ limit: '50mb' }))
app.use('/plugin', subApp)

frameworkAPI.bootstrap(frameworkConfig, subApp).then(data => runApp()).catch(error => runApp())

function endSession(request, response, next) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  delete request.session['orgs']
  if (request.session) {
    if (_.get(request, 'session.userId')) { telemetryHelper.logSessionEnd(request) }
    delete request.session.sessionEvents
    delete request.session['deviceId']
  }
  next()
}

if (!process.env.sunbird_environment || !process.env.sunbird_instance) {
  logger.error({msg: `please set environment variable sunbird_environment,sunbird_instance
  start service Eg: sunbird_environment = dev, sunbird_instance = sunbird`})
  process.exit(1)
}
function runApp() {

  app.all('*', (req, res) => res.redirect('/')) // redirect to home if nothing found
  // start server after building the configuration data and fetch default channel id

  fetchDefaultChannelDetails((channelError, channelRes, channelData) => {
    portal.server = app.listen(envHelper.PORTAL_PORT, () => {
      envHelper.defaultChannelId = _.get(channelData, 'result.response.content[0].hashTagId'); // needs to be added in envVariable file
      logger.info({msg: `app running on port ${envHelper.PORTAL_PORT}`})
    })
    portal.server.keepAliveTimeout = 60000 * 5;
  })
}
const fetchDefaultChannelDetails = (callback) => {
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

telemetry.init({
  pdata: { id: envHelper.APPID, ver: packageObj.version },
  method: 'POST',
  batchsize: process.env.sunbird_telemetry_sync_batch_size || 200,
  endpoint: telemetryEventConfig.endpoint,
  host: envHelper.TELEMETRY_SERVICE_LOCAL_URL,
  authtoken: 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
})

process.on('unhandledRejection', (reason, p) => console.log('Unhandled Rejection', p, reason));
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception', err)
  process.exit(1);
});
exports.close = () => portal.server.close()
