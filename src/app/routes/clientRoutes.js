const express = require('express')
const fs = require('fs')
const MobileDetect = require('mobile-detect');
const envHelper = require('../helpers/environmentVariablesHelper.js')
const tenantHelper = require('../helpers/tenantHelper.js')
const defaultTenantIndexStatus = tenantHelper.getDefaultTenantIndexState();
const tenantCdnUrl = envHelper.TENANT_CDN_URL;
const defaultTenant = envHelper.DEFAULT_CHANNEL
let tenantId = ''
const _ = require('lodash')
const path = require('path')

function getLocals(req) {
    var locals = {};
    locals.userId = _.get(req, 'kauth.grant.access_token.content.sub') ? req.kauth.grant.access_token.content.sub : null
    locals.sessionId = _.get(req, 'sessionID') && _.get(req, 'kauth.grant.access_token.content.sub') ? req.sessionID : null
    locals.cdnUrl = envHelper.PORTAL_CDN_URL
    locals.theme = envHelper.PORTAL_THEME
    locals.defaultPortalLanguage = envHelper.PORTAL_DEFAULT_LANGUAGE
    locals.instance = process.env.sunbird_instance
    locals.appId = envHelper.APPID
    locals.ekstepEnv = envHelper.EKSTEP_ENV
    locals.defaultTenant = envHelper.DEFAULT_CHANNEL
    locals.exploreButtonVisibility = envHelper.EXPLORE_BUTTON_VISIBILITY;
    locals.defaultTenantIndexStatus = defaultTenantIndexStatus;
    locals.enableSignup = envHelper.ENABLE_SIGNUP;
    locals.extContWhitelistedDomains = envHelper.SUNBIRD_EXTCONT_WHITELISTED_DOMAINS;
    locals.buildNumber = envHelper.BUILD_NUMBER
    locals.apiCacheTtl = envHelper.PORTAL_API_CACHE_TTL
    return locals;
}

function indexPage(req, res) {
    if (defaultTenant && req.path === '/') {
        tenantId = defaultTenant
        renderTenantPage(req, res)
    } else {
        renderDefaultIndexPage(req, res)
    }
}

function renderDefaultIndexPage(req, res) {
    const mobileDetect = new MobileDetect(req.headers['user-agent']);
    if ((req.path === '/get' || req.path === '/' + req.params.slug + '/get')
        && mobileDetect.os() === 'AndroidOS') {
        res.redirect(envHelper.ANDROID_APP_URL)
    } else {
        res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
        _.forIn(getLocals(req), function (value, key) {
            res.locals[key] = value
        })
        res.render(path.join(__dirname, '../dist', 'index.ejs'))
    }
}
// renders tenant page from cdn or from local files based on tenantCdnUrl exists
function renderTenantPage(req, res) {
    try {
        if (tenantCdnUrl) {
            request(tenantCdnUrl + '/' + tenantId + '/' + 'index.html', function (error, response, body) {
                if (error || !body || response.statusCode !== 200) {
                    loadTenantFromLocal(req, res)
                } else {
                    res.send(body)
                }
            });
        } else {
            loadTenantFromLocal(req, res)
        }
    } catch (e) {
        loadTenantFromLocal(req, res)
    }
}
//in fallback option check always for local tenant folder and redirect to / if not exists
function loadTenantFromLocal(req, res) {
    if (tenantId) {
        if (fs.existsSync(path.join(__dirname, 'tenant', tenantId, 'index.html'))) {
            res.sendFile(path.join(__dirname, 'tenant', tenantId, 'index.html'))
        } else {
            // renderDefaultIndexPage only if there is no local default tenant else redirect
            if (defaultTenant && req.path === '/') {
                renderDefaultIndexPage(req, res)
            } else {
                //this will be executed only if user is typed invalid tenant in url
                res.redirect('/')
            }
        }
    } else {
        renderDefaultIndexPage(req, res)
    }
}
module.exports = (app, keycloak) => {

    app.all(['/', '/signup', '/get', '/get/dial/:dialCode', '/explore',
        '/explore/*', '/:slug/explore', '/:slug/explore/*', '/play/*'], indexPage)

    app.all('/:slug/get', (req, res) => res.redirect('/get'))

    app.all('/:slug/get/dial/:dialCode', (req, res) => res.redirect('/get/dial/:dialCode'))

    app.all(['*/dial/:dialCode', '/dial/:dialCode'], (req, res) => res.redirect('/get/dial/' + req.params.dialCode))

    app.all('/app', (req, res) => res.redirect(envHelper.ANDROID_APP_URL))

    app.all(['/home', '/home/*', '/announcement', '/announcement/*', '/search', '/search/*',
        '/orgType', '/orgType/*', '/dashboard', '/dashboard/*', '/orgDashboard', '/orgDashboard/*',
        '/workspace', '/workspace/*', '/profile', '/profile/*', '/learn', '/learn/*', '/resources',
        '/resources/*', '/myActivity', '/myActivity/*'], keycloak.protect(), indexPage)

    app.use(express.static(path.join(__dirname, '/')))

    app.all('/:tenantName', (req, res) => {
        tenantId = req.params.tenantName
        if (_.isString(tenantId)) {
            tenantId = _.lowerCase(tenantId)
        }
        if (tenantId) {
            renderTenantPage(req, res)
        } else if (defaultTenant) {
            renderTenantPage(req, res)
        } else {
            res.redirect('/')
        }
    })

    app.use(express.static(path.join(__dirname, '../tenant', tenantId)))

    if (defaultTenant) {
        app.use(express.static(path.join(__dirname, '../tenant', defaultTenant)))
    }
}