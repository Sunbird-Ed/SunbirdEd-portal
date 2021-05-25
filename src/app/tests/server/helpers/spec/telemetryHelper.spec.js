const mock    = require('mock-require');
const chai    = require('chai');
const expect  = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

const generic = require('../generics/genericHelper');

const mockEnv = {
  PORTAL_TELEMETRY_PACKET_SIZE: 1,
  TELEMETRY_SERVICE_LOCAL_URL: 'http://telemetry-service:9001/',
  default_username: 'public',
  default_userid: 'public'
};
mock('../../../../helpers/environmentVariablesHelper', mockEnv);

const mockTelemetry = require('../mocks/sb_telemetry_util.mock.js');
mock('sb_telemetry_util', mockTelemetry);

const spy = {
  mockTelemetryStart: chai.spy.on(mockTelemetry.prototype, 'start'),
  mockTelemetryEnd: chai.spy.on(mockTelemetry.prototype, 'end'),
  mockTelemetryLog: chai.spy.on(mockTelemetry.prototype, 'log'),
  mockTelemetryRollUpData: chai.spy.on(mockTelemetry.prototype, 'getRollUpData'),
  mockTelemetryGetActorData: chai.spy.on(mockTelemetry.prototype, 'getActorData'),
  mockTelemetryError: chai.spy.on(mockTelemetry.prototype, 'error'),
  mockTelemetryAudit: chai.spy.on(mockTelemetry.prototype, 'audit'),
  mockTelemetryImpression: chai.spy.on(mockTelemetry.prototype, 'impression')
};

const request = (options, cb) => { cb(null, true, null); };
mock('request', request);

const jsonwebtoken = require('../mocks/jsonwebtoken.mock')
mock('jsonwebtoken', jsonwebtoken);

const testData = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79 Safari/537.36',
  uri: 'org/v2/search',
  options: {
    headers: {
      ts: new Date().getTime()
    },
    method: 'POST',
    body: {
      ts: new Date().getTime()
    }
  },
  statusCode: 200,
  resp: {
    id: 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0'
  },
  deviceId: 'f0bb2c64c266047b72a794afdcee92'
};


const telemetryHelper = require('../../../../helpers/telemetryHelper');

describe('Telemetry Helper Test Cases', () => {

  it('should return user spec error for without request', (done) => {
    try {
      const res = telemetryHelper.getUserSpec();
    } catch (error) {
      const errorResponse = new TypeError(error)
      expect(errorResponse.name).to.eql('TypeError');
      done();
    }
  });

  it('should return user spec based on req headers', (done) => {
    const req = generic.constructReqBody();
    req.headers['user-agent'] = testData.userAgent;
    const res = telemetryHelper.getUserSpec(req);
    expect(res).to.be.an('object');
    expect(res).to.haveOwnProperty('agent');
    expect(res['agent']).to.eql('Chrome');
    expect(res).to.haveOwnProperty('ver');
    expect(res['ver']).to.eql('79');
    expect(res).to.haveOwnProperty('system');
    expect(res['system']).to.eql('Windows');
    expect(res).to.haveOwnProperty('platform');
    expect(res['platform']).to.eql('WebKit');
    expect(res).to.haveOwnProperty('raw');
    expect(res['raw']).to.eql(testData.userAgent);
    done();
  });

  it('should start session start event', (done) => {
    const req = generic.constructReqBody();
    req.headers['user-agent'] = testData.userAgent;
    req['session'] = {
      userId: '2217bd20-47e7-11ea-8c77-b55095b87aaf',
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC'],
      save: () => { return true; }
    };
    telemetryHelper.logSessionStart(req, function () {
      expect(spy.mockTelemetryStart).to.have.been.called();
      let _startData = {
        edata:
          {
            type: 'click',
            mode: 'mode',
            duration: 1000,
            pageid: 'profile',
            uaspec:
              {
                agent: 'Chrome',
                ver: '79',
                system: 'Windows',
                platform: 'WebKit',
                raw: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79 Safari/537.36'
              }
          },
        context:
          {
            channel: 'channel',
            env: 'user',
            did: undefined,
            sid: undefined,
            rollup: { l1: 'ORG', l2: 'PUBLIC', l3: 'channel' }
          },
        actor: { id: '2217bd20-47e7-11ea-8c77-b55095b87aaf', type: 'user' },
        tags: ['channel']
      };
      expect(spy.mockTelemetryStart).to.have.been.called.with(_startData);
      done();
    });
  });

  it('should start session end event', (done) => {
    const req = generic.constructReqBody();
    req['sessionID'] = 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0';
    req['session'] = {
      userId: '2217bd20-47e7-11ea-8c77-b55095b87aaf',
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC'],
      deviceId: testData.deviceId
    };
    telemetryHelper.logSessionEnd(req);
    expect(spy.mockTelemetryEnd).to.have.been.called();
    let _endData = {
      edata:
      {
        type: 'click',
        mode: 'mode',
        duration: 1000,
        pageid: 'profile',
        summary: 'logout'
      },
      context:
      {
        channel: 'channel',
        env: 'user',
        did: 'f0bb2c64c266047b72a794afdcee92',
        sid: 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0',
        rollup: { l1: 'ORG', l2: 'PUBLIC' }
      },
      actor: { id: '2217bd20-47e7-11ea-8c77-b55095b87aaf', type: 'user' },
      tags: ['channel']
    };
    expect(spy.mockTelemetryEnd).to.have.been.called.with(_endData);
    done();
  });

  it('should generate SSO start event', (done) => {
    const req = generic.constructReqBody();
    req['sessionID'] = 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0';
    req['session'] = {
      userId: '2217bd20-47e7-11ea-8c77-b55095b87aaf',
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC'],
      deviceId: testData.deviceId
    };
    req['query']['token'] = testData.deviceId;
    telemetryHelper.logSSOStartEvent(req);
    expect(spy.mockTelemetryStart).to.have.been.called();
    done();
  });

  it('should generate SSO end event', (done) => {
    const req = generic.constructReqBody();
    req['session'] = {
      rootOrghashTagId: 'channel'
    };
    req['query']['token'] = testData.deviceId;
    telemetryHelper.logSSOEndEvent(req);
    expect(spy.mockTelemetryEnd).to.have.been.called();
    let _endData = {
      edata:
      {
        type: 'click',
        mode: 'mode',
        duration: 1000,
        pageid: 'profile',
        summary: 'logout'
      },
      actor: { id: 'f0bb2c64c266047b72a794afdcee92', type: 'user' },
      tags: ['channel']
    };
    expect(spy.mockTelemetryEnd).to.have.been.called.with(_endData);
    done();
  });

  it('should return params data for log event', (done) => {
    const res = telemetryHelper.getParamsData(testData.options, testData.statusCode, testData.resp, testData.uri);
    expect(res).to.be.an('array');
    expect(res[0]).to.haveOwnProperty('title');
    expect(res[1]).to.haveOwnProperty('category');
    expect(res[2]).to.haveOwnProperty('url');
    expect(res[3]).to.haveOwnProperty('duration');
    expect(res[4]).to.haveOwnProperty('status');
    expect(res[5]).to.haveOwnProperty('protocol');
    expect(res[6]).to.haveOwnProperty('method');
    expect(res[7]).to.haveOwnProperty('req');
    expect(res[8]).to.haveOwnProperty('rid');
    expect(res[9]).to.haveOwnProperty('size');
    done();
  });

  it('should generate log for api call event', (done) => {
    const req = generic.constructReqBody();
    req.id = '001';
    req.uri = testData.uri;
    req.resp = testData.resp;
    req.type = 'POST';
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req.options = testData.options;
    req.statusCode = testData.statusCode;
    req['reqObj'] = {
      'session': {
        rootOrghashTagId: 'channel',
        orgs: ['ORG', 'PUBLIC']
      },
      sessionID: 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0'
    };
    telemetryHelper.logAPICallEvent(req);
    expect(spy.mockTelemetryLog).to.have.been.called();
    done();
  });

  it('should generate keyclock grant log event', (done) => {
    const req = generic.constructReqBody();
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req.success = true;
    req['reqObj'] = {
      'session': {
        rootOrghashTagId: 'channel',
        orgs: ['ORG', 'PUBLIC']
      },
      sessionID: 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0'
    };
    telemetryHelper.logGrantLogEvent(req);
    expect(spy.mockTelemetryLog).to.have.been.called();
    done();
  });

  it('should log API access event', (done) => {
    const req = generic.constructReqBody();
    req.id = '001';
    req.uri = testData.uri;
    req.resp = testData.resp;
    req.type = 'POST';
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req.options = testData.options;
    req.statusCode = testData.statusCode;
    req['reqObj'] = {
      'session': {
        rootOrghashTagId: 'channel',
        orgs: ['ORG', 'PUBLIC']
      },
      sessionID: 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0'
    };
    telemetryHelper.logAPIAccessEvent(req);
    expect(spy.mockTelemetryLog).to.have.been.called();
    expect(spy.mockTelemetryRollUpData).to.have.been.called.with([ 'ORG', 'PUBLIC', 'channel' ]);
    done();
  });

  it('should log api error event', (done) => {
    const req = generic.constructReqBody();
    req.id = '001';
    req.uri = testData.uri;
    req.resp = testData.resp;
    req.type = 'POST';
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req.options = testData.options;
    req.statusCode = testData.statusCode;
    req['reqObj'] = {
      'session': {
        rootOrghashTagId: 'channel',
        orgs: ['ORG', 'PUBLIC']
      },
      sessionID: 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0'
    };
    telemetryHelper.logAPIErrorEvent(req);
    expect(spy.mockTelemetryLog).to.have.been.called();
    expect(spy.mockTelemetryGetActorData).to.have.been.called.with(req.userId, 'user');
    done();
  });

  it('should log api error event - logApiErrorEventV2', (done) => {
    const req = generic.constructReqBody();
    req.id = '001';
    req.uri = testData.uri;
    req.resp = testData.resp;
    req.type = 'POST';
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req.options = testData.options;
    req.statusCode = testData.statusCode;
    req['session'] = {
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC']
    };
    const options = {
      edata: {
        err: null,
        errtype: null,
        stacktrace: null
      },
      context: {
        channel: null,
        env: null,
        cdata: null,
        rollup: null,
        did: null
      }
    };
    telemetryHelper.logApiErrorEventV2(req, options);
    expect(spy.mockTelemetryError).to.have.been.called();
    done();
  });

  it('should log audit event', (done) => {
    const req = generic.constructReqBody();
    req.uri = testData.uri;
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req.sessionID = 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0';
    req['session'] = {
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC']
    };
    const options = {
      edata: {
        props: null,
        state: null,
        prevstate: null
      },
      context: {
        channel: null,
        env: null,
        cdata: null,
        rollup: null,
        did: null,
        sid: null
      }
    };
    telemetryHelper.logAuditEvent(req, options);
    expect(spy.mockTelemetryAudit).to.have.been.called();
    done();
  });

  it('should log impression event', (done) => {
    const req = generic.constructReqBody();
    req.uri = testData.uri;
    req.userId = '2217bd20-47e7-11ea-8c77-b55095b87aaf';
    req['session'] = {
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC']
    };
    const options = {
      edata: {
        type: null,
        subtype: null,
        pageid: null,
        uri: testData.uri,
        visits: 12345
      },
      context: {
        channel: null,
        env: null,
        cdata: null,
        rollup: null,
        did: null,
        sid: null
      }
    };
    telemetryHelper.logImpressionEvent(req, options);
    expect(spy.mockTelemetryImpression).to.have.been.called();
    done();
  });

  it('should log session event', (done) => {
    const req = generic.constructReqBody();
    const res = generic.getResponseObject();
    req['session'] = {
      sessionEvents: [],
      save: () => { return true; }
    };
    req.body['event'] = '{"eid":"INTERACT","ets":1580900354165,"ver":"3.0"}';
    telemetryHelper.logSessionEvents(req, res);
    done();
  });

  it('should get actor data for telemetry - for userId in session', (done) => {
    const req = generic.constructReqBody();
    req['session'] = {
      userId: '2217bd20-47e7-11ea-8c77-b55095b87aaf'
    };
    const _response = telemetryHelper.getTelemetryActorData(req);
    expect(_response).to.be.an('object');
    expect(_response).to.haveOwnProperty('id');
    expect(_response).to.haveOwnProperty('type');
    expect(_response['type']).to.eql('user');
    done();
  });

  it('should get actor data for telemetry - for userId in headers', (done) => {
    const req = generic.constructReqBody();
    req.headers['x-consumer-id'] = mockEnv.default_userid;
    req.headers['x-consumer-username'] = mockEnv.default_username;
    const _response = telemetryHelper.getTelemetryActorData(req);
    expect(_response).to.be.an('object');
    expect(_response).to.haveOwnProperty('id');
    expect(_response).to.haveOwnProperty('type');
    expect(_response['type']).to.eql('public');
    done();
  });

  it('should generate telemetry for proxy api\'s - Learner Service', (done) => {
    const req = generic.constructReqBody();
    const res = generic.getResponseObject();
    const next = () => { };
    telemetryHelper.generateTelemetryForLearnerService(req, res, next);
    expect(req).to.haveOwnProperty('telemetryEnv');
    done();
  });

  it('should generate telemetry for proxy api\'s - Content Service', (done) => {
    const req = generic.constructReqBody();
    const res = generic.getResponseObject();
    const next = () => { };
    telemetryHelper.generateTelemetryForContentService(req, res, next);
    expect(req).to.haveOwnProperty('telemetryEnv');
    done();
  });

  it('should generate telemetry for proxy', (done) => {
    const req = generic.constructReqBody({
      headers: {
        'x-device-id': testData.deviceId
      }
    });
    const res = generic.getResponseObject();
    const next = () => { };
    req['session'] = {
      rootOrghashTagId: 'channel',
      orgs: ['ORG', 'PUBLIC']
    };
    req.sessionID = 'dK0-14e-apyYA86Yolmc.fQyOhLpLaZmLJvaRaeae0';
    telemetryHelper.generateTelemetryForProxy(req, res, next);
    expect(spy.mockTelemetryLog).to.have.been.called();
    done();
  });

});
