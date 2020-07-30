const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const logger = require('sb_logger_util_v2')
const _ = require('lodash')
const bodyParser = require('body-parser');
const { getUserCertificates } = require('./../helpers/certHelper');


var certRegServiceApi = {
  searchCertificate : 'certreg/v1/certs/search',
  reIssueCertificate: '/certreg/v1/user/search',
  searchUser: '/user/v1/search'
};

module.exports = function (app) {

    app.all(`/+${certRegServiceApi.searchCertificate}`,
    permissionsHelper.checkPermission(),
    proxy(certRegURL, {
      limit: reqDataLimitOfContentUpload,
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: function (req) {
        return (certRegURL + certRegServiceApi.searchCertificate)
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
            logger.info({msg: '/certs/search called'});
            const data = JSON.parse(proxyResData.toString('utf8'));
            if(req.method === 'GET' && proxyRes.statusCode === 404 && (typeof data.message === 'string' && data.message.toLowerCase() === 'API not found with these values'.toLowerCase())) res.redirect('/')
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
        } catch(err) {
          logger.error({msg:'content api user res decorator json parse error:', proxyResData})
            return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res);
        }
      }
    }))

    let courseId;
    app.post(certRegServiceApi.reIssueCertificate,
      bodyParser.json({ limit: '10mb' }),
      permissionsHelper.checkPermission(),
      proxy(certRegURL, {
        proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
        proxyReqPathResolver: function (req) {
          logger.debug({msg: `${certRegServiceApi.reIssueCertificate} is called with request: ${JSON.stringify(_.get(req, 'body'))}`});
          courseId = _.get(req, 'body.request.filters.courseId');
          delete req.body.request.filters['courseId'];
          return require('url').parse(certRegURL + certRegServiceApi.searchUser).path;
        },
        userResDecorator: async (proxyRes, proxyResData, req, res) => {
          try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            logger.info({msg: `getUserCertificates() is calling from certRegRoutes `});
            const certificates = await getUserCertificates(data, courseId);
            if (data) {
            data.result.response = certificates;
            return data;
            }
            else return proxyUtils.handleSessionExpiry(proxyRes, proxyResData, req, res, data);
          } catch (err) {
            logger.error({msg: `Error occured while searching userData with: ${certRegServiceApi.searchUser}, Error: ${err}`});
            let data = JSON.parse(proxyResData.toString('utf8'));
            data.result.response = {err: err};
            return proxyUtils.handleSessionExpiry(proxyRes, data, req, res);
          }
        },
      })
    );
};