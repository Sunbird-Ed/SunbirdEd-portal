const proxyUtils = require('../proxy/proxyUtils.js');
const BASE_REPORT_URL = "/discussion";
const proxy = require('express-http-proxy');
const { discussions_middleware } = require('../helpers/environmentVariablesHelper.js');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bodyParser = require('body-parser');
const dateFormat = require('dateformat')
const { logger } = require('@project-sunbird/logger');
const isAPIWhitelisted  = require('../helpers/apiWhiteList');


module.exports = function (app) {

    app.post(`${BASE_REPORT_URL}/forum/v2/read`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/tags`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v2/create`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v2/remove`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v3/create`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v3/category/:cid/privileges`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v3/group/membership`,verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v3/groups/users`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/privileges/v2/copy`, verifyToken(), proxyObject());

    app.get(`${BASE_REPORT_URL}/tags`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/tags/:tag`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/tags/list`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/notifications`, verifyToken(), proxyObject());

    // categories apis
    app.get(`${BASE_REPORT_URL}/category/:category_id`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/category/list`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories/:cid/moderators`, verifyToken(), proxyObject());

    app.get(`${BASE_REPORT_URL}/user/:userslug`, verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/upvoted`, verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/downvoted`, verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/bookmarks`, verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/best`, verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/posts`, verifyToken(), proxyObject())


    // topic apis
    app.get(`${BASE_REPORT_URL}/unread`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/recent`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/popular`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/top`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/:topic_id/:slug`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/:topic_id`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/unread/total`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/teaser/:topic_id`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/pagination/:topic_id`, verifyToken(), proxyObject());

    // groups api
    app.get(`${BASE_REPORT_URL}/groups`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/groups/:slug`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/groups/:slug/members`, verifyToken(), proxyObject());

    // post apis
    app.get(`${BASE_REPORT_URL}/recent/posts/:day`, verifyToken(), proxyObject());

    // all admin apis : Not require for now
    // app.get(`${BASE_REPORT_URL}/user/admin/watched`, verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/info`, verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/bookmarks`, verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/posts`, verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/groups`, verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/upvoted`, verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/downvoted`, verifyToken(), proxyObject());

    // topics apis 
    app.post(`${BASE_REPORT_URL}/v2/topics`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/topics/:tid`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/topics/update/:tid`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/state`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, verifyToken(), proxyObject());

    // categories apis
    app.post(`${BASE_REPORT_URL}/v2/categories`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/categories/:cid`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/categories/:cid`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/categories/:cid/state`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/state`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, verifyToken(), proxyObject());

    // groups apis 
    app.post(`${BASE_REPORT_URL}/v2/groups`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/groups/:slug`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, verifyToken(), proxyObject());


    // post apis 
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/posts/:pid/state`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/state`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, verifyToken(), proxyObject());

    // util apis : not require for now
    // app.post(`${BASE_REPORT_URL}/v2/util/upload`, verifyToken(), proxyObject());
    // app.post(`${BASE_REPORT_URL}/v2/util/maintenance`, verifyToken(), proxyObject());
    // app.delete(`${BASE_REPORT_URL}/v2/util/maintenance`, verifyToken(), proxyObject());

    // user api
    app.post(`${BASE_REPORT_URL}/v2/users`, verifyToken(), bodyParser.json({ limit: '10mb' }), checkEmail(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/password`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/follow`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/follow`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/users/:uid/chats`, verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/ban`, verifyToken(), proxyObject());
    // app.delete(`${BASE_REPORT_URL}/v2/users/:uid/ban`, verifyToken(), proxyObject()); // not require for now
    app.get(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/tokens/:token`, verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/username/:username`, verifyToken(), proxyObject());

    // TODO: add into white api and add role owner check
    app.post(`${BASE_REPORT_URL}/user/v1/create`, isAPIWhitelisted.isAllowed(), verifyToken(), proxyObjectForCreate());
    app.get(`${BASE_REPORT_URL}/user/uid/:uid`, verifyToken(), proxyObject());
}

function verifyToken() {
    return async (req, res, next) => {
        let reqSession = Object.assign({}, req.session);
        delete reqSession['auth_redirect_uri'];
        delete reqSession['keycloak-token']
        console.log('Discussion forum let:', reqSession);
        await proxyUtils.validateUserTokenForDF(req, res, next);
        next();
    }
}

function checkEmail() {
    return function (req, res, next) {
            const token = JSON.parse(req.session['keycloak-token']);
            const jwtPayload = jwt.decode(token['access_token'], { complete: true });
            const email = jwtPayload.payload.email;
            const userName = jwtPayload.payload. preferred_username;
            const userName_body = req.body.username;
            const userId = req.session.userId;
            const user = req.session.userName;
            if (email && userName === userName_body) {
                logger.info("email found", email)
                req.body['email'] = email;
                req.body['sbUsername'] = user;
                req.body['sbIdentifier']  = userId;
                next();
            } else {
                logger.info({message: "email not found"})
                res.status(500)
                res.send({
                  'id': 'api.error',
                  'ver': '1.0',
                  'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
                  'params': {
                    'msgid': null,
                    'status': 'failed',
                    'err': 'Email Required',
                    'errmsg': 'Email Required'
                  },
                  'responseCode': 500,
                  'result': {}
                })
                res.end();
            }
    }
}

// TODO: this token logic we have to add in middleware itself;
function addHeaders() {
    return function (proxyReqOpts, srcReq) { 
        var sessionId = _.get(srcReq, 'headers.x-session-id') || _.get(srcReq, 'sessionID');
        proxyReqOpts.headers['X-Session-Id'] = sessionId;
        return proxyReqOpts;
    }
}

function proxyObject() {
    return proxy(discussions_middleware, {
        proxyReqOptDecorator: addHeaders(),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl;
            console.log("Request comming from :", urlParam)
            const uid = req.session['nodebb_uid'];
            let query = require('url').parse(req.url).query;
            if (query) {
                const queryData = _.isEmpty(req.query._uid) ? `&_uid=${uid}` : ''
                const path = require('url').parse(discussions_middleware + urlParam + queryData).path
                return path
            } else {
                return require('url').parse(discussions_middleware + urlParam+ '?_uid='+ uid).path
            }
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({message: err});
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    })
}


function proxyObjectForCreate() {
    return proxy(discussions_middleware, {
        proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(discussions_middleware),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl;
            let query = require('url').parse(req.url).query;
            return require('url').parse(discussions_middleware + urlParam).path;
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                const data = JSON.parse(proxyResData.toString('utf8'));
                const nodebb_uid = data.result['userId']['uid'];
                if(nodebb_uid) {
                    req.session['nodebb_uid'] = nodebb_uid;
                }
                if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
                else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
            } catch (err) {
                logger.error({message: err});
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    })
}
