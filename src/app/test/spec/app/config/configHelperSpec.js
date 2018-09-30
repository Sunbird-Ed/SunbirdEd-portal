const configHelper = require('../../../../helpers/config/configHelper.js')
const configToTest = 'PORTAL_DEFAULT_LANGUAGE'
let envHelper = require('../environmentVariablesHelper.js')
let chai = require('chai'),
  sinon = require('sinon'),
  expect = chai.expect
const apiResponseSuccess = {
    "id": "sunbird.config.read",
    "ver": "1.0",
    "ts": "2018-09-30T11:02:44ZZ",
    "params": {
        "resmsgid": "eaa033c0-4291-4e37-9c2d-1ab97de99abe",
        "msgid": null,
        "err": null,
        "status": "successful",
        "errmsg": null
    },
    "responseCode": "OK",
    "result": {
        "keys": {
            "instance.portal": {
                "sunbird_portal_default_language": "en",
                "sunbird_explore_button_visibility": "true",
                "sunbird_extcont_whitelisted_domains": "youtube.com",
                "sunbird_portal_user_upload_ref_link": "http://www.sunbird.org/features-documentation/register_user",
                "sunbird_enabless_permission_check": "true",
                "sunbird_autocreate_trampoline_user": "true",
                "sunbird_theme": "default",
                "sunbird_portal_primary_bundle_language": "en",
                "sunbird_enable_signup": "true"
            }
        }
    }
} 

const apiResponseFailure = {
    "id": "sunbird.config.read",
    "ver": "1.0",
    "ts": "2018-09-30T11:32:46ZZ",
    "params": {
        "resmsgid": "70169d5a-0333-4cf7-bef0-65a226d57cfa",
        "msgid": null,
        "err": "SYSTEM_ERROR",
        "status": "failed",
        "errmsg": "Something went wrong in server while processing the request"
    },
    "responseCode": "SERVER_ERROR",
    "result": {}
}

envHelper[configToTest] = 'hi'
describe('Config helper', function () {
  describe('fetch config from api', function () {
    beforeEach(() => {
        request.post = sinon.stub(request, 'post');
        request.post.yields(JSON.stringify(apiResponseSuccess))
      });
      afterEach(() => {
        request.restore();
      });
    it('should fetch all config from API and store it', function (done) {
        configHelper.fetchConfig().then(function(){
            expect(configHelper.getConfig(configToTest)).toBe('en')
            done()
        })
      })
  })
  describe('fallback to env config', function () {
    beforeEach(() => {
        request.post = sinon.stub(request, 'post');
        request.post.yields(JSON.stringify(apiResponseFailure))
      });
      afterEach(() => {
        request.restore();
      });
      it('should fallback to environment variables incase of API error', function (done) {
        configHelper.fetchConfig().then(function(){
            expect(configHelper.getConfig(configToTest)).toBe(envHelper[configToTest])
            done()
        })
      })
  })
})
