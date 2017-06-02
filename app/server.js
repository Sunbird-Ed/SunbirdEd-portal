'use strict';

var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');

app.use(express.static('./'));
app.use('/ekContentEditor', express.static('./thirdparty/content-editor'))
app.get('/', function(req, res) {
    res.sendFile(__dirname+'/index.html');
});
app.get('/ekContentEditor', function (req, res) {
    res.sendFile(__dirname+"/thirdparty/content-editor/index.html");
})
app.listen(7000);
console.log('app running on port 7000');