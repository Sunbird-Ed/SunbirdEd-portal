const Hashids = require('hashids/cjs');
import * as UUID from 'uuid';

export class Util {
    public static hash(text: string): string {
        let hash = new Hashids(text, 5, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        return hash.encode(1).toLowerCase();
    }

    public static generateId(prefix: string, id: string): string {
		  return (Util.hash(prefix) + '_' + id).toLowerCase();
    }

    public static UUID() {
        return UUID();
    }
}

export enum FrameworkErrors {
    MANIFEST_NOT_FOUND,
    MANIFEST_NOT_PARSEABLE,
    ENTRY_FILE_NOT_FOUND,
    METHOD_NOT_IMPLEMENTED,
    PLUGIN_LOAD_FAILED,
    PLUGIN_BUILD_FAILED,
    PLUGIN_INSTANCE_FAILED,
    ROUTE_REGISTRY_FAILED,
    ROUTER_FILE_NOT_FOUND,
    PLUGIN_ROUTE_INIT_FAILED,
    UNKNOWN_ERROR,
    DB_ERROR,
    SCHEMA_LOADER_FAILED,
    INVALID_SCHEMA_PATH,
    PLUGIN_REGISTERED,
    PLUGIN_REGISTER_FAILED,
    INVALID_AUTH_PROVIDER,
    AUTH_PROVIDER_ALREADY_CONFIGURED
}

export interface ErrorSubclass extends Error {
}

export class ErrorSubclass {

    public name: string;
    public message: string;
    public stack: string;

    constructor(message: string) {

        this.name = "ErrorSubclass";
        this.message = message;
        this.stack = (new Error(message)).stack;
    }
}

// ErrorSubclass.prototype = <any>Object.create( Error.prototype );
Object.defineProperty(ErrorSubclass, 'prototype', Object.create(Error.prototype));

export interface FrameworkErrorOptions {
    message?: string;
    detail?: string;
    extendedInfo?: string;
    code: FrameworkErrors;
    rootError?: any;
}

export class FrameworkError extends ErrorSubclass {

    public name: string;
    public detail: string;
    public extendedInfo: string;
    public code: FrameworkErrors;
    public rootError: any;

    constructor(options: FrameworkErrorOptions) {
        super(options.message);
        this.name = "FrameworkError";
        this.detail = (options.detail || "");
        this.extendedInfo = (options.extendedInfo || "");
        this.code = (options.code || FrameworkErrors.UNKNOWN_ERROR);
        this.rootError = (options.rootError || null);
    }

    public print(): string {
        return ("FrameworkError:: code:" + this.code + " | message:" + this.message + " | rootErr:" + this.rootError);
    }

}

export function delayPromise(duration) {
    return function(...args){
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve([...args]);
        }, duration)
      });
    };
  }