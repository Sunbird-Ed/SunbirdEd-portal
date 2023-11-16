/*jslint node: true, nomen: true, plusplus: true*/
const SB_DOMAIN = require('./environmentVariablesHelper').SB_DOMAIN;
'use strict';

module.exports = {
  KEYCLOAK: {
    SCOPE: {
      OPENID: 'openid'
    },
    VERSION: 5
  },
  HTTP: {
    METHOD: {
      GET: 'GET',
      POST: 'POST'
    }
  },
  API_VERSION: {
    V1: 'v1',
    V3: 'v3'
  },
  LOCALHOST:'http://localhost:3000/',
  GOOGLE_VERIFICATION_URL: 'https://www.google.com/recaptcha/api/siteverify'
};
