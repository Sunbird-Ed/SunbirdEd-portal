const request = require('request-promise');
const envHelper = require('./environmentVariablesHelper.js');

/**
 * Generates Auth Token based on code from keycloak
 * @param code
 * @param redirectUri
 * @returns {Promise<void>}
 */
const generateAuthToken = async (code, redirectUri) => {
  const options = {
    method: 'POST',
    url: `${envHelper.PORTAL_AUTH_SERVER_URL}/realms/${envHelper.PORTAL_REALM}/protocol/openid-connect/token`,
    headers: getHeaders(),
    form: {
      client_id: 'portal',
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }
  };
  console.log('generateAuthToken', JSON.stringify(options));
  return request(options);
};

const getHeaders = () => {
  return {}
};

module.exports = {generateAuthToken};
