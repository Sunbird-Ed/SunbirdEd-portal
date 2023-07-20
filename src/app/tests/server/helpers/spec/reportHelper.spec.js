const mock = require('mock-require');
const events = require('events').EventEmitter;
const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

const generic = require('../generics/genericHelper');

const mockEnv = {
  sunbird_azure_account_name: 'accountname',
  sunbird_azure_account_key: 'LCJpYXQiOjE1MTYyMzkwMjJ9',
  sunbird_azure_report_container_name: 'ReportHelper_Container_Name'
};
const testData = {
  stateSlug: 'tn',
  publicSlug: 'public',
  mockSlug: 'lorem',
  roles: ['CONTENT_CREATOR', 'ORG_ADMIN', 'REPORT_VIEWER'],
  mockRole: 'CONTENT_REVIEWER',
  blobFilename: 'test',
  blobExtension: '.json',
  blobResponse: { id: '42a432-2a34f2-fsf232' },
  signedUrl: 'https://storagesample.blob.core.net/'
};
testData.signedUrl += mockEnv.sunbird_azure_report_container_name + '/' + testData.blobFilename + testData.blobExtension;

mock('../../../../helpers/environmentVariablesHelper', mockEnv);

const createReadStream = () => {
  return readStream
}
const readStream = {
  pipe: (data) => {
    return data;
  },
  on: (e, data) => {
    if (e == 'end') {
      return generic.getResponseObject();
    } else {
      return generic.getResponseObject(new Error('Stream Error'));
    }
  }
};
const generateSharedAccessSignature = () => {
  return 'token'
};
const getUrl = () => {
  return testData.signedUrl
};


const reportHelper = require('../../../../helpers/reportHelper');

describe('Report Helper Test Cases', () => {

  it('should return success for validating slug passed', (done) => {
    const req = generic.constructReqBody({
      rootOrg: {
        slug: testData.stateSlug
      },
      params: {
        slug: testData.publicSlug
      }
    });
    const res = generic.getResponseObject();
    reportHelper.validateSlug([testData.publicSlug])(req, res, () => { });
    expect(res.statusCode).to.eql(200);
    done();
  });

  it('should return error for validating slug passed - FORBIDDEN', (done) => {
    const req = generic.constructReqBody({
      rootOrg: {
        slug: testData.stateSlug
      },
      params: {
        slug: testData.mockSlug
      }
    });
    const res = generic.getResponseObject();
    reportHelper.validateSlug([testData.publicSlug])(req, res, () => { });
    expect(res._getData()).to.be.an('object');
    expect(res._getData()).to.haveOwnProperty('responseCode');
    expect(res._getData()['responseCode']).to.eql('FORBIDDEN');
    expect(res._getData()).to.have.nested.property('params.errmsg');
    expect(res._getData()['params']['errmsg']).to.eql('FORBIDDEN');
    expect(res.statusCode).to.eql(403);
    done();
  });

  it('should return success for validating roles for user', (done) => {
    const req = generic.constructReqBody({
      session: {
        roles: testData.roles
      }
    });
    const res = generic.getResponseObject();
    reportHelper.validateRoles([testData.roles[1]])(req, res, () => { });
    expect(res.statusCode).to.eql(200);
    done();
  });

  it('should return error for validating roles for user - FORBIDDEN', (done) => {
    const req = generic.constructReqBody({
      session: {
        roles: testData.roles
      }
    });
    const res = generic.getResponseObject();
    reportHelper.validateRoles([testData.mockRole])(req, res, () => { });
    expect(res._getData()).to.be.an('object');
    expect(res._getData()).to.haveOwnProperty('responseCode');
    expect(res._getData()['responseCode']).to.eql('FORBIDDEN');
    expect(res._getData()).to.have.nested.property('params.errmsg');
    expect(res._getData()['params']['errmsg']).to.eql('FORBIDDEN');
    expect(res.statusCode).to.eql(403);
    done();
  });

});
