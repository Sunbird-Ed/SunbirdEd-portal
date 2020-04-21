const _ = require('lodash');
const bodyParser = require('body-parser')
const envHelper = require('./../helpers/environmentVariablesHelper.js')
const dateFormat = require('dateformat')
const uuidv1 = require('uuid/v1')
const proxy = require('express-http-proxy')
const proxyUtils = require('../proxy/proxyUtils.js')
const logger = require('sb_logger_util_v2');
const { encrypt, decrypt } = require('../helpers/crypto');
const {parseJson, isDateExpired} = require('../helpers/utilityService');

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
      proxyReqBodyDecorator: function (bodyContent, srcReq) {
        var data = JSON.parse(bodyContent.toString('utf8'));
        var rewUserId = _.get(req.body, 'request.userId')
        var reqValidator = data.request['validator'];
        var decodedValidator = isValidRequest(reqValidator);
        if((decodedValidator['userId']) && (rewUserId === decodedValidator['userId'])){
          data = _.omit(data, 'request.validator');
          return data;
        } else{
          throw new Error('USER_CANNOTBE_CREATED');
        }
      },
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
        try {
            proxyUtils.addReqLog(req);
            const data = JSON.parse(proxyResData.toString('utf8'));
            if (data.responseCode === 'OK') {
              req.session.otpVerifiedFor = req.body;
              const encrypt = {
                key: req.body.request.key
              }
              if (req.body.request.userId) {
                encrypt['userId'] = req.body.request.userId
              }
              var validator = getEncyptedQueryParams(encrypt);
              data['validator'] = validator;
            }
            return data;
        } catch (err) {
          logger.error({
            URL: req.url,
            body: JSON.stringify(req.body),
            resp: JSON.stringify(data),
            msg: 'portal - otp verification failed',
            error: JSON.stringify(err)
          });
      return proxyResData;
        }
      }
  }));

/**
 * To generate session for state user logins
 * using server's time as iat and exp time as 5 min
 * Session will not be created if exp is expired
 * @param data object to encrypt data
 * @returns {string}
 */
const getEncyptedQueryParams = (data) => {
  data.exp = Date.now() + (5 * 60 * 1000);  // adding 5 minutes
  return JSON.stringify(encrypt(JSON.stringify(data)));
};
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