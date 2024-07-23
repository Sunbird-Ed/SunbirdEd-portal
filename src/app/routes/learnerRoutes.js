/**
 * @file
 * @description - Learner routes handler
 * @version 1.0
 */

const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const utils = require('../helpers/utils.js');
const learnerURL = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
const telemetryHelper = require('../helpers/telemetryHelper.js')
const proxy = require('express-http-proxy')
const bodyParser = require('body-parser')
const healthService = require('../helpers/healthCheckService.js')
const { decrypt } = require('../helpers/crypto');
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const googleService = require('../helpers/googleService')
const reqDataLimitOfContentUpload = '50mb'
const { logger } = require('@project-sunbird/logger');
const { parseJson, isDateExpired, decodeNChkTime } = require('../helpers/utilityService');
const learner_Service_Local_BaseUrl = utils?.defaultHost(utils?.envVariables?.learner_Service_Local_BaseUrl);
const _ = require('lodash');

module.exports = function (app) {
  require('./accountRecoveryRoute.js')(app) // account recovery route
  // Helper route to enable enable admin to update user fields
  app.patch('/learner/portal/user/v3/update',
    proxyUtils.verifyToken(),
    proxy(learner_Service_Local_BaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learner_Service_Local_BaseUrl),
      proxyReqPathResolver: (req) => {
        return '/private/user/v3/update';
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        logger.info({ msg: '/learner/portal/user/v3/update called upstream url /private/user/v3/update' });
        try {
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData });
          logger.error({ msg: 'learner route : error for /learner/portal/user/v3/update upstram url is /private/user/v3/update ', err });
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null);
        }
      }
    })
  )
  app.post('/learner/user/v1/delete',
    bodyParser.json(),
    proxyUtils.verifyToken(),
    isAPIWhitelisted.isAllowed(),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
      proxyReqPathResolver: (req) => {
        logger.info({ msg: '/learner/user/v1/delete called upstream url /user/v1/delete in request path resolver' });
        return require('url').parse(envHelper.LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        logger.info({ msg: '/learner/user/v1/delete called upstream url /user/v1/delete' });
        try {
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'POST' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
        } catch (err) {
          logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData });
          logger.error({ msg: 'learner route : error for /learner/user/v1/delete upstram url is /private/user/v1/delete ', err });
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, null);
        }
      }
    })
  )
  
  app.get('/learner/user/v1/managed/*', proxyManagedUserRequest());

  // Route to check user email id exists (or) already registered
  app.get('/learner/user/v2/exists/email/:emailId', googleService.validateRecaptcha);

  // Route to check user phone number exists (or) already registered
  app.get('/learner/user/v2/exists/phone/:phoneNumber', googleService.validateRecaptcha);

  app.post('/learner/anonymous/otp/v2/generate', googleService.validateRecaptcha);

  // Route to check user email exists - SSO update contact workflow
  app.all('/learner/user/v1/get/email/*', googleService.validateRecaptcha, proxyObj());

  // Route to check user phone exists - SSO update contact workflow
  app.all('/learner/user/v1/get/phone/*', googleService.validateRecaptcha, proxyObj());

  app.get('/learner/isUserExists/user/v1/get/phone/*', proxyObj());

  app.get('/learner/isUserExists/user/v1/get/email/*', proxyObj());
  app.post('/learner/user/v2/bulk/upload', proxyObj());
  // Route to handle user registration
  app.all('/learner/user/v2/signup',
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    proxyUtils.checkForValidRedirect,
    checkForValidUser()
  );

  app.all('/learner/*',
    bodyParser.json(),
    isAPIWhitelisted.isAllowed(),
    healthService.checkDependantServiceHealth(['LEARNER', 'CASSANDRA']),
    telemetryHelper.generateTelemetryForLearnerService,
    telemetryHelper.generateTelemetryForProxy,
    proxy(learnerURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
      proxyReqPathResolver: function (req) {
        let urlParam = req.params['0']
        let query = require('url').parse(req.url).query
        if (urlParam.indexOf('anonymous') > -1) urlParam = urlParam.replace('anonymous/', '');
        if (urlParam.indexOf('delete/otp') > -1) urlParam = urlParam.replace('delete/otp', 'otp');
        if (req.url.indexOf('/otp/') > 0) {
          proxyUtils.addReqLog(req);
        }       
        if (req.originalUrl === '/learner/data/v1/role/read') {
          urlParam = req.originalUrl.replace('/learner/', '')
        }
        logger.info({ msg: '/learner/* called - ' + req.method + ' - ' + req.url });

        if (req.originalUrl === ' /learner/rc/certificate/v1/search') {
          logger.info({ msg: '/learner/rc/certificate/v1/search called - ' + req.method + ' - ' + '/api/rc/certificate/v1/search' });
          return `/api/rc/certificate/v1/search`;
        }

        if (query) {
          return require('url').parse(learnerURL + urlParam + '?' + query).path
        } else {
          console.log('Request URL:',learnerURL + urlParam)
          return require('url').parse(learnerURL + urlParam).path
        }
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData, error: JSON.stringify(err) })
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    })
  )
}

