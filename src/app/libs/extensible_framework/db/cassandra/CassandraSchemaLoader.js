"use strict";
/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
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
const index_1 = require("./index");
const util_1 = require("../../util");
const schemaService_1 = require("./schemaService");
const util = require("util");
const CassandraMetaDataProvider_1 = require("../../meta/CassandraMetaDataProvider");
const logger_1 = require("../../logger");
const typescript_ioc_1 = require("typescript-ioc");
let CassandraSchemaLoader = class CassandraSchemaLoader {
    constructor(config) {
        this._config = config;
        this.cassandraDB.initialize(config);
    }
    getType() {
        return 'cassandra';
    }
    exists(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: complete implementation
        });
    }
    alter(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: complete implementation
        });
    }
    migrate(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: complete implementation
        });
    }
    create(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.info('loading schema for plugin: ', pluginId);
            this.validateSchema(schema);
            const keyspaceName = util_1.Util.generateId(pluginId, schema.keyspace_name);
            this.schemaService.setSchema(pluginId, Object.assign({}, schema, { keyspace_name: keyspaceName }));
            if (!schema.private)
                yield this.metaDataProvider.updateMeta(pluginId, { cassandra_keyspace: keyspaceName });
            this.dbConnection = yield this.cassandraDB.getConnectionByKeyspace(keyspaceName, schema.config);
            for (const table of schema.column_families) {
                const model = this.dbConnection.loadSchema(table.table_name, table);
                const syncDBAsync = util.promisify(model.syncDB.bind(model));
                yield syncDBAsync()
                    .then((result) => {
                    if (result) {
                        logger_1.logger.info(`cassandra schema updated successfully for "${pluginId}"`);
                    }
                    else {
                        logger_1.logger.info(`no Cassandra schema change detected for plugin "${pluginId}"!`);
                    }
                })
                    .catch((err) => {
                    if (err)
                        throw new util_1.FrameworkError({ message: `"${pluginId}" : unable to sync database model with cassandra`, code: util_1.FrameworkErrors.DB_ERROR });
                });
            }
            ;
        });
    }
    validateSchema(schema) {
        if (!schema.column_families || !Array.isArray(schema.column_families)) {
            throw new util_1.FrameworkError({ message: 'invalid cassandra schema! "column_families" not defined!', code: util_1.FrameworkErrors.DB_ERROR });
        }
        if (!schema.keyspace_name) {
            throw new util_1.FrameworkError({ message: 'invalid cassandra schema! "keyspace_name" not defined!', code: util_1.FrameworkErrors.DB_ERROR });
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", CassandraMetaDataProvider_1.CassandraMetaDataProvider)
], CassandraSchemaLoader.prototype, "metaDataProvider", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", schemaService_1.SchemaService)
], CassandraSchemaLoader.prototype, "schemaService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.CassandraDB)
], CassandraSchemaLoader.prototype, "cassandraDB", void 0);
CassandraSchemaLoader = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [Object])
], CassandraSchemaLoader);
exports.CassandraSchemaLoader = CassandraSchemaLoader;
