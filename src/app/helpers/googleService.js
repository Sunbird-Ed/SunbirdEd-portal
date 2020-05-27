const envHelper = require('./environmentVariablesHelper.js');
const CONSTANTS = require('./constants');
const _ = require('lodash');
const httpSatusCode = require('http-status-codes');
const logger = require('sb_logger_util_v2');
const {sendRequest} = require('./httpRequestHandler');
const uuidv1 = require('uuid/v1');
const {parseJson} = require('./utilityService');


const validateRecaptcha = async (req, res) => {
  let errType;
  try {
    // Validating if request is valid or not
    if (!req.query.captchaResponse) {
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
    errType = 'ERRORED_PARSING_JSON';
    responseData = parseJson(responseData);
    errType = '';
    if (responseData && responseData.success) {
      res.status(httpSatusCode.OK).send({
        'id': 'api.validate.recaptcha', 'ts': new Date(),
        'params': {'resmsgid': uuidv1(), 'status': 'successful'},
        'responseCode': 'OK', 'result': responseData
      })
    } else {
      logger.info({
        msg: 'googleService:validateRecaptcha success',
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
    res.status(httpSatusCode.INTERNAL_SERVER_ERROR).send({
      'id': 'api.validate.recaptcha', 'ts': new Date(),
      'params': {
        'resmsgid': uuidv1(), 'msgid': uuidv1(), 'err': 'INTERNAL_SERVER_ERROR',
        'status': 'INTERNAL_SERVER_ERROR', 'errmsg': error.message
      },
      'responseCode': 'INTERNAL_SERVER_ERROR',
      'result': {}
    });
  }
};


module.exports = {validateRecaptcha};
