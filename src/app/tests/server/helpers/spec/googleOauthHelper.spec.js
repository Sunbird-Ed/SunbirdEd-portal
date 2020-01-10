var mock = require('mock-require');
const mockEnv = {
  LEARNER_URL: "learnerUrl/",
  PORTAL_API_AUTH_TOKEN: "mock_token",
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: "clientId1",
    secret: "mocksecret"
  },
  PORTAL_AUTH_SERVER_URL: 'https://server/auth/url',
  PORTAL_REALM: 'realm',
  PORTAL_MERGE_AUTH_SERVER_URL: "https://merge.server/auth/url",
  KEYCLOAK_GOOGLE_ANDROID_CLIENT: {
    clientId: 'google-client-id2',
    secret: 'secret'
  }
};
const mockPromise = function (data) {
  return new Promise((resolve, reject) => {
    if (data) {
      resolve({
        "ver": "v1",
        "ts": "2019-12-27 03:55:29:464+0000",
        "params": {
          "resmsgid": null,
          "msgid": null,
          "err": null,
          "status": "success",
          "errmsg": null
        },
        "responseCode": "OK",
        "result": {
          "success": true
        }
      })
    }
  })
};
const request = {
  get: function () {
    return 'x-device-id'
  },
  kauth: {}
};

const mockKeycloackObject = {
  getKeyCloakClient: function () {
    return {
      grantManager: {
        obtainDirectly: function () {
          return new Promise((resolve, reject) => {
            resolve({
              access_token: {
                token: 'access_token'
              },
              refresh_token: {
                token: 'refresh_token'
              }
            })
          })
        }
      },
      storeGrant: function () {
      },
      authenticated: function () {
      }
    }
  }
};

mock('request-promise', mockPromise);
mock('../../../../helpers/keyCloakHelper', mockKeycloackObject);
mock('../../../../helpers/environmentVariablesHelper', mockEnv);
const {expect} = require('chai');
const googleOauthHelper = require('../../../../helpers/googleOauthHelper');

describe('Google Oauth Helper Test Cases', function () {

  it('should fetch user by email id', function (done) {
    googleOauthHelper.fetchUserByEmailId('mail@gmail.com', request)
      .then(function (data) {
        expect(data.responseCode).to.eql('OK');
        done();
      });
  });

  it('should create session', function (done) {
    googleOauthHelper.createSession('mail@gmail.com', {client_id: 'portal'}, request, {})
      .then(function (data) {
        expect(data.access_token).to.eql('access_token');
        expect(data.refresh_token).to.eql('refresh_token');
        done();
      });
  });

});
