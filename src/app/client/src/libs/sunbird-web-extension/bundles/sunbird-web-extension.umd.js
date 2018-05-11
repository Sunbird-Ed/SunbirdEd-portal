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
    var ExtenstionPointDirective = (function () {
        function ExtenstionPointDirective(viewContainerRef, componentResolver, pluginService) {
            var _this = this;
            this.override = false;
            this.viewContainerRef = viewContainerRef;
            this.componentResolver = componentResolver;
            this.pluginService = pluginService;
            this.componentRefs = [];
            this.pluginChangeSubscription = this.pluginService.change.subscribe(function () { return _this.initialize(); });
        }
        /**
         * @return {?}
         */
        ExtenstionPointDirective.prototype.initialize = /**
         * @return {?}
         */
            function () {
                var _this = this;
                if (!this.name) {
                    return;
                }
                if (this.componentRefs.length > 0) {
                    this.componentRefs.forEach(function (componentRef) { return componentRef.destroy(); });
                    this.componentRefs = [];
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
        ExtenstionPointDirective.prototype.instantiatePluginComponent = /**
         * @param {?} pluginData
         * @return {?}
         */
            function (pluginData) {
                if (!pluginData) {
                    return;
                }
                var /** @type {?} */ componentFactory = this.componentResolver.resolveComponentFactory(pluginData.placement.component);
                var /** @type {?} */ contextInjector = this.viewContainerRef.parentInjector;
                var /** @type {?} */ providers = [
                    { provide: PluginData, useValue: pluginData }
                ];
                var /** @type {?} */ childInjector = core.ReflectiveInjector.resolveAndCreate(providers, contextInjector);
                var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
                this.componentRefs.push(componentRef);
                componentRef.changeDetectorRef.markForCheck();
                componentRef.changeDetectorRef.detectChanges();
                return componentRef;
            };
        /**
         * @return {?}
         */
        ExtenstionPointDirective.prototype.ngOnChanges = /**
         * @return {?}
         */
            function () {
                this.initialize();
            };
        /**
         * @return {?}
         */
        ExtenstionPointDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.pluginChangeSubscription.unsubscribe();
            };
        ExtenstionPointDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: 'extension-point'
                    },] },
        ];
        /** @nocollapse */
        ExtenstionPointDirective.ctorParameters = function () {
            return [
                { type: undefined, decorators: [{ type: core.Inject, args: [core.ViewContainerRef,] },] },
                { type: undefined, decorators: [{ type: core.Inject, args: [core.ComponentFactoryResolver,] },] },
                { type: undefined, decorators: [{ type: core.Inject, args: [PluginService,] },] },
            ];
        };
        ExtenstionPointDirective.propDecorators = {
            "name": [{ type: core.Input },],
            "override": [{ type: core.Input },],
        };
        return ExtenstionPointDirective;
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
                { type: PluginService, },
            ];
        };
        return BootstrapFramework;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var WebFrameworkModule = (function () {
        function WebFrameworkModule() {
        }
        /**
         * @return {?}
         */
        WebFrameworkModule.forRoot = /**
         * @return {?}
         */
            function () {
                return {
                    ngModule: WebFrameworkModule,
                    providers: [PluginService]
                };
            };
        WebFrameworkModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            ExtenstionPointDirective
                        ],
                        imports: [
                            platformBrowser.BrowserModule
                        ],
                        exports: [
                            ExtenstionPointDirective
                        ],
                        providers: [
                            PluginService,
                            BootstrapFramework
                        ],
                        entryComponents: []
                    },] },
        ];
        return WebFrameworkModule;
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

    exports.WebFrameworkModule = WebFrameworkModule;
    exports.BootstrapFramework = BootstrapFramework;
    exports.ExtenstionPointDirective = ExtenstionPointDirective;
    exports.PluginConfig = PluginConfig;
    exports.PluginPlacement = PluginPlacement;
    exports.PluginData = PluginData;
    exports.PluginService = PluginService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC13ZWItZXh0ZW5zaW9uLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL21vZGVscy50cyIsIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL3BsdWdpbi1zZXJ2aWNlLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS50cyIsIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL0Jvb3RzdHJhcEZyYW1ld29yay50cyIsIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL2FwcC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFBsdWdpbkNvbmZpZyA9IChjb25maWcpID0+IHtcbiAgcmV0dXJuICh0eXBlKSA9PiB7XG4gICAgdHlwZS5fcGx1Z2luQ29uZmlnID0gY29uZmlnO1xuICB9O1xufTtcblxuZXhwb3J0IGNsYXNzIFBsdWdpblBsYWNlbWVudCB7XG4gIHB1YmxpYyBuYW1lO1xuICBwdWJsaWMgcHJpb3JpdHk7XG4gIHB1YmxpYyBjb21wb25lbnQ7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5wcmlvcml0eSA9IG9wdGlvbnMucHJpb3JpdHk7XG4gICAgdGhpcy5jb21wb25lbnQgPSBvcHRpb25zLmNvbXBvbmVudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGx1Z2luRGF0YSB7XG4gIHB1YmxpYyBwbHVnaW47XG4gIHB1YmxpYyBwbGFjZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKHBsdWdpbiwgcGxhY2VtZW50KSB7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsdWdpbkRhdGF9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsdWdpblNlcnZpY2Uge1xuICBwdWJsaWMgcGx1Z2lucztcbiAgcHVibGljIGNoYW5nZTtcbiAgcHJpdmF0ZSBjb25maWc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgdGhpcy5jaGFuZ2UgPSBuZXcgUmVwbGF5U3ViamVjdCgxKTtcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKGNvbmZpZzogYW55KSB7XG4gICAgaWYgKCFjb25maWcgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZnJhbWV3b3JrIGNvbmZpZ3VyYXRpb24hIEZhaWxlZCB0byBsb2FkIHBsdWdpbnMhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zLm1hcCgoZGF0YSkgPT4gZGF0YS5tYWluKTtcbiAgICBmb3IgKGxldCBwbHVnaW4gb2YgcGx1Z2lucykge1xuICAgICAgdGhpcy5sb2FkUGx1Z2luKHBsdWdpbik7XG4gICAgfVxuICB9XG5cbiAgbG9hZFBsdWdpbihwbHVnaW4pIHtcbiAgICAgIGNvbnN0IFBsdWdpbiA9IDxhbnk+cGx1Z2luO1xuICAgICAgY29uc3QgcGx1Z2luRGF0YSA9IHtcbiAgICAgICAgdHlwZTogUGx1Z2luLFxuICAgICAgICBjb25maWc6IFBsdWdpbi5fcGx1Z2luQ29uZmlnLFxuICAgICAgICBpbnN0YW5jZTogbmV3IFBsdWdpbigpXG4gICAgICB9O1xuICAgICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wbHVnaW5zLmNvbmNhdChbcGx1Z2luRGF0YV0pO1xuICAgICAgdGhpcy5jaGFuZ2UubmV4dCh0aGlzLnBsdWdpbnMpO1xuICB9XG5cbiAgcmVtb3ZlUGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2lucy5maW5kKChwbHVnaW5PYmopID0+IHBsdWdpbk9iai5uYW1lID09PSBuYW1lKTtcbiAgICBpZiAocGx1Z2luKSB7XG4gICAgICBjb25zdCBwbHVnaW5zID0gdGhpcy5wbHVnaW5zLnNsaWNlKCk7XG4gICAgICBwbHVnaW5zLnNwbGljZShwbHVnaW5zLmluZGV4T2YocGx1Z2luKSwgMSk7XG4gICAgICB0aGlzLnBsdWdpbnMgPSBwbHVnaW5zO1xuICAgICAgdGhpcy5jaGFuZ2UubmV4dCh0aGlzLnBsdWdpbnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBsdWdpbkRhdGEobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2lucy5yZWR1Y2UoKGNvbXBvbmVudHMsIHBsdWdpbkRhdGEpID0+IHtcbiAgICAgIHJldHVybiBjb21wb25lbnRzLmNvbmNhdChcbiAgICAgICAgcGx1Z2luRGF0YS5jb25maWcucGxhY2VtZW50c1xuICAgICAgICAgIC5maWx0ZXIoKHBsYWNlbWVudCkgPT4gcGxhY2VtZW50Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgLm1hcCgocGxhY2VtZW50KSA9PiBuZXcgUGx1Z2luRGF0YShwbHVnaW5EYXRhLCBwbGFjZW1lbnQpKVxuICAgICAgKTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbiIsImltcG9ydCB7RGlyZWN0aXZlLCBJbnB1dCwgSW5qZWN0LCBQcm92aWRlciwgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBSZWZsZWN0aXZlSW5qZWN0b3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGx1Z2luRGF0YX0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtQbHVnaW5TZXJ2aWNlfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnZXh0ZW5zaW9uLXBvaW50J1xufSlcbmV4cG9ydCBjbGFzcyBFeHRlbnN0aW9uUG9pbnREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgb3ZlcnJpZGU6IEJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHZpZXdDb250YWluZXJSZWY7XG4gIHB1YmxpYyBjb21wb25lbnRSZXNvbHZlcjtcbiAgcHVibGljIHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2U7XG4gIHB1YmxpYyBjb21wb25lbnRSZWZzO1xuICBwdWJsaWMgcGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoVmlld0NvbnRhaW5lclJlZikgdmlld0NvbnRhaW5lclJlZiwgQEluamVjdChDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIGNvbXBvbmVudFJlc29sdmVyLCBcbiAgQEluamVjdChQbHVnaW5TZXJ2aWNlKSBwbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB0aGlzLmNvbXBvbmVudFJlc29sdmVyID0gY29tcG9uZW50UmVzb2x2ZXI7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZnMgPSBbXTtcbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMucGx1Z2luU2VydmljZS5jaGFuZ2Uuc3Vic2NyaWJlKCgpID0+IHRoaXMuaW5pdGlhbGl6ZSgpKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKCkge1xuICAgIGlmICghdGhpcy5uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMuZm9yRWFjaCgoY29tcG9uZW50UmVmKSA9PiBjb21wb25lbnRSZWYuZGVzdHJveSgpKTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcyA9IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IHBsdWdpbkRhdGEgPSB0aGlzLnBsdWdpblNlcnZpY2UuZ2V0UGx1Z2luRGF0YSh0aGlzLm5hbWUpO1xuICAgIGlmICh0aGlzLm92ZXJyaWRlKSB7XG4gICAgICBwbHVnaW5EYXRhLnNvcnQoKGEsIGIpID0+IGEucGxhY2VtZW50LnByaW9yaXR5ID4gYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAxIDogYS5wbGFjZW1lbnQucHJpb3JpdHkgPCBiLnBsYWNlbWVudC5wcmlvcml0eSA/IC0xIDogMCk7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW5EYXRhLnNoaWZ0KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW5EYXRhLnNvcnQoKGEsIGIpID0+IGEucGxhY2VtZW50LnByaW9yaXR5ID4gYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAxIDogYS5wbGFjZW1lbnQucHJpb3JpdHkgPCBiLnBsYWNlbWVudC5wcmlvcml0eSA/IC0xIDogMCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwocGx1Z2luRGF0YS5tYXAoKHBsdWdpbikgPT4gdGhpcy5pbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW4pKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEpIHtcbiAgICBpZiAoIXBsdWdpbkRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShwbHVnaW5EYXRhLnBsYWNlbWVudC5jb21wb25lbnQpO1xuICAgIGNvbnN0IGNvbnRleHRJbmplY3RvciA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5wYXJlbnRJbmplY3RvcjtcbiAgICBjb25zdCBwcm92aWRlcnMgPSBbXG4gICAgICB7IHByb3ZpZGU6IFBsdWdpbkRhdGEsIHVzZVZhbHVlOiBwbHVnaW5EYXRhIH1cbiAgICBdO1xuICAgIGNvbnN0IGNoaWxkSW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShwcm92aWRlcnMsIGNvbnRleHRJbmplY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5LCB0aGlzLnZpZXdDb250YWluZXJSZWYubGVuZ3RoLCBjaGlsZEluamVjdG9yKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZnMucHVzaChjb21wb25lbnRSZWYpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiBjb21wb25lbnRSZWY7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJvb3RzdHJhcEZyYW1ld29yayB7XG5cbiAgcHJpdmF0ZSBjb25maWc6IGFueTtcblxuICBwcml2YXRlIHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmZpZzogYW55KSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlLmxvYWRQbHVnaW5zKHRoaXMuY29uZmlnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlIH0gZnJvbSAnLi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBQbHVnaW5TZXJ2aWNlIH0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5pbXBvcnQgeyBCb290c3RyYXBGcmFtZXdvcmsgfSBmcm9tICcuL0Jvb3RzdHJhcEZyYW1ld29yayc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEV4dGVuc3Rpb25Qb2ludERpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFBsdWdpblNlcnZpY2UsXG4gICAgQm9vdHN0cmFwRnJhbWV3b3JrXG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW11cbn0pXG5leHBvcnQgY2xhc3MgV2ViRnJhbWV3b3JrTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBXZWJGcmFtZXdvcmtNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtQbHVnaW5TZXJ2aWNlXVxuICAgIH07XG4gIH1cbn1cblxuXG4iXSwibmFtZXMiOlsiUmVwbGF5U3ViamVjdCIsInRzbGliXzEuX192YWx1ZXMiLCJJbmplY3RhYmxlIiwiUmVmbGVjdGl2ZUluamVjdG9yIiwiRGlyZWN0aXZlIiwiSW5qZWN0IiwiVmlld0NvbnRhaW5lclJlZiIsIkNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciIsIklucHV0IiwiTmdNb2R1bGUiLCJCcm93c2VyTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUJBQWEsWUFBWSxHQUFHLFVBQUMsTUFBTTtRQUNqQyxPQUFPLFVBQUMsSUFBSTtZQUNWLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO1NBQzdCLENBQUM7S0FDSCxDQUFDO0FBRUYsUUFBQTtRQUlFLHlCQUFZLE9BQU87WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7U0FDcEM7OEJBZEg7UUFlQyxDQUFBO0FBVEQsUUFXQTtRQUdFLG9CQUFZLE1BQU0sRUFBRSxTQUFTO1lBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQzVCO3lCQXZCSDtRQXdCQzs7Ozs7OztRQ2RDO1lBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJQSxrQkFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BDOzs7OztRQUVELG1DQUFXOzs7O1lBQVgsVUFBWSxNQUFXO2dCQUNyQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQzdDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztpQkFDN0U7Z0JBRUQs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