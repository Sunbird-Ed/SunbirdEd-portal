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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const _ = require("lodash");
const util_1 = require("../util");
const cls = require("continuation-local-storage");
const typescript_ioc_1 = require("typescript-ioc");
let RouterRegistry = class RouterRegistry {
    constructor() {
        this.routerInstances = [];
    }
    initialize(app) {
        this.rootApp = app;
        this.threadLocalNamespace = cls.createNamespace('com.sunbird');
    }
    /**
     *
     *
     * @param {Manifest} manifest
     * @returns {Router}
     * @memberof RouterRegistry
     */
    bindRouter(manifest) {
        const router = express_1.Router();
        const prefix = _.get(manifest, 'server.routes.prefix');
        if (!prefix)
            throw new util_1.FrameworkError({ message: `cannot bind "Router" object to App`, code: util_1.FrameworkErrors.ROUTE_REGISTRY_FAILED });
        router.use(this.threadLocal(this.getThreadNamespace()));
        this.routerInstances.push({ [manifest.id]: router });
        this.rootApp.use(prefix, router);
        return router;
    }
    getThreadNamespace() {
        return this.threadLocalNamespace;
    }
    threadLocal(namespace) {
        return (req, res, next) => {
            namespace.bindEmitter(req);
            namespace.bindEmitter(res);
            namespace.run(() => {
                namespace.set('requestId', util_1.Util.UUID());
                namespace.set('headers', _.clone(req.headers));
                next();
            });
        };
    }
};
RouterRegistry = __decorate([
    typescript_ioc_1.Singleton
], RouterRegistry);
exports.RouterRegistry = RouterRegistry;
