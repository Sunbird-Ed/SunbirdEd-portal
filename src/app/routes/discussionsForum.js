const proxyUtils = require('../proxy/proxyUtils.js');
const BASE_REPORT_URL = "/discussionForum";
const proxy = require('express-http-proxy');
const { discussions_middleware } = require('../helpers/environmentVariablesHelper.js');
const jwt = require('jsonwebtoken');
const _ = require('lodash')
const bodyParser = require('body-parser');
const dateFormat = require('dateformat')


module.exports = function (app) {

    app.get(`${BASE_REPORT_URL}/forumId`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/forum`, proxyUtils.verifyToken(), proxyObject());

    app.get(`${BASE_REPORT_URL}/tags`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/notifications`, proxyUtils.verifyToken(), proxyObject());

    // categories apis
    app.get(`${BASE_REPORT_URL}/category/:category_id/:slug/:topic_index`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/categories/:cid/moderators`, proxyUtils.verifyToken(), proxyObject());

    // topic apis
    app.get(`${BASE_REPORT_URL}/unread`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/recent`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/popular`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/top`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/:topic_id/:slug/:post_index`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/unread/total`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/teaser/:topic_id`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/topic/pagination/:topic_id`, proxyUtils.verifyToken(), proxyObject());

    // groups api
    app.get(`${BASE_REPORT_URL}/groups`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/groups/:slug`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/groups/:slug/members`, proxyUtils.verifyToken(), proxyObject());

    // post apis
    app.get(`${BASE_REPORT_URL}/recent/posts/:day`, proxyUtils.verifyToken(), proxyObject());

    // all admin apis
    app.get(`${BASE_REPORT_URL}/user/admin/watched`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/admin/info`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/admin/bookmarks`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/admin/posts`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/admin/groups`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/admin/upvoted`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/admin/downvoted`, proxyUtils.verifyToken(), proxyObject());

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
    app.put(`${BASE_REPORT_URL}/v2/posts/:pid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/state`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/vote`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/posts/:pid/bookmark`, proxyUtils.verifyToken(), proxyObject());

    // util apis 
    app.post(`${BASE_REPORT_URL}/v2/util/upload`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/util/maintenance`, proxyUtils.verifyToken(), proxyObject());

    // user api
    app.post(`${BASE_REPORT_URL}/v2/users`, proxyUtils.verifyToken(), bodyParser.json({ limit: '10mb' }), checkEmail(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/password`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/follow`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/users/:uid/chats`, proxyUtils.verifyToken(), proxyObject());
    app.put(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/ban`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyUtils.verifyToken(), proxyObject());
    app.post(`${BASE_REPORT_URL}/v2/users/:uid/tokens`, proxyUtils.verifyToken(), proxyObject());
    app.delete(`${BASE_REPORT_URL}/v2/users/:uid/tokens/:token`, proxyUtils.verifyToken(), proxyObject());
    app.get(`${BASE_REPORT_URL}/user/username/:username`, proxyUtils.verifyToken(), proxyObject());

}

function checkEmail() {
    return function (req, res, next) {
            console.log(req.session['keycloak-token'])
            const token = JSON.parse(req.session['keycloak-token'])
            const jwtPayload = jwt.decode(token['access_token'], { complete: true });
            console.log(jwtPayload)
            const email = jwtPayload.payload.email;
            if (email) {
                console.log("email found", email)
                req.body['email'] = email;
                next();
            } else {
                console.log("email not found")
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

function proxyObject() {
    return proxy(discussions_middleware, {
        proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(discussions_middleware),
        proxyReqPathResolver: function (req) {
            let urlParam = req.originalUrl.replace('/discussionForum', '');
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
                return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
            }
        }
    })
}
