"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
const Hashids = require("hashids");
const UUID = require("uuid");
class Util {
    static hash(text) {
        let hash = new Hashids(text, 5, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        return hash.encode(1).toLowerCase();
    }
    static generateId(prefix, id) {
        return (Util.hash(prefix) + '_' + id).toLowerCase();
    }
    static UUID() {
        return UUID();
    }
}
exports.Util = Util;
var FrameworkErrors;
(function (FrameworkErrors) {
    FrameworkErrors[FrameworkErrors["MANIFEST_NOT_FOUND"] = 0] = "MANIFEST_NOT_FOUND";
    FrameworkErrors[FrameworkErrors["MANIFEST_NOT_PARSEABLE"] = 1] = "MANIFEST_NOT_PARSEABLE";
    FrameworkErrors[FrameworkErrors["ENTRY_FILE_NOT_FOUND"] = 2] = "ENTRY_FILE_NOT_FOUND";
    FrameworkErrors[FrameworkErrors["METHOD_NOT_IMPLEMENTED"] = 3] = "METHOD_NOT_IMPLEMENTED";
    FrameworkErrors[FrameworkErrors["PLUGIN_LOAD_FAILED"] = 4] = "PLUGIN_LOAD_FAILED";
    FrameworkErrors[FrameworkErrors["PLUGIN_BUILD_FAILED"] = 5] = "PLUGIN_BUILD_FAILED";
    FrameworkErrors[FrameworkErrors["PLUGIN_INSTANCE_FAILED"] = 6] = "PLUGIN_INSTANCE_FAILED";
    FrameworkErrors[FrameworkErrors["ROUTE_REGISTRY_FAILED"] = 7] = "ROUTE_REGISTRY_FAILED";
    FrameworkErrors[FrameworkErrors["ROUTER_FILE_NOT_FOUND"] = 8] = "ROUTER_FILE_NOT_FOUND";
    FrameworkErrors[FrameworkErrors["PLUGIN_ROUTE_INIT_FAILED"] = 9] = "PLUGIN_ROUTE_INIT_FAILED";
    FrameworkErrors[FrameworkErrors["UNKNOWN_ERROR"] = 10] = "UNKNOWN_ERROR";
    FrameworkErrors[FrameworkErrors["DB_ERROR"] = 11] = "DB_ERROR";
    FrameworkErrors[FrameworkErrors["SCHEMA_LOADER_FAILED"] = 12] = "SCHEMA_LOADER_FAILED";
    FrameworkErrors[FrameworkErrors["INVALID_SCHEMA_PATH"] = 13] = "INVALID_SCHEMA_PATH";
    FrameworkErrors[FrameworkErrors["PLUGIN_REGISTERED"] = 14] = "PLUGIN_REGISTERED";
    FrameworkErrors[FrameworkErrors["PLUGIN_REGISTER_FAILED"] = 15] = "PLUGIN_REGISTER_FAILED";
    FrameworkErrors[FrameworkErrors["INVALID_AUTH_PROVIDER"] = 16] = "INVALID_AUTH_PROVIDER";
    FrameworkErrors[FrameworkErrors["AUTH_PROVIDER_ALREADY_CONFIGURED"] = 17] = "AUTH_PROVIDER_ALREADY_CONFIGURED";
})(FrameworkErrors = exports.FrameworkErrors || (exports.FrameworkErrors = {}));
class ErrorSubclass {
    constructor(message) {
        this.name = "ErrorSubclass";
        this.message = message;
        this.stack = (new Error(message)).stack;
    }
}
exports.ErrorSubclass = ErrorSubclass;
// ErrorSubclass.prototype = <any>Object.create( Error.prototype );
Object.defineProperty(ErrorSubclass, 'prototype', Object.create(Error.prototype));
class FrameworkError extends ErrorSubclass {
    constructor(options) {
        super(options.message);
        this.name = "FrameworkError";
        this.detail = (options.detail || "");
        this.extendedInfo = (options.extendedInfo || "");
        this.code = (options.code || FrameworkErrors.UNKNOWN_ERROR);
        this.rootError = (options.rootError || null);
    }
    print() {
        return ("FrameworkError:: code:" + this.code + " | message:" + this.message + " | rootErr:" + this.rootError);
    }
}
exports.FrameworkError = FrameworkError;
function delayPromise(duration) {
    return function (...args) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(...args);
            }, duration);
        });
    };
}
exports.delayPromise = delayPromise;
