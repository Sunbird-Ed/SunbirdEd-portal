'use strict';

const express = require('express'),
  app = express(),
  router = express.Router(),
  proxy = require('express-http-proxy'),
  Keycloak = require('keycloak-connect'),
  session = require('express-session'),
  path = require('path'),
  request = require('request'),
  bodyParser = require('body-parser'),
  async = require('async'),
  helmet = require('helmet'),
  CassandraStore = require("cassandra-session-store"),
  trampolineServiceHelper = require('./helpers/trampolineServiceHelper.js'),
  telemetryHelper = require('./helpers/telemetryHelper.js'),
  permissionsHelper = require('./helpers/permissionsHelper.js'),
  tenantHelper = require('./helpers/tenantHelper.js'),
  envHelper = require('./helpers/environmentVariablesHelper.js'),
  publicServicehelper = require('./helpers/publicServiceHelper.js'),
  userHelper = require('./helpers/userHelper.js'),
  fs = require('fs'),
  port = envHelper.PORTAL_PORT,
  learnerURL = envHelper.LEARNER_URL,
  contentURL = envHelper.CONTENT_URL,
  contentProxyUrl = envHelper.CONTENT_PROXY_URL,
  realm = envHelper.PORTAL_REALM,
  auth_server_url = envHelper.PORTAL_AUTH_SERVER_URL,
  keycloak_resource = envHelper.PORTAL_AUTH_SERVER_CLIENT,
  reqDataLimitOfContentEditor = '50mb',
  reqDataLimitOfContentUpload = '30mb',
  ekstep_env = envHelper.EKSTEP_ENV,
  appId = envHelper.APPID,
  default_tenant = envHelper.DEFAUULT_TENANT,
  md5 = require('js-md5'),
  sunbird_api_auth_token = envHelper.PORTAL_API_AUTH_TOKEN;


let cassandraCP = envHelper.PORTAL_CASSANDRA_URLS;


let memoryStore = null;

if (envHelper.PORTAL_SESSION_STORE_TYPE === 'in-memory') {
    memoryStore = new session.MemoryStore();
} else {
    memoryStore = new CassandraStore({
                      "table": "sessions",
                      "client": null,
                      "clientOptions": {
                        "contactPoints": cassandraCP,
                        "keyspace": "portal",
                        "queryOptions": {
                          "prepare": true
                        }
                      }
                    }, function () {});
}


let keycloak = new Keycloak({ store: memoryStore }, {
  "realm": realm,
  "auth-server-url": auth_server_url,
  "ssl-required": "none",
  "resource": keycloak_resource,
  "public-client": true
});
let tenantId = '';

const decorateRequestHeaders = function() {
  return function(proxyReqOpts, srcReq) {
    if (srcReq.session) {
      var userId = srcReq.session.userId;
      var channel = md5(srcReq.session.rootOrgId || 'sunbird');
      if (userId)
        proxyReqOpts.headers['X-Authenticated-Userid'] = userId;
      proxyReqOpts.headers['X-Channel-Id'] = channel;
    }
    proxyReqOpts.headers['X-App-Id'] = appId;
    if(srcReq.kauth && srcReq.kauth.grant && srcReq.kauth.grant.access_token && srcReq.kauth.grant.access_token.token) {
      proxyReqOpts.headers['x-authenticated-user-token'] = srcReq.kauth.grant.access_token.token;
    }
    proxyReqOpts.headers.Authorization = 'Bearer ' + sunbird_api_auth_token;
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  };
};
const decoratePublicRequestHeaders = function() {
  return function(proxyReqOpts, srcReq) {
    proxyReqOpts.headers['X-App-Id'] = appId;
    proxyReqOpts.headers.Authorization = 'Bearer ' + sunbird_api_auth_token;
    return proxyReqOpts;
  };
};
app.use(helmet());
app.use(session({
  secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
  resave: false,
  saveUninitialized: false,
  store: memoryStore
}));

app.use(keycloak.middleware({ admin: '/callback', logout: '/logout' }));

