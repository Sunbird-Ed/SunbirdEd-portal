'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var proxy = require('express-http-proxy');
const port = process.env.port ? process.env.port : 7000;

app.use(express.static('./'));
app.use('/ekContentEditor', express.static('./thirdparty/content-editor'));
app.get('/ekContentEditor', function (req, res) {
    res.sendFile(__dirname+"/thirdparty/content-editor/index.html");
});

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

app.get('/*', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});

app.listen(port);
console.log('app running on port ', port);