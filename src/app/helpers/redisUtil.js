/**
 * @file
 * 1. Connects to Redis DataStore with specified configuration
 * 2. Creates Redis Store instance with `express-session`
 * 3. Default Redis storage type will be `sentinel`
 * @since release-4.3.0
 * @version 1.0
 */

 const { logger }  = require('@project-sunbird/logger');
 const envHelper   = require('./environmentVariablesHelper.js');
 const Redis       = require("ioredis");
 let cluster;
 
 logger.info({ msg: 'Connecting to redis for type [ ' + envHelper.PORTAL_REDIS_TYPE + ' ]' });
 if (envHelper.PORTAL_REDIS_TYPE == 'standalone') {
   if (!envHelper.PORTAL_REDIS_CONNECTION_STRING) throw new Error('Redis connection URL required.');
   logger.info({ msg: 'Connecting to redis conn url [ ' + envHelper.PORTAL_REDIS_CONNECTION_STRING + ' ]' });
   cluster = new Redis(envHelper.PORTAL_REDIS_CONNECTION_STRING.toString());
 } else if (envHelper.PORTAL_REDIS_TYPE == 'cluster') {
   if (!envHelper.PORTAL_REDIS_URL || !envHelper.PORTAL_REDIS_PORT || !envHelper.PORTAL_REDIS_PASSWORD) {
     throw new Error('Redis Host, PORT and Password configuration required.');
   }
   logger.info({ msg: `✅ Redis Server connecting to [${envHelper.PORTAL_REDIS_URL}:${envHelper.PORTAL_REDIS_PORT}]` });
   cluster = new Redis.Cluster([
     {
       port: envHelper.PORTAL_REDIS_PORT,
       host: envHelper.PORTAL_REDIS_URL,
     }
   ], {
     redisOptions: {
       password: envHelper.PORTAL_REDIS_PASSWORD,
     },
   });
 } else {
   if (!envHelper.PORTAL_REDIS_URL || !envHelper.PORTAL_REDIS_PORT || !envHelper.PORTAL_REDIS_PASSWORD) {
     throw new Error('Redis Host, PORT and Password configuration required.');
   }
   logger.info({ msg: `✅ Redis Server connecting to [${envHelper.PORTAL_REDIS_URL}:${envHelper.PORTAL_REDIS_PORT}]` });
   cluster = new Redis({
     sentinels: [
       {
         port: envHelper.PORTAL_REDIS_PORT,
         host: envHelper.PORTAL_REDIS_URL,
       }
     ],
     name: 'sbportalmaster',
     password: envHelper.PORTAL_REDIS_PASSWORD,
     sentinelPassword: envHelper.PORTAL_REDIS_PASSWORD
   });
 }
 
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
   return new RedisStore({ client: cluster });
 };
 
 module.exports = {
   getRedisStoreInstance
 };
 