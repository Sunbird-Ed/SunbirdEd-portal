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
const ExpressCassandra = require("express-cassandra");
const schemaService_1 = require("./schemaService");
const typescript_ioc_1 = require("typescript-ioc");
class CassandraDB {
    initialize(config) {
        this._config = config;
    }
    getConnectionByKeyspace(keyspace, defaultSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = this.getConnection(keyspace, defaultSettings);
            yield connection.initAsync();
            const schema = this.schemaService.getSchemaBykeyspace(keyspace);
            if (schema) {
                schema.column_families.forEach(table => connection.loadSchema(table.table_name, table));
            }
            return connection;
        });
    }
    getConnectionByPlugin(pluginId) {
        let connection;
        const schema = this.schemaService.getSchemaByPlugin(pluginId);
        if (schema) {
            connection = this.getConnection(schema.keyspace_name, schema.config);
            schema.column_families.forEach(table => connection.loadSchema(table.table_name, table));
        }
        return connection;
    }
    getConnection(keyspace, defaultSettings) {
        const config = {
            clientOptions: {
                contactPoints: this._config.contactPoints,
                protocolOptions: { port: this._config.port || 9042 },
                keyspace: keyspace || this._config.keyspace,
            }, ormOptions: {
                defaultReplicationStrategy: defaultSettings && defaultSettings.replication || {
                    class: 'SimpleStrategy',
                    replication_factor: 1
                }
            }
        };
        return ExpressCassandra.createClient(config);
    }
}
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", schemaService_1.SchemaService)
], CassandraDB.prototype, "schemaService", void 0);
exports.CassandraDB = CassandraDB;
