import TelemetrySDK from "./TelemetrySDK";
import * as _ from "lodash";
import * as path from 'path';
import { TelemetryInstance } from "./../services/telemetry/telemetryInstance";

const chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox();
const expect = chai.expect;

export const getSystemSDKerr = {
  status: 404,
  name: 'not_found',
  message: 'missing',
  error: true,
  reason: 'missing',
  docId: 'telemetrySyncSetting'
};

let telemetryInstance: TelemetryInstance = new TelemetryInstance();
describe("TelemetrySDK", () => {
  process.env.FILES_PATH = path.join(__dirname, '..', 'test_data');

  let telemetrySDK;
    process.env.DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'test_data');
    beforeEach(async () => {
      telemetrySDK = new TelemetrySDK();
    });
    afterEach(async () => {
      spy.restore();
    })

  it("should get the telemetryInstance", () => {
    expect(telemetrySDK.getInstance()).to.be.instanceOf(TelemetryInstance);
  });
  it("should send the telemetryEvents", () => {
    let event = {
      eid: "START",
      ets: 1569914181294,
      ver: "3.0",
      mid: "START:ba3bf4531aaf7b31bfacec988d9c3744",
      actor: {
        id: "d91406817c80b540c49434a5ba7d365db6ca88672304b444118be2e331718d75",
        type: "User"
      },
      context: {
        channel: "505c7c48ac6dc1edc9b08f21db5a571d",
        pdata: {
          id: "prod.sunbird.desktop",
          ver: "2.0",
          pid: "sunbird-portal.contentplayer"
        },
        env: "contentplayer",
        sid: "9fb221f7-cfce-9c08-75c7-de0718d5b767",
        did: "d91406817c80b540c49434a5ba7d365db6ca88672304b444118be2e331718d75",
        cdata: [
          { id: "9fd60c07a690f2d54ba515e095b839ca", type: "ContentSession" }
        ],
        rollup: { l1: "505c7c48ac6dc1edc9b08f21db5a571d" }
      },
      object: {
        id: "do_312473549722288128119665",
        type: "Content",
        ver: "1",
        rollup: {}
      },
      tags: [],
      edata: { type: "content", mode: "play", pageid: "", duration: 1.49 }
    };
    telemetrySDK.send([event]);
  });

  it('should return data - getTelemetrySyncSetting', async () => {
    spy.on(telemetrySDK.settingSDK, 'get', (data) => Promise.resolve({enable: true, updatedOn: 12345678987687}));
    const response = await telemetrySDK.getTelemetrySyncSetting();
    expect(response['enable']).to.equal(true );
    expect(response).to.have.property('enable');
  });

  it('should return only true - getTelemetrySyncSetting', async () => {
    spy.on(telemetrySDK.settingSDK, 'get', (data) => Promise.reject(getSystemSDKerr));
    const response = await telemetrySDK.getTelemetrySyncSetting();
    expect(response).to.deep.equal({ enable: true });
    expect(response).to.have.property('enable');
  });

  it('should insert config and return true - setTelemetrySyncSetting', async () => {
    spy.on(telemetrySDK.settingSDK, 'put', data => Promise.resolve(true));
    const response = await telemetrySDK.setTelemetrySyncSetting(true);
    expect(response).to.deep.equal([ { type: 'TELEMETRY', sync: true } ]);
  });

});
