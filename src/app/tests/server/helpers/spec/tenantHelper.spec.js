const mock = require('mock-require');
const chai = require('chai');
const expect = chai.expect;

const generic = require('../generics/genericHelper');

const testData = {
  userId: '2217bd20-47e7-11ea-8c77-b55095b87aaf',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.hqWGSaFpvbrXkOWc6lrnffhNWR19W_S1YKFBx2arWBk',
  baseUrl: 'localhost:9000',
  tenantId: 'sunbird',
  invalidTenantId: 'testTenant',
  image: 'appLogo.png',
  invalidImage: 'test.png',
  protocol: 'http'
};

const mockEnv = {
  PORTAL_API_AUTH_TOKEN: 'testData.token',
  LEARNER_URL: 'http://localhost:9000',
  TENANT_CDN_URL: 'http://localhost:9000',
  DEFAULT_CHANNEL: 'sunbird'
};
mock('../../../../helpers/environmentVariablesHelper.js', mockEnv);

const request = {
  get: () => {
    return {
      on: (e, cb) => {
        if (e == 'response') {
          cb(generic.getResponseObject());
        }
      }
    }
  },

}
mock('request', request);

function CacheManager() {}
CacheManager.prototype.get = function (key, callback) {
  if (typeof key == 'string') {
    callback(null, {
      ts: '',
      params: {}
    });
  } else {
    callback(true, null);
  }
};
CacheManager.prototype.set = function (data, callback) {
  return callback(null, { success: true });
};
mock('sb_cache_manager', CacheManager);

const tenantHelper = require('../../../../helpers/tenantHelper');

describe('Tenant Helper Test Cases', () => {

  after(() => {
    mock.stopAll();
  });

  it('should get image path', (done) => {
    tenantHelper.getImagePath(testData.baseUrl, testData.tenantId, testData.image, (err, res) => {
      expect(res).to.be.eql(testData.protocol + '://' + testData.baseUrl + '/' + testData.tenantId + '/' + testData.image);
      done();
    });
  });

  it('should get local image path', (done) => {
    tenantHelper.getLocalImage(testData.baseUrl, testData.tenantId, testData.image, (err, res) => {
      expect(res).to.be.eql(testData.baseUrl + '/tenant/' + testData.tenantId + '/' + testData.image);
      done();
    });
  });

  it('should get local image path based on DEFAULT_CHANNEL', (done) => {
    tenantHelper.getLocalImage(testData.baseUrl, testData.invalidTenantId, testData.image, (err, res) => {
      expect(res).to.be.eql(testData.baseUrl + '/tenant/' + mockEnv.DEFAULT_CHANNEL + '/' + testData.image);
      done();
    });
  });

  it('should fail to get local image path based on DEFAULT_CHANNEL', (done) => {
    tenantHelper.getLocalImage(testData.baseUrl, testData.tenantId, testData.invalidImage, (err, res) => {
      expect(res).to.be.eql(null);
      done();
    });
  });

  it('should get info', (done) => {
    const req = generic.constructReqBody({
      hostname: testData.baseUrl,
      headers: {
        host: testData.baseUrl,
        'x-forwarded-proto': 'http'
      }
    });
    const res = generic.getResponseObject();
    tenantHelper.getInfo(req, res);
    expect(res).to.be.an('object');
    expect(res).to.haveOwnProperty('statusCode');
    expect(res['statusCode']).to.be.eql(200);
    done();
  });

  it('should get info for tenant available cache', (done) => {
    const req = generic.constructReqBody({
      hostname: testData.baseUrl,
      params: {
        tenantId: 123
      },
      headers: {
        host: testData.baseUrl,
        'x-forwarded-proto': 'http'
      }
    });
    const res = generic.getResponseObject();
    try {
      tenantHelper.getInfo(req, res);
    } catch (error) {
      expect(res).to.be.an('object');
      expect(res).to.haveOwnProperty('statusCode');
      expect(res['statusCode']).to.be.eql(200);
    }
    done();
  });

  it('should get default tenant index state', (done) => {
    const res = tenantHelper.getDefaultTenantIndexState();
    expect(res).to.be.an('boolean');
    expect(res).to.be.eql(true);
    done();
  });

});