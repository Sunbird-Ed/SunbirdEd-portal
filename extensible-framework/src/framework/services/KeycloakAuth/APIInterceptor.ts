import * as keyCloakAuthUtils from 'keycloak-auth-utils';
import { CacheManager } from './CacheManager';

export class ApiInterceptor {
    private cacheManager: object;
    private cacheManagerConfig: { ttl: any };
    private grantManager: any;
    private keyCloakConfig: any;
    private config: object;

    constructor(keyclock_config, cache_config) {
        this.config = keyclock_config;
        this.keyCloakConfig = new keyCloakAuthUtils.Config(this.config);
        this.grantManager = new keyCloakAuthUtils.GrantManager(this.keyCloakConfig);

        this.cacheManagerConfig = cache_config;
        this.cacheManager = new CacheManager(cache_config);
    }

    /**
     * [validateToken is used for validate user]
     * @param  {[string]}   token    [x-auth-token]
     * @param  {Function} callback []
     * @return {[Function]} callback [its retrun err or object with fields(token, userId)]
     */
    validateToken(token, callback) {
        var self = this;
        self.cacheManager.get(token, function (err, tokenData) {
            if (err || !tokenData) {
                self.grantManager.userInfo(token, function (err, userData) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        if (self.cacheManagerConfig.ttl) {
                            self.cacheManager.set({ key: token, value: { token: token, userId: userData.sub } }, function (err, res) { });
                        }
                        return callback(null, { token: token, userId: userData.sub });
                    }
                });
            } else {
                return callback(null, tokenData);
            }
        });
    }
}