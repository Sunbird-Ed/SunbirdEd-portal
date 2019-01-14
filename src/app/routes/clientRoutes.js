const express = require('express')
const fs = require('fs')
const request = require('request')
const compression = require('compression')
const MobileDetect = require('mobile-detect')
const _ = require('lodash')
const path = require('path')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const tenantHelper = require('../helpers/tenantHelper.js')
const configHelper = require('../helpers/configServiceSDKHelper.js')
const defaultTenantIndexStatus = tenantHelper.getDefaultTenantIndexState()
const tenantCdnUrl = envHelper.TENANT_CDN_URL
const defaultTenant = envHelper.DEFAULT_CHANNEL
const oneDayMS = 86400000
let tenantId = ''

module.exports = (app, keycloak) => {
  app.set('view engine', 'ejs')

  app.use(express.static(path.join(__dirname, '../dist'), { extensions: ['ejs'], index: false }))

  app.use(express.static(path.join(__dirname, '../')))

  app.use(express.static(path.join(__dirname, '../tenant', tenantId)))

  if (defaultTenant) {
    app.use(express.static(path.join(__dirname, '../tenant', defaultTenant)))
  }

  app.get(['/dist/*.js', '/dist/*.css', '/dist/*.ttf', '/dist/*.woff2', '/dist/*.woff', '/dist/*.eot', '/dist/*.svg'],
        compression(), (req, res, next) => {
          res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS * 30)
          res.setHeader('Expires', new Date(Date.now() + oneDayMS * 30).toUTCString())
          next()
        })

  app.all(['/server.js', '/helpers/*.js', '/helpers/**/*.js'], (req, res) => res.sendStatus(404))

  app.get('/assets/images/*', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS)
    res.setHeader('Expires', new Date(Date.now() + oneDayMS).toUTCString())
    next()
  })

  app.all(['/', '/get', '/get/dial/:dialCode', '/explore',
    '/explore/*', '/:slug/explore', '/:slug/explore/*', '/play/*','/explore-course',
    '/explore-course/*', '/:slug/explore-course', '/:slug/explore-course/*',
    '/:slug/signup', '/signup', '/:slug/sign-in/*', '/sign-in/*'], indexPage)

  app.all('/:slug/get', (req, res) => res.redirect('/get'))

  app.all('/:slug/get/dial/:dialCode', (req, res) => res.redirect('/get/dial/:dialCode'))

  app.all(['*/dial/:dialCode', '/dial/:dialCode'], (req, res) => res.redirect('/get/dial/' + req.params.dialCode))

  app.all('/app', (req, res) => res.redirect(envHelper.ANDROID_APP_URL))

  app.all(['/home', '/home/*', '/announcement', '/announcement/*', '/search', '/search/*',
    '/orgType', '/orgType/*', '/dashboard', '/dashboard/*', '/orgDashboard', '/orgDashboard/*',
    '/workspace', '/workspace/*', '/profile', '/profile/*', '/learn', '/learn/*', '/resources',
    '/resources/*', '/myActivity', '/myActivity/*'], keycloak.protect(), indexPage)

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
}

function getLocals (req, callback) {
  var locals = {}
  locals.userId = _.get(req, 'kauth.grant.access_token.content.sub') ? req.kauth.grant.access_token.content.sub : null
  locals.sessionId = _.get(req, 'sessionID') && _.get(req, 'kauth.grant.access_token.content.sub') ? req.sessionID : null
  locals.cdnUrl = envHelper.PORTAL_CDN_URL
  locals.theme = configHelper.getConfig('sunbird_theme')
  locals.defaultPortalLanguage = configHelper.getConfig('sunbird_default_language')
  locals.instance = process.env.sunbird_instance
  locals.appId = envHelper.APPID
  locals.defaultTenant = envHelper.DEFAULT_CHANNEL
  locals.exploreButtonVisibility = configHelper.getConfig('sunbird_explore_button_visibility')
  locals.helpLinkVisibility = envHelper.sunbird_help_link_visibility
  locals.defaultTenantIndexStatus = defaultTenantIndexStatus
  locals.extContWhitelistedDomains = configHelper.getConfig('sunbird_extcont_whitelisted_domains')
  locals.buildNumber = envHelper.BUILD_NUMBER
  locals.apiCacheTtl = envHelper.PORTAL_API_CACHE_TTL
  locals.cloudStorageUrls = envHelper.CLOUD_STORAGE_URLS
  locals.userUploadRefLink = configHelper.getConfig('sunbird_portal_user_upload_ref_link')
  locals.deviceRegisterApi = envHelper.DEVICE_REGISTER_API
  locals.googleCaptchaSiteKey = envHelper.sunbird_google_captcha_site_key
  callback(null, locals)
}

function indexPage (req, res) {
  if (defaultTenant && req.path === '/') {
    tenantId = defaultTenant
    renderTenantPage(req, res)
  } else {
    renderDefaultIndexPage(req, res)
  }
}

function renderDefaultIndexPage (req, res) {
  try {
    const mobileDetect = new MobileDetect(req.headers['user-agent'])
    if ((req.path === '/get' || req.path === '/' + req.params.slug + '/get') &&
        mobileDetect.os() === 'AndroidOS') {
      res.redirect(envHelper.ANDROID_APP_URL)
    } else {
      res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
      var responseData = getLocals(req, function (error, response) {
        if (!error) {
          _.forIn(response, function (value, key) {
            res.locals[key] = value
          })
          res.render(path.join(__dirname, '../dist', 'index.ejs'))
        } else {
          console.warn('Fails to render')
        }
      })
    }
  } catch (e) {
    throw e
  }
}
// renders tenant page from cdn or from local files based on tenantCdnUrl exists
function renderTenantPage (req, res) {
  try {
    if (tenantCdnUrl) {
      request(tenantCdnUrl + '/' + tenantId + '/' + 'index.html', function (error, response, body) {
        if (error || !body || response.statusCode !== 200) {
          loadTenantFromLocal(req, res)
        } else {
          res.send(body)
        }
      })
    } else {
      loadTenantFromLocal(req, res)
    }
  } catch (e) {
    loadTenantFromLocal(req, res)
  }
}
// in fallback option check always for local tenant folder and redirect to / if not exists
function loadTenantFromLocal (req, res) {
  if (tenantId) {
    if (fs.existsSync(path.join(__dirname, 'tenant', tenantId, 'index.html'))) {
      res.sendFile(path.join(__dirname, 'tenant', tenantId, 'index.html'))
    } else {
            // renderDefaultIndexPage only if there is no local default tenant else redirect
      if (defaultTenant && req.path === '/') {
        renderDefaultIndexPage(req, res)
      } else {
                // this will be executed only if user is typed invalid tenant in url
        res.redirect('/')
      }
    }
  } else {
    renderDefaultIndexPage(req, res)
  }
}
