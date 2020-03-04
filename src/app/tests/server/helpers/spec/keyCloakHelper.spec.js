var mock = require('mock-require');
const mockEnv = {
  PORTAL_SESSION_STORE_TYPE: 'in-memory'
};
const mockCassandra = {
  getCassandraStoreInstance: function () {
    return {'instance': 'mockinstance'}
  }
};
const {expect} = require('chai');
const keyCloakHelper = require('../../../../helpers/keyCloakHelper');

describe('keyCloakHelper Test Cases', function () {

  beforeEach(function () {
    mock('../../../../helpers/cassandraUtil', mockCassandra);
    mock('../../../../helpers/environmentVariablesHelper', mockEnv);
  });

  it('should return in memory memstorage', function (done) {
    const memoryStore = keyCloakHelper.getKeyCloakClient;
    expect(typeof memoryStore).to.eql('function');
    done();
  });

  afterEach(function () {
    mock.stop('../../../../helpers/cassandraUtil');
    mock.stop('../../../../helpers/environmentVariablesHelper');
  });

});
