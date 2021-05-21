const requestPromise = require('request-promise');
const { logger } = require('@project-sunbird/logger');

const sendRequest = async (options) => {
  logger.info({msg: 'httpRequestHandler:sendRequest fetching data for ' + options.url});
  return requestPromise(options).then(data => {
    logger.info({msg: 'sendRequest data successfully fetched for ' + options.url});
    return data;
  }, (error) => {
    logger.error({msg: 'httpRequestHandler:sendRequest error ', error: error});
    throw new Error(error);
  })
};


module.exports = {sendRequest};
