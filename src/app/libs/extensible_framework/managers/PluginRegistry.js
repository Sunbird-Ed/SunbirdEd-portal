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
const interfaces_1 = require("../interfaces");
const logger_1 = require("../logger");
const typescript_ioc_1 = require("typescript-ioc");
const CassandraMetaDataProvider_1 = require("../meta/CassandraMetaDataProvider");
/**
 *
 *
 * @export
 * @class PluginRegistry
 */
let PluginRegistry = class PluginRegistry {
    initialize(config) {
        this.config = Object.assign({}, config);
        this.metaDataProvider.initialize(config.metaProviderConfig);
    }
    /**
     *
     *
     * @static
     * @param {Manifest} manifest
     * @returns {Promise<void>}
     * @memberof PluginRegistry
     */
    register(manifest) {
        return __awaiter(this, void 0, void 0, function* () {
            let isRegistered = yield this.isRegistered(manifest.id);
            if (!isRegistered) {
                let metaObject = { id: manifest.id, name: manifest.name || '', version: manifest.version || '', repo: 'local', registered_on: new Date(), status: interfaces_1.PluginStatusEnum.registered, manifest: JSON.stringify(manifest.toJSON()) };
                yield this.metaDataProvider.createMeta(metaObject);
                logger_1.logger.info(`Plugin "${manifest.id}" is registered!`);
            }
            else {
                logger_1.logger.info(`Plugin "${manifest.id}" is already registered!`);
            }
            return true;
        });
    }
    /**
     *
     *
     * @static
     * @param {string} id
     * @returns
     * @memberof PluginRegistry
     */
    unregister(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateStatus(id, interfaces_1.PluginStatusEnum.unregistered);
        });
    }
    /**
     *
     *
     * @static
     * @param {string} id
     * @returns {Promise<boolean>}
     * @memberof PluginRegistry
     */
    isRegistered(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.metaDataProvider.getMeta(id);
            if (result) {
                let plugin = result.rows.find((row) => row.id === id);
                return plugin && plugin.status && plugin.status === interfaces_1.PluginStatusEnum.registered;
            }
        });
    }
    /**
     *
     *
     * @static
     * @param {string} id
     * @returns {Promise<PluginStatusEnum | undefined>}
     * @memberof PluginRegistry
     */
    getStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.metaDataProvider.getMeta(id);
            if (result) {
                let plugin = result.rows.find((row) => row.id === id);
                return plugin && plugin.status && interfaces_1.PluginStatusEnum[interfaces_1.PluginStatusEnum[plugin.status]];
            }
        });
    }
    /**
     *
     *
     * @static
     * @param {string} id
     * @param {PluginStatusEnum} status
     * @returns
     * @memberof PluginRegistry
     */
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.metaDataProvider.updateMeta(id, { status });
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", CassandraMetaDataProvider_1.CassandraMetaDataProvider)
], PluginRegistry.prototype, "metaDataProvider", void 0);
PluginRegistry = __decorate([
    typescript_ioc_1.Singleton
], PluginRegistry);
exports.PluginRegistry = PluginRegistry;
