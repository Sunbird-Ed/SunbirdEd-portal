var mock = require('mock-require');
const mockEnv = {
  PORTAL_CASSANDRA_URLS: "PORTAL_CASSANDRA_URLS",
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: "PORTAL_CASSANDRA_CONSISTENCY_LEVEL",
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class": "SimpleStrategy", "replication_factor": 2}',
};
const mockCassandraExpress = {
  consistencies: {
    one: 'one'
  }
};
const mockCassandraSessionStore = function (data) {
  return data
};

mock('../../../../helpers/environmentVariablesHelper', mockEnv);
mock('express-cassandra', mockCassandraExpress);
mock('cassandra-session-store', mockCassandraSessionStore);

const {expect} = require('chai');
const cassandraUtil = require('../../../../helpers/cassandraUtil');

describe('Cassandra Utils Test Cases', function () {

  it('should return default and throw error replication strategy', function (done) {
    const replicationStrategy = cassandraUtil.getReplicationStrategy('asd');
    expect(replicationStrategy).to.eql({"class": "SimpleStrategy", "replication_factor": 1});
    done();
  });

  it('should parse and send replication strategy', function (done) {
    const replicationStrategy = cassandraUtil.getReplicationStrategy('{"class": "SimpleStrategy", "replication_factor": 2}');
    expect(replicationStrategy).to.eql({"class": "SimpleStrategy", "replication_factor": 2});
    done();
  });

  it('should return consistency level', function (done) {
    const consistencyLevel = cassandraUtil.getConsistencyLevel('one');
    expect(consistencyLevel).to.eql('one');
    done();
  });

  it('should return default consistency level as not found in config', function (done) {
    const consistencyLevel = cassandraUtil.getConsistencyLevel('two');
    expect(consistencyLevel).to.eql('one');
    done();
  });

  it('should return cassandra store instance', function (done) {
    const store = cassandraUtil.getCassandraStoreInstance();
    expect(store.ormOptions.migration).to.eql('safe');
    expect(store.clientOptions.queryOptions.consistency).to.eql('one');
    done();
  });

});
