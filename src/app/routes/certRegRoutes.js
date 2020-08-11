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
const { getUserCertificates } = require('./../helpers/certHelper');


var certRegServiceApi = {
  searchCertificate: 'certreg/v1/certs/search',
  getUserDetails: 'certreg/v1/user/search',
  reIssueCertificate: 'certreg/v1/cert/reissue',
}


module.exports = function (app) {

  app.all(`/+${certRegServiceApi.searchCertificate}`,
    permissionsHelper.checkPermission(),
    proxy(certRegURL, {
      timeout: envHelper.sunbird_api_request_timeout,
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
        logger.info({ msg: `${certRegServiceApi.getUserDetails} is called with request: ${JSON.stringify(_.get(req, 'body'))}` });
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
          logger.error({ msg: `Error occurred while searching userData with: ${certRegServiceApi.getUserDetails}, Error: ${err}` });
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
        logger.info({ msg: `/course/batch/cert/v1/issue?reissue=true is called with ${JSON.stringify(_.get(req, 'body'))}` });
        return require('url').parse(certRegURL + 'course/batch/cert/v1/issue' + '?' + 'reissue=true').path;
      },
      userResDecorator: async (proxyRes, proxyResData, req, res) => {
        try {
          logger.info({ msg: `/course/batch/cert/v1/issue?reissue=true called  by userId: ${req.session['userId']}` });
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
          else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch (err) {
          logger.error({ msg: 'Error Occurred while reIssuing certificate:', err });
          return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      },
    }))
};