const express = require('express'),
fs = require('fs'),
request = require('request'),
compression = require('compression'),
MobileDetect = require('mobile-detect'),
_ = require('lodash'),
path = require('path'),
envHelper = require('../helpers/environmentVariablesHelper.js'),
tenantHelper = require('../helpers/tenantHelper.js'),
defaultTenantIndexStatus = tenantHelper.getDefaultTenantIndexState(),
oneDayMS = 86400000,
pathMap = {},
cdnIndexFileExist = fs.existsSync(path.join(__dirname, '../dist', 'index_cdn.ejs')),
proxyUtils = require('../proxy/proxyUtils.js')
const CONSTANTS = require('../helpers/constants');
const { memoryStore } = require('../helpers/keyCloakHelper')
const session = require('express-session');
const { logger } = require('@project-sunbird/logger');

logger.info({msg:`CDN index file exist: ${cdnIndexFileExist}`});

const setZipConfig = (req, res, type, encoding, dist = '../') => {
    if (pathMap[req.path + type] && pathMap[req.path + type] === 'notExist') {
      return false;
    }
    if(pathMap[req.path + '.'+ type] === 'exist' ||
      fs.existsSync(path.join(__dirname, dist) + req.path + '.' + type)){
        if (req.path.endsWith('.css')) {
          res.set('Content-Type', 'text/css');
        } else if (req.path.endsWith('.js')) {
          res.set('Content-Type', 'text/javascript');
        }
        req.url = req.url + '.' + type;
        res.set('Content-Encoding', encoding);
        pathMap[req.path + type] = 'exist';
        return true
    } else {
      pathMap[req.path + type] = 'notExist';
      // logger.info({ msg: 'zip file not exist', additionalInfo: { url: req.url, type: type } });
      return false;
    }
}
module.exports = (app, keycloak) => {

  app.set('view engine', 'ejs')

  app.get(['*.js', '*.css'], (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS * 30)
    res.setHeader('Expires', new Date(Date.now() + oneDayMS * 30).toUTCString())
    if(req.get('Accept-Encoding') && req.get('Accept-Encoding').includes('br')){ // send br files
      if(!setZipConfig(req, res, 'br', 'br') && req.get('Accept-Encoding').includes('gzip')){
        setZipConfig(req, res, 'gz', 'gzip') // send gzip if br file not found
      }
    } else if(req.get('Accept-Encoding') && req.get('Accept-Encoding').includes('gzip')){
      setZipConfig(req, res, 'gz', 'gzip')
    }
    next();
  });

  app.get(['/dist/*.ttf', '/dist/*.woff2', '/dist/*.woff', '/dist/*.eot', '/dist/*.svg',
    '/*.ttf', '/*.woff2', '/*.woff', '/*.eot', '/*.svg', '/*.html'], compression(),
    (req, res, next) => {
      res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS * 30)
      res.setHeader('Expires', new Date(Date.now() + oneDayMS * 30).toUTCString())
      next()
  })

  app.use(express.static(path.join(__dirname, '../dist'), { extensions: ['ejs'], index: false }))

  app.use('/dist', express.static(path.join(__dirname, '../dist'), { extensions: ['ejs'], index: false }))

  app.use(express.static(path.join(__dirname, '../tenant'), { index: false }))

  app.use('/sunbird-plugins', express.static(path.join(__dirname, '../sunbird-plugins')))

  app.use('/tenant', express.static(path.join(__dirname, '../tenant'), { index: false }))

  if (envHelper.DEFAULT_CHANNEL) {
    app.use(express.static(path.join(__dirname, '../tenant', envHelper.DEFAULT_CHANNEL)))
  }

  app.get('/assets/images/*', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=' + oneDayMS)
    res.setHeader('Expires', new Date(Date.now() + oneDayMS).toUTCString())
    next()
  })

  app.all('/play/quiz/*', playContent);
  app.all('/manage-learn/*', MLContent);

  app.all('/get/dial/:dialCode',(req,res,next) => {
      if (_.get(req, 'query.channel')) {
          getdial(req,res);
      } else {
        next();
      }
  });

  app.all(['/announcement', '/announcement/*', '/search', '/search/*',
  '/orgType', '/orgType/*', '/dashBoard', '/dashBoard/*',
  '/workspace', '/workspace/*', '/profile', '/profile/*', '/learn', '/learn/*', '/resources', '/discussion-forum/*',
  '/resources/*', '/myActivity', '/myActivity/*', '/org/*', '/manage', '/contribute','/contribute/*','/groups','/groups/*', '/my-groups','/my-groups/*','/certs/configure/*',
   '/observation', '/observation/*'], 
  session({
    secret: envHelper.PORTAL_SESSION_SECRET_KEY,
    resave: false,
    cookie: {
      maxAge: envHelper.sunbird_session_ttl 
    },
    saveUninitialized: false,
    store: memoryStore
  }), keycloak.middleware({ admin: '/callback', logout: '/logout' }), keycloak.protect(), indexPage(true));

  // all public route should also have same route prefixed with slug
  app.all(['/', '/get', '/:slug/get', '/:slug/get/dial/:dialCode',  '/get/dial/:dialCode', '/explore',
    '/explore/*', '/:slug/explore', '/:slug/explore/*', '/play/*', '/:slug/play/*',  '/explore-course', '/explore-course/*',
    '/:slug/explore-course', '/:slug/explore-course/*', '/:slug/signup', '/signup', '/:slug/sign-in/*',
    '/sign-in/*', '/download/*', '/accountMerge/*','/:slug/accountMerge/*', '/:slug/download/*', '/certs/*', '/:slug/certs/*', '/recover/*', '/:slug/recover/*', '/explore-groups'], 
    session({
      secret: envHelper.PORTAL_SESSION_SECRET_KEY,
      resave: false,
      cookie: {
        maxAge: envHelper.sunbird_session_ttl 
      },
      saveUninitialized: false,
      store: memoryStore
    }),
    keycloak.middleware({ admin: '/callback', logout: '/logout' }),
    redirectTologgedInPage, indexPage(false))

  app.all(['*/dial/:dialCode', '/dial/:dialCode'], (req, res) => {
    if (_.get(req, 'query.channel')) {
      res.redirect(`/${_.get(req, 'query.channel')}/get/dial/${req.params.dialCode}?source=scan`);
    } else {
      res.redirect('/get/dial/' + req.params.dialCode + '?source=scan')
    }
  })

  app.all('/app', (req, res) => res.redirect(envHelper.ANDROID_APP_URL))

  app.all('/:tenantName', renderTenantPage)

  app.all('/redirect/login', redirectToLogin)
}

function getLocals(req) {
  const slug = req.params.slug;
  var locals = {}
  if(req.includeUserDetail){
    locals.userId = _.get(req, 'session.userId') ? req.session.userId : null
    locals.sessionId = _.get(req, 'sessionID') && _.get(req, 'session.userId') ? req.sessionID : null
    locals.userSid = _.get(req, 'session.userSid') || locals.sessionId || null;
  } else {
    locals.userId = null
    locals.sessionId = null
    locals.userSid = null;
  }
  locals.userName = _.get(req, 'session.userName') || null;
  locals.cdnUrl = envHelper.PORTAL_CDN_URL
  locals.theme = envHelper.sunbird_theme
  locals.defaultPortalLanguage = envHelper.sunbird_default_language
  locals.instance = process.env.sunbird_instance
  locals.appId = envHelper.APPID
  locals.defaultTenant = envHelper.DEFAULT_CHANNEL
  locals.exploreButtonVisibility = envHelper.sunbird_explore_button_visibility
  locals.helpLinkVisibility = envHelper.sunbird_help_link_visibility
  locals.defaultTenantIndexStatus = defaultTenantIndexStatus
  locals.extContWhitelistedDomains = envHelper.sunbird_extcont_whitelisted_domains
  locals.buildNumber = envHelper.BUILD_NUMBER
  locals.apiCacheTtl = envHelper.PORTAL_API_CACHE_TTL
  locals.cloudStorageUrls = envHelper.CLOUD_STORAGE_URLS
  locals.userUploadRefLink = envHelper.sunbird_portal_user_upload_ref_link
  locals.deviceRegisterApi = envHelper.DEVICE_REGISTER_API
  locals.deviceApi = envHelper.sunbird_device_api
  locals.googleCaptchaSiteKey = envHelper.sunbird_google_captcha_site_key
  locals.videoMaxSize = envHelper.sunbird_portal_video_max_size
  locals.reportsLocation = envHelper.sunbird_azure_report_container_name
  locals.previewCdnUrl = envHelper.sunbird_portal_preview_cdn_url
  locals.offlineDesktopAppTenant = envHelper.sunbird_portal_offline_tenant
  locals.offlineDesktopAppVersion = envHelper.sunbird_portal_offline_app_version
  locals.offlineDesktopAppReleaseDate = envHelper.sunbird_portal_offline_app_release_date
  locals.offlineDesktopAppSupportedLanguage = envHelper.sunbird_portal_offline_supported_languages,
  locals.offlineDesktopAppDownloadUrl = envHelper.SUNBIRD_PORTAL_BASE_URL
  locals.logFingerprintDetails = envHelper.LOG_FINGERPRINT_DETAILS,
  locals.slugForProminentFilter = envHelper.sunbird_portal_slugForProminentFilter,
  locals.deviceId = '';
  locals.deviceProfileApi = envHelper.DEVICE_PROFILE_API;
  locals.slug = slug ? slug : '';
  locals.collectionEditorURL = envHelper.CONTENT_EDITORS_URL.COLLECTION_EDITOR;
  locals.contentEditorURL = envHelper.CONTENT_EDITORS_URL.CONTENT_EDITOR;
  locals.genericEditorURL = envHelper.CONTENT_EDITORS_URL.GENERIC_EDITOR;
  locals.botConfigured = envHelper.sunbird_bot_configured;
  locals.botServiceURL = envHelper.sunbird_bot_service_URL;
  locals.superAdminSlug = envHelper.sunbird_super_admin_slug;
  locals.p1reCaptchaEnabled = envHelper.sunbird_p1_reCaptcha_enabled;
  locals.p2reCaptchaEnabled = envHelper.sunbird_p2_reCaptcha_enabled;
  locals.p3reCaptchaEnabled = envHelper.sunbird_p3_reCaptcha_enabled;
  locals.enableSSO = envHelper.sunbird_enable_sso;
  locals.reportsListVersion = envHelper.reportsListVersion;
  locals.baseUrl = null;
  return locals
}

const indexPage = (loggedInRoute) => {
  return async (req, res) => {
    if (envHelper.DEFAULT_CHANNEL && req.path === '/') {
      renderTenantPage(req, res)
    } else {
      req.includeUserDetail = true
      if(!loggedInRoute) { // for public route, if user token is valid then send user details
        await proxyUtils.validateUserToken(req, res).catch(err => req.includeUserDetail = false)
      }
      renderDefaultIndexPage(req, res)
    }
  }
}

const renderDefaultIndexPage = (req, res) => {
  const mobileDetect = new MobileDetect(req.headers['user-agent'])
  if ((req.path == '/get' || req.path == `/${req.params.slug}/get`) && mobileDetect.os() == 'AndroidOS') {
    res.redirect(envHelper.ANDROID_APP_URL)
  } else {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    res.locals = getLocals(req);
    logger.info({
      msg:'cdn parameters:',
      additionalInfo: {
        PORTAL_CDN_URL: envHelper.PORTAL_CDN_URL,
        cdnIndexFileExist: cdnIndexFileExist,
        cdnFailedCookies: req.cookies.cdnFailed
      }
    })
    if(envHelper.PORTAL_CDN_URL && cdnIndexFileExist && req.cookies.cdnFailed !== 'yes'){ // assume cdn works and send cdn ejs file
      res.locals.cdnWorking = 'yes';
      res.render(path.join(__dirname, '../dist', 'index_cdn.ejs'))
    } else { // load local file if cdn fails or cdn is not enabled
      if(req.cookies.cdnFailed === 'yes'){
        logger.info({msg:'CDN Failed - loading local files',
      additionalInfo: {
        cdnIndexFileExist: cdnIndexFileExist,
        PORTAL_CDN_URL: envHelper.PORTAL_CDN_URL
      }})
      }
      res.locals.cdnWorking = 'no';
      res.render(path.join(__dirname, '../dist', 'index.ejs'))
    }
  }
}
// renders tenant page from cdn or from local files based on tenantCdnUrl exists
const renderTenantPage = (req, res) => {
  const tenantName = _.lowerCase(req.params.tenantName) || envHelper.DEFAULT_CHANNEL
  if(req.query.cdnFailed === 'true') {
    loadTenantFromLocal(req, res)
    return;
  }
  if (envHelper.TENANT_CDN_URL) {
    request(`${envHelper.TENANT_CDN_URL}/${tenantName}/index.html`, (error, response, body) => {
      if (error || !body || response.statusCode !== 200) {
        loadTenantFromLocal(req, res)
      } else {
        res.send(body)
      }
    })
  } else {
    loadTenantFromLocal(req, res)
  }
}
// in fallback option check always for local tenant folder and redirect to / if not exists
const loadTenantFromLocal = (req, res) => {
  const tenantName = _.lowerCase(req.params.tenantName) || envHelper.DEFAULT_CHANNEL
  if (tenantName && fs.existsSync(path.join(__dirname, './../tenant', tenantName, 'index.html'))) {
    res.sendFile(path.join(__dirname, './../tenant', tenantName, 'index.html'))
  } else {
    renderDefaultIndexPage(req, res)
  }
}
const redirectTologgedInPage = (req, res) => {
	let redirectRoutes = { '/explore': '/resources', '/explore/1': '/search/Library/1', '/explore-course': '/learn', '/explore-course/1': '/search/Courses/1' };
	if (req.params.slug) {
		redirectRoutes = {
			[`/${req.params.slug}/explore`]: '/resources',
			[`/${req.params.slug}/explore-course`]: '/learn'
		}
	}
	if (_.get(req, 'sessionID') && _.get(req, 'session.userId')) {
		if (_.get(redirectRoutes, req.originalUrl)) {
			const routes = _.get(redirectRoutes, req.originalUrl);
			res.redirect(routes)
		} else if (_.get(redirectRoutes, ((req.originalUrl).substring(0,(req.originalUrl).indexOf('?'))))) {
      let routes = _.get(redirectRoutes, ((req.originalUrl).substring(0,(req.originalUrl).indexOf('?'))));
      routes = routes + ((req.originalUrl).substring((req.originalUrl).indexOf('?')));
			res.redirect(routes)
    } else {
      const urlWithOutSlug = req.params.slug ? req.originalUrl.replace('/' + req.params.slug, '') : req.originalUrl;
      const courseUrl = urlWithOutSlug.includes('/explore-course/course/');
      if (courseUrl) {
        return res.redirect(urlWithOutSlug.replace('/explore-course/course/', '/learn/course/'));
      }
			if (_.get(redirectRoutes, `/${req.originalUrl.split('/')[1]}`)) {
				const routes = _.get(redirectRoutes, `/${req.originalUrl.split('/')[1]}`);
				res.redirect(routes)
      } else if(_.includes(_.get(req, 'originalUrl'), 'get') || _.includes(_.get(req, 'originalUrl'), 'dial')){
        req.includeUserDetail = true;
        renderDefaultIndexPage(req, res);
      }
      else {
				renderDefaultIndexPage(req, res)
			}
		}
	} else {
		renderDefaultIndexPage(req, res)
	}
}

const playContent = (req, res) => {
  if (req.path.includes('/play/quiz') && fs.existsSync(path.join(__dirname, '../tenant/quiz/', 'index.html'))){
    res.sendFile(path.join(__dirname, '../tenant/quiz/', 'index.html'));
  } else {
    renderDefaultIndexPage(req, res);
  }
}
const MLContent = (req, res) => {
  if (req.path.includes('/manage-learn/') && fs.existsSync(path.join(__dirname, '../tenant/manage-learn/', 'index.html'))){
    res.sendFile(path.join(__dirname, '../tenant/manage-learn/', 'index.html'));
  } else {
    renderDefaultIndexPage(req, res);
  }
}

const redirectToLogin = (req, res) => {
  const redirectUrl = req.query.redirectUri || '/resources';
  const url = `${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/auth`;
  const query = `?client_id=portal&state=3c9a2d1b-ede9-4e6d-a496-068a490172ee&redirect_uri=https://${req.get('host')}/${redirectUrl}&scope=openid&version=${CONSTANTS.KEYCLOAK.VERSION}&response_type=code&error_message=${req.query.error_message}`;
  res.redirect(url + query);
};


const getdial = (req,res) => {
  if (fs.existsSync(path.join(__dirname, '../tenant/course/', 'index.html'))) {
    res.sendFile(path.join(__dirname, '../tenant/course/', 'index.html'));
  } else {
    renderDefaultIndexPage(req, res);
  }
}
