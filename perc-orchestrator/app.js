/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Bootstrap for the Orchestrator
 *
 * @author ravitejagarlapati
 */
appConfig = require('./conf/appConfig.json');
var cluster = require('cluster');
var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , fs = require('fs')
  , db = require('./models')
  , interactiondb = require('./interactions/models')
  , staticGzip =  require('http-static-gzip-regexp')
  , passport = require('passport')
  , flash = require('connect-flash')
  , domain = require('domain')
  , ConnectRoles = require('connect-roles')
  ,  validator  = require('express-validator');

require('./config/passport')(passport);
LoggerUtil = require('./commons/LoggerUtil');
LogLevel = require('./commons/LogLevel');
var appUtil = require('./commons/AppUtil');
EventHelper = require('./commons/EventHelper');
bcrypt = require('bcrypt-nodejs');
var RBACUtil = require('./commons/RBACUtil');
var CSVImportUtil = require('./commons/CSVImportUtil');
var interceptor = require('./log_stream/view_helpers/APIInterceptor');
ClusterHub = require('clusterhub');

http.globalAgent.maxSockets = 100000;

if (cluster.isMaster) {
    var numCPUs = require('os').cpus().length;
    if(numCPUs > appConfig.NUM_OF_WORKERS) {
        numCPUs = appConfig.NUM_OF_WORKERS;
    }
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code);
        cluster.fork();
    });
    appUtil.initializeAppCache();
    appUtil.failCSVImportProcessingRecords();

} else {
    MongoHelper = require('./commons/MongoHelper');
    NodeCacheUtil = require('./commons/NodeCacheUtil');
    appUtil.initializeListeners();
    InteractionCache = require('./interactions/util/InteractionCache');
    InteractionCache.initialize();

    ClusterHub.on('event', function(data) {
        appUtil.processClusterHubEvent(data);
    });

    var app = express();
    if(appConfig.SESSION_STORE_TYPE == 'Mongo') {
        var MongoStore = require('connect-mongo')(express);
        var sessionStore = new MongoStore({url: appConfig.MONGO_SESSION_STORE_URL}, function(e) {
            registerMiddlewaresAndListen(app, sessionStore);
        });
    } else if(appConfig.SESSION_STORE_TYPE == 'Redis') {
        var RedisStore = require('connect-redis')(express);
        var sessionStore = new RedisStore({
            port: appConfig.REDIS_PORT,
            host: appConfig.REDIS_HOST,
            db: appConfig.REDIS_DB,
            pass: appConfig.REDIS_PASSWORD
        });
        registerMiddlewaresAndListen(app, sessionStore);
    } else {
        registerMiddlewaresAndListen(app);
    }
}

function registerMiddlewaresAndListen(app, sessionStore) {

    /** Middleware for performance engineering starts here */
    app.use(function(req, res, next) {
        var d = domain.create();
        d.add(req);
        d.add(res);
        d._reqTime = (new Date()).getTime();
        d.logObject = {scenarioId: req.get('scenario_id'), runId: req.get('run_id'), threadId: req.get('thread_id'), userId: req.get('user_id'), bopId: req.get('bop_id'), operationId: req.get('operation_id'), requestId: req.get('txn_id'), status: 'Success', nodeId: 'CLUSTER_NODE_' + cluster.worker.id};
        d.on('error', function(er) {
            LoggerUtil.error(er);
            interceptor.flushEvents();
            if(process.domain) {
                process.domain.logObject.status = 'Error';
                process.domain._error = er.toString();
                if(!res.headersSent) {
                    res.send('Error - ' + process.domain._error);
                } else {
                    res.end('Error - ' + process.domain._error);
                }
            }
        });
        d.enter();
        next();
    });

    // all environments
    app.set('port', appConfig.ENV_PORT);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    //app.use(auth.connect(digest));
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(validator());

    // app.use(function (req, res, next) {
    //     for (var item in req.body) {
    //         req.sanitize(item).escape();
    //         console.log("item : ", item );
    //     }
    //     next();
    // });

    if(sessionStore) {
        app.use(express.session({
            secret: appConfig.SESSION_SECRET,
            store: sessionStore
        }));
    } else {
        app.use(express.session({
            secret: appConfig.SESSION_SECRET
        }));
    }

    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    /**
    // Log Orchestrator start and end times - on performance engineering
    app.use(function(req, res, next) {
        if(req.path.indexOf('/private/v1/performance/jmeterlog') == -1) {
            var startAt = (new Date()).getTime();
            res.on('header', function() {
                var endAt = (new Date()).getTime();
                LoggerUtil.logViewHelper(process.domain, startAt, endAt, process.domain._error);
            });
        }
        next();
    });
    */
    /** End */
    app.use(flash()); // use connect-flash for flash messages stored in session
    app.use(app.router);

    // Override Express routes generic try catch block - Catches all synchronous errors
    app.use(function(err, req, res, next) {
        interceptor.flushEvents();
        if(process.domain) {
            LoggerUtil.error(err);
            process.domain.logObject.status = 'Error';
            process.domain._error = err.toString();
            if(!res.headersSent) {
                // TODO: Remove this and define a generic error middleware and call next(err)
                res.send('Error - ' + err);
            }
        }
    });

    //Add the middleware express way:
    // app.use(staticGzip(/(\.js|\.css)$/));

    //Add dynamic compression if you don't handle all files static
    app.use(express.compress());

    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'views')));

    // app.enable('view cache');
    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    //Bootstrap routes
    var routes = __dirname + '/routes', route_files = fs.readdirSync(routes);
    var connectroles = new ConnectRoles({
        failureHandler: function (req, res, action) {
        // optional function to customise code that runs when
        // user fails authorisation
            var accept = req.headers.accept || '';
            res.status(403);
            if (~accept.indexOf('html')) {
                res.render('access-denied', {action: action});
            } else {
                res.send('You don\'t have permission to this action.' );
            }
        }
    });

    app.use(connectroles.middleware());

    RBACUtil.initializeRoles(connectroles, function(connectroles) {
        route_files.forEach(function (file) {
            require(routes+'/'+file)(app, __dirname, passport, connectroles);
        });
    });


    // Workers can share any TCP connection
    // In this case its a HTTP server
    var server = http.createServer(app).listen(app.get('port'), 1500, function(){
        console.log('Worker ' + cluster.worker.id + ' listening on port ' + app.get('port'));
    });
    server.timeout = 0;
    server.on('request', function(req, res) {
        if(!res.headersSent) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Ilimi-Api-Call, Consumer-Key, User-Name');
        }
    });
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}
