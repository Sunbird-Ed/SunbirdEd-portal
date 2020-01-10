const {expect} = require('chai');
const jwtHelper = require('../../../../helpers/jwtHelper');
const testData = require('../testData/jwtHelperTestData');

describe('JWT helper Test Cases', function () {

  it('should extract userid from token as token valid', function (done) {
    const userId = jwtHelper.getUserIdFromToken(testData.validToken);
    expect(userId).to.equal('874ed8a5-782e-4f6c-8f36-e0288455901e');
    done();
  });

  it('should not extract userid from token as token in valid', function (done) {
    const userId = jwtHelper.getUserIdFromToken(testData.invalidToken);
    expect(userId).to.equal(null);
    done();
  });

  it('should decode token', function (done) {
    const tokenData = jwtHelper.decodeToken(testData.validToken);
    expect(tokenData).to.eql({
      sub: 'f:5a8a3f2b-3409-42e0-9001-f913bc0fde31:874ed8a5-782e-4f6c-8f36-e0288455901e',
      name: 'John Doe',
      iat: 1516239022
    });
    done();
  });


});
