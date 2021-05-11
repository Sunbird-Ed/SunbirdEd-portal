const mock    = require('mock-require');
const chai    = require('chai');
const expect  = chai.expect;

const generic = require('../generics/genericHelper');

const testData = {
  userId: '2217bd20-47e7-11ea-8c77-b55095b87aaf',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.hqWGSaFpvbrXkOWc6lrnffhNWR19W_S1YKFBx2arWBk'
};

const mockEnv = {
  PORTAL_API_AUTH_TOKEN: 'testData.token',
  LEARNER_URL: 'http://localhost:9000'
};
mock('../../../../helpers/environmentVariablesHelper.js', mockEnv);

const userHelper = require('../../../../helpers/userHelper');

describe('User Helper Test Cases', () => {
  it('should get user details', (done) => {
    userHelper.getUserDetails(testData.userId, testData.token).then((data) => {
      if (data) expect(data).to.be.eql.apply('OK');
    });
    done();
  });

  it('should accept Terms And Condition', (done) => {
    userHelper.acceptTermsAndCondition({}, testData.token).then((data) => {
      expect(data).to.be.eql.apply('OK');
    });
    done();
  });

});
