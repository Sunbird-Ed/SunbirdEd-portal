var mock = require('mock-require');
const mockEnv = {
  PORTAL_API_AUTH_TOKEN: "mock token",
  LEARNER_URL: "lerner-service/api/"
};
const mockPromise = function (data) {
  return new Promise((resolve, reject) => {
    if (data) {
      resolve(data)
    }
  })
};
mock('request-promise', mockPromise);
mock('../../../../helpers/environmentVariablesHelper', mockEnv);
const testData = require('../testData/accountMergeTestData');
const {expect} = require('chai');
const accountMergeHelper = require('../../../../helpers/accountMergeHelper');

describe('Account merge Helper Test Cases', function () {

  it('should initiate account merge', function (done) {
    accountMergeHelper.initiateAccountMerge({
      sessionToken: testData.token,
      userId: '874ed8a5-782e-4f6c-8f36-e02884'
    }, testData.token).then(function (data) {
      expect(data.method).to.eql('PATCH');
      expect(data.url).to.eql(mockEnv.LEARNER_URL + 'user/v1/account/merge');
      expect(data.body.request.fromAccountId).to.eql('874ed8a5-782e-4f6c-8f36-e0288455901e');
      expect(data.body.request.toAccountId).to.eql('874ed8a5-782e-4f6c-8f36-e02884');
      done();
    });
  });

});

