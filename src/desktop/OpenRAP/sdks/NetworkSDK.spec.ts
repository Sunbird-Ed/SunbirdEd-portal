import NetworkSDK from './NetworkSDK';
import { expect } from 'chai';

describe('NetworkSDK', () => {
    it('should connect to internet or throw error', async () => {
        process.env.APP_BASE_URL = 'https://www.sunbird.org/';
        let networkSDK = new NetworkSDK()
        networkSDK.isInternetAvailable().then((connection) => {
            expect(connection, 'Connected').to.be.true;
        }).catch(connection => {
            expect(connection, 'Not connected').to.be.false;
        })
    })
})