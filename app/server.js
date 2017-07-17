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
    env = process.env,
    trampolineServiceHelper = require('./helpers/trampolineServiceHelper.js'),
    telemetryHelper = require('./helpers/telemetryHelper.js'),
    port = env['sunbird_port'] || 3000,
    learnerURL = env.sunbird_learner_player_url || 'http://52.172.36.121:9000/v1/',
    contentURL = env.sunbird_content_player_url || 'http://localhost:5000/v1/',
    ekstep = "https://qa.ekstep.in",
    dev = "https://dev.ekstep.in";

// Create a new session store in-memory
let memoryStore = new session.MemoryStore();
// Setup keycloak to use the in-memory store
let keycloak = new Keycloak({ store: memoryStore });

app.use(session({
    secret: '717b3357-b2b1-4e39-9090-1c712d1b8b64',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));
app.use(keycloak.middleware({ admin: '/callback' }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));
app.all('/content-editor/telemetry', keycloak.protect(), telemetryHelper.logContentEditorEvents);

app.use('/collectionEditor', express.static('./thirdparty/collection-editor'))
app.get('/collectionEditor', function(req, res) {
    res.sendFile(__dirname + "/thirdparty/collection-editor/index.html");
});


app.all('/public/service/v1/*', proxy(learnerURL, {
    proxyReqPathResolver: function(req) {
        let urlParam = req.params["0"];
        return require('url').parse(learnerURL + urlParam).path;
    }
}))
app.all('/private/service/v1/learner/*', keycloak.protect(), proxy(learnerURL, {
    proxyReqPathResolver: function(req) {
        let urlParam = req.params["0"];
        return require('url').parse(learnerURL + urlParam).path;
    }
}))
app.all('/private/service/v1/content/*', keycloak.protect(), proxy(contentURL, {
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

app.all('/private/*', keycloak.protect(), function(req, res) {
    res.locals.userId = req.kauth.grant.access_token.content.sub;
    res.render(__dirname + '/private/index.ejs');
});


app.all('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//proxy urls


app.use('*/content-editor-iframe/api/*', proxy(ekstep, {
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

app.use('/api/*', proxy(ekstep, {
    proxyReqOptDecorator: function(proxyReqOpts, srcReq) {
        // you can update headers 
        proxyReqOpts.headers['Authorization'] = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2MzExMTYwNTMzOGY0Zjc5YTgwZTM3YjcyZjVjMmUwZiJ9.azmj_AHmndeJz0h6yIkOJz1XjeZR6Gzd-OrZzR66I0A';
        return proxyReqOpts;
    },
    proxyReqPathResolver: function(req) {
        return require('url').parse(ekstep + req.originalUrl).path;
    }
}));

app.use('/content-plugins/*', proxy(dev, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(dev + req.originalUrl).path;
    }
}));

app.use('/plugins/*', proxy(dev, {
    proxyReqPathResolver: function(req) {
        return require('url').parse(dev + req.originalUrl).path;
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

app.use('/action/*', proxy(ekstep, {
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
    telemetryHelper.logSessionStart(request)
}

app.listen(port);
console.log('app running on port ' + port);
