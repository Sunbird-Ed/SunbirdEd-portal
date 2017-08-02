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
  MongoStore = require('connect-mongo')(session),
  async = require('async'),
  env = process.env,
  trampolineServiceHelper = require('./helpers/trampolineServiceHelper.js'),
  telemetryHelper = require('./helpers/telemetryHelper.js'),
  permissionsHelper = require('./helpers/permissionsHelper.js'),
  tenantHelper = require('./helpers/tenantHelper.js'),
  fs = require('fs'),
  port = env['sunbird_port'] || 3000,
  learnerURL = env.sunbird_learner_player_url || 'https://dev.open-sunbird.org/api/',
  contentURL = env.sunbird_content_player_url || 'https://dev.open-sunbird.org/api/',
  realm = env.sunbird_portal_realm || "sunbird",
  auth_server_url = env.sunbird_portal_auth_server_url || "https://dev.open-sunbird.org/auth",
  keycloak_resource = env.sunbird_portal_auth_server_client || "portal",
  reqDataLimitOfContentEditor = '50mb',
  reqDataLimitOfContentUpload = '30mb',
  ekstep_env = env.ekstep_env || 'qa',
  appId = env.sunbird_appid || 'sunbird.portal',
  default_tenant = env.sunbird_default_tenant,
  md5 = require('js-md5'),
  sunbird_api_auth_token = env.sunbird_api_auth_token || 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkMTc1MDI' +
                'wNDdlODc0ODZjOTM0ZDQ1ODdlYTQ4MmM3MyJ9.7LWocwCn5rrCScFQYOne8_Op2EOo-xTCK5JCFarHKSs';

const contentProxyUrl = contentURL.replace('/api/', '');

let mongoURL = (env.sunbird_mongodb_ip && env.sunbird_mongodb_port) ? ("mongodb://" + env.sunbird_mongodb_ip + ":" + env.sunbird_mongodb_port + "/portal") : 'mongodb://localhost/portal';
let session_ttl = env.sunbird_mongodb_ttl | 1; //in days
let memoryStore = new MongoStore({
  url: mongoURL,
  autoRemove: 'native',
  ttl: session_ttl * 24 * 60 * 60
});
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
    proxyReqOpts.headers.Authorization = sunbird_api_auth_token;
    return proxyReqOpts;
  };
};

app.use(session({
  secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
app.use(keycloak.middleware({ admin: '/callback', logout: '/logout' }));

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'tenant', tenantId)));
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

app.get('/private/service/get/tenant/logo', function(req, res) {
  res.status(200);
  var data = { 'logo': '' };
  if (default_tenant && default_tenant !== 'sunbird') {
    data.logo = (req.get('X-Forwarded-Protocol') || req.protocol) + '://' + req.get('host') + '/tenant/' + default_tenant + '/logo.png';
  }
  res.send(data)
  res.end();
});

app.all('/content-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents);

app.all('/collection-editor/telemetry', bodyParser.urlencoded({ extended: false }),
  bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents);

app.all('/public/service/*', proxy(learnerURL, {
  proxyReqPathResolver: function(req) {
    let urlParam = req.params["0"];
    return require('url').parse(learnerURL + urlParam).path;
  }
}))

app.all('/private/service/v1/learner/*', verifyToken(), permissionsHelper.checkPermission(), proxy(learnerURL, {
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: function(req) {
    let urlParam = req.params["0"];
    return require('url').parse(learnerURL + urlParam).path;
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

app.all('/:tenantName', function(req, res) {
  tenantId = req.params.tenantName;
  if(tenantId && fs.existsSync(path.join(__dirname, 'tenant', tenantId, 'index.html'))){
    res.sendFile(path.join(__dirname, 'tenant', tenantId, 'index.html'));
  }else if (default_tenant && fs.fileExistsSync(path.join(__dirname, 'tenant', default_tenant, 'index.html'))) {
    res.sendFile(path.join(__dirname, 'tenant', default_tenant, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  }
});

app.get('/get/envData', keycloak.protect(), function(req, res) {
  res.status(200);
  res.send({ appId: appId, ekstep_env: ekstep_env });
  res.end();
});

//tenant Api's
app.get('/api/tenant/logo/:tenantId', tenantHelper.getLogo);
app.get('/api/tenant/favicon/:tenantId', tenantHelper.getFavicon);

//proxy urls


app.use('*/content-editor-iframe/api/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
  proxyReqPathResolver: function(req) {
    var originalUrl = req.originalUrl;
    originalUrl = originalUrl.replace('thirdparty/bower_components/content-editor-iframe/', '');
    return require('url').parse(contentProxyUrl + originalUrl).path;
  }
}));

app.use('*/collection-editor-iframe/api/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
  proxyReqPathResolver: function(req) {
    var originalUrl = req.originalUrl;
    originalUrl = originalUrl.replace('thirdparty/bower_components/collection-editor-iframe/', '');
    return require('url').parse(contentProxyUrl + originalUrl).path;
  }
}));

app.use('/api/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: function(req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path;
  }
}));

app.use('/content-plugins/*', proxy(contentProxyUrl, {
  proxyReqPathResolver: function(req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path;
  }
}));

app.use('/plugins/*', proxy(contentProxyUrl, {
  proxyReqPathResolver: function(req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path;
  }
}));

app.use('/assets/public/*', proxy(contentProxyUrl, {
  proxyReqPathResolver: function(req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path;
  }
}));

app.use('/content/preview/*', proxy(contentProxyUrl, {
  proxyReqPathResolver: function(req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path;
  }
}));

app.use('/action/*', permissionsHelper.checkPermission(), proxy(contentProxyUrl, {
  limit: reqDataLimitOfContentUpload,
  proxyReqOptDecorator: decorateRequestHeaders(),
  proxyReqPathResolver: function(req) {
    return require('url').parse(contentProxyUrl + req.originalUrl).path;
  }
}));


//redirect to home if nothing found
app.all('*', function(req, res) {
  res.redirect('/');
});

/*
 * Method called after successful authentication and it will log the telemetry for CP_SESSION_START
 */
keycloak.authenticated = function(request) {
  async.series({
    getUserData: function(callback) {
      permissionsHelper.getCurrentUserRoles(request, callback);
    },
    logSession: function(callback) {
      telemetryHelper.logSessionStart(request, callback);
    }
  }, function(err, results) {
    console.log('res', results);
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
    if (!req.session['keycloak-token']) {
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

app.listen(port);
console.log('app running on port ' + port);