function proxyManagedUserRequest() {
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace('/learner/', '');
      let query = require('url').parse(req.url).query;
      if (query) {
        return require('url').parse(learnerURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(learnerURL + urlParam).path
      }
    },
    userResDecorator: function (proxyRes, proxyResData, req, res) {
      try {
        let data = JSON.parse(proxyResData.toString('utf8'));
        _.forEach(_.get(data.result.response, 'content'), (managedUser, index) => {
          if (managedUser.managedToken) {
            delete data.result.response.content[index].managedToken
          }
        });
        if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
      } catch (err) {
        logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData })
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  });
}

function checkForValidUser() {
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
    proxyReqBodyDecorator: function (bodyContent, srcReq) {
      var data = JSON.parse(bodyContent.toString('utf8'));
      var reqEmail = data.request['email'];
      var reqPhone = data.request['phone'];
      var reqValidator = data.request['reqData'];
      var decodedValidator = decodeNChkTime(reqValidator);
      if ((decodedValidator['key']) && (reqEmail === decodedValidator['key'] || reqPhone === decodedValidator['key'])) {
        data = _.omit(data, 'request.reqData');
        return data;
      } else {
        throw new Error('USER_CANNOT_BE_CREATED');
      }
    },
    proxyReqPathResolver: function (req) {
      return require('url').parse(envHelper.LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
    },
    userResDecorator: function (proxyRes, proxyResData, req, res) {
      try {
        logger.info({ msg: 'proxyObj' });
        let data = JSON.parse(proxyResData.toString('utf8'));
        let response = data.result.response;
        data.result.response = { id: '', rootOrgId: '', isUserExists: '' };
        if (data.responseCode === 'OK') {
          data.result.response.id = response.id;
          data.result.response.rootOrgId = response.rootOrgId;
          data.result.response.isUserExists = true;
        }
        if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
      } catch (err) {
        logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData })
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  });
}

function proxyObj() {
  return proxy(learnerURL, {
    limit: reqDataLimitOfContentUpload,
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learnerURL),
    proxyReqPathResolver: function (req) {
      let urlParam = req.originalUrl.replace('/learner/', '')
      let query = require('url').parse(req.url).query
      if (urlParam.indexOf('isUserExists') > -1) urlParam = urlParam.replace('isUserExists/', '');
      if (query) {
        return require('url').parse(learnerURL + urlParam + '?' + query).path
      } else {
        return require('url').parse(learnerURL + urlParam).path
      }
    },
    userResDecorator: function (proxyRes, proxyResData, req, res) {
      try {
        let data = JSON.parse(proxyResData.toString('utf8'));
       let response = data.result.response;
        data.result.response = { id: '', rootOrgId: '', isUserExists: '' };
        if (data.responseCode === 'OK') {
          data.result.response.id = response.id;
          data.result.response.rootOrgId = response.rootOrgId;
          data.result.response.isUserExists = true;
        }
        if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
        else return proxyUtils.handleSessionExpiry(proxyRes, data, req, res, data);
      } catch (err) {
        logger.error({ msg: 'learner route : userResDecorator json parse error:', proxyResData })
        return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
      }
    }
  });
}
