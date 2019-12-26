const {expect} = require('chai');
const utils = require('../../../../helpers/utilityService');


describe('Utility Service Test Cases', function () {
  it('should fail to parse and return false', function (done) {
    const parsedData = utils.parseJson('mockData');
    expect(parsedData).to.equal(false);
    done();
  });
  it('should parse data', function (done) {
    const parsedData = utils.parseJson('{"test":"mockData"}');
    expect(parsedData).to.eql({"test": "mockData"});
    done();
  });
});
