import { __values } from 'tslib';
import { Injectable, Directive, Input, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output, NgModule } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @param {?} config
 * @return {?}
 */
function PluginConfig(config) {
    return function (type) {
        type._pluginConfig = config;
    };
}
var PluginPlacement = /** @class */ (function () {
    function PluginPlacement(options) {
        this.name = options.name;
        this.priority = options.priority;
        this.component = options.component;
    }
    return PluginPlacement;
}());
var PluginData = /** @class */ (function () {
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
var PluginService = /** @class */ (function () {
    function PluginService() {
        this.plugins = [];
        this.change = new ReplaySubject(1);
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
            for (var plugins_1 = __values(plugins), plugins_1_1 = plugins_1.next(); !plugins_1_1.done; plugins_1_1 = plugins_1.next()) {
                var plugin = plugins_1_1.value;
                this.loadPlugin(plugin);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (plugins_1_1 && !plugins_1_1.done && (_a = plugins_1.return)) _a.call(plugins_1);
            }
            finally { if (e_1) throw e_1.error; }
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
        var /** @type {?} */ pluginData = {
            type: plugin,
            config: plugin._pluginConfig,
            instance: new plugin()
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
        var /** @type {?} */ plugin = this.plugins.find(function (pluginObj) { return pluginObj.config.name === name; });
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
        { type: Injectable },
    ];
    /** @nocollapse */
    PluginService.ctorParameters = function () { return []; };
    return PluginService;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var ExtensionPointDirective = /** @class */ (function () {
    function ExtensionPointDirective(viewContainerRef, componentResolver, pluginService) {
        var _this = this;
        this.override = false;
        this.output = new EventEmitter();
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
        var /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate(providers, contextInjector);
        var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
        componentRef.instance.input = this.input;
        componentRef.instance.output = componentRef.instance.output || new EventEmitter();
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
        if (this.componentRefs.length > 0) {
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
        if (this.componentRefs.length > 0) {
            this.componentRefs.forEach(function (componentRef) { return componentRef.destroy(); });
            this.componentRefs = [];
        }
        this.pluginChangeSubscription.unsubscribe();
    };
    ExtensionPointDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: 'extension-point'
                },] },
    ];
    /** @nocollapse */
    ExtensionPointDirective.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver },
        { type: PluginService }
    ]; };
    ExtensionPointDirective.propDecorators = {
        name: [{ type: Input }],
        override: [{ type: Input }],
        input: [{ type: Input }],
        output: [{ type: Output }]
    };
    return ExtensionPointDirective;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var BootstrapFramework = /** @class */ (function () {
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
        { type: Injectable },
    ];
    /** @nocollapse */
    BootstrapFramework.ctorParameters = function () { return [
        { type: PluginService }
    ]; };
    return BootstrapFramework;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WebExtensionModule = /** @class */ (function () {
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
            providers: [PluginService, BootstrapFramework]
        };
    };
    WebExtensionModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ExtensionPointDirective
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        ExtensionPointDirective
                    ]
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

export { WebExtensionModule, BootstrapFramework, ExtensionPointDirective, PluginConfig, PluginPlacement, PluginData, PluginService };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC13ZWItZXh0ZW5zaW9uLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vbW9kZWxzLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vcGx1Z2luLXNlcnZpY2UudHMiLCJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vQm9vdHN0cmFwRnJhbWV3b3JrLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vYXBwLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gUGx1Z2luQ29uZmlnKGNvbmZpZykge1xuICByZXR1cm4gZnVuY3Rpb24odHlwZSkge1xuICAgIHR5cGUuX3BsdWdpbkNvbmZpZyA9IGNvbmZpZztcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFBsdWdpblBsYWNlbWVudCB7XG4gIHB1YmxpYyBuYW1lO1xuICBwdWJsaWMgcHJpb3JpdHk7XG4gIHB1YmxpYyBjb21wb25lbnQ7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5wcmlvcml0eSA9IG9wdGlvbnMucHJpb3JpdHk7XG4gICAgdGhpcy5jb21wb25lbnQgPSBvcHRpb25zLmNvbXBvbmVudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGx1Z2luRGF0YSB7XG4gIHB1YmxpYyBwbHVnaW47XG4gIHB1YmxpYyBwbGFjZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKHBsdWdpbiwgcGxhY2VtZW50KSB7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gIH1cbn1cbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsdWdpbkRhdGEsIFBsdWdpblBsYWNlbWVudCB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuZXhwb3J0IGludGVyZmFjZSBJUGx1Z2luRGF0YSB7XG4gIHR5cGU6IElQbHVnaW5DbGFzcztcbiAgY29uZmlnOiBJUGx1Z2luQ2xhc3NbJ19wbHVnaW5Db25maWcnXTtcbiAgaW5zdGFuY2U6IG5ldyAoKSA9PiBJUGx1Z2luQ2xhc3M7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBsdWdpbkNsYXNzIHtcbiAgbmV3KCk7XG4gIF9wbHVnaW5Db25maWc/OiBJUGx1Z2luQ29uZmlnO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQbHVnaW5Db25maWcge1xuICBuYW1lOiBzdHJpbmc7XG4gIGRlc2NyaXB0aW9uOiBzdHJpbmc7XG4gIHBsYWNlbWVudHM6IEFycmF5PFBsdWdpblBsYWNlbWVudD47XG59XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFBsdWdpblNlcnZpY2Uge1xuICBwdWJsaWMgcGx1Z2luczogQXJyYXk8SVBsdWdpbkRhdGE+O1xuICBwdWJsaWMgY2hhbmdlO1xuICBwcml2YXRlIGNvbmZpZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICB0aGlzLmNoYW5nZSA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMoY29uZmlnOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoIWNvbmZpZyB8fCAhQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBmcmFtZXdvcmsgY29uZmlndXJhdGlvbiEgRmFpbGVkIHRvIGxvYWQgcGx1Z2lucyEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnMubWFwKChkYXRhKSA9PiBkYXRhLm1haW4pO1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHBsdWdpbnMpIHtcbiAgICAgIHRoaXMubG9hZFBsdWdpbihwbHVnaW4pO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRQbHVnaW4ocGx1Z2luOiBJUGx1Z2luQ2xhc3MpOiB2b2lkIHtcbiAgICBjb25zdCBwbHVnaW5EYXRhOiBJUGx1Z2luRGF0YSA9IHtcbiAgICAgIHR5cGU6IHBsdWdpbixcbiAgICAgIGNvbmZpZzogcGx1Z2luLl9wbHVnaW5Db25maWcsXG4gICAgICBpbnN0YW5jZTogbmV3IHBsdWdpbigpXG4gICAgfTtcbiAgICB0aGlzLnBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuY29uY2F0KFtwbHVnaW5EYXRhXSk7XG4gICAgdGhpcy5jaGFuZ2UubmV4dCh0aGlzLnBsdWdpbnMpO1xuICB9XG5cbiAgcmVtb3ZlUGx1Z2luKG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2lucy5maW5kKChwbHVnaW5PYmopID0+IHBsdWdpbk9iai5jb25maWcubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKHBsdWdpbikge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IHRoaXMucGx1Z2lucy5zbGljZSgpO1xuICAgICAgcGx1Z2lucy5zcGxpY2UocGx1Z2lucy5pbmRleE9mKHBsdWdpbiksIDEpO1xuICAgICAgdGhpcy5wbHVnaW5zID0gcGx1Z2lucztcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgICB9XG4gIH1cblxuICBnZXRQbHVnaW5EYXRhKG5hbWU6IHN0cmluZyk6IEFycmF5PFBsdWdpbkRhdGE+IHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW5zLnJlZHVjZSgoY29tcG9uZW50cywgcGx1Z2luRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbXBvbmVudHMuY29uY2F0KFxuICAgICAgICBwbHVnaW5EYXRhLmNvbmZpZy5wbGFjZW1lbnRzXG4gICAgICAgICAgLmZpbHRlcigocGxhY2VtZW50KSA9PiBwbGFjZW1lbnQubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAubWFwKChwbGFjZW1lbnQpID0+IG5ldyBQbHVnaW5EYXRhKHBsdWdpbkRhdGEsIHBsYWNlbWVudCkpXG4gICAgICApO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBJbnB1dCwgSW5qZWN0LCBQcm92aWRlciwgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBSZWZsZWN0aXZlSW5qZWN0b3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgT25Jbml0LCBDb21wb25lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnZXh0ZW5zaW9uLXBvaW50J1xufSlcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG92ZXJyaWRlOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGlucHV0OiBhbnk7XG4gIEBPdXRwdXQoKSBvdXRwdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHVibGljIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gIHB1YmxpYyBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuICBwdWJsaWMgY29tcG9uZW50UmVmczogQXJyYXk8YW55PiA9IFtdO1xuICBwdWJsaWMgcGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3Iodmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiwgY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB0aGlzLmNvbXBvbmVudFJlc29sdmVyID0gY29tcG9uZW50UmVzb2x2ZXI7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMucGx1Z2luU2VydmljZS5jaGFuZ2Uuc3Vic2NyaWJlKHggPT4gdGhpcy5pbml0aWFsaXplKCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwbHVnaW5EYXRhID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmdldFBsdWdpbkRhdGEodGhpcy5uYW1lKTtcbiAgICBpZiAodGhpcy5vdmVycmlkZSkge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YS5zaGlmdCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBsdWdpbkRhdGEubWFwKHBsdWdpbiA9PiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbikpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YTogUGx1Z2luRGF0YSk6IENvbXBvbmVudFJlZjxhbnk+IHtcbiAgICBpZiAoIXBsdWdpbkRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkocGx1Z2luRGF0YS5wbGFjZW1lbnQuY29tcG9uZW50KTtcbiAgICBjb25zdCBjb250ZXh0SW5qZWN0b3IgPSB0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3I7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW3sgcHJvdmlkZTogUGx1Z2luRGF0YSwgdXNlVmFsdWU6IHBsdWdpbkRhdGEgfV07XG4gICAgY29uc3QgY2hpbGRJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVycywgY29udGV4dEluamVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWY6IGFueSA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aCwgY2hpbGRJbmplY3Rvcik7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmlucHV0ID0gdGhpcy5pbnB1dDtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dCB8fCBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dC5zdWJzY3JpYmUoY2hpbGRDb21wb25lbnRFdmVudCA9PiB0aGlzLm91dHB1dC5lbWl0KGNoaWxkQ29tcG9uZW50RXZlbnQpKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZnMucHVzaChjb21wb25lbnRSZWYpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiBjb21wb25lbnRSZWY7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKGNvbXBvbmVudFJlZiA9PiB7XG4gICAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRSZWYuaW5zdGFuY2UubmdPbkNoYW5nZXMgPyBjb21wb25lbnRSZWYuaW5zdGFuY2UubmdPbkNoYW5nZXMoKSA6IHVuZGVmaW5lZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzLmZvckVhY2goY29tcG9uZW50UmVmID0+IGNvbXBvbmVudFJlZi5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgfVxuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJvb3RzdHJhcEZyYW1ld29yayB7XG5cbiAgcHJpdmF0ZSBjb25maWc6IGFueTtcblxuICBwcml2YXRlIHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2U7XG5cbiAgY29uc3RydWN0b3IocGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gIH1cblxuICBpbml0aWFsaXplKGNvbmZpZzogYW55KSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlLmxvYWRQbHVnaW5zKHRoaXMuY29uZmlnKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEJvb3RzdHJhcEZyYW1ld29yayB9IGZyb20gJy4vQm9vdHN0cmFwRnJhbWV3b3JrJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEV4dGVuc2lvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEV4dGVuc2lvblBvaW50RGlyZWN0aXZlXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgV2ViRXh0ZW5zaW9uTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBXZWJFeHRlbnNpb25Nb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtQbHVnaW5TZXJ2aWNlLCBCb290c3RyYXBGcmFtZXdvcmtdXG4gICAgfTtcbiAgfVxufVxuXG5cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQTZCLE1BQU07SUFDakMsT0FBTyxVQUFTLElBQUk7UUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7S0FDN0IsQ0FBQztDQUNIO0FBRUQsSUFBQTtJQUlFLHlCQUFZLE9BQU87UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7S0FDcEM7MEJBZEg7SUFlQyxDQUFBO0FBVEQsSUFXQTtJQUdFLG9CQUFZLE1BQU0sRUFBRSxTQUFTO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0tBQzVCO3FCQXZCSDtJQXdCQzs7Ozs7OztJQ0lDO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQzs7Ozs7SUFFRCxtQ0FBVzs7OztJQUFYLFVBQVksTUFBVztRQUNyQixJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDN0MsTUFBTSxJ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