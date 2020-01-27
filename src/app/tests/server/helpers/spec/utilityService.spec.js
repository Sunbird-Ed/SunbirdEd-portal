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

  it('should get delay of given duration', function (done) {
    const date1 = Date.now();
    const delayTime = 100;
    utils.delay(delayTime).then(() => {
      const date2 = Date.now();
      const durationGap = date2 - date1;
      expect(durationGap).to.gte(delayTime);
      done();
    });
  });
});
