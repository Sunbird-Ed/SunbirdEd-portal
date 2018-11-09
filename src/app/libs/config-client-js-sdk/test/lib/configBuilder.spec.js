let expect = require('chai').expect
let ConfigBuilder = require('../../lib/configBuilder')
const EnvVarSourceAdapter = require('../../lib/adapters/envVarSourceAdapter')
let rewire = require('rewire')
let rewireConfigBuilder = rewire('../../lib/configBuilder');

const scheduleConfigRefreshJob = rewireConfigBuilder.__get__('scheduleConfigRefreshJob')
const envHelper = process.env
const keys = ["sunbird_default_channel"]

describe('Config Builder methods test', function () {
   
    it('should throw error on empty options provided', function (done) {
        let cfgBuilder = new ConfigBuilder({})
        cfgBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).not.to.equal(null)
            done()
        })
    })

    it('should throw error if sources are not provided', function (done) {
        let cfgBuilder = new ConfigBuilder({
            sources: []
        })
        cfgBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).to.equal('child "sources" fails because ["sources" must contain at least 1 items]')
            done()
        })
    })

    it('should throw error if keys are not  provided', function (done) {
        let cfgBuilder = new ConfigBuilder({
            sources: [new EnvVarSourceAdapter(envHelper)]
        })
        cfgBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).to.equal('child "keys" fails because ["keys" is required]')
            done()
        })
    })

    it('should throw error if invalid sources are  provided', function (done) {
        let cfgBuilder = new ConfigBuilder({
            sources: [new Array()],
            keys: keys
        })
        cfgBuilder.buildConfig().then(function (status) {

        }, function (err) {
            expect(err).to.contain('Invalid config source provided')
            done()
        })
    })

    it('should build configurations on valid config options', function (done) {
        let cfgBuilder = new ConfigBuilder({
            sources: [new EnvVarSourceAdapter()],
            keys: keys
        })
        cfgBuilder.buildConfig().then(function (status) {
            expect(status).to.equal(true)
            done()
        }, function (err) {
            expect(err).to.equal(null)
            done()
        })
    })

    it('should set the cron job scheduler to refresh config at given interval', function (done) {
        scheduleConfigRefreshJob(10)
        const cacheRefreshEnabled = rewireConfigBuilder.__get__('cacheRefreshEnabled')
        expect(cacheRefreshEnabled).to.be.true
        done()
    })

})