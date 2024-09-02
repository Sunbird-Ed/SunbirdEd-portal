const _ = require('lodash');
const bodyParser = require('body-parser');
const envHelper = require('./../helpers/environmentVariablesHelper.js');
const dateFormat = require('dateformat');
const uuidv1 = require('uuid/v1');
const proxy = require('express-http-proxy');
const proxyUtils = require('../proxy/proxyUtils.js');
const utils = require('../helpers/utils.js');
const { logger } = require('@project-sunbird/logger');
const { encriptWithTime, encrypt } = require('../helpers/crypto');
const { decodeNChkTime } = require('../helpers/utilityService');
const googleService = require('../helpers/googleService');
const learner_Service_Local_BaseUrl = utils?.defaultHost(utils?.envVariables?.learner_Service_Local_BaseUrl);
const LEARNER_URL  = utils?.defaultHost(utils?.envVariables?.LEARNER_URL);
module.exports = (app) => {

  app.post('/learner/user/v1/fuzzy/search',
  googleService.validateRecaptcha,
  proxy(learner_Service_Local_BaseUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learner_Service_Local_BaseUrl),
    proxyReqPathResolver: (req) => {
      logger.info({ msg: `${req.url} called`});
    return '/private/user/v1/search';
    }
  }))

  app.post('/learner/user/v1/password/reset', bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }),
    (req, res, next) => {
      logger.info({ msg: `${req.url} called`});
      try {
        var reqUserId = _.get(req.body, 'request.userId');
        var reqValidator = _.get(req, 'body.request.reqData');
        var decodedValidator = decodeNChkTime(reqValidator);
        // checking only for the userID from request and from the decoded object.
        if ((decodedValidator['id']) && (reqUserId === decodedValidator['id'])) {
          next();
        } else {
          logger.error({
            msg: 'unauthorized',
            userId:_.get(req.body, 'request.userId')
          });
          res.status(401).send({ "id": "api.reset.password", "ver": "v1", "ts": dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'), "params": { "resmsgid": null, "msgid": uuidv1(), "err": null, "status": "unauthorized", "errmsg": null }, "responseCode": "UNAUTHORIZED", "result": { "response": "unauthorized" } })
        }
      } catch (err) {
        logger.error({
          URL: req.url,
          body: JSON.stringify(req.body),
          msg: 'portal - reset password sfailed',
          uuid: _get(req,'headers.x-msgid'),
          did:_get(req,'headers.x-device-id'),
          error: JSON.stringify(err)
        });
      }
    },
    proxy(learner_Service_Local_BaseUrl, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(learner_Service_Local_BaseUrl),
      proxyReqPathResolver: (req) => {
        return '/private/user/v1/password/reset'; // /private/user/v1/reset/password
      }
    }))

  app.all('/learner/otp/v1/verify',
    bodyParser.urlencoded({ extended: false }), bodyParser.json({ limit: '10mb' }),
    proxy(LEARNER_URL, {
      proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(LEARNER_URL),
      proxyReqPathResolver: (req) => {
        return require('url').parse(LEARNER_URL + req.originalUrl.replace('/learner/', '')).path
      },
      userResDecorator: (proxyRes, proxyResData, req, res) => {
        try {
          proxyUtils.addReqLog(req);
          const data = JSON.parse(proxyResData.toString('utf8'));
          logger.ing({msg: "verify response", data})
          if (data.responseCode === 'OK') {
            req.session.otpVerifiedFor = req.body;
            const _encrypt = {
              key: req.body.request.key
            }
            if (req.body.request.userId) {
              _encrypt['id'] = req.body.request.userId
            }
            logger.info({msg: "before encryption", _encrypt})
            var timeInMin = 5;
            var validator = encriptWithTime(_encrypt, timeInMin);
            const reqType = req.body.request.type;
            const dataToEncrypt = {};
            dataToEncrypt[reqType] = req.body.request.key;
            req.session.otpEncryptedInfo = encrypt(JSON.stringify(dataToEncrypt));
            logger.info({msg: "after encryption", validator})
            data['reqData'] = validator;
          }
          return data;

        } catch (err) {
          logger.error({
            URL: req.url,
            body: JSON.stringify(req.body),
            msg: 'portal - otp verification failed',
            uuid: _.get(req,'headers.x-msgid'),
            did:_.get(req,'headers.x-device-id'),
            error: JSON.stringify(err)
          });
          return proxyResData;
        }
      }
    }));
}
