let expect = require('chai').expect
let ConfigBuilder = require('../../lib/configBuilder')
const EnvVarSourceAdapter = require('../../lib/adapters/envVarSourceAdapter')
const ServiceSourceAdapter = require('../../lib/adapters/serviceSourceAdapter')
let rewire = require('rewire')
let rewireConfigBuilder = rewire('../../lib/configBuilder');
let configUtil = require('../../lib/configUtil');

const scheduleConfigRefreshJob = rewireConfigBuilder.__get__('scheduleConfigRefreshJob')
const envHelper = process.env
const keys = ['sunbird_default_language','sunbird_instance_name', 'sunbird_theme',
'sunbird_primary_bundle_language', 'sunbird_explore_button_visibility', 'sunbird_enable_signup',
'sunbird_extcont_whitelisted_domains', 'sunbird_portal_user_upload_ref_link']

let httpOptions={url:envHelper.sunbird_config_service_url+'v1/read',method:'POST',headers:{authorization:'Bearer '+envHelper.sunbird_api_auth_token},json:!0}
const configPRefix = 'portal.'

describe('Config Builder methods test', function () {

    it('should throw error on empty options provided', function (done) {
        let configBuilder = new ConfigBuilder({})
        configBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).not.to.equal(null)
            done()
        })
    })

    it('should throw error if sources are not provided', function (done) {
        let configBuilder = new ConfigBuilder({
            sources: []
        })
        configBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).to.equal('child "sources" fails because ["sources" must contain at least 1 items]')
            done()
        })
    })

    it('should throw error if keys are not  provided', function (done) {
        let configBuilder = new ConfigBuilder({
            sources: [new EnvVarSourceAdapter(envHelper)]
        })
        configBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).to.equal('child "keys" fails because ["keys" is required]')
            done()
        })
    })

    it('should throw error if invalid sources are  provided', function (done) {
        let configBuilder = new ConfigBuilder({
            sources: [new Array()],
            keys: keys
        })
        configBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).to.contain('Invalid config source provided')
            done()
        })
    })

    it('should build configurations on valid config options', function (done) {
        let configBuilder = new ConfigBuilder({
            sources: [new EnvVarSourceAdapter(envHelper),new ServiceSourceAdapter(httpOptions,configPRefix , true)],
            keys: keys
        })
        configBuilder.buildConfig().then(function (status) {
            expect(status).to.equal(true)
            let configVal = configUtil.getConfig(keys[0])
            expect(configVal).to.not.equal(null)
            done()
        }, function (err) {
            expect(err).to.equal(null)
            done()
        })
    })

    it('should have null value for the keys which does not have configurations', function (done) {
      let configBuilder = new ConfigBuilder({
          sources: [new EnvVarSourceAdapter(envHelper),new ServiceSourceAdapter(httpOptions,configPRefix , true)],
          keys: ['not_found_key']
      })
      configBuilder.buildConfig().then(function (status) {
          expect(status).to.equal(true)
          expect(configUtil.getConfig('not_found_key')).to.equal(null)
          done()
      }, function (err) {
          expect(err).to.equal(null)
          done()
      })
  })

    it('should set the cron job scheduler to refresh config at given interval', function (done) {
        scheduleConfigRefreshJob(10)
        const cronScheduled = rewireConfigBuilder.__get__('cronScheduled')
        expect(cronScheduled).to.be.true
        done()
    })

})
