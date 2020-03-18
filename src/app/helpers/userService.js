const {getKeyCloakClient} = require('./keyCloakHelper');
const envHelper = require('./environmentVariablesHelper.js');
const keyCloakClient = getKeyCloakClient({
  resource: envHelper.KEYCLOAK_GOOGLE_CLIENT.clientId,
  bearerOnly: true,
  serverUrl: envHelper.PORTAL_AUTH_SERVER_URL,
  realm: envHelper.PORTAL_REALM,
  credentials: {
    secret: envHelper.KEYCLOAK_GOOGLE_CLIENT.secret
  }
});
const CONSTANTS = require('./constants');
const _ = require('lodash');
const {acceptTermsAndCondition} = require('./userHelper');
const httpSatusCode = require('http-status-codes');
const logger = require('sb_logger_util_v2');
const {delay} = require('../helpers/utilityService');

const handleError = (error) => {
  logger.error({
    msg: 'userService: handleError',
    error: error,
    params: _.get(error, 'error.params'),
    message: _.get(error, 'message')
  });
  if (_.get(error, 'error.params')) {
    throw error.error.params;
  } else if (error instanceof Error) {
    throw error.message;
  } else {
    throw 'unhandled exception while accepting tnc';
  }
};


const acceptTncAndGenerateToken = async (identifier, tncVersionAccepted) => {
  let errorType, accessToken;
  try {
    errorType = 'ERROR_GENERATING_TOKEN';
    logger.info({msg: 'generate token for email id - ' + identifier});
    await delay(3000);
    grant = await keyCloakClient.grantManager.obtainDirectly(identifier, undefined, undefined, CONSTANTS.KEYCLOAK.SCOPE.OPENID).catch(handleError);
    errorType = 'ERROR_ACCEPTING_TNC';
    const tncRequest = {
      params: {},
      request: {
        version: tncVersionAccepted
      }
    };
    accessToken = _.get(grant, 'access_token.token');
    logger.info({msg: 'token generated', token: accessToken});
    const tncResponse = await acceptTermsAndCondition(tncRequest, accessToken).catch(handleError);
    logger.info({
      msg: 'userService: tnc accepted successfully',
      additionalInfo: {
        errType: errorType,
        tncResponse: tncResponse,
        accessToken: accessToken
      }
    });
    return tncResponse;
  } catch (e) {
    logger.info({
      msg: 'userService: tnc failed',
      additionalInfo: {
        errType: errorType,
        accessToken: accessToken,
        error: e
      }
    });
    handleError(e);
  }
};


const acceptTnc = async (req, res) => {
  const identifier = _.get(req, 'body.request.identifier');
  const tncVersionAccepted = _.get(req, 'body.request.version');
  if (!identifier || !tncVersionAccepted) {
    logger.error({
      msg: 'Userservice: acceptTnc, missing mandatory parameters', additionalInfo:
        {identifier: identifier, tncVersionAccepted: tncVersionAccepted}
    });
    res.status(httpSatusCode.BAD_REQUEST).send({
      id: "api.user.tnc.accept",
      params: {
        err: "mandatory parameters missing",
        status: "error", "errType": "MISSING_PARAMETERS"
      },
      responseCode: httpSatusCode.BAD_REQUEST,
      result: {"response": "identifier and tncVersionAccepted is mandatory"}
    });
  }

  try {
    await acceptTncAndGenerateToken(identifier, tncVersionAccepted);
    res.status(httpSatusCode.OK).send({
      id: "api.user.tnc.accept",
      params: {
        err: null,
        status: "success",
        errType: null
      },
      responseCode: httpSatusCode.OK,
      result: {response: "Success"}
    });
  } catch (e) {
    logger.error({
      msg: 'Userservice: acceptTnc, accept tnc failed',
      additionalInfo: {
        identifier: identifier, tncVersionAccepted: tncVersionAccepted,
        error: JSON.stringify(e),
        errorMessage: e.message
      }
    });
    res.status(httpSatusCode.INTERNAL_SERVER_ERROR).send({
      id: "api.user.tnc.accept",
      params: {
        err: "failed to accept tnc",
        status: "error",
        errType: "FAILED_TO_ACCEPT_TNC"
      },
      responseCode: httpSatusCode.BAD_REQUEST,
      result: {response: "ERROR"}
    });
  }
};


module.exports = {acceptTnc, acceptTncAndGenerateToken};






