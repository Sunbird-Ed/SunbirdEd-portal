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
const index_1 = require("./index");
const util_1 = require("../../util");
const _ = require("lodash");
const logger_1 = require("../../logger");
const typescript_ioc_1 = require("typescript-ioc");
const CassandraMetaDataProvider_1 = require("../../meta/CassandraMetaDataProvider");
let ESSchemaLoader = class ESSchemaLoader {
    constructor(config) {
        this._config = config;
        this.elasticSearchDB.initialize(config);
    }
    alter(pluginId, schemaData) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: complete implementation
        });
    }
    migrate(pluginId, schemaData) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: complete implementation
        });
    }
    getType() {
        return 'elasticsearch';
    }
    exists(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const index of schema.indexes) {
                yield this.isIndexDefined(index);
            }
        });
    }
    create(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dbConnection = this.elasticSearchDB.getConnection(pluginId);
            this.validateSchema(schema);
            yield this.createSchema(pluginId, schema).then(() => {
                logger_1.logger.info(`mappings successfully created for plugin "${pluginId}" `);
            });
        });
    }
    validateSchema(schema) {
        if (!schema.indexes || !Array.isArray(schema.indexes)) {
            throw new util_1.FrameworkError({ message: `invalid schema, "indexes" is not defined`, code: util_1.FrameworkErrors.DB_ERROR });
        }
        for (const index of schema.indexes) {
            if (!index.mappings || typeof index.mappings !== "object") {
                throw new util_1.FrameworkError({ message: `invalid schema, "mappings" should be of type Object!`, code: util_1.FrameworkErrors.DB_ERROR });
            }
            if (!index.name) {
                throw new util_1.FrameworkError({ message: `invalid schema, "name" should be defined for index!`, code: util_1.FrameworkErrors.DB_ERROR });
            }
        }
    }
    createIndex(index, body) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dbConnection.indices.create({ index, body });
        });
    }
    generateESIndexAlias(id) {
        return util_1.Util.hash(id);
    }
    isIndexDefined(index) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDefined = this.dbConnection.indices.exists({ index });
            return isDefined;
        });
    }
    createSchema(pluginId, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!schema || !schema.indexes)
                return;
            for (const indexMapping of schema.indexes) {
                let indexName = util_1.Util.generateId(pluginId, indexMapping.name);
                let indexDefined = yield this.isIndexDefined(indexMapping.name);
                if (!indexDefined) {
                    yield this.createIndex(indexMapping.name, _.omit(indexMapping, ['name']));
                    logger_1.logger.info(`Index "${indexName}" has been created in Elasticsearch for ${pluginId}`);
                    const alias = this.generateESIndexAlias(pluginId + indexName);
                    yield this.createIndexAlias(indexMapping.name, alias);
                    yield this.metaDataProvider.updateMeta(pluginId, { elasticsearch_index: { '$add': { [indexName]: alias } } });
                    logger_1.logger.info(`creating mappings for index "${indexName}"`);
                }
                else {
                    logger_1.logger.info(`index "${indexName}" already defined! for "${pluginId}"`);
                }
            }
        });
    }
    createIndexAlias(index, alias) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dbConnection.indices.putAlias({ index, name: alias }).then(() => {
                logger_1.logger.debug(`=====> Alias created for index: "${index}", alias: "${alias}"`);
            });
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", CassandraMetaDataProvider_1.CassandraMetaDataProvider)
], ESSchemaLoader.prototype, "metaDataProvider", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", index_1.ElasticSearchDB)
], ESSchemaLoader.prototype, "elasticSearchDB", void 0);
ESSchemaLoader = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [Object])
], ESSchemaLoader);
exports.ESSchemaLoader = ESSchemaLoader;
