const _ = require('lodash');
const bodyParser = require('body-parser');
const envHelper = require('./../helpers/environmentVariablesHelper.js');
const dateFormat = require('dateformat');
const uuidv1 = require('uuid/v1');
const proxy = require('express-http-proxy');
const proxyUtils = require('../proxy/proxyUtils.js');
const logger = require('sb_logger_util_v2');
const { encriptWithTime } = require('../helpers/crypto');
const { decodeNChkTime } = require('../helpers/utilityService');
const googleService = require('../helpers/googleService');

module.exports = (app) => {

  app.post('/learner/user/v1/fuzzy/search',
  googleService.validateRecaptcha,
  proxy(envHelper.learner_Service_Local_BaseUrl, {
    proxyReqOptDecorator: proxyUtils.decorateRequestHeaders(),
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
        try {
          proxyUtils.addReqLog(req);
          const data = JSON.parse(proxyResData.toString('utf8'));
          if (data.responseCode === 'OK') {
            req.session.otpVerifiedFor = req.body;
            const encrypt = {
              key: req.body.request.key
            }
            if (req.body.request.userId) {
              encrypt['id'] = req.body.request.userId
            }
            var timeInMin = 5;
            var validator = encriptWithTime(encrypt, timeInMin);
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
