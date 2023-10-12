const proxyUtils = require('../proxy/proxyUtils.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const utils = require('../helpers/utils.js');
const certRegURL  = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
const contentProxy = envHelper.CONTENT_PROXY_URL;
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const { logger } = require('@project-sunbird/logger');
const _ = require('lodash')
const bodyParser = require('body-parser');
const isAPIWhitelisted = require('../helpers/apiWhiteList');
const { getUserCertificates, addTemplateToBatch, removeCert } = require('./../helpers/certHelper');
const { logError } = require('./../helpers/utilityService');
const validate = require('uuid-validate');
// const mockData = require('./mockdata/asset.json');

var certRegServiceApi = {
  searchCertificate: 'certreg/v1/certs/search',
  getUserDetails: 'certreg/v1/user/search',
  reIssueCertificate: 'certreg/v1/cert/reissue',
  addTemplateProxy: 'certreg/v1/add/template',
  addTemplate: 'course/batch/cert/v1/template/add'
}

const createMock = {
  "id":"api.content.create",
  "ver":"3.0",
  "ts":"2020-10-12T09:31:27ZZ",
  "params":{
     "resmsgid":"18b3cf91-6d7e-4bb9-b393-b5385e81b011",
     "msgid":null,
     "err":null,
     "status":"successful",
     "errmsg":null
  },
  "responseCode":"OK",
  "result":{
     "identifier":"do_11312763976015872012",
     "node_id":"do_11312763976015872012",
     "versionKey":"1602495087918"
  }
};

const uploadMock = {
  "id":"api.content.upload",
  "ver":"3.0",
  "ts":"2020-10-12T09:31:32ZZ",
  "params":{
     "resmsgid":"bb3bf3fa-d542-45f5-ac9d-a4352c373946",
     "msgid":null,
     "err":null,
     "status":"successful",
     "errmsg":null
  },
  "responseCode":"OK",
  "result":{
     "identifier":"do_11312763976015872012",
     "artifactUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11312763976015872012/artifact/apgov.png",
     "content_url":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_11312763976015872012/artifact/apgov.png",
     "node_id":"do_11312763976015872012",
     "versionKey":"1602495092097"
  }
}

module.exports = function (app) {

  app.all(`/+${certRegServiceApi.searchCertificate}`,
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
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        logger.debug(req.context, { msg: `${req.url} is called with request: ${JSON.stringify(_.get(req, 'body'))}` });
        courseId = _.get(req, 'body.request.filters.courseId');
        currentUser = _.get(req, 'body.request.filters.createdBy');
        const userId = _.get(req, 'body.request.filters.userName');
        if (validate(userId)) {
          req.body.request.filters['userId'] = userId;
          delete req.body.request.filters['userName'];
        }
        delete req.body.request.filters['courseId'];
        delete req.body.request.filters['createdBy'];
        return require('url').parse(certRegURL + 'user/v3/search').path;
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
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        logger.debug(req.context, { msg: `${req.url} is called with ${JSON.stringify(_.get(req, 'body'))} by userId:${req.session['userId']}userId: ${req.session['userId']}` });
        // Only if loggedIn user & content creator or if the user is an assigned mentor same, then only he can re-issue the certificate
        return require('url').parse(certRegURL + 'course/batch/cert/v1/issue' + '?' + 'reIssue=true').path;
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
    addTemplateToBatch(),
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        const batch = _.pick(_.get(req, 'body.request'), ['batchId', 'courseId', 'template']);
        req.body.request = {batch: batch};
        logger.debug(req.context, {msg: `${req.url} is called with requestBody: ${JSON.stringify(req.body)}`});
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


  app.patch('/certreg/v1/template/add',
    bodyParser.json({ limit: '10mb'}),
    isAPIWhitelisted.isAllowed(),
    removeCert(),
    proxy(certRegURL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(certRegURL),
      proxyReqPathResolver: function (req) {
        logger.debug(req.context, {msg: `${req.url} is called with requestBody: ${JSON.stringify(req.body)}`});
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