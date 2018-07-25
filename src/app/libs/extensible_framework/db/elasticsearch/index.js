"use strict";
/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const elasticsearch = require("elasticsearch");
const util_1 = require("../../util");
const logger_1 = require("../../logger");
class ElasticSearchDB {
    initialize(config) {
        this._config = config;
    }
    getConnection(pluginId) {
        let connection = new elasticsearch.Client(JSON.parse(JSON.stringify(this._config)));
        connection._pluginId = pluginId;
        return this.proxyMethod(connection, this._config.disabledApis);
    }
    proxyMethod(obj, disabledAPIs) {
        let handler = {
            get(target, propKey, receiver) {
                const originalMethod = target[propKey];
                if (disabledAPIs.indexOf(propKey) !== -1) {
                    logger_1.logger.error(`Elasticsearch: ${propKey}: this api is disabled!`);
                    return Object.create({});
                }
                if (typeof target[propKey] === 'object' && target[propKey] !== null) {
                    return new Proxy(target[propKey], handler);
                }
                return function () {
                    const params = arguments[0];
                    // append the index with prefix (pluginId)
                    if (typeof params === "object") {
                        if (params.index)
                            params.index = util_1.Util.generateId(obj._pluginId, params.index);
                    }
                    if (typeof originalMethod === "function") {
                        return originalMethod.apply(target, arguments);
                    }
                    else {
                        return Object.create({});
                    }
                };
            }
        };
        return new Proxy(obj, handler);
    }
}
exports.ElasticSearchDB = ElasticSearchDB;
;
