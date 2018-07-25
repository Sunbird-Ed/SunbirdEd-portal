"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
const _ = require("lodash");
class AuthProvider {
    constructor() {
        this.providers = [];
    }
    register(provider) {
        if (provider) {
            this.providers.concat([provider]);
        }
        else {
            throw new util_1.FrameworkError({ code: util_1.FrameworkErrors.INVALID_AUTH_PROVIDER, message: 'unable to register! invalid auth provider' });
        }
    }
    unregister(provider) {
        if (provider) {
            _.remove(this.providers, p => p === provider);
        }
        else {
            throw new util_1.FrameworkError({ code: util_1.FrameworkErrors.INVALID_AUTH_PROVIDER, message: 'unable to unregister, invalid auth provider' });
        }
    }
    getDefault() {
        return this.providerInUse;
    }
    use(provider) {
        if (this.providerInUse) {
            throw new util_1.FrameworkError({ code: util_1.FrameworkErrors.AUTH_PROVIDER_ALREADY_CONFIGURED, message: 'auth provider is already configured with a provider! unable to reconfigure' });
        }
        const registeredProvider = this.providers.find(x => provider instanceof x);
        if (registeredProvider) {
            this.providerInUse = provider;
            console.log('====> Auth Provider is configured with ', provider.constructor.name);
        }
        else {
            throw new util_1.FrameworkError({ code: util_1.FrameworkErrors.INVALID_AUTH_PROVIDER, message: 'supplied provider is not registered to use!' });
        }
    }
}
exports.AuthProvider = AuthProvider;
exports.authProvider = new AuthProvider();
