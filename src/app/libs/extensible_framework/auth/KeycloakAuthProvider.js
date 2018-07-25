"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keycloak = require("keycloak-connect");
const AuthProvider_1 = require("./AuthProvider");
const _ = require("lodash");
class KeycloakAuthProvider {
    configure(options) {
        this.options = _.cloneDeep(options);
        this.connection = new Keycloak({ store: this.options.store }, this.options);
    }
    authenticate(req, res, next) {
        this.connection.middleware(this.options['middleware-options'])(...arguments);
    }
    protect(req, res, next) {
        this.connection.protect()(...arguments);
    }
}
exports.KeycloakAuthProvider = KeycloakAuthProvider;
AuthProvider_1.authProvider.register(KeycloakAuthProvider);
