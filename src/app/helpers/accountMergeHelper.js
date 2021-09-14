const _ = require('lodash');
const envHelper = require('./environmentVariablesHelper.js');
const {getUserIdFromToken} = require('../helpers/jwtHelper');
const request = require('request-promise');
const authorizationToken = envHelper.PORTAL_API_AUTH_TOKEN;
const { getBearerToken } = require('../helpers/kongTokenHelper')
const initiateAccountMerge = async (initiatorAccountDetails, fromAccountUserToken, _req = undefined) => {
  var fromAccountId = getUserIdFromToken(fromAccountUserToken);
  const options = {
    method: 'PATCH',
    url: `${envHelper.LEARNER_URL}user/v1/account/merge`,
    headers: getAccountMergeHeaders(initiatorAccountDetails, fromAccountUserToken, _req),
    body: {
      "params": {},
      "request": {
        "fromAccountId": fromAccountId,
        "toAccountId": _.get(initiatorAccountDetails, 'userId')
      }
    },
    json: true
  };
  console.log('verifyAuthToken sending request for merge', JSON.stringify(options));
  return await request(options)
};

const getAccountMergeHeaders = (initiatorAccountDetails, fromAccountUserToken, _req) => {
  return {
    'x-authenticated-user-token': _.get(initiatorAccountDetails, 'sessionToken'),
    'x-source-user-token': fromAccountUserToken,
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getBearerToken(_req),
  }
};

module.exports = {initiateAccountMerge};
