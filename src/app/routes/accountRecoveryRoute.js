const _ = require('lodash');
const bodyParser = require('body-parser')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const proxy = require('express-http-proxy')
const proxyUtils = require('../proxy/proxyUtils.js')
const logger = require('sb_logger_util_v2');

module.exports = (app) => {

  app.post('/learner/user/v1/fuzzy/search', proxy(envHelper.learner_Service_Local_BaseUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
    proxyReqPathResolver: (req) => {
      logger.info({msg: '/learner/user/v1/fuzzy/search called'});
      return '/private/user/v1/search';
    }
  }))

  app.post('/learner/user/v1/password/reset', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
    (req, res, next) => {
      logger.info({msg: '/learner/user/v1/password/reset called'});
      if(_.get(req.body, 'request.userId') !== _.get(req.session, 'otpVerifiedFor.request.userId')){
        logger.error({
          msg: 'unauthorized'
        });
        res.status(401).send({"id":"api.reset.password","ver":"v1" ,"ts":dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),"params":{"resmsgid":null,"msgid": uuidv1(),"err":null,"status":"unauthorized","errmsg":null},"responseCode":"UNAUTHORIZED","result":{"response":"unauthorized"}})
      } else {
        next()
      }
    },
    proxy(envHelper.learner_Service_Local_BaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: (req) => {
        return '/private/user/v1/password/reset'; // /private/user/v1/reset/password
      }
  }))

  app.all('/learner/otp/v1/verify',
    bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }), 
    proxy(envHelper.LEARNER_URL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
      proxyReqPathResolver: (req) => {
        return require('url').parse(envHelper.LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        logger.info({msg: '/learner/otp/v1/verify called'});
        try {
            const data = JSON.parse(proxyResData.toString('utf8'));
            if (data.responseCode === 'OK') {
              req.session.otpVerifiedFor = req.body;
            }
            return proxyResData;
        } catch(err) {
          logger.error({
            msg: 'otp verification failed',
            error: JSON.stringify(err)
          });
          return proxyResData;
        }
      }
  }));

}
