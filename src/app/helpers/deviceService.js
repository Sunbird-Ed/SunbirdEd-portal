const envHelper = require('./environmentVariablesHelper.js');
const CONSTANTS = require('./constants');
const _ = require('lodash');
const httpSatusCode = require('http-status-codes');
const { logger } = require('@project-sunbird/logger');
const {sendRequest} = require('./httpRequestHandler');
const {parseJson} = require('./utilityService');
const { v1: uuidv1 } = require('uuid');
const { getBearerToken } = require('../helpers/kongTokenHelper')

const getDeviceProfile = async (req, res) => {
  const options = {
    method: CONSTANTS.HTTP.METHOD.GET,
    url: envHelper.sunbird_device_api + CONSTANTS.API_VERSION.V3 + '/device/profile/' + req.params.deviceId,
    headers: {
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getBearerToken(req),
      'X-REAL-IP': req.headers['x-real-ip'],
      'X-FORWARDED-FOR': req.headers['x-real-ip']
    }
  };
  try {
    const responseData = await sendRequest(options);
    logger.info({msg: 'deviceService:getDeviceProfile', data: responseData.responseCode});
    res.status(httpSatusCode.OK).send(parseJson(responseData))
  } catch (e) {
    logger.error({msg: 'deviceService:getDeviceProfile caught exception', errorMessage: e.message, error: e});
    res.status(httpSatusCode.INTERNAL_SERVER_ERROR).send({
      "id": "api.device.profile",
      "ver": CONSTANTS.API_VERSION.V3,
      "ts": new Date(),
      "params": {
        "resmsgid": uuidv1(),
        "msgid": uuidv1(),
        "err": "INTERNAL_SERVER_ERROR",
        "status": "INTERNAL_SERVER_ERROR",
        "errmsg": e.message
      },
      "responseCode": "INTERNAL_SERVER_ERROR",
      result: {
        error: e
      }
    });
  }
};

const registerDeviceProfile = async (req, res) => {
  const options = {
    method: CONSTANTS.HTTP.METHOD.POST,
    url: envHelper.sunbird_device_api + CONSTANTS.API_VERSION.V3 + '/device/register/' + req.params.deviceId,
    headers: {
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + getBearerToken(req),
    },
    body: req.body,
    json: true
  };
  try {
    const responseData = await sendRequest(options);
    logger.info({msg: 'devi' +
        'ceService:registerDeviceProfile', data: responseData.responseCode});
    res.status(httpSatusCode.OK).send(responseData)
  } catch (error) {
    logger.error({
      msg: 'deviceService:registerDeviceProfile caught exception',
      errorMessage: error.message,
      error: error,
    });
    res.status(httpSatusCode.INTERNAL_SERVER_ERROR).send({
      "id": "api.device.profile",
      "ver": CONSTANTS.API_VERSION.V3,
      "ts": new Date(),
      "params": {
        "resmsgid": uuidv1(),
        "msgid": uuidv1(),
        "err": "INTERNAL_SERVER_ERROR",
        "status": "INTERNAL_SERVER_ERROR",
        "errmsg": error.message
      },
      "responseCode": "INTERNAL_SERVER_ERROR",
      "result": {
        "error": error
      }
    });
  }
};


module.exports = {getDeviceProfile, registerDeviceProfile};






