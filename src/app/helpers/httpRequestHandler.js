const requestPromise = require('request-promise');
const logger = require('sb_logger_util_v2');
const {logInfo, logDebug, logErr} = require('./utilityService');
const sendRequest = async (options) => {
  logDebug({},{}, `httpRequestHandler:sendRequest is called with ${JSON.stringify(options)}`);
  return requestPromise(options).then(data => {
    logInfo({}, {}, `sendRequest data successfully fetched for ${options.url}`);
    return data;
  }, (error) => {
    logErr({}, error, `httpRequestHandler:sendRequest errored, error: ${error}`);
    throw new Error(error);
  })
};


module.exports = {sendRequest};
