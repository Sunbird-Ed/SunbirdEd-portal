/**
 * @file        - Storage Service logger
 * @exports     - Different HTTP status log builder(s)
 * @since       - 5.0.1
 * @version     - 1.0.0
 */

const { logger }          = require('@project-sunbird/logger');
const dateFormat          = require('dateformat');
const { v1: uuidv1 } = require('uuid');

module.exports = {
  's500': (res, logMessage = '', stack = '', errorMessage) => {
    logger.error({ msg: logMessage, error: stack });
    const response = {
      responseCode: "SERVER_ERROR",
      params: {
        err: "SERVER_ERROR",
        status: "failed",
        errmsg: errorMessage
      },
      result: {}
    }
    res.status(500).send(apiResponse(response));
  },
  's404': (res, logMessage = '', stack = '', errorMessage) => {
    logger.error({ msg: logMessage, error: stack });
    const response = {
      responseCode: "CLIENT_ERROR",
      params: {
        err: "CLIENT_ERROR",
        status: "failed",
        errmsg: errorMessage
      },
      result: {}
    }
    res.status(404).send(apiResponse(response));
  }
};

function apiResponse({ responseCode, result, params: { err, errmsg, status } }) {
  return {
    'id': 'api.report',
    'ver': '1.0',
    'ts': dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss:lo'),
    'params': {
      'resmsgid': uuidv1(),
      'msgid': null,
      'status': status,
      'err': err,
      'errmsg': errmsg
    },
    'responseCode': responseCode,
    'result': result
  }
};
