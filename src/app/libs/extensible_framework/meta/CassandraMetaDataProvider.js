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
Object.defineProperty(exports, "__esModule", { value: true });
const cassandra_1 = require("../db/cassandra");
const util_1 = require("../util");
const RegistrySchema_1 = require("./RegistrySchema");
const logger_1 = require("../logger");
const typescript_ioc_1 = require("typescript-ioc");
let CassandraMetaDataProvider = class CassandraMetaDataProvider {
    initialize(config) {
        config = Object.assign({}, config, { keyspace: util_1.Util.generateId(RegistrySchema_1.RegistrySchema.keyspace_prefix, RegistrySchema_1.RegistrySchema.keyspace_name) });
        this.cassandraDB.initialize(config);
    }
    getMeta(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.getConnection();
            yield model.instance.plugin_registry.findAsync({ id })
                .catch(error => {
                logger_1.logger.error('error when getting meta data', error);
            });
        });
    }
    updateMeta(id, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.getConnection();
            yield model.instance.plugin_registry.updateAsync({ id }, Object.assign({}, meta))
                .catch(error => {
                logger_1.logger.error('error when updating meta data', error);
            });
        });
    }
    createMeta(meta) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.getConnection();
            const record = new model.instance.plugin_registry(Object.assign({}, meta));
            yield record.saveAsync()
                .catch(error => {
                logger_1.logger.error('error when creating meta data', error);
            });
        });
    }
    deleteMeta(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = yield this.getConnection();
            yield model.instance.plugin_registry.deleteAsync({ id: id })
                .catch(error => {
                logger_1.logger.error('error when deleting meta data', error);
            });
        });
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection)
                return this.connection;
            this.connection = yield this.cassandraDB.getConnectionByKeyspace(util_1.Util.generateId(RegistrySchema_1.RegistrySchema.keyspace_prefix, RegistrySchema_1.RegistrySchema.keyspace_name));
            return this.connection;
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", cassandra_1.CassandraDB)
], CassandraMetaDataProvider.prototype, "cassandraDB", void 0);
CassandraMetaDataProvider = __decorate([
    typescript_ioc_1.Singleton
], CassandraMetaDataProvider);
exports.CassandraMetaDataProvider = CassandraMetaDataProvider;
