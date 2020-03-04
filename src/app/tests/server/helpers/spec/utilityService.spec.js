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

  it('should check for valid string', function (done) {
    const isString = utils.isValidAndNotEmptyString('test');
    expect(isString).to.eql(true);
    done();
  });

  it('should return false as invalid string', function (done) {
    const isString = utils.isValidAndNotEmptyString(null);
    expect(isString).to.eql(false);
    done();
  });

  it('should return false as it is undefined', function (done) {
    const isString = utils.isValidAndNotEmptyString(undefined);
    expect(isString).to.eql(false);
    done();
  });

  it('should return false as it is empty string', function (done) {
    const isString = utils.isValidAndNotEmptyString('');
    expect(isString).to.eql(false);
    done();
  });

});
