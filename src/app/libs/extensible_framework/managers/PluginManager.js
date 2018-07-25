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
const PluginLoader_1 = require("./PluginLoader");
const util_1 = require("../util");
const logger_1 = require("../logger");
const typescript_ioc_1 = require("typescript-ioc");
const _ = require("lodash");
let PluginManager = class PluginManager {
    initialize(config) {
        this._config = _.cloneDeep(config);
        this.pluginLoader.initialize(config);
    }
    load(config) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let plugin of config.plugins) {
                logger_1.logger.info(`--------loding-plugin-${plugin.id}-------`);
                yield this.loadPlugin(plugin).then(_ => {
                    logger_1.logger.info(`--------load-complete-${plugin.id}-------`);
                });
            }
        });
    }
    getPluginInstance(pluginId) {
        return this.pluginLoader.getPluginInstance(pluginId);
    }
    loadPlugin(plugin) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.pluginLoader.loadPlugin(plugin);
            }
            catch (e) {
                (e instanceof util_1.FrameworkError) && logger_1.logger.fatal(`plugin "${plugin.id}" load failed due to ` + e.stack);
                throw e;
            }
        });
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", PluginLoader_1.PluginLoader)
], PluginManager.prototype, "pluginLoader", void 0);
PluginManager = __decorate([
    typescript_ioc_1.Singleton
], PluginManager);
exports.PluginManager = PluginManager;
