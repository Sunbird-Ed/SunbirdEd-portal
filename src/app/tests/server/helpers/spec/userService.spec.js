var mock = require('mock-require');
const sinon = require('sinon');
const mockPromise = function (data) {
  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data)
    }
  })
};
const httpMocks = require('node-mocks-http');

function getRequest(config) {
  return httpMocks.createRequest(config);
}

function getResponseObject() {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
}

const mockKeycloackObject = {
  getKeyCloakClient: function () {
    return {
      grantManager: {
        obtainDirectly: function () {
          return new Promise((resolve, reject) => {
            resolve({
              access_token: {
                token: 'access_token'
              }
            })
          })
        }
      }
    }
  }
};
const mockUserHelper = {
  acceptTermsAndCondition: function (data) {
    return mockPromise(data)
  }
};
mock('request-promise', mockPromise);
const mockEnv = {
  LEARNER_URL: 'learner',
  PORTAL_API_AUTH_TOKEN: 'portal-token',
  KEYCLOAK_GOOGLE_CLIENT: {
    clientId: "clientId1",
    secret: "mocksecret"
  },
  PORTAL_AUTH_SERVER_URL: 'https://server/auth/url',
  PORTAL_REALM: 'realm',
  PORTAL_CASSANDRA_URLS: "PORTAL_CASSANDRA_URLS",
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: "PORTAL_CASSANDRA_CONSISTENCY_LEVEL",
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class": "SimpleStrategy", "replication_factor": 2}',
  PORTAL_SESSION_STORE_TYPE: 'in-memory'
};
mock('../../../../helpers/environmentVariablesHelper', mockEnv);
mock('../../../../helpers/keyCloakHelper', mockKeycloackObject);
mock('../../../../helpers/userHelper', mockUserHelper);

const {expect} = require('chai');
const {acceptTnc} = require('../../../../helpers/userService');
describe('User Service Test Cases', function () {

  it('should not accept terms and conditions as tnc data not present', async function (done) {
    const request = getRequest({
      body: {
        request: {
          identifier: 'test@gmail.com'
        }
      }
    });
    const response = getResponseObject();
    acceptTnc(request, response);
    const responseData = response._getData();
    expect(response._getStatusCode()).to.eql(400);
    expect(responseData.params.err).to.eql('mandatory parameters missing');
    expect(responseData.params.status).to.eql('error');
    expect(responseData.params.errType).to.eql('MISSING_PARAMETERS');
    expect(responseData.responseCode).to.eql(400);
    done();
  });

  it('should not accept terms and conditions as identifier not present', async function (done) {
    const request = getRequest({
      body: {
        request: {
          version: 'v4'
        }
      }
    });
    const response = getResponseObject();
    acceptTnc(request, response);
    const responseData = response._getData();
    expect(response._getStatusCode()).to.eql(400);
    expect(responseData.params.err).to.eql('mandatory parameters missing');
    expect(responseData.params.status).to.eql('error');
    expect(responseData.params.errType).to.eql('MISSING_PARAMETERS');
    expect(responseData.responseCode).to.eql(400);
    done();
  });

  it('should accept terms and conditions', async function (done) {
    const request = getRequest({
      body: {
        request: {
          version: 'v4',
          identifier: 'test@gmail.com'
        }
      }
    });
    const response = getResponseObject();
    acceptTnc(request, response);
    expect(response._getStatusCode()).to.eql(200);
    done();
  });

});


