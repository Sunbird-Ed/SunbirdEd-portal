'use strict'
const env = process.env;
const fs = require('fs')
const mandEnvVariables = require('./mandatoryEnv');
const optionalEnvVariables = require('./optionalEnv');
/**
* @description mandEnvVariables file contains the Environment variable that is minimally required for the portal to run.
* @description optionalEnvVariables file contains optional environment variable that can be used when needed.
*/
let envVariables = { ...mandEnvVariables, ...optionalEnvVariables}

envVariables.PORTAL_CASSANDRA_URLS = (env.sunbird_cassandra_urls && env.sunbird_cassandra_urls !== '')
  ? env.sunbird_cassandra_urls.split(',') : ['localhost']

// Path to dev config file
const devConfig = __dirname + '/devConfig.js';
try {
  // If environment is `local`; use custom config
  // Else default config will be used
  if (process.env.sunbird_environment === 'local' && fs.existsSync(devConfig)) {
    const devVariables = require('./devConfig');
    module.exports = devVariables;
    // console.log('local---->',devVariables);
  } else {
    module.exports = envVariables;
    // console.log('env---->',envVariables);
  }
} catch (error) {
  module.exports = envVariables;
  // console.log('errorEnv---->',envVariables);
}
