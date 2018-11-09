let expect = require('chai').expect
let EnvVarSourceAdapter = require('../../../lib/adapters/envVarSourceAdapter')
let _= require('lodash') 
const envHelper = process.env
const keys = ["sunbird_default_channel"]
let envInstance = new EnvVarSourceAdapter(envHelper)
describe('Env variable source adapter methods test', function () {
    it('should load the given key configs from envrionment', function (done) {
        envInstance.getConfigs(keys,function(err,configs){
            expect(err).to.equal(null)
            expect(_.keys(configs).length).to.be.greaterThan(0)
            done()
        })
    })
})