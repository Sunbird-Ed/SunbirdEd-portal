const envHelper = require('./environmentVariablesHelper.js');
const CONSTANTS = require('./constants');
const _ = require('lodash');
const httpSatusCode = require('http-status-codes');
const { logger } = require('@project-sunbird/logger');
const { sendRequest } = require('./httpRequestHandler');
const uuidv1 = require('uuid/v1');
const { parseJson } = require('./utilityService');


const validateRecaptcha = async (req, res, next) => {
  let errType;
  const reCaptchaMapping = {
    '/learner/user/v2/exists/email/:emailId': envHelper.sunbird_p1_reCaptcha_enabled,
    '/learner/user/v2/exists/phone/:phoneNumber': envHelper.sunbird_p1_reCaptcha_enabled,
    '/learner/user/v1/fuzzy/search': envHelper.sunbird_p1_reCaptcha_enabled,
    '/learner/user/v1/get/phone/*': envHelper.sunbird_p1_reCaptcha_enabled,
    '/learner/user/v1/get/email/*': envHelper.sunbird_p1_reCaptcha_enabled,
    '/learner/anonymous/otp/v2/generate': envHelper.sunbird_p2_reCaptcha_enabled
  };
  if (_.get(reCaptchaMapping, req.route.path)) {
    try {
      // Validating if request is valid or not
      if (!req.query.captchaResponse || req.query.captchaResponse === undefined) {
        errType = 'MISSING_QUERY_PARAMS';
        throw new Error('MISSING_CAPTCHA_RESPONSE');
      }
      // Validating captcha from google
      errType = 'ERROR_VALIDATING_CAPTCHA';
      const queryParams = '?secret=' + envHelper.google_captcha_private_key + '&response=' + req.query.captchaResponse;
      const options = {
        method: CONSTANTS.HTTP.METHOD.POST,
        url: CONSTANTS.GOOGLE_VERIFICATION_URL + queryParams
      };
      let responseData = await sendRequest(options);
      // Parsing data
      errType = 'ERROR_PARSING_RESPONSE_JSON';
      responseData = parseJson(responseData);
      errType = '';
      if (responseData && responseData.success) {
          next();
      } else {
        logger.info({
          msg: 'googleService:validateRecaptcha failed',
          data: responseData,
          did: req.headers['x-device-id']
        });
        throw new Error('CAPTCHA_VALIDATING_FAILED');
      }
    } catch (error) {
      logger.error({
        msg: 'googleService:validateRecaptcha caught exception',
        errorMessage: error.message,
        error: error,
        errType: errType,
        did: req.headers['x-device-id']
      });
      res.status(httpSatusCode.IM_A_TEAPOT).send({
        'id': 'api.validate.recaptcha', 'ts': new Date(),
        'params': {
          'resmsgid': uuidv1(),
          'msgid': uuidv1(),
          'err': 'I\'m a teapot',
          'status': 'I\'m a teapot',
          'errmsg': 'I\'m a teapot'
        },
        'responseCode': 'I\'m a teapot',
        'result': {}
      });
    }
  } else {
    next();
  }
};

module.exports = { validateRecaptcha };
