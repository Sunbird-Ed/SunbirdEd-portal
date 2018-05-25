(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('tslib'), require('@angular/core'), require('rxjs'), require('@angular/platform-browser')) :
    typeof define === 'function' && define.amd ? define('sunbird-web-extension', ['exports', 'tslib', '@angular/core', 'rxjs', '@angular/platform-browser'], factory) :
    (factory((global['sunbird-web-extension'] = {}),global.tslib,global.ng.core,null,global.ng.platformBrowser));
}(this, (function (exports,tslib_1,core,rxjs,platformBrowser) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var /** @type {?} */ PluginConfig = function (config) {
        return function (type) {
            type._pluginConfig = config;
        };
    };
    var PluginPlacement = (function () {
        function PluginPlacement(options) {
            this.name = options.name;
            this.priority = options.priority;
            this.component = options.component;
        }
        return PluginPlacement;
    }());
    var PluginData = (function () {
        function PluginData(plugin, placement) {
            this.plugin = plugin;
            this.placement = placement;
        }
        return PluginData;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var PluginService = (function () {
        function PluginService() {
            this.plugins = [];
            this.change = new rxjs.ReplaySubject(1);
        }
        /**
         * @param {?} config
         * @return {?}
         */
        PluginService.prototype.loadPlugins = /**
         * @param {?} config
         * @return {?}
         */
            function (config) {
                if (!config || !Array.isArray(config.plugins)) {
                    throw new Error('invalid framework configuration! Failed to load plugins!');
                }
                var /** @type {?} */ plugins = config.plugins.map(function (data) { return data.main; });
                try {
                    for (var plugins_1 = tslib_1.__values(plugins), plugins_1_1 = plugins_1.next(); !plugins_1_1.done; plugins_1_1 = plugins_1.next()) {
                        var plugin = plugins_1_1.value;
                        this.loadPlugin(plugin);
                    }
                }
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (plugins_1_1 && !plugins_1_1.done && (_a = plugins_1.return))
                            _a.call(plugins_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
                }
                var e_1, _a;
            };
        /**
         * @param {?} plugin
         * @return {?}
         */
        PluginService.prototype.loadPlugin = /**
         * @param {?} plugin
         * @return {?}
         */
            function (plugin) {
                var /** @type {?} */ Plugin = (plugin);
                var /** @type {?} */ pluginData = {
                    type: Plugin,
                    config: Plugin._pluginConfig,
                    instance: new Plugin()
                };
                this.plugins = this.plugins.concat([pluginData]);
                this.change.next(this.plugins);
            };
        /**
         * @param {?} name
         * @return {?}
         */
        PluginService.prototype.removePlugin = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                var /** @type {?} */ plugin = this.plugins.find(function (pluginObj) { return pluginObj.name === name; });
                if (plugin) {
                    var /** @type {?} */ plugins = this.plugins.slice();
                    plugins.splice(plugins.indexOf(plugin), 1);
                    this.plugins = plugins;
                    this.change.next(this.plugins);
                }
            };
        /**
         * @param {?} name
         * @return {?}
         */
        PluginService.prototype.getPluginData = /**
         * @param {?} name
         * @return {?}
         */
            function (name) {
                return this.plugins.reduce(function (components, pluginData) {
                    return components.concat(pluginData.config.placements
                        .filter(function (placement) { return placement.name === name; })
                        .map(function (placement) { return new PluginData(pluginData, placement); }));
                }, []);
            };
        PluginService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        PluginService.ctorParameters = function () { return []; };
        return PluginService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var ExtensionPointDirective = (function () {
        function ExtensionPointDirective(viewContainerRef, componentResolver, pluginService) {
            var _this = this;
            this.override = false;
            this.output = new core.EventEmitter();
            this.componentRefs = [];
            this.viewContainerRef = viewContainerRef;
            this.componentResolver = componentResolver;
            this.pluginService = pluginService;
            this.pluginChangeSubscription = this.pluginService.change.subscribe(function (x) { return _this.initialize(); });
        }
        /**
         * @return {?}
         */
        ExtensionPointDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.initialize();
            };
        /**
         * @return {?}
         */
        ExtensionPointDirective.prototype.initialize = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (!this.name) {
                    return;
                }
                var /** @type {?} */ pluginData = this.pluginService.getPluginData(this.name);
                if (this.override) {
                    pluginData.sort(function (a, b) { return a.placement.priority > b.placement.priority ? 1 : a.placement.priority < b.placement.priority ? -1 : 0; });
                    return this.instantiatePluginComponent(pluginData.shift());
                }
                else {
                    pluginData.sort(function (a, b) { return a.placement.priority > b.placement.priority ? 1 : a.placement.priority < b.placement.priority ? -1 : 0; });
                    return Promise.all(pluginData.map(function (plugin) { return _this.instantiatePluginComponent(plugin); }));
                }
            };
        /**
         * @param {?} pluginData
         * @return {?}
         */
        ExtensionPointDirective.prototype.instantiatePluginComponent = /**
         * @param {?} pluginData
         * @return {?}
         */
            function (pluginData) {
                var _this = this;
                if (!pluginData) {
                    return;
                }
                var /** @type {?} */ componentFactory = this.componentResolver.resolveComponentFactory(pluginData.placement.component);
                var /** @type {?} */ contextInjector = this.viewContainerRef.parentInjector;
                var /** @type {?} */ providers = [{ provide: PluginData, useValue: pluginData }];
                var /** @type {?} */ childInjector = core.ReflectiveInjector.resolveAndCreate(providers, contextInjector);
                var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
                componentRef.instance.input = this.input;
                componentRef.instance.output = componentRef.instance.output || new core.EventEmitter();
                componentRef.instance.output.subscribe(function (childComponentEvent) { return _this.output.emit(childComponentEvent); });
                this.componentRefs.push(componentRef);
                componentRef.changeDetectorRef.markForCheck();
                componentRef.changeDetectorRef.detectChanges();
                return componentRef;
            };
        /**
         * @return {?}
         */
        ExtensionPointDirective.prototype.ngOnChanges = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (this.componentRefs.length) {
                    this.componentRefs.forEach(function (componentRef) {
                        componentRef.instance.input = _this.input;
                        return componentRef.instance.ngOnChanges ? componentRef.instance.ngOnChanges() : undefined;
                    });
                }
            };
        /**
         * @return {?}
         */
        ExtensionPointDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                if (this.componentRefs.length) {
                    this.componentRefs.forEach(function (componentRef) { return componentRef.destroy(); });
                    this.componentRefs = [];
                }
                this.pluginChangeSubscription.unsubscribe();
            };
        ExtensionPointDirective.decorators = [
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: 'extension-point'
                    },] },
        ];
        /** @nocollapse */
        ExtensionPointDirective.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: core.Inject, args: [core.ViewContainerRef,] }] },
                { type: undefined, decorators: [{ type: core.Inject, args: [core.ComponentFactoryResolver,] }] },
                { type: undefined, decorators: [{ type: core.Inject, args: [PluginService,] }] }
            ];
        };
        ExtensionPointDirective.propDecorators = {
            name: [{ type: core.Input }],
            override: [{ type: core.Input }],
            input: [{ type: core.Input }],
            output: [{ type: core.Output }]
        };
        return ExtensionPointDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var BootstrapFramework = (function () {
        function BootstrapFramework(pluginService) {
            this.pluginService = pluginService;
        }
        /**
         * @param {?} config
         * @return {?}
         */
        BootstrapFramework.prototype.initialize = /**
         * @param {?} config
         * @return {?}
         */
            function (config) {
                this.config = config;
                this.pluginService.loadPlugins(this.config);
            };
        BootstrapFramework.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        BootstrapFramework.ctorParameters = function () {
            return [
                { type: PluginService }
            ];
        };
        return BootstrapFramework;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var WebExtensionModule = (function () {
        function WebExtensionModule() {
        }
        /**
         * @return {?}
         */
        WebExtensionModule.forRoot = /**
         * @return {?}
         */
            function () {
                return {
                    ngModule: WebExtensionModule,
                    providers: [PluginService]
                };
            };
        WebExtensionModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            ExtensionPointDirective
                        ],
                        imports: [
                            platformBrowser.BrowserModule
                        ],
                        exports: [
                            ExtensionPointDirective
                        ],
                        providers: [
                            PluginService,
                            BootstrapFramework
                        ],
                        entryComponents: []
                    },] },
        ];
        return WebExtensionModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.WebExtensionModule = WebExtensionModule;
    exports.BootstrapFramework = BootstrapFramework;
    exports.ExtensionPointDirective = ExtensionPointDirective;
    exports.PluginConfig = PluginConfig;
    exports.PluginPlacement = PluginPlacement;
    exports.PluginData = PluginData;
    exports.PluginService = PluginService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC13ZWItZXh0ZW5zaW9uLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL21vZGVscy50cyIsIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL3BsdWdpbi1zZXJ2aWNlLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS50cyIsIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL0Jvb3RzdHJhcEZyYW1ld29yay50cyIsIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL2FwcC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFBsdWdpbkNvbmZpZyA9IChjb25maWcpID0+IHtcbiAgcmV0dXJuICh0eXBlKSA9PiB7XG4gICAgdHlwZS5fcGx1Z2luQ29uZmlnID0gY29uZmlnO1xuICB9O1xufTtcblxuZXhwb3J0IGNsYXNzIFBsdWdpblBsYWNlbWVudCB7XG4gIHB1YmxpYyBuYW1lO1xuICBwdWJsaWMgcHJpb3JpdHk7XG4gIHB1YmxpYyBjb21wb25lbnQ7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5wcmlvcml0eSA9IG9wdGlvbnMucHJpb3JpdHk7XG4gICAgdGhpcy5jb21wb25lbnQgPSBvcHRpb25zLmNvbXBvbmVudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGx1Z2luRGF0YSB7XG4gIHB1YmxpYyBwbHVnaW47XG4gIHB1YmxpYyBwbGFjZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKHBsdWdpbiwgcGxhY2VtZW50KSB7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsdWdpbkRhdGF9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsdWdpblNlcnZpY2Uge1xuICBwdWJsaWMgcGx1Z2lucztcbiAgcHVibGljIGNoYW5nZTtcbiAgcHJpdmF0ZSBjb25maWc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgdGhpcy5jaGFuZ2UgPSBuZXcgUmVwbGF5U3ViamVjdCgxKTtcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKGNvbmZpZzogYW55KSB7XG4gICAgaWYgKCFjb25maWcgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZnJhbWV3b3JrIGNvbmZpZ3VyYXRpb24hIEZhaWxlZCB0byBsb2FkIHBsdWdpbnMhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zLm1hcCgoZGF0YSkgPT4gZGF0YS5tYWluKTtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XG4gICAgICB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICB9XG4gIH1cblxuICBsb2FkUGx1Z2luKHBsdWdpbikge1xuICAgICAgY29uc3QgUGx1Z2luID0gPGFueT5wbHVnaW47XG4gICAgICBjb25zdCBwbHVnaW5EYXRhID0ge1xuICAgICAgICB0eXBlOiBQbHVnaW4sXG4gICAgICAgIGNvbmZpZzogUGx1Z2luLl9wbHVnaW5Db25maWcsXG4gICAgICAgIGluc3RhbmNlOiBuZXcgUGx1Z2luKClcbiAgICAgIH07XG4gICAgICB0aGlzLnBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuY29uY2F0KFtwbHVnaW5EYXRhXSk7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gIH1cblxuICByZW1vdmVQbHVnaW4obmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW5zLmZpbmQoKHBsdWdpbk9iaikgPT4gcGx1Z2luT2JqLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChwbHVnaW4pIHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuc2xpY2UoKTtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pLCAxKTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnM7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGx1Z2luRGF0YShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW5zLnJlZHVjZSgoY29tcG9uZW50cywgcGx1Z2luRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbXBvbmVudHMuY29uY2F0KFxuICAgICAgICBwbHVnaW5EYXRhLmNvbmZpZy5wbGFjZW1lbnRzXG4gICAgICAgICAgLmZpbHRlcigocGxhY2VtZW50KSA9PiBwbGFjZW1lbnQubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAubWFwKChwbGFjZW1lbnQpID0+IG5ldyBQbHVnaW5EYXRhKHBsdWdpbkRhdGEsIHBsYWNlbWVudCkpXG4gICAgICApO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBJbnB1dCwgSW5qZWN0LCBQcm92aWRlciwgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBSZWZsZWN0aXZlSW5qZWN0b3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgT25Jbml0LCBDb21wb25lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnZXh0ZW5zaW9uLXBvaW50J1xufSlcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG92ZXJyaWRlOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGlucHV0OiBhbnk7XG4gIEBPdXRwdXQoKSBvdXRwdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHVibGljIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gIHB1YmxpYyBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuICBwdWJsaWMgY29tcG9uZW50UmVmczogQXJyYXk8YW55PiA9IFtdO1xuICBwdWJsaWMgcGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChWaWV3Q29udGFpbmVyUmVmKSB2aWV3Q29udGFpbmVyUmVmLCBASW5qZWN0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgY29tcG9uZW50UmVzb2x2ZXIsXG4gICAgQEluamVjdChQbHVnaW5TZXJ2aWNlKSBwbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB0aGlzLmNvbXBvbmVudFJlc29sdmVyID0gY29tcG9uZW50UmVzb2x2ZXI7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMucGx1Z2luU2VydmljZS5jaGFuZ2Uuc3Vic2NyaWJlKHggPT4gdGhpcy5pbml0aWFsaXplKCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwbHVnaW5EYXRhID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmdldFBsdWdpbkRhdGEodGhpcy5uYW1lKTtcbiAgICBpZiAodGhpcy5vdmVycmlkZSkge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YS5zaGlmdCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBsdWdpbkRhdGEubWFwKHBsdWdpbiA9PiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbikpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YSkge1xuICAgIGlmICghcGx1Z2luRGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShwbHVnaW5EYXRhLnBsYWNlbWVudC5jb21wb25lbnQpO1xuICAgIGNvbnN0IGNvbnRleHRJbmplY3RvciA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5wYXJlbnRJbmplY3RvcjtcbiAgICBjb25zdCBwcm92aWRlcnMgPSBbeyBwcm92aWRlOiBQbHVnaW5EYXRhLCB1c2VWYWx1ZTogcGx1Z2luRGF0YSB9XTtcbiAgICBjb25zdCBjaGlsZEluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUocHJvdmlkZXJzLCBjb250ZXh0SW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlZjogYW55ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5LCB0aGlzLnZpZXdDb250YWluZXJSZWYubGVuZ3RoLCBjaGlsZEluamVjdG9yKTtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXQgPSB0aGlzLmlucHV0O1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQgPSBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0IHx8IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0LnN1YnNjcmliZShjaGlsZENvbXBvbmVudEV2ZW50ID0+IHRoaXMub3V0cHV0LmVtaXQoY2hpbGRDb21wb25lbnRFdmVudCkpO1xuICAgIHRoaXMuY29tcG9uZW50UmVmcy5wdXNoKGNvbXBvbmVudFJlZik7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMuZm9yRWFjaChjb21wb25lbnRSZWYgPT4ge1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXQgPSB0aGlzLmlucHV0O1xuICAgICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzID8gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzKCkgOiB1bmRlZmluZWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzLmZvckVhY2goY29tcG9uZW50UmVmID0+IGNvbXBvbmVudFJlZi5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgfVxuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJvb3RzdHJhcEZyYW1ld29yayB7XG5cbiAgcHJpdmF0ZSBjb25maWc6IGFueTtcblxuICBwcml2YXRlIHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmZpZzogYW55KSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlLmxvYWRQbHVnaW5zKHRoaXMuY29uZmlnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEJvb3RzdHJhcEZyYW1ld29yayB9IGZyb20gJy4vQm9vdHN0cmFwRnJhbWV3b3JrJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEV4dGVuc2lvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFBsdWdpblNlcnZpY2UsXG4gICAgQm9vdHN0cmFwRnJhbWV3b3JrXG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW11cbn0pXG5leHBvcnQgY2xhc3MgV2ViRXh0ZW5zaW9uTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBXZWJFeHRlbnNpb25Nb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtQbHVnaW5TZXJ2aWNlXVxuICAgIH07XG4gIH1cbn1cblxuXG4iXSwibmFtZXMiOlsiUmVwbGF5U3ViamVjdCIsInRzbGliXzEuX192YWx1ZXMiLCJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwiUmVmbGVjdGl2ZUluamVjdG9yIiwiRGlyZWN0aXZlIiwiSW5qZWN0IiwiVmlld0NvbnRhaW5lclJlZiIsIkNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJCcm93c2VyTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUJBQWEsWUFBWSxHQUFHLFVBQUMsTUFBTTtRQUNqQyxPQUFPLFVBQUMsSUFBSTtZQUNWLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1NBQzdCLENBQUM7S0FDSCxDQUFDO0FBRUYsUUFBQTtRQUlFLHlCQUFZLE9BQU87WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDcEM7OEJBZEg7UUFlQyxDQUFBO0FBVEQsUUFXQTtRQUdFLG9CQUFZLE1BQU0sRUFBRSxTQUFTO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQzVCO3lCQXZCSDtRQXdCQzs7Ozs7OztRQ2RDO1lBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJQSxrQkFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7OztRQUVELG1DQUFXOzs7O1lBQVgsVUFBWSxNQUFXO2dCQUNyQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztpQkFDN0U7Z0JBRUQscUJBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksR0FBQSxDQUFDLENBQUM7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