const proxy = require('express-http-proxy')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const learnerBaseUrl = envHelper.LEARNER_SERVICE_UPSTREAM_URL
const contentBaseUrl = envHelper.CONTENT_SERVICE_UPSTREAM_URL
const csLocalProxyURI = '/localproxy/content/'
const lsLocalProxyURI = '/localproxy/learner/'
const reqDataLimitOfContentUpload = '30mb'

/**
 * [contentServiceApi these are the content service api map]
 * [Any new api will come, we will add in last.]
 * @type {Object}
 */
var contentServiceApi = {
  'composite/v1/search': 'v1/search',
  'course/v1/search': 'v1/course/search',
  'course/v1/hierarchy': 'v1/course/hierarchy',
  'content/v1/search': 'v1/content/search',
  'content/v1/create': 'v1/content/create',
  'content/v1/publish': 'v1/content/publish',
  'content/v1/read': 'v1/content/read',
  'content/v1/retire': 'v1/content/retire',
  'content/v1/reject': 'v1/content/reject',
  'content/v1/flag': 'v1/content/flag',
  'content/v1/flag/accept': 'v1/content/flag/accept',
  'content/v1/flag/reject': 'v1/content/flag/reject',
  'channel/v1/read': 'v1/channel/read',
  'framework/v1/read': 'v1/framework/read'
}

/**
 * [learnerServiceApithese are the learner service api map]
 * [Any new api will come, we will add in last.]
 * @type {Object}
 */
var learnerServiceApi = {
  'data/v1/page/assemble': 'v1/page/assemble',
  'user/v1/create': 'v1/user/create',
  'user/v1/update': 'v1/user/update',
  'user/v1/read': 'v1/user/read',
  'course/v1/content/state/read': 'v1/content/state/read',
  'course/v1/content/state/update': 'v1/content/state/update',
  'course/v1/user/enrollment/list': 'v1/user/courses/list',
  'course/v1/enrol': 'v1/course/enrol',
  'course/v1/unenrol': 'v1/course/unenrol',
  'recommended/courses': 'v1/recommended/courses',
  'dashboard/v1/creation/org': 'v1/dashboard/creation/org',
  'dashboard/v1/consumption/org': 'v1/dashboard/consumption/org',
  'dashboard/v1/progress/course': 'v1/dashboard/progress/course',
  'dashboard/v1/consumption/course': 'v1/dashboard/consumption/course',
  'notes/v1/search': 'v1/note/search',
  'notes/v1/create': 'v1/note/create',
  'notes/v1/update': 'v1/note/update',
  'notes/v1/read': 'v1/note/read',
  'notes/v1/delete': 'v1/note/delete',
  'data/v1/role/read': 'v1/role/read',
  'course/v1/batch/create': 'v1/course/batch/create',
  'course/v1/batch/update': 'v1/course/batch/update',
  'course/v1/batch/user/add': 'v1/course/batch/users/add',
  'course/v1/batch/read': 'v1/course/batch/read',
  'course/v1/batch/list': 'v1/course/batch/search',
  'user/v1/search': 'v1/user/search',
  'org/v1/search': 'v1/org/search',
  'user/v1/upload': 'v1/user/upload',
  'org/v1/upload': 'v1/org/upload',
  'data/v1/upload/status': 'v1/upload/status',
  'user/v1/block': 'v1/user/block',
  'org/v1/badges/list': 'v1/badges/list',
  'user/v1/badges/add': 'v1/user/badges/add',
  'org/v1/type/list': 'v1/org/type/list',
  'org/v1/type/create': 'v1/org/type/create',
  'org/v1/type/update': 'v1/org/type/update',
  'role/read': 'v1/role/read'
}

/**
 * [getRedirectUrl : this function is used for get the local(private) api.]
 * @param  {[string]}   requestUrl [api call by portal or public api]
 * @param  {[object]}   urlMap     [api map. Where all api are maped]
 * @param  {Function}   cb         [Cb have public and private api]
 * @return {[Function]}            [description]
 */
var getRedirectUrl = function (requestUrl, urlMap, cb) {
  var uriArray = ''
  if (urlMap[requestUrl]) {
    cb(requestUrl, urlMap[requestUrl])
  } else {
    uriArray = requestUrl.split('/')
    uriArray.pop()
    requestUrl = uriArray.join('/')
    if (urlMap[requestUrl]) {
      cb(requestUrl, urlMap[requestUrl])
    } else {
      uriArray = requestUrl.split('/')
      uriArray.pop()
      requestUrl = uriArray.join('/')
      if (urlMap[requestUrl]) {
        cb(requestUrl, urlMap[requestUrl])
      } else {
        cb(requestUrl, urlMap[requestUrl])
      }
    }
  }
}

module.exports = function (app) {
  app.all(csLocalProxyURI + '*', function (req, res, next) {
    var urlAfterBU = req.url.split(csLocalProxyURI)[1]
    getRedirectUrl(urlAfterBU, contentServiceApi, function (actualUrl, redirectUrl) {
      req.url = req.url.replace(actualUrl, redirectUrl)
      next()
    })
  })

  app.all(csLocalProxyURI + '*', proxy(contentBaseUrl, {
    limit: reqDataLimitOfContentUpload,
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(contentBaseUrl + urlParam + '?' + query).path
      } else {
        return require('url').parse(contentBaseUrl + urlParam).path
      }
    }
  }))

  app.all(lsLocalProxyURI + '*', function (req, res, next) {
    var urlAfterBU = req.url.split(lsLocalProxyURI)[1]
    getRedirectUrl(urlAfterBU, learnerServiceApi, function (actualUrl, redirectUrl) {
      req.url = req.url.replace(actualUrl, redirectUrl)
      next()
    })
  })

  app.all(lsLocalProxyURI + '*', proxy(learnerBaseUrl, {
    proxyReqPathResolver: function (req) {
      let urlParam = req.params['0']
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(learnerBaseUrl + urlParam + '?' + query).path
      } else {
        return require('url').parse(learnerBaseUrl + urlParam).path
      }
    }
  }))
}
