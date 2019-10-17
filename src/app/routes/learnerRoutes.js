const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const healthService = require('../helpers/healthCheckService.js')
const logger = require('sb_logger_util_v2')

module.exports = function (app) {

  require('./accountRecoveryRoute.js')(app) // account recovery route

  // helper route to enable enable admin to update user fields
  app.patch('/learner/portal/user/v1/update',
    proxyUtils.verifyToken(),permissionsHelper.checkPermission(),
    proxy(envHelper.learner_Service_Local_BaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: (req) => {
        return '/private/user/v1/update';
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData});
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        }
      }
  }))
  // Generate telemetry fot proxy service
  app.all('/learner/*', telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy)

  app.post('/learner/content/v1/media/upload',
    proxyUtils.verifyToken(),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        return require('url').parse(learnerURL + '/content/v1/media/upload').path
      },
      userResDecorator: function (proxyRes, proxyResData,  req, res) {
        try {
          let data = JSON.parse(proxyResData.toString('utf8'))
          if (data.responseCode === 'OK') {
            data.success = true
            return JSON.stringify(data)
          }
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))

  app.all('/learner/data/v1/role/read',
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.originalUrl.replace('/learner/', '')
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: function (proxyRes, proxyResData,  req, res) {
        try {
          let data = JSON.parse(proxyResData.toString('utf8'))
          if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))
  
  app.all('/learner/user/v1/get/phone/*',
    permissionsHelper.checkPermission(),
    proxyObj()
  )

  app.all('/learner/user/v1/get/email/*',
    permissionsHelper.checkPermission(),
    proxyObj()
  )
  
  app.all('/learner/*',
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    permissionsHelper.checkPermission(),
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        let urlParam = req.params['0']
        let query = require('url').parse(req.url).query
        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))
}

function proxyObj (){
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace('/learner/', '')
      let query = require('url').parse(req.url).query
      if (query) {
        return require('url').parse(learnerURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(learnerURL + urlParam).path
      }
    },
    userResDecorator: function (proxyRes, proxyResData,  req, res) {
      try {
        let data = JSON.parse(proxyResData.toString('utf8'));
        let response = data.result.response;
        data.result.response = {id: '', rootOrgId: '',isUserExists:''};
        if (data.responseCode === 'OK') {
          data.result.response.id = response.id;
          data.result.response.rootOrgId = response.rootOrgId;
          data.result.response.isUserExists = true;
        }
        if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
      } catch (err) {
        logger.error({msg:'content api user res decorator json parse error:', proxyResData})
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  });
}