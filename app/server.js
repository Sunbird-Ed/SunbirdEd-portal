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
    port = env['sunbird_port'] || 3000,
    learnerURL = env.sunbird_learner_player_url || 'http://52.172.36.121:9000/v1/',
    contentURL = env.sunbird_content_player_url || 'http://localhost:5000/v1/',
    realm = env.sunbird_portal_realm || "sunbird",
    auth_server_url = env.sunbird_portal_auth_server_url || "https://dev.open-sunbird.org/auth",
    keycloak_resource = env.sunbird_portal_auth_server_client || "portal",
    ekstep = "https://qa.ekstep.in",
    reqDataLimitOfContentEditor = '50mb',
    reqDataLimitOfContentUpload = '30mb',
    appId = env.sunbird_appid || 'sunbird.portal';

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

app.use(session({
    secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
app.use(keycloak.middleware({ admin: '/callback', logout: '/logout' }));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.all('/content-editor/telemetry', bodyParser.urlencoded({ extended: false }),
    bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents);

app.all('/collection-editor/telemetry', bodyParser.urlencoded({ extended: false }),
    bodyParser.json({ limit: reqDataLimitOfContentEditor }), keycloak.protect(), telemetryHelper.logSessionEvents);

app.all('/public/service/v1/*', proxy(learnerURL, {
    proxyReqPathResolver: function(req) {
        let urlParam = req.params["0"];
        return require('url').parse(learnerURL + urlParam).path;
    }
}))
app.all('/private/service/v1/learner/*', keycloak.protect(), permissionsHelper.checkPermission(), proxy(learnerURL, {
    proxyReqPathResolver: function(req) {
        let urlParam = req.params["0"];
        return require('url').parse(learnerURL + urlParam).path;
    }
}));

app.all('/private/service/v1/content/*', keycloak.protect(), permissionsHelper.checkPermission(), proxy(contentURL, {
    limit: reqDataLimitOfContentUpload,
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



app.all('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/get/appid', keycloak.protect(), function(req,res){
    res.status(200);
    res.send({appId : appId});
    res.end();
});

//proxy urls


app.use('*/content-editor-iframe/api/*', permissionsHelper.checkPermission(), proxy(ekstep, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers 
        proxyReqOpts.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2MzExMTYwNTMzOGY0Zjc5YTgwZTM3YjcyZjVjMmUwZiJ9.azmj_AHmndeJz0h6yIkOJz1XjeZR6Gzd-OrZzR66I0A';
        return proxyReqOpts;
    },
    proxyReqPathResolver: function(req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace('thirdparty/bower_components/content-editor-iframe/', '');
        return require('url').parse(ekstep + originalUrl).path;
    }
}));

app.use('*/collection-editor-iframe/api/*', permissionsHelper.checkPermission(), proxy(ekstep, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers 
        proxyReqOpts.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2MzExMTYwNTMzOGY0Zjc5YTgwZTM3YjcyZjVjMmUwZiJ9.azmj_AHmndeJz0h6yIkOJz1XjeZR6Gzd-OrZzR66I0A';
        return proxyReqOpts;
    },
    proxyReqPathResolver: function(req) {
        var originalUrl = req.originalUrl;
        originalUrl = originalUrl.replace('thirdparty/bower_components/collection-editor-iframe/', '');
        return require('url').parse(ekstep + originalUrl).path;
    }
}));

app.use('/api/*', permissionsHelper.checkPermission(), proxy(ekstep, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers 
        proxyReqOpts.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2MzExMTYwNTMzOGY0Zjc5YTgwZTM3YjcyZjVjMmUwZiJ9.azmj_AHmndeJz0h6yIkOJz1XjeZR6Gzd-OrZzR66I0A';
        return proxyReqOpts;
    },
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
    }
}));

app.use('/content-plugins/*', proxy(ekstep, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
    }
}));

app.use('/plugins/*', proxy(ekstep, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
    }
}));


app.use('/assets/public/preview/*', proxy(ekstep, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
    }
}));

app.use('/content/preview/*', proxy(ekstep, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
    }
}));

app.use('/action/*', permissionsHelper.checkPermission(), proxy(ekstep, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
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

    });


};

keycloak.deauthenticated = function(request) {
    delete request.session['roles'];
    if (request.session) {
        request.session.sessionEvents = request.session.sessionEvents || [];
        telemetryHelper.sendTelemetry(request, request.session.sessionEvents, function(status) {
            //remove session data
            delete request.session.sessionEvents;
        });
    }
};

app.listen(port);
console.log('app running on port ' + port);
