var express = require('express');
var app = express(); // create our app w/ express

var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

app.use(express.static(__dirname + '/dist')); // set the static files location /public/img will be /img for users

app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.get('*', function(req, res) {
    res.sendfile('./dist/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

app.listen(8000);
console.log('App listening on port 8000');