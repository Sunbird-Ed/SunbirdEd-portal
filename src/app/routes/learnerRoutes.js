const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const learnerURL = envHelper.LEARNER_URL
const telemetryHelper = require('../helpers/telemetryHelper.js')
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const healthService = require('../helpers/healthCheckService.js')
const logger = require('sb_logger_util_v2')
const whitelistUrls = require('../helpers/whitellistUrls.js')
const {decrypt} = require('../helpers/crypto');
const {parseJson, isDateExpired} = require('../helpers/utilityService');
const _ = require('lodash');

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
          logger.info({msg: '/learner/portal/user/v1/update called'});
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
          logger.info({msg: '/learner/content/v1/media/upload called'});
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
          logger.info({msg: '/learner/data/v1/role/read called'});
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


  app.all('/learner/user/v1/signup',
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    permissionsHelper.checkPermission(),
    checkForValidUser()
  )

  app.all('/learner/*', bodyParser.urlencoded({ extended: false }), bodyParser.json({limit: '10mb'}),
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    whitelistUrls.isWhitelistUrl(),
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
            if(req.url.indexOf('/otp/') > 0) {
              proxyUtils.addReqLog(req);
            }            
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData, error: JSON.stringify(err)})
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))
}

function checkForValidUser (){
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      var data = JSON.parse(bodyContent.toString('utf8'));
      var reqEmail = data.request['email'];
      var reqPhone = data.request['phone'];
      var reqValidator = data.request['validator'];
      var decodedValidator = isValidRequest(reqValidator);
      if((decodedValidator['key']) && (reqEmail === decodedValidator['key'] || reqPhone === decodedValidator['key'])){
        data = _.omit(data, 'request.validator');
        return data;
      } else{
        throw new Error('USER_CANNOTBE_CREATED');
      }
    },
    proxyReqPathResolver: function (req) {
      return require('url').parse(envHelper.LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
    },
    userResDecorator: function (proxyRes, proxyResData,  req, res) {
      try {
        logger.info({msg: 'proxyObj'});
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

/**
 * Verifies request and check exp time
 * @param encryptedData encrypted data to be decrypted
 * @returns {*}
 */
const isValidRequest = (encryptedData) => {
  const decryptedData = decrypt(parseJson(decodeURIComponent(encryptedData)));
  const parsedData = parseJson(decryptedData);
  if (isDateExpired(parsedData.exp)) {
    throw new Error('DATE_EXPIRED');
  } else {
    return _.omit(parsedData, ['exp']);
  }
};

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
        logger.info({msg: 'proxyObj'});
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