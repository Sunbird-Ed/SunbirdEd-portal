const configHelper = require('../../../../helpers/config/configHelper.js')
let chai = require('chai')
let expect = chai.expect
let configData = {PORTAL_DEFAULT_LANGUAGE:'en'}

describe('Config helper', function () {
    it('store given config into cache', function (done) {
        configHelper.loadConfigData(configData);
        let configValue = configHelper.getConfig('PORTAL_DEFAULT_LANGUAGE');
        expect(configValue).to.be.equal(configData.PORTAL_DEFAULT_LANGUAGE);
        done();
      })
})
