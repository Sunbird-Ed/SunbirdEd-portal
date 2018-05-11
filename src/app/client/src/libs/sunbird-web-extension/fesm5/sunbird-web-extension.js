import { __values } from 'tslib';
import { Injectable, Directive, Input, Inject, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, NgModule } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var /** @type {?} */ PluginConfig = function (config) {
    return function (type) {
        type._pluginConfig = config;
    };
};
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
        var /** @type {?} */ Plugin = /** @type {?} */ (plugin);
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
var ExtenstionPointDirective = /** @class */ (function () {
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
        var /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate(providers, contextInjector);
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
        { type: Directive, args: [{
                    selector: 'extension-point'
                },] },
    ];
    /** @nocollapse */
    ExtenstionPointDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [ViewContainerRef,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [ComponentFactoryResolver,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [PluginService,] },] },
    ]; };
    ExtenstionPointDirective.propDecorators = {
        "name": [{ type: Input },],
        "override": [{ type: Input },],
    };
    return ExtenstionPointDirective;
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
        { type: PluginService, },
    ]; };
    return BootstrapFramework;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var WebFrameworkModule = /** @class */ (function () {
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
        { type: NgModule, args: [{
                    declarations: [
                        ExtenstionPointDirective
                    ],
                    imports: [
                        BrowserModule
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

export { WebFrameworkModule, BootstrapFramework, ExtenstionPointDirective, PluginConfig, PluginPlacement, PluginData, PluginService };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC13ZWItZXh0ZW5zaW9uLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vbW9kZWxzLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vcGx1Z2luLXNlcnZpY2UudHMiLCJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vQm9vdHN0cmFwRnJhbWV3b3JrLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vYXBwLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgUGx1Z2luQ29uZmlnID0gKGNvbmZpZykgPT4ge1xuICByZXR1cm4gKHR5cGUpID0+IHtcbiAgICB0eXBlLl9wbHVnaW5Db25maWcgPSBjb25maWc7XG4gIH07XG59O1xuXG5leHBvcnQgY2xhc3MgUGx1Z2luUGxhY2VtZW50IHtcbiAgcHVibGljIG5hbWU7XG4gIHB1YmxpYyBwcmlvcml0eTtcbiAgcHVibGljIGNvbXBvbmVudDtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IG9wdGlvbnMuY29tcG9uZW50O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5EYXRhIHtcbiAgcHVibGljIHBsdWdpbjtcbiAgcHVibGljIHBsYWNlbWVudDtcbiAgY29uc3RydWN0b3IocGx1Z2luLCBwbGFjZW1lbnQpIHtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB0aGlzLnBsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGx1Z2luRGF0YX0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGx1Z2luU2VydmljZSB7XG4gIHB1YmxpYyBwbHVnaW5zO1xuICBwdWJsaWMgY2hhbmdlO1xuICBwcml2YXRlIGNvbmZpZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICB0aGlzLmNoYW5nZSA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMoY29uZmlnOiBhbnkpIHtcbiAgICBpZiAoIWNvbmZpZyB8fCAhQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBmcmFtZXdvcmsgY29uZmlndXJhdGlvbiEgRmFpbGVkIHRvIGxvYWQgcGx1Z2lucyEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnMubWFwKChkYXRhKSA9PiBkYXRhLm1haW4pO1xuICAgIGZvciAobGV0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XG4gICAgICB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICB9XG4gIH1cblxuICBsb2FkUGx1Z2luKHBsdWdpbikge1xuICAgICAgY29uc3QgUGx1Z2luID0gPGFueT5wbHVnaW47XG4gICAgICBjb25zdCBwbHVnaW5EYXRhID0ge1xuICAgICAgICB0eXBlOiBQbHVnaW4sXG4gICAgICAgIGNvbmZpZzogUGx1Z2luLl9wbHVnaW5Db25maWcsXG4gICAgICAgIGluc3RhbmNlOiBuZXcgUGx1Z2luKClcbiAgICAgIH07XG4gICAgICB0aGlzLnBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuY29uY2F0KFtwbHVnaW5EYXRhXSk7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gIH1cblxuICByZW1vdmVQbHVnaW4obmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgcGx1Z2luID0gdGhpcy5wbHVnaW5zLmZpbmQoKHBsdWdpbk9iaikgPT4gcGx1Z2luT2JqLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChwbHVnaW4pIHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuc2xpY2UoKTtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pLCAxKTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnM7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGx1Z2luRGF0YShuYW1lOiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5wbHVnaW5zLnJlZHVjZSgoY29tcG9uZW50cywgcGx1Z2luRGF0YSkgPT4ge1xuICAgICAgcmV0dXJuIGNvbXBvbmVudHMuY29uY2F0KFxuICAgICAgICBwbHVnaW5EYXRhLmNvbmZpZy5wbGFjZW1lbnRzXG4gICAgICAgICAgLmZpbHRlcigocGxhY2VtZW50KSA9PiBwbGFjZW1lbnQubmFtZSA9PT0gbmFtZSlcbiAgICAgICAgICAubWFwKChwbGFjZW1lbnQpID0+IG5ldyBQbHVnaW5EYXRhKHBsdWdpbkRhdGEsIHBsYWNlbWVudCkpXG4gICAgICApO1xuICAgIH0sIFtdKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBJbmplY3QsIFByb3ZpZGVyLCBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIFJlZmxlY3RpdmVJbmplY3RvciwgT25EZXN0cm95LCBPbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbHVnaW5EYXRhfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQge1BsdWdpblNlcnZpY2V9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdleHRlbnNpb24tcG9pbnQnXG59KVxuZXhwb3J0IGNsYXNzIEV4dGVuc3Rpb25Qb2ludERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBvdmVycmlkZTogQm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjtcbiAgcHVibGljIGNvbXBvbmVudFJlc29sdmVyO1xuICBwdWJsaWMgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcbiAgcHVibGljIGNvbXBvbmVudFJlZnM7XG4gIHB1YmxpYyBwbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChWaWV3Q29udGFpbmVyUmVmKSB2aWV3Q29udGFpbmVyUmVmLCBASW5qZWN0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgY29tcG9uZW50UmVzb2x2ZXIsIFxuICBASW5qZWN0KFBsdWdpblNlcnZpY2UpIHBsdWdpblNlcnZpY2UpIHtcbiAgICB0aGlzLnZpZXdDb250YWluZXJSZWYgPSB2aWV3Q29udGFpbmVyUmVmO1xuICAgIHRoaXMuY29tcG9uZW50UmVzb2x2ZXIgPSBjb21wb25lbnRSZXNvbHZlcjtcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UgPSBwbHVnaW5TZXJ2aWNlO1xuICAgIHRoaXMuY29tcG9uZW50UmVmcyA9IFtdO1xuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5pbml0aWFsaXplKCkpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLm5hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKChjb21wb25lbnRSZWYpID0+IGNvbXBvbmVudFJlZi5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2luRGF0YSA9IHRoaXMucGx1Z2luU2VydmljZS5nZXRQbHVnaW5EYXRhKHRoaXMubmFtZSk7XG4gICAgaWYgKHRoaXMub3ZlcnJpZGUpIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEuc2hpZnQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwbHVnaW5EYXRhLm1hcCgocGx1Z2luKSA9PiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbikpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YSkge1xuICAgIGlmICghcGx1Z2luRGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBsdWdpbkRhdGEucGxhY2VtZW50LmNvbXBvbmVudCk7XG4gICAgY29uc3QgY29udGV4dEluamVjdG9yID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFtcbiAgICAgIHsgcHJvdmlkZTogUGx1Z2luRGF0YSwgdXNlVmFsdWU6IHBsdWdpbkRhdGEgfVxuICAgIF07XG4gICAgY29uc3QgY2hpbGRJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVycywgY29udGV4dEluamVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnksIHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGgsIGNoaWxkSW5qZWN0b3IpO1xuICAgIHRoaXMuY29tcG9uZW50UmVmcy5wdXNoKGNvbXBvbmVudFJlZik7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwRnJhbWV3b3JrIHtcblxuICBwcml2YXRlIGNvbmZpZzogYW55O1xuXG4gIHByaXZhdGUgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoY29uZmlnOiBhbnkpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UubG9hZFBsdWdpbnModGhpcy5jb25maWcpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBFeHRlbnN0aW9uUG9pbnREaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEJvb3RzdHJhcEZyYW1ld29yayB9IGZyb20gJy4vQm9vdHN0cmFwRnJhbWV3b3JrJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBFeHRlbnN0aW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgUGx1Z2luU2VydmljZSxcbiAgICBCb290c3RyYXBGcmFtZXdvcmtcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBXZWJGcmFtZXdvcmtNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFdlYkZyYW1ld29ya01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1BsdWdpblNlcnZpY2VdXG4gICAgfTtcbiAgfVxufVxuXG5cbiJdLCJuYW1l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