const proxyUtils = require('../proxy/proxyUtils.js')
const permissionsHelper = require('../helpers/permissionsHelper.js')
const envHelper = require('../helpers/environmentVariablesHelper.js')
const certRegURL = envHelper.LEARNER_URL
const reqDataLimitOfContentUpload = '50mb'
const proxy = require('express-http-proxy')
const logger = require('sb_logger_util_v2')

var certRegServiceApi = {
  searchCertificate : 'certreg/v1/certs/search'
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
};
