'use strict'
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d
  if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function') r = Reflect.decorate(decorators, target, key, desc)
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
  return c > 3 && r && Object.defineProperty(target, key, r), r
}
var __metadata = (this && this.__metadata) || function (k, v) {
  if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v)
}
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator['throw'](value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value) }).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
const db_1 = require('./db')
const RouterRegistry_1 = require('./managers/RouterRegistry')
const config_1 = require('./config')
const PluginManager_1 = require('./managers/PluginManager')
const RegistrySchema_1 = require('./meta/RegistrySchema')
const logger_1 = require('./logger')
const util_1 = require('./util')
const typescript_ioc_1 = require('typescript-ioc')
const ESSchemaLoader_1 = require('./db/elasticsearch/ESSchemaLoader')
const CassandraSchemaLoader_1 = require('./db/cassandra/CassandraSchemaLoader')
let Framework = class Framework {
  constructor () {
    this.initialized = false
  }
  get config () {
    return Object.assign({}, this._config)
  }
  initialize (config, app) {
    return __awaiter(this, void 0, void 0, function * () {
      try {
        if (!this.initialized) {
          config = Object.freeze(Object.assign({}, config_1.defaultConfig, config))
          this._config = config
                    // configure logger
          if (config.logLevel) { logger_1.enableLogger(config.logLevel) }
          this.schemaLoader.registerLoader(new ESSchemaLoader_1.ESSchemaLoader(config.db.elasticsearch))
          this.schemaLoader.registerLoader(new CassandraSchemaLoader_1.CassandraSchemaLoader(config.db.cassandra))
          this.pluginManager.initialize(config)
          this.routerRegistry.initialize(app)
          yield this.loadPluginRegistrySchema()
          this.initialized = true
          logger_1.logger.info('Framework is initialized!')
          yield this.pluginManager.load(this.config)
          logger_1.logger.info('All plugins are loaded!')
        }
      } catch (error) {
        logger_1.logger.fatal('framework initialization FAILED due to following errors!', new util_1.FrameworkError({ code: util_1.FrameworkErrors.UNKNOWN_ERROR, message: 'error while initializing the framework', rootError: error }))
        logger_1.logger.fatal('EXITING OUT OF PROCESS DUE TO ERROR!')
                // process.exit(1);
      }
    })
  }
  loadPluginRegistrySchema () {
    return __awaiter(this, void 0, void 0, function * () {
      try {
        let schemaLoader = this.schemaLoader.getLoader(RegistrySchema_1.RegistrySchema.type)
        yield schemaLoader.create(RegistrySchema_1.RegistrySchema.keyspace_prefix, RegistrySchema_1.RegistrySchema)
        logger_1.logger.info('loading registry schema')
      } catch (error) {
        logger_1.logger.fatal('failed to load registry schema', error)
        throw error
      }
    })
  }
}
__decorate([
  typescript_ioc_1.Inject,
  __metadata('design:type', RouterRegistry_1.RouterRegistry)
], Framework.prototype, 'routerRegistry', void 0)
__decorate([
  typescript_ioc_1.Inject,
  __metadata('design:type', PluginManager_1.PluginManager)
], Framework.prototype, 'pluginManager', void 0)
__decorate([
  typescript_ioc_1.Inject,
  __metadata('design:type', db_1.SchemaLoader)
], Framework.prototype, 'schemaLoader', void 0)
Framework = __decorate([
  typescript_ioc_1.Singleton
], Framework)
exports.Framework = Framework
