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
const Manifest_1 = require("../models/Manifest");
const util_1 = require("../util");
const PluginRegistry_1 = require("./PluginRegistry");
const RouterRegistry_1 = require("./RouterRegistry");
const _ = require("lodash");
const db_1 = require("../db");
const glob = require("glob");
const logger_1 = require("../logger");
const typescript_ioc_1 = require("typescript-ioc");
let PluginLoader = class PluginLoader {
    constructor() {
        this.pluginsLoaded = [];
        this.pluginInstances = {};
    }
    initialize(config) {
        this.config = _.cloneDeep(config);
        this.pluginRegistry.initialize({ metaProviderConfig: config.db.cassandra });
    }
    loadDBSchema(manifest, path) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const schemaFilePath of glob.sync(path, {})) {
                const schema = yield Promise.resolve().then(() => require(schemaFilePath)).catch((error) => {
                    throw new util_1.FrameworkError({ message: `invalid schema file path for plugin ${manifest.id}`, code: util_1.FrameworkErrors.INVALID_SCHEMA_PATH, rootError: error });
                });
                const schemaLoader = this.schemaLoader.getLoader(schema.type);
                yield schemaLoader.create(manifest.id, schema)
                    .catch((error) => {
                    throw new util_1.FrameworkError({ message: `Error while loading DB schema for plugin ${manifest.id}`, code: util_1.FrameworkErrors.SCHEMA_LOADER_FAILED, rootError: error });
                });
            }
        });
    }
    getPluginManifest(pluginId) {
        return;
    }
    getPluginInstance(pluginId) {
        return this.pluginInstances[pluginId];
    }
    loadDependencies(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const dependency of manifest.server.dependencies) {
                if (this.pluginsLoaded.indexOf(dependency.id) === -1) {
                    yield this.loadPlugin(dependency)
                        .then(() => {
                        logger_1.logger.info(`"${manifest.id}" plugin loaded`);
                    })
                        .catch((error) => {
                        this.unregister(manifest.id);
                        logger_1.logger.error(`unable to load dependent plugin! "${manifest.id}"`, error);
                        throw new util_1.FrameworkError({ message: 'unable to load dependent plugin!', code: util_1.FrameworkErrors.PLUGIN_LOAD_FAILED, rootError: error });
                    });
                }
            }
        });
    }
    /**
     * Steps:
     *  1) Put a placeholder to indicate that this plugin is triggered for load so the cyclic dependencies don't kill the process
     *  2) Load manifest
     *  3) Load dependencies first
     *  4) Register the plugin
     *  5) Prepare the plugin - create/alter schema, run migration
     *  6) Instantiate the plugin
     *  7) Register the routes
     *
     * @param plugin IPlugin
     */
    loadPlugin(plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isPluginLoaded(plugin.id))
                return;
            this.register(plugin.id); // Step 1
            const manifest = yield this.getManifest(plugin); // Step 2
            if (!_.isEmpty(manifest.server.dependencies))
                yield this.loadDependencies(manifest); // step 3
            yield this.pluginRegistry.register(manifest).catch((error) => {
                this.unregister(plugin.id);
                logger_1.logger.error(`unable to register plugin! "${manifest.id}"`, error);
                throw new util_1.FrameworkError({ message: 'unable to register plugin!', code: util_1.FrameworkErrors.PLUGIN_REGISTER_FAILED, rootError: error });
            }); // Step 4
            yield this.buildPlugin(manifest)
                .catch((error) => {
                this.unregister(plugin.id);
                logger_1.logger.error(`unable to load plugin! "${manifest.id}"`, error);
                throw new util_1.FrameworkError({ message: 'unable to load plugin!', code: util_1.FrameworkErrors.PLUGIN_LOAD_FAILED, rootError: error });
            });
        });
    }
    buildPlugin(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.preparePlugin(manifest), // Step 5
                    yield this.instantiatePlugin(manifest), // Step 6
                    yield this.registerRoutes(manifest); // Step 7
            }
            catch (error) {
                logger_1.logger.error(`failed to build plugin! "${manifest.id}"`, error);
                throw new util_1.FrameworkError({ message: 'plugin build failed!', code: util_1.FrameworkErrors.PLUGIN_BUILD_FAILED, rootError: error });
            }
            ;
        });
    }
    isPluginLoaded(pluginId) {
        if (this.pluginsLoaded.indexOf(pluginId) === -1)
            return false;
        return true;
    }
    register(pluginId) {
        this.pluginsLoaded.push(pluginId);
    }
    unregister(pluginId) {
        _.remove(this.pluginsLoaded, loadedPluginId => loadedPluginId === pluginId);
    }
    getManifest(plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Look for multiple paths
            const pluginId = plugin.id;
            const pluginManifest = yield Promise.resolve().then(() => require(this.config.pluginBasePath + pluginId + '/manifest')).catch((error) => {
                throw new util_1.FrameworkError({ message: `manifest not found for the plugin ${plugin.id}`, code: util_1.FrameworkErrors.MANIFEST_NOT_FOUND, rootError: error });
            });
            return Manifest_1.Manifest.fromJSON(pluginManifest.manifest);
        });
    }
    preparePlugin(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            // PluginRegistry checks if database schema is created for the plugin
            // if migration, do migration
            // if not, db schema for the plugin should be created
            const schemaPath = this.config.pluginBasePath + manifest.id + '/db/**/schema*.json';
            yield this.loadDBSchema(manifest, schemaPath).catch((error) => {
                logger_1.logger.error(`error while loading database schema models! "${manifest.id}"`, error);
            });
        });
    }
    instantiatePlugin(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pluginFile = yield Promise.resolve().then(() => require(this.config.pluginBasePath + manifest.id + '/server')).catch((error) => {
                    logger_1.logger.error('Entry file not found for the plugin ${manifest.id}', error);
                    throw new util_1.FrameworkError({ message: `Entry file not found for the plugin ${manifest.id}`, code: util_1.FrameworkErrors.ENTRY_FILE_NOT_FOUND, rootError: error });
                });
                const pluginClass = pluginFile.Server;
                this.pluginInstances[manifest.id] = new pluginClass(manifest);
            }
            catch (err) {
                logger_1.logger.error('error when instantiate plugin', err);
                throw new util_1.FrameworkError({ code: util_1.FrameworkErrors.PLUGIN_INSTANCE_FAILED, rootError: err });
            }
        });
    }
    registerRoutes(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const router = this.routerRegistry.bindRouter(manifest);
                let pluginRouter = yield Promise.resolve().then(() => require(this.config.pluginBasePath + manifest.id + '/routes')).catch((error) => {
                    throw new util_1.FrameworkError({ message: `Router file not found for the plugin ${manifest.id}`, code: util_1.FrameworkErrors.ROUTER_FILE_NOT_FOUND, rootError: error });
                });
                pluginRouter = pluginRouter.Router;
                const routerInstance = new pluginRouter();
                routerInstance.init(router, manifest);
            }
            catch (err) {
                logger_1.logger.error(`error while registering routes "${manifest.id}"`, err);
                throw new util_1.FrameworkError({ code: util_1.FrameworkErrors.PLUGIN_ROUTE_INIT_FAILED, rootError: err });
            }
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", PluginRegistry_1.PluginRegistry)
], PluginLoader.prototype, "pluginRegistry", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", RouterRegistry_1.RouterRegistry)
], PluginLoader.prototype, "routerRegistry", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", db_1.SchemaLoader)
], PluginLoader.prototype, "schemaLoader", void 0);
PluginLoader = __decorate([
    typescript_ioc_1.Singleton
], PluginLoader);
exports.PluginLoader = PluginLoader;