/*the below line will be replaced while creating the deployment package. this line must not be deleted*/
//app.use(staticGzip(/(invalid)/));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'tenant', tenantId)));
//this line should be above middleware please don't change
app.get('/public/service/orgs', publicServicehelper.getOrgs);
app.use('/public/*', express.static(path.join(__dirname, 'public')))
if (default_tenant) {
  app.use(express.static(path.join(__dirname, 'tenant', default_tenant)));
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.use('/private/index', function(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});



app.all('/content-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents);

app.all('/collection-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents);

app.all('/public/service/*', proxy(learnerURL, {
  proxyReqOptDecorator: decoratePublicRequestHeaders(),
  proxyReqPathResolver: function(req) {
    let urlParam = req.params["0"];
    return require('url').parse(learnerURL + urlParam).path;
  }
}))

app.all('/private/service/v1/learner/*', verifyToken(), permissionsHelper.checkPermission(), proxy(learnerURL, {
  limit: reqDataLimitOfContentUpload,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: function(req) {
    let urlParam = req.params["0"];
    let query = require('url').parse(req.url).query;
    if (query) {
      return require('url').parse(learnerURL + urlParam + '?' + query).path;
    } else {
      return require('url').parse(learnerURL + urlParam).path;
    }
  }
}));

app.all('/private/service/v1/content/*', verifyToken(), permissionsHelper.checkPermission(), proxy(contentURL, {
  limit: reqDataLimitOfContentUpload,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: function(req) {
    let urlParam = req.params["0"];
    let query = require('url').parse(req.url).query;
    if (query) {
      return require('url').parse(contentURL + urlParam + '?' + query).path;
    } else {
      return require('url').parse(contentURL + urlParam).path;
    }
  }
}));

app.all('/v1/user/session/create', function(req, res) {
  trampolineServiceHelper.handleRequest(req, res, keycloak);
})

app.all('/private/*', keycloak.protect(), permissionsHelper.checkPermission(), function(req, res) {
  res.locals.userId = req.kauth.grant.access_token.content.sub;
  res.locals.sessionId = req.sessionID;
  res.render(__dirname + '/private/index.ejs');
});

app.get('/get/envData', keycloak.protect(), function(req, res) {
  res.status(200);
  res.send({ appId: appId, ekstep_env: ekstep_env });
  res.end();
});

//tenant Api's
app.get('/v1/tenant/info', tenantHelper.getInfo);
app.get('/v1/tenant/info/:tenantId', tenantHelper.getInfo);


//proxy urls

const proxyReqPathResolverMethod = function(req) {
  return require('url').parse(contentProxyUrl + req.originalUrl).path;
}

app.use('/api/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
  preserveHostHdr: true,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: proxyReqPathResolverMethod
}));

app.use('/content-plugins/*', proxy(contentProxyUrl, {
  preserveHostHdr: true,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: proxyReqPathResolverMethod
}));

app.use('/plugins/*', proxy(contentProxyUrl, {
  preserveHostHdr: true,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: proxyReqPathResolverMethod
}));

app.use('/assets/public/*', proxy(contentProxyUrl, {
  preserveHostHdr: true,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: proxyReqPathResolverMethod
}));

app.use('/content/preview/*', proxy(contentProxyUrl, {
  preserveHostHdr: true,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: proxyReqPathResolverMethod
}));

app.use('/action/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
  preserveHostHdr: true,
  limit: reqDataLimitOfContentUpload,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: proxyReqPathResolverMethod
}));

app.all('/:tenantName', function(req, res) {
  tenantId = req.params.tenantName;
  if (tenantId && fs.existsSync(path.join(__dirname, 'tenant', tenantId, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'tenant', tenantId, 'index.html'));
  } else if (default_tenant && fs.existsSync(path.join(__dirname, 'tenant', default_tenant, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'tenant', default_tenant, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  }
});


//redirect to home if nothing found
app.all('*', function(req, res) {
  res.redirect('/');
});

  /*
 * Method called after successful authentication and it will log the telemetry for CP_SESSION_START and updates the login time
 */
keycloak.authenticated = function(request) {
  async.series({
    getUserData: function(callback) {
      permissionsHelper.getCurrentUserRoles(request, callback);
    },
    logSession: function(callback) {
      telemetryHelper.logSessionStart(request, callback);
    },
    updateLoginTime:function(callback){
        userHelper.updateLoginTime(request, callback);
    }
  }, function(err, results) {
    if (err) {
      console.log('err', err);
    }
  });


};

keycloak.deauthenticated = function(request) {
  delete request.session['roles'];
  delete request.session['rootOrgId'];
  delete request.session['orgs'];
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || [];
    telemetryHelper.sendTelemetry(request, request.session.sessionEvents, function(status) {
      //remove session data
      delete request.session.sessionEvents;
    });
  }
};

function verifyToken() {
  return function(req, res, next) {

    if (!req.session) {
      res.status(440);
      res.send({
        "id": "api.error",
        "ver": "1.0",
        "ts": dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss:lo"),
        "params": {
          "resmsgid": uuidv1(),
          "msgid": null,
          "status": "failed",
          "err": "LOGIN_TIMEOUT",
          "errmsg": "Session Expired"
        },
        "responseCode": "LOGIN_TIMEOUT",
        "result": {}
      });
      res.end();
    } else {
      next();
    }
  }
}

this.server = app.listen(port, function () {
    console.log('app running on port ' + port);
    permissionsHelper.getPermissions();
});

exports.close = function() {
    this.server.close();
};
