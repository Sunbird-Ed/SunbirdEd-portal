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
const trampolineServiceHelper = require('./helpers/trampolineServiceHelper.js')
const telemetryHelper = require('./helpers/telemetryHelper.js')
const permissionsHelper = require('./helpers/permissionsHelper.js')
const tenantHelper = require('./helpers/tenantHelper.js')
const envHelper = require('./helpers/environmentVariablesHelper.js')
const publicServicehelper = require('./helpers/publicServiceHelper.js')
const userHelper = require('./helpers/userHelper.js')
const resourcesBundlesHelper = require('./helpers/resourceBundlesHelper.js')
const proxyUtils = require('./proxy/proxyUtils.js')
const fs = require('fs')
const port = envHelper.PORTAL_PORT
const learnerURL = envHelper.LEARNER_URL
const contentURL = envHelper.CONTENT_URL
const realm = envHelper.PORTAL_REALM
const authServerUrl = envHelper.PORTAL_AUTH_SERVER_URL
const keycloakResource = envHelper.PORTAL_AUTH_SERVER_CLIENT
const reqDataLimitOfContentEditor = '50mb'
const reqDataLimitOfContentUpload = '30mb'
const ekstepEnv = envHelper.EKSTEP_ENV
const appId = envHelper.APPID
const defaultTenant = envHelper.DEFAUULT_TENANT
const portal = this
const Telemetry = require('sb_telemetry_util')
const telemetry = new Telemetry()
const telemtryEventConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'helpers/telemetryEventConfig.json')))

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
  'realm': realm,
  'auth-server-url': authServerUrl,
  'ssl-required': 'none',
  'resource': keycloakResource,
  'public-client': true
})
let tenantId = ''

app.use(helmet())
app.use(session({
  secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
  resave: false,
  saveUninitialized: false,
  store: memoryStore
}))

app.use(keycloak.middleware({ admin: '/callback', logout: '/logout' }))

/* the below line will be replaced while creating the deployment package. this line must not be deleted */
// app.use(staticGzip(/(invalid)/));

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'tenant', tenantId)))
// this line should be above middleware please don't change
app.get('/public/service/orgs', publicServicehelper.getOrgs)

app.all('/public', function (req, res) {
  res.locals.cdnUrl = envHelper.PORTAL_CDN_URL
  res.locals.theme = envHelper.PORTAL_THEME
  res.locals.defaultPortalLanguage = envHelper.PORTAL_DEFAULT_LANGUAGE
  res.render(path.join(__dirname, 'public', 'index.ejs'))
})

app.use('/public/*', express.static(path.join(__dirname, 'public')))
if (defaultTenant) {
  app.use(express.static(path.join(__dirname, 'tenant', defaultTenant)))
}
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'private')))
app.use(express.static(path.join(__dirname, 'migration/dist'), { extensions: ['ejs'], index: false }))
// Announcement routing
app.use('/announcement/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '10mb' }), require('./helpers/announcement')(keycloak))
app.use('/discussions/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '10mb' }), require('./helpers/discussion-poc')(keycloak))

// Discussion routing
app.use('/discussions/v1', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: '10mb' }), require('./helpers/discussion')(keycloak))
app.use('/private/index', function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
  res.header('Expires', '-1')
  res.header('Pragma', 'no-cache')
  next()
})

// Mobile redirection to app
require('./helpers/mobileRedirectHelper.js')(app)

app.all('/', function (req, res) {
  res.locals.cdnUrl = envHelper.PORTAL_CDN_URL
  res.locals.theme = envHelper.PORTAL_THEME
  res.locals.defaultPortalLanguage = envHelper.PORTAL_DEFAULT_LANGUAGE
  res.render(path.join(__dirname, 'public', 'index.ejs'))
})

app.all('/content-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents)

app.all('/collection-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents)

// Generate telemetry fot public service
app.all('/public/service/*', telemetryHelper.generateTelemetryForProxy)

app.all('/public/service/v1/learner/*', proxy(learnerURL, {
  proxyReqOptDecorator: proxyUtils.decoratePublicRequestHeaders(),
  proxyReqPathResolver: function (req) {
    let urlParam = req.params['0']
    return require('url').parse(learnerURL + urlParam).path
  }
}))

app.all('/public/service/v1/content/*', proxy(contentURL, {
  proxyReqOptDecorator: proxyUtils.decoratePublicRequestHeaders(),
  proxyReqPathResolver: function (req) {
    let urlParam = req.params['0']
    let query = require('url').parse(req.url).query
    if (query) {
      return require('url').parse(contentURL + urlParam + '?' + query).path
    } else {
      return require('url').parse(contentURL + urlParam).path
    }
  }
}))

// Generate telemetry fot public service
app.all('/private/service/*', telemetryHelper.generateTelemetryForProxy)

app.post('/private/service/v1/learner/content/v1/media/upload',
  proxyUtils.verifyToken(),
  permissionsHelper.checkPermission(),
  proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      return require('url').parse(learnerURL + '/content/v1/media/upload').path
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
      let data = JSON.parse(proxyResData.toString('utf8'))
      if (data.responseCode === 'OK') {
        data.success = true
      }
      return JSON.stringify(data)
    }
  }))

