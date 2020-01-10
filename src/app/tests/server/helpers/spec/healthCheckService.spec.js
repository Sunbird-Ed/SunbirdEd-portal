var mock = require('mock-require');
var httpMocks = require('node-mocks-http');
var res = httpMocks.createResponse({
  eventEmitter: require('events').EventEmitter
});
var request = httpMocks.createRequest({
  rspObj: {
    apiId: 'apiId'
  }
});

const mockEnv = {
  PORTAL_CASSANDRA_URLS: ['localhost']
};
mock('../../../../helpers/environmentVariablesHelper', mockEnv);
const {expect} = require('chai');
const healthCheckService = require('../../../../helpers/healthCheckService');

describe('HealthCheckService Test Cases', function () {

  it('should return health check object', function (done) {
    const response = healthCheckService.checkSunbirdPortalHealth(request, res);
    const responseData = response._getData();
    expect(response.statusCode).to.eql(200);
    expect(responseData.id).to.eql('apiId');
    expect(responseData.params.status).to.eql('successful');
    expect(responseData.responseCode).to.eql('OK');
    expect(responseData.result.name).to.eql('PortalHealthCheckService');
    done();
  });

});
