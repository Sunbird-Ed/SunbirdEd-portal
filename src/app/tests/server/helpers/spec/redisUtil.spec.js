const mock = require('mock-require');
const chai = require('chai');
const expect = chai.expect;

const generic = require('../generics/genericHelper');

const mockEnv = {
  sunbird_azure_account_name: 'accountname',
  sunbird_azure_account_key: 'LCJpYXQiOjE1MTYyMzkwMjJ9',
  sunbird_azure_report_container_name: 'ReportHelper_Container_Name'
};
const testData = {
  session: {
    sid: 'session-sid'
  }
};

mock('../../../../helpers/environmentVariablesHelper', mockEnv);

const mockRedis = {
  createClient: (options) => {
    return redisClient;
  }
};

const redisClient = {
  on: (e, data) => {
    if (e == 'connect') {
      return true;
    } else if (e == 'reconnecting') {
      return true;
    } else {
      return new Error('Redis Connecting Error');
    }
  }
};

mock('redis', mockRedis);

const redisUtil = require('../../../../helpers/redisUtil');

describe('Redis Util Test Cases', () => {

  it('should return error message for validating function missing argument - getRedisStoreInstance', (done) => {
    try {
      redisUtil.getRedisStoreInstance();
    } catch (error) {
      const err = new Error(error);
      expect(err.message).to.eql('InvalidArgumentException: session is required.');
    }
    done();
  });

});