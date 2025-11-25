const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;
const nodeFetch = require('node-fetch');
const AbortController = require('abort-controller').AbortController;
const util = require('util');

class JSDOMEnvironmentWithFetch extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
    
    // Install fetch polyfills on the global environment
    // This happens after jsdom is created, so self/window exist
    this.global.Headers = nodeFetch.Headers;
    this.global.Request = nodeFetch.Request;
    this.global.Response = nodeFetch.Response;
    this.global.FormData = nodeFetch.FormData;
    this.global.fetch = nodeFetch.default;
    this.global.AbortController = AbortController;
    
    // Also set on self and window (which ky checks first)
    if (this.global.self) {
      this.global.self.Headers = nodeFetch.Headers;
      this.global.self.Request = nodeFetch.Request;
      this.global.self.Response = nodeFetch.Response;
      this.global.self.FormData = nodeFetch.FormData;
      this.global.self.fetch = nodeFetch.default;
      this.global.self.AbortController = AbortController;
    }
    
    if (this.global.window) {
      this.global.window.Headers = nodeFetch.Headers;
      this.global.window.Request = nodeFetch.Request;
      this.global.window.Response = nodeFetch.Response;
      this.global.window.FormData = nodeFetch.FormData;
      this.global.window.fetch = nodeFetch.default;
      this.global.window.AbortController = AbortController;
    }
    
    // Polyfill TextEncoder/TextDecoder if needed
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = util.TextEncoder;
      this.global.TextDecoder = util.TextDecoder;
    }
  }
}

module.exports = JSDOMEnvironmentWithFetch;
