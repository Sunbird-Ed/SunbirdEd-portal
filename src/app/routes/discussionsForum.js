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

    app.post(`${BASE_REPORT_URL}/forum/v2/read`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v2/create`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum/v2/remove`, proxyUtils.verifyToken(), proxyObject());

    app.get(`${BASE_REPORT_URL}/tags`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/notifications`, proxyUtils.verifyToken(), proxyObject());

    // categories apis
    app.get(`${BASE_REPORT_URL}/category/:category_id`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories/:cid/moderators`, proxyUtils.verifyToken(), proxyObject());

    app.get(`${BASE_REPORT_URL}/user/:userslug`, proxyUtils.verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/upvoted`, proxyUtils.verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/downvoted`, proxyUtils.verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/bookmarks`, proxyUtils.verifyToken(), proxyObject())
    app.get(`${BASE_REPORT_URL}/user/:userslug/best`, proxyUtils.verifyToken(), proxyObject())

    // topic apis
    app.get(`${BASE_REPORT_URL}/unread`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/recent`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/popular`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/top`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/:topic_id/:slug`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/:topic_id`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/unread/total`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/teaser/:topic_id`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/pagination/:topic_id`, proxyUtils.verifyToken(), proxyObject());

    // groups api
    app.get(`${BASE_REPORT_URL}/groups`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/groups/:slug`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/groups/:slug/members`, proxyUtils.verifyToken(), proxyObject());

    // post apis
    app.get(`${BASE_REPORT_URL}/recent/posts/:day`, proxyUtils.verifyToken(), proxyObject());

    // all admin apis : Not require for now
    // app.get(`${BASE_REPORT_URL}/user/admin/watched`, proxyUtils.verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/info`, proxyUtils.verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/bookmarks`, proxyUtils.verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/posts`, proxyUtils.verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/groups`, proxyUtils.verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/upvoted`, proxyUtils.verifyToken(), proxyObject());
    // app.get(`${BASE_REPORT_URL}/user/admin/downvoted`, proxyUtils.verifyToken(), proxyObject());

    // topics apis 
    app.post(`${BASE_REPORT_URL}/v2/topics`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/state`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/follow`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/tags`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/topics/:tid/pin`, proxyUtils.verifyToken(), proxyObject());

    // categories apis
    app.post(`${BASE_REPORT_URL}/v2/categories`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/categories/:cid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/categories/:cid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/categories/:cid/state`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/state`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/categories/:cid/privileges`, proxyUtils.verifyToken(), proxyObject());

    // groups apis 
    app.post(`${BASE_REPORT_URL}/v2/groups`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/groups/:slug`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/groups/:slug/membership/:uid`, proxyUtils.verifyToken(), proxyObject());


    // post apis 
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyUtils.verifyToken(), proxyObject());

    // util apis : not require for now
    // app.post(`${BASE_REPORT_URL}/v2/util/upload`, proxyUtils.verifyToken(), proxyObject());
    // app.post(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyUtils.verifyToken(), proxyObject());
    // app.delete(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyUtils.verifyToken(), proxyObject());

    // user api
    app.post(`${BASE_REPORT_URL}/v2/users`, proxyUtils.verifyToken(), bodyParser.json({ limit: '10mb' }), checkEmail(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/password`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/users/:uid/chats`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyUtils.verifyToken(), proxyObject());
    // app.delete(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyUtils.verifyToken(), proxyObject()); // not require for now
    app.get(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/tokens/:token`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/username/:username`, proxyUtils.verifyToken(), proxyObject());

    // TODO: add into white api and add role owner check
    app.post(`${BASE_REPORT_URL}/user/v1/create`, isAPIWhitelisted.isAllowed(), proxyUtils.verifyToken(), proxyObjectForCreate());
    app.get(`${BASE_REPORT_URL}/user/uid/:uid`, proxyUtils.verifyToken(), proxyObject());
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
    //    let decoratedHeaders =  proxyUtils.decorateRequestHeaders(discussions_middleware)()
        proxyReqOpts.headers['Authorization'] = 'Bearer ' + srcReq.session['nodebb_authorization_token'];
        return proxyReqOpts;
    }
}

function proxyObject() {
    return proxy(discussions_middleware, {
        proxyReqOptDecorator: addHeaders(),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl;
            console.log("Request comming from :", urlParam)
            let query = require('url').parse(req.url).query;
            if (query) {
                return require('url').parse(discussions_middleware + urlParam + '?' + query).path
            } else {
                return require('url').parse(discussions_middleware + urlParam).path
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
            if (query) {
                return require('url').parse(discussions_middleware + urlParam + '?' + query).path
            } else {
                return require('url').parse(discussions_middleware + urlParam).path
            }
        },
        userResDecorator: (proxyRes, proxyResData, req, res) => {
            try {
                const nodebb_auth_token = proxyRes.headers['nodebb_auth_token'];
                if(nodebb_auth_token) {
                    req.session['nodebb_authorization_token'] = nodebb_auth_token;
                    delete req.headers['nodebb_authorization_token'];
                }
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