app.all('/private/service/v1/learner/*',
  proxyUtils.verifyToken(),
  permissionsHelper.checkPermission(),
  proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(learnerURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(learnerURL + urlParam).path
      }
    }
  }))

app.all('/private/service/v1/content/*',
  proxyUtils.verifyToken(),
  permissionsHelper.checkPermission(),
  proxy(contentURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(contentURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(contentURL + urlParam).path
      }
    }
  }))

app.post('/learner/content/v1/media/upload',
  proxyUtils.verifyToken(),
  permissionsHelper.checkPermission(),
  proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      return require('url').parse(learnerURL + '/content/v1/media/upload').path
    },
    userResDecorator: function (proxyRes, proxyResData, userReq, userRes) {
      let data = JSON.parse(proxyResData.toString('utf8'))
      if (data.responseCode === 'OK') {
        data.success = true
      }
      return JSON.stringify(data)
    }
  }))

app.all('/learner/*',
  proxyUtils.verifyToken(),
  permissionsHelper.checkPermission(),
  proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(learnerURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(learnerURL + urlParam).path
      }
    }
  }))

app.all('/content/*',
  proxyUtils.verifyToken(),
  permissionsHelper.checkPermission(),
  proxy(contentURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(contentURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(contentURL + urlParam).path
      }
    }
  }))
// Local proxy for content and learner service
require('./proxy/localProxy.js')(app)

app.all('/v1/user/session/create', function (req, res) {
  trampolineServiceHelper.handleRequest(req, res, keycloak)
})

app.all('/private/*', keycloak.protect(), permissionsHelper.checkPermission(), function (req, res) {
  res.locals.userId = req.kauth.grant.access_token.content.sub
  res.locals.sessionId = req.sessionID
  res.locals.cdnUrl = envHelper.PORTAL_CDN_URL
  res.locals.theme = envHelper.PORTAL_THEME
  res.locals.defaultPortalLanguage = envHelper.PORTAL_DEFAULT_LANGUAGE
  res.render(path.join(__dirname, 'private', 'index.ejs'))
})

app.all('/migration/*', keycloak.protect(), permissionsHelper.checkPermission(), function (req, res) {
  res.locals.userId = req.kauth.grant.access_token.content.sub
  res.locals.sessionId = req.sessionID
  res.locals.cdnUrl = envHelper.PORTAL_CDN_URL
  res.locals.theme = envHelper.PORTAL_THEME
  res.locals.defaultPortalLanguage = envHelper.PORTAL_DEFAULT_LANGUAGE
  res.render(path.join(__dirname, 'migration/dist', 'index.ejs'))
})

app.get('/get/envData', keycloak.protect(), function (req, res) {
  res.status(200)
  res.send({ appId: appId, ekstep_env: ekstepEnv })
  res.end()
})

// tenant Api's
app.get('/v1/tenant/info', tenantHelper.getInfo)
app.get('/v1/tenant/info/:tenantId', tenantHelper.getInfo)

// proxy urls
require('./proxy/contentEditorProxy.js')(app, keycloak)

app.all('/:tenantName', function (req, res) {
  tenantId = req.params.tenantName
  if (_.isString(tenantId)) {
    tenantId = _.lowerCase(tenantId)
  }
  if (tenantId && fs.existsSync(path.join(__dirname, 'tenant', tenantId, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'tenant', tenantId, 'index.html'))
  } else if (defaultTenant && fs.existsSync(path.join(__dirname, 'tenant', defaultTenant, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'tenant', defaultTenant, 'index.html'))
  } else {
    res.redirect('/')
  }
})

// Handle content share request
require('./helpers/shareUrlHelper.js')(app)

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
  async.series({
    getPermissionData: function (callback) {
      permissionsHelper.getPermissions(request)
      callback()
    },
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
  delete request.session['orgs']
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    telemetryHelper.logSessionEnd(request)
    delete request.session.sessionEvents
  }
}

resourcesBundlesHelper.buildResources(function (err, result) {
  console.log('building resource bundles ......')
  if (err) {
    throw err
  } else {
    portal.server = app.listen(port, function () {
      console.log('completed resource bundles' + '\r\n' + 'starting  server...')
      console.log('app running on port ' + port)
    })
  }
})

exports.close = function () {
  portal.server.close()
}

// Telemetry initialization
const telemetryConfig = {
  pdata: {id: appId, ver: telemtryEventConfig.pdata.ver},
  method: 'POST',
  batchsize: process.env.sunbird_telemetry_sync_batch_size || 20,
  endpoint: telemtryEventConfig.endpoint,
  host: contentURL,
  authtoken: 'Bearer ' + envHelper.PORTAL_API_AUTH_TOKEN
}

telemetry.init(telemetryConfig)

// Handle Telemetry data on server close
function exitHandler (options, err) {
  console.log('Exit', options, err)
  telemetry.syncOnExit(function (err, res) {
    if (err) {
      process.exit()
    } else {
      process.exit()
    }
  })
}

// catches ctrl+c event
process.on('SIGINT', exitHandler)

// catches uncaught exceptions
process.on('uncaughtException', exitHandler)
