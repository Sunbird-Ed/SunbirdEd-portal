/**
 * @file
 * 1. Connects to Redis DataStore with specified configuration
 * 2. Creates Redis Store instance with `express-session`
 * @since release-2.9.0
 * @version 1.0
 */

const redis       = require('redis');
const logger      = require('sb_logger_util_v2');
const envHelper   = require('./environmentVariablesHelper.js');
if (!envHelper.PORTAL_REDIS_URL || !envHelper.PORTAL_REDIS_PORT) throw new Error('Redis Host and PORT configuration required.');
const redisClient = redis.createClient({
  host: envHelper.PORTAL_REDIS_URL,
  port: envHelper.PORTAL_REDIS_PORT,
  retry_strategy: (options) => {
    return 5000; //in ms
  }
});

/**
 * Redis Event listener for `connect` event
 */
redisClient.on('connect', function () {
  logger.info({msg: `✅ Redis Server connecting to [${envHelper.PORTAL_REDIS_URL}:${envHelper.PORTAL_REDIS_PORT}]`});
});

/**
 * Redis Event listener for `ready` event
 */
redisClient.on('ready', function () {
  logger.info({msg: `✅ Redis Server connected to [${envHelper.PORTAL_REDIS_URL}:${envHelper.PORTAL_REDIS_PORT}]`});
});

/**
 * Redis Event listener for `reconnecting` event
 */
redisClient.on('reconnecting', function () {
  logger.info({msg: `❌ Redis Server reconnecting to [${envHelper.PORTAL_REDIS_URL}:${envHelper.PORTAL_REDIS_PORT}]`});
  // throw new Error('Redis Client - Connection failure');
});

/**
 * Redis Event listener for `error` event
 */
redisClient.on('error', function (error) {
  logger.info({
    msg: `❌ Redis Server error while connecting to [${envHelper.PORTAL_REDIS_URL}:${envHelper.PORTAL_REDIS_PORT}]`,
    error: error
  });
  // throw new Error(error);
});

/**
 * @param  {any} param - An argument of any type
 * @throws {InvalidArgumentException} - Will throw an error if the argument is missing
 * @description Validates a single argument
 */
function valueRequired (param) {
  const errorObject   = new Error();
  errorObject.name    = 'InvalidArgumentException';
  errorObject.message = `${param} is required.`;
  throw errorObject;
};

/**
 * @param  {Object} session - Express Session Object
 * @returns {Object} - Redis Store with configured client
 */
/* istanbul ignore next */
function getRedisStoreInstance (session = valueRequired('session')) {
  const RedisStore = require('connect-redis')(session);
  return new RedisStore({ client: redisClient });
};

module.exports = {
  getRedisStoreInstance
};
