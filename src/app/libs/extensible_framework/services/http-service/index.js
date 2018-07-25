"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fromPromise_1 = require("rxjs/internal/observable/fromPromise");
/**
 *
 *
 * @export
 * @class HTTPService
 */
class HTTPService {
    /**
     *
     *
     * @param {string} url
     * @param {IHttpRequestConfig} config
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static get(url, config) {
        return fromPromise_1.fromPromise(axios_1.default.get(url, config));
    }
    /**
     *
     *
     * @param {string} url
     * @param {IHttpRequestConfig} [config]
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static delete(url, config) {
        return fromPromise_1.fromPromise(axios_1.default.delete(url, config));
    }
    /**
     *
     *
     * @param {string} url
     * @param {IHttpRequestConfig} [config]
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static head(url, config) {
        return fromPromise_1.fromPromise(axios_1.default.head(url, config));
    }
    /**
     *
     *
     * @param {string} url
     * @param {*} [data]
     * @param {IHttpRequestConfig} [config]
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static post(url, data, config) {
        return fromPromise_1.fromPromise(axios_1.default.post(url, data, config));
    }
    /**
     *
     *
     * @param {string} url
     * @param {*} [data]
     * @param {IHttpRequestConfig} [config]
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static put(url, data, config) {
        return fromPromise_1.fromPromise(axios_1.default.put(url, data, config));
    }
    /**
     *
     *
     * @param {string} url
     * @param {*} [data]
     * @param {IHttpRequestConfig} [config]
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static patch(url, data, config) {
        return fromPromise_1.fromPromise(axios_1.default.patch(url, data, config));
    }
    /**
     *
     *
     * @param {IHttpRequestConfig} config
     * @returns {Observable<IHttpResponse>}
     * @memberof HTTPService
     */
    static request(config) {
        return fromPromise_1.fromPromise(axios_1.default.request(config));
    }
}
exports.HTTPService = HTTPService;
