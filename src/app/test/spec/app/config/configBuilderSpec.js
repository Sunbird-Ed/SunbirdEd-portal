const ConfigBuilder = require('../../../../helpers/config/configBuilder.js')
let chai = require('chai')
let expect = chai.expect
const EnvVarSourceAdapter = require('../../../../helpers/config/sourceAdapters/envVarSourceAdapter')
const envHelper = require('../../../../helpers/environmentVariablesHelper')
const configMap = {
  sunbird_instance_name: 'PORTAL_TITLE_NAME',
  sunbird_theme: 'PORTAL_THEME',
  sunbird_default_language: 'PORTAL_DEFAULT_LANGUAGE',
  sunbird_primary_bundle_language: 'PORTAL_PRIMARY_BUNDLE_LANGUAGE',
  sunbird_explore_button_visibility: 'EXPLORE_BUTTON_VISIBILITY',
  sunbird_enable_signup: 'ENABLE_SIGNUP',
  sunbird_extcont_whitelisted_domains: 'SUNBIRD_EXTCONT_WHITELISTED_DOMAINS',
  sunbird_portal_user_upload_ref_link: 'PORTAL_USER_UPLOAD_REF_LINK'
}
let configBuilder = new ConfigBuilder(configMap)
configBuilder.addConfigSource(new EnvVarSourceAdapter(envHelper))


describe('Config builder', function () {
  it('build configurations from given sources', function (done) {
    configBuilder.buildConfig(5).then(function (status) {
      expect(status).to.be.equal(true);
      done();
    })
  })
})
