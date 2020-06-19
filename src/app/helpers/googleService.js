const envHelper = require('./environmentVariablesHelper.js');
const CONSTANTS = require('./constants');
const _ = require('lodash');
const httpSatusCode = require('http-status-codes');
const {sendRequest} = require('./httpRequestHandler');
const uuidv1 = require('uuid/v1');
const {parseJson, logInfo, logDebug, logErr} = require('./utilityService');


const validateRecaptcha = async (req, res) => {
  logDebug(req, {}, 'validateRecaptcha() is called');
  let errType;
  try {
    // Validating if request is valid or not
    if (!req.query.captchaResponse) {
      logErr(req, {}, `googleService:validateRecaptcha throwing error of MISSING_QUERY_PARAMS ${req.query.captchaResponse}`)
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
      logInfo(req, {}, `recaptcha is validated`);
      res.status(httpSatusCode.OK).send({
        'id': 'api.validate.recaptcha', 'ts': new Date(),
        'params': {'resmsgid': uuidv1(), 'status': 'successful'},
        'responseCode': 'OK', 'result': responseData
      })
    } else {
      logErr(req, {}, `googleService:validateRecaptcha throwing error of CAPTCHA_VALIDATING_FAILED ${responseData}`)
      throw new Error('CAPTCHA_VALIDATING_FAILED');
    }
  } catch (error) {
    logErr(req, error, `googleService:validateRecaptcha caught exception: ${errType}`);
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
