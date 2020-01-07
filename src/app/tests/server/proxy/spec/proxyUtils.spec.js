const mock = require('mock-require');
const httpMocks = require('node-mocks-http');
const res = httpMocks.createResponse({
  eventEmitter: require('events').EventEmitter
});
const request = httpMocks.createRequest({
  rspObj: {
    apiId: 'apiId'
  }
});
const mockEnv = {
  APPID: 'app-id',
  PORTAL_API_AUTH_TOKEN: 'authToekn',
  PORTAL_AUTH_SERVER_URL: 'auth server url',
  KEY_CLOAK_REALM: 'realm',
  PORTAL_AUTH_SERVER_CLIENT: 'authclient',
  KEY_CLOAK_PUBLIC: 'keycloackpublic'
};
const {expect} = require('chai');
const proxyUtils = require('../../../../proxy/proxyUtils');

describe('ProxyUtils should verify token', function () {

  beforeEach(function () {
    mock('../../../../helpers/environmentVariablesHelper', mockEnv);
  });

  it('should not validate user token as token not exist', function (done) {
    proxyUtils.validateUserToken(request, res).catch(err => {
      expect(err.err).to.eql('TOKEN_MISSING');
      expect(err.errmsg).to.eql('Required field token is missing');
      done();
    });
  });

  afterEach(function () {
    mock.stop('../../../../helpers/environmentVariablesHelper');
  });

});
