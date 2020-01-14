/*
const mock = require('mock-require');
const httpMocks = require('node-mocks-http');
let chai = require('chai');
const ssoRoutes = require('../../../../routes/ssoRoutes');
const crypto = require('../../../../helpers/crypto');
const mockEnv = {
  PORTAL_AUTH_SERVER_URL: 'auth/server/url',
  PORTAL_REALM: 'realm',
  PORTAL_SESSION_STORE_TYPE: 'in-memory',
  PORTAL_TRAMPOLINE_CLIENT_ID: 'trampoline_client_id',
  PORTAL_CASSANDRA_URLS: "PORTAL_CASSANDRA_URLS",
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: "PORTAL_CASSANDRA_CONSISTENCY_LEVEL",
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class": "SimpleStrategy", "replication_factor": 2}',
  CRYPTO_ENCRYPTION_KEY: "8887a2bc869998be22221b9b1bb42555"
};
let sinon = require('sinon');
const mockFunction = function () {
};
const ssoHelper = require('../../../../helpers/ssoHelper');
const mockSsoHelper = {
  verifySignature: function (data) {
    new Promise((resolve, reject) => {
      if (data) {
        resolve(data)
      } else {
        resolve();
      }
    })
  },
  verifyIdentifier: mockFunction,
};
const expect = chai.expect;
const ssoRouteTestData = require('../testData/ssoRoutesTestData');

function getRequest(config) {
  return httpMocks.createRequest(config);
}

function getResponseObject() {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
}

describe('Sso routes Test Cases', function () {

  before(function () {
    mock('../../../../helpers/ssoHelper', mockSsoHelper);
    mock('../../../../helpers/environmentVariablesHelper', mockEnv);
  });

  it('should not migrate user as nonStateUserToken not present', function (done) {
    const req = getRequest({session: {test: 'mock'}});
    const res = getResponseObject();
    ssoRoutes.ssoValidations(req, res);
    expect(res.statusCode).to.eql(401);
    expect(res._getData()).to.eql({
      responseCode: 'UNAUTHORIZED'
    });
    done();
  });

  it('should not migrate user as migrate user info not present', function (done) {
    const req = getRequest({session: {nonStateUserToken: 'mock'}});
    const res = getResponseObject();
    ssoRoutes.ssoValidations(req, res);
    expect(res.statusCode).to.eql(401);
    expect(res._getData()).to.eql({
      responseCode: 'UNAUTHORIZED'
    });
    done();
  });


  after(function () {
    mock.stop('../../../../helpers/ssoHelper');
    mock.stop('../../../../helpers/environmentVariablesHelper');
  });


});
*/
