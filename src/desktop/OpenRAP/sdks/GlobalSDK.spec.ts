import { expect } from 'chai';
import { register, get, list } from './GlobalSDK';
import * as _ from 'lodash';

describe('GlobalSDK', () => {
    let pluginInfo = {
        pluginVer: "1.0",
        apiToken: "agkjhfsald",
        apiBaseURL: "https://www.sunbird.org",
        apiTokenRefreshFn: 'refreshToken'
    }
    it('should register a plugin', (done) => {
        register('testplugin', pluginInfo).then(() => {
            done()
        })
    })

    it('should return registered  plugin', (done) => {
        get('testplugin').then(pluginInfoRes => {
            expect(_.isEqual(pluginInfoRes, {
                pluginVer: "1.0",
                apiToken: "agkjhfsald",
                apiBaseURL: "https://www.sunbird.org",
                apiTokenRefreshFn: 'refreshToken'
            })).to.be.true;
            done()
        })
    })


    it('should return the list of the plugins', (done) => {
        list().then(plugins => {
            expect(plugins.length > 0).to.be.true;
            done()
        })
    })
})