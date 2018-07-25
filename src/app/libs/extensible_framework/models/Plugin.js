"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../api");
const _ = require("lodash");
;
class BaseServer {
    constructor(manifest) {
        this.manifest = _.cloneDeep(manifest);
        this.cassandra = api_1.frameworkAPI.getCassandraInstance(this.manifest.id);
        this.elasticsearch = api_1.frameworkAPI.getElasticsearchInstance(this.manifest.id);
    }
}
exports.BaseServer = BaseServer;
