import { expect } from 'chai';
import SettingSDK from './SettingSDK';
import * as _ from 'lodash';

let settingSDK = new SettingSDK('testPlugin');

describe('SettingSDK', () => {
    let dbSetting = {
        DB_PORT: 5984
    }
    it('should put setting', async () => {
        settingSDK.put('DB_DETAILS', dbSetting).then(() => {
        })
    })

    it('should get the setting', async () => {
        settingSDK.get('DB_DETAILS').then(dbSettingRes => {
            expect(_.isEqual(dbSettingRes, { DB_PORT: 5984 })).to.be.true;
        })
    })
})