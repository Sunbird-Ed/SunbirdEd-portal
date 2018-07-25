"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const index_1 = require("../index");
const typescript_ioc_1 = require("typescript-ioc");
__export(require("../interfaces"));
let FrameworkAPI = class FrameworkAPI {
    bootstrap(config, app) {
        return __awaiter(this, void 0, void 0, function* () {
            this.config = Object.assign({}, config);
            this.elasticSearchDB.initialize(this.config.db.elasticsearch);
            this.cassandraDB.initialize(this.config.db.cassandra);
            yield this.framework.initialize(config, app);
        });
    }
    getCassandraInstance(pluginId) {
        return this.cassandraDB.getConnectionByPlugin(pluginId);
    }
    getElasticsearchInstance(pluginId) {
        return this.elasticSearchDB.getConnection(pluginId);
    }
    threadLocal() {
        return this.framework.routerRegistry.getThreadNamespace();
    }
    getPluginInstance(id) {
        return this.framework.pluginManager.getPluginInstance(id);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.Framework)
], FrameworkAPI.prototype, "framework", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", db_1.CassandraDB)
], FrameworkAPI.prototype, "cassandraDB", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", db_1.ElasticSearchDB)
], FrameworkAPI.prototype, "elasticSearchDB", void 0);
FrameworkAPI = __decorate([
    typescript_ioc_1.Singleton
], FrameworkAPI);
exports.FrameworkAPI = FrameworkAPI;
exports.frameworkAPI = new FrameworkAPI();
