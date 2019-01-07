let expect = require('chai').expect
let configUtil = require('../../lib/configUtil')

describe('Config Utils methods test', function () {
    it('should load the given config into cache', function (done) {
        let configData = {
            config_key_1: 'value1',
            config_key_2: 'value2'
        }
        configUtil.loadConfigData(configData)
        expect(configUtil.getConfig('config_key_1')).to.equal('value1')
        expect(configUtil.getConfig('key_not_loaded')).to.be.undefined
        done()
    })
})