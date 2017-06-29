'use strict';

const express = require('express'),
app = express(),
router = express.Router(),
request = require('request'),
proxy = require('express-http-proxy'),
Keycloak     = require('keycloak-connect'),
session      = require('express-session'),
path = require('path');

// Create a new session store in-memory
var memoryStore = new session.MemoryStore();
// Setup keycloak to use the in-memory store
var keycloak = new Keycloak({store: memoryStore});

app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));
app.use(keycloak.middleware({admin: '/'}));

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));

app.use('/ekContentEditor', express.static('./thirdparty/content-editor'))
app.get('/ekContentEditor', function (req, res) {
    res.sendFile(__dirname+"/thirdparty/content-editor/index.html");
})

 var ekstep = "https://dev.ekstep.in";

    app.use('/api/*', proxy(ekstep, {

        proxyReqPathResolver: function (req) {
            return require('url').parse(ekstep + req.originalUrl).path;
        }
    }));

    app.use('/content-plugins/*', proxy(ekstep, {

        proxyReqPathResolver: function (req) {
            return require('url').parse(ekstep + req.originalUrl).path;
        }
    }));

    app.use('/plugins/*', proxy(ekstep, {

        proxyReqPathResolver: function (req) {
            return require('url').parse(ekstep + req.originalUrl).path;
        }
    }));


    app.use('/assets/public/preview/*', proxy(ekstep, {

        proxyReqPathResolver: function (req) {
            return require('url').parse(ekstep + req.originalUrl).path;
        }
    }));

    app.use('/content/preview/*', proxy(ekstep, {

        proxyReqPathResolver: function (req) {
            return require('url').parse(ekstep + req.originalUrl).path;
        }
    }));

    app.use('/action/*', proxy(ekstep, {

        proxyReqPathResolver: function (req) {
            return require('url').parse(ekstep + req.originalUrl).path;
        }
    }));

app.all('/private/*', keycloak.protect(), function(req, res) {
    res.locals.userId = req.kauth.grant.access_token.content.sub;
    res.render(__dirname+'/private/index.ejs');
});

app.all('/', function(req, res) {
    res.sendFile(__dirname+'/public/index.html');
});
app.all('*', function(req, res) {
    res.redirect('/');
});

app.listen(8080);
console.log('app running on port 80');