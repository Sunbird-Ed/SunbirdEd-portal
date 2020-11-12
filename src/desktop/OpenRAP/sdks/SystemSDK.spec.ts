import SystemSDK from './SystemSDK';
import * as path from 'path';
const GetMac = require("getmac");
const chai = require('chai'), spies = require('chai-spies');
chai.use(spies);
const spy = chai.spy.sandbox();
const expect = chai.expect;

describe('SystemSDK', () => {
    let systemSDK;
    process.env.DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'test_data');
    beforeEach(async () => {
        systemSDK = new SystemSDK();
    });
    afterEach(async () => {
      spy.restore();
    })


    it('getMac should throw error and use random ID to generate deviceID',  (done) => {       
        spy.on(GetMac, 'getMac', (cb) => {cb(new Error('Unable get the address'), undefined);});
        spy.on(systemSDK.settingSDK, 'get', () => Promise.reject('no deviceID'));
        let did1;
        systemSDK.getDeviceId()
        .then(did => {
            did1 =did;
            return systemSDK.getDeviceId();
        }).then(did => { 
          expect(did).to.equal(did1)
          console.log(`did: ${did}, did1: ${did1}`); 
          done();
        })        
    })

    it('should get DeviceID',  (done) => {
        systemSDK.getDeviceId().then(id => {
            console.log('deviceId: ', id);
            expect(id).to.be.string;
            done();
        }).catch(err => done(err));
    })

    xit('should get deviceSpec',  (done) => {
        systemSDK.getDeviceInfo().then(id => {
            expect(id).to.be.haveOwnProperty('platform');
            done()
        }).catch(done);
    })
})