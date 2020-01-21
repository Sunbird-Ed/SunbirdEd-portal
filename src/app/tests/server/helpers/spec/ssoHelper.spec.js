var mock = require('mock-require');
const mockEnv = {
  CRYPTO_ENCRYPTION_KEY: "8887a2bc869998be22221b9b1bb42555",
  PORTAL_SESSION_STORE_TYPE: 'in-memory',
  PORTAL_TRAMPOLINE_CLIENT_ID: 'trampoline_client',
  PORTAL_AUTH_SERVER_URL: 'https://server/auth/url',
  PORTAL_REALM: 'realm',
  PORTAL_MERGE_AUTH_SERVER_URL: "https://merge.server/auth/url",
  PORTAL_TRAMPOLINE_SECRET: 'secret',
  KEYCLOAK_TRAMPOLINE_ANDROID_CLIENT: {
    clientId: 'client_android',
    secret: 'android_secret'
  },
  PORTAL_ECHO_API_URL: 'https://server/api/echo/',
  PORTAL_CASSANDRA_URLS: "PORTAL_CASSANDRA_URLS",
  PORTAL_CASSANDRA_CONSISTENCY_LEVEL: "PORTAL_CASSANDRA_CONSISTENCY_LEVEL",
  PORTAL_CASSANDRA_REPLICATION_STRATEGY: '{"class": "SimpleStrategy", "replication_factor": 2}',
};
mock('../../../../helpers/environmentVariablesHelper', mockEnv);
const {expect} = require('chai');
const ssoHelper = require('../../../../helpers/ssoHelper');

describe('SsoHelper Test Cases', function () {

  it('should verifyIdentifier and return true for email', function (done) {
    const stateVerifiedIdentifier = 'mockemail@yopmail.com';
    const nonStateMaskedIdentifier = 'mo*******@yopmail.com';
    const isMigrationAllowed = ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'email');
    expect(isMigrationAllowed).to.eql(true);
    done();
  });

  it('should not allow migration as email length mismatch', function (done) {
    const stateVerifiedIdentifier = 'mockemal@yopmail.com';
    const nonStateMaskedIdentifier = 'mo*******@yopmail.com';
    const isMigrationAllowed = ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'email');
    expect(isMigrationAllowed).to.eql(false);
    done();
  });

  it('should not allow migration as email invalid', function (done) {
    const stateVerifiedIdentifier = 'mockemal@yopmail.com';
    const nonStateMaskedIdentifier = 'mo*******';
    try {
      ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'email');
    } catch (e) {
      expect(e).to.eql('ERROR_PARSING_EMAIL');
      done();
    }
  });

  it('should allow migration for phone number', function (done) {
    const stateVerifiedIdentifier = '9595959595';
    const nonStateMaskedIdentifier = '******9595';
    const isMigrationAllowed = ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'phone');
    expect(isMigrationAllowed).to.eql(true);
    done();
  });

  it('should not allow migration for phone number as phone number length is in correct', function (done) {
    const stateVerifiedIdentifier = '5959595';
    const nonStateMaskedIdentifier = '******9595';
    const isMigrationAllowed = ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'phone');
    expect(isMigrationAllowed).to.eql(false);
    done();
  });

  it('should not allow migration for phone number as phone number not matched', function (done) {
    const stateVerifiedIdentifier = '9595959595';
    const nonStateMaskedIdentifier = '******5555';
    const isMigrationAllowed = ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'phone');
    expect(isMigrationAllowed).to.eql(false);
    done();
  });

  it('should throw error as phone and email only allowed', function (done) {
    const stateVerifiedIdentifier = '9595959595';
    const nonStateMaskedIdentifier = '******5555';
    try {
      ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'invalidIdentifier');
    } catch (e) {
      expect(e).to.eql('UNKNOWN_IDENTIFIER');
      done();
    }
  });

  it('should throw error as state identifier is not string', function (done) {
    const stateVerifiedIdentifier = '9595959595';
    const nonStateMaskedIdentifier = null;
    try {
      ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'invalidIdentifier');
    } catch (e) {
      expect(e).to.eql('ERROR_PARSING_NON_STATE_IDENTIFIER');
      done();
    }
  });

  it('should throw error as state identifier is not string', function (done) {
    const stateVerifiedIdentifier = null;
    const nonStateMaskedIdentifier = '******5555';
    try {
      ssoHelper.verifyIdentifier(stateVerifiedIdentifier, nonStateMaskedIdentifier, 'invalidIdentifier');
    } catch (e) {
      expect(e).to.eql('ERROR_PARSING_STATE_IDENTIFIER');
      done();
    }
  });

});
