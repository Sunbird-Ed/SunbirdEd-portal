const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const logger = require('sb_logger_util_v2')
const _ = require('lodash')
const bodyParser = require('body-parser');
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const { getUserCertificates, addTemplateToBatch } = require('./../helpers/certHelper');
const { logError } = require('./../helpers/utilityService');


var certRegServiceApi = {
  searchCertificate: 'certreg/v1/certs/search',
  getUserDetails: 'certreg/v1/user/search',
  reIssueCertificate: 'certreg/v1/cert/reissue',
  addTemplateProxy: 'certreg/v1/add/template',
  addTemplate: 'course/batch/cert/v1/template/add'
}


module.exports = function (app) {

  app.all(`/+${certRegServiceApi.searchCertificate}`,
    permissionsHelper.checkPermission(),
    proxy(certRegURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        return (certRegURL + certRegServiceApi.searchCertificate)
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
          logger.info({ msg: '/certs/search called' });
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({ msg: 'content api user res decorator json parse error:', proxyResData })
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))

  // To get user certificates list
  let courseId, currentUser;
  app.post(`/+${certRegServiceApi.getUserDetails}`,
    bodyParser.json({ limit: '10mb' }),
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        logger.debug({ msg: `${req.url} is called with request: ${JSON.stringify(_.get(req, 'body'))}` });
        courseId = _.get(req, 'body.request.filters.courseId');
        currentUser = _.get(req, 'body.request.filters.createdBy');
        delete req.body.request.filters['courseId'];
        delete req.body.request.filters['createdBy'];
        return require('url').parse(certRegURL + 'user/v1/search').path;
      },
      userResDecorator: async (proxyRes, proxyResData, req, res) => {
        try {
          const data = JSON.parse(proxyResData.toString('utf8'));
          logger.info({ msg: `getUserCertificates() is calling from certRegRoutes with ${JSON.stringify(data)}` });
          if (data && !_.isEmpty(_.get(data, 'result.response.content'))) {
            const certificates = await getUserCertificates(req, _.get(data, 'result.response.content[0]'), courseId, currentUser);
            data.result.response = certificates;
            return data;
          } else return proxyUtils.handleSessionExpiry(proxyRes, _.omit(data, ['result.response.content', 'result.response.count']), req, res);
        } catch (err) {
          logError(req, err, `Error occurred while searching userData with: ${certRegServiceApi.getUserDetails}`);
          return proxyUtils.handleSessionExpiry(proxyRes, err , req, res);
        }
      },
    })
  );

  // To ReIssue certificate 
  app.post(`/+${certRegServiceApi.reIssueCertificate}`,
    bodyParser.json({ limit: '10mb' }),
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        logger.debug({ msg: `${req.url} is called with ${JSON.stringify(_.get(req, 'body'))} by userId:${req.session['userId']}userId: ${req.session['userId']}` });
        // Only if loggedIn user & content creator is same, then only he can re-issue the certificate
        if (_.get(req.body, 'request.createdBy') === req.session['userId']) {
          return require('url').parse(certRegURL + 'course/batch/cert/v1/issue' + '?' + 'reIssue=true').path;
        } else {
          logError(req, 'UNAUTHORIZED_USER', `createdBy,${_.get(req.body, 'request.createdBy')},  userID: ${req.session['userId']} should be equal`);
          throw new Error('UNAUTHORIZED_USER');
        }
      },
      userResDecorator: async (proxyRes, proxyResData, req, res) => {
        try {
          logger.info({ msg: `/course/batch/cert/v1/issue?reIssue=true called  by userId: ${req.session['userId']}` });
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logError(req, err, 'Error occurred while reIssuing certificate');
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      },
    }))

  // add the template to course batch;
  app.patch(`/+${certRegServiceApi.addTemplateProxy}`,
    bodyParser.json({ limit: '10mb' }),
    isAPIWhitelisted.isAllowed(),
    permissionsHelper.checkPermission(),
    addTemplateToBatch(),
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        const batch = _.pick(_.get(req, 'body.request'), ['batchId', 'courseId', 'template']);
        req.body.request = {batch: batch};
        logger.debug({msg: `${req.url} is called with requestBody: ${JSON.stringify(req.body)}`});
        return require('url').parse(certRegURL + certRegServiceApi.addTemplate).path;
      },
      userResDecorator:  (proxyRes, proxyResData, req, res) => {
        try {
          logger.info({msg: `Adding certificate {} to a  courseId ${_.get(req, 'body.request.batch.courseId')}',batchId: ${_.get(req, 'body.request.batch.batchId')}, template id ${_.get(req, 'body.request.batch.template.identifier')}`});
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logError(req, err, `Error while addTemplate to courseId ${_.get(req, 'body.request.batch.courseId')} batchId: ${_.get(req, 'body.request.batch.batchId')}, err: ${err} , template id ${_.get(req, 'body.request.batch.template.identifier')}`,);
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      },
    }))
};