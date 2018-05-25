import { __values } from 'tslib';
import { Injectable, Directive, Input, Inject, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output, NgModule } from '@angular/core';
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
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: 'extension-point'
                },] },
    ];
    /** @nocollapse */
    ExtensionPointDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [ViewContainerRef,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [ComponentFactoryResolver,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [PluginService,] }] }
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
            providers: [PluginService]
        };
    };
    WebExtensionModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ExtensionPointDirective
                    ],
                    imports: [
                        BrowserModule
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

export { WebExtensionModule, BootstrapFramework, ExtensionPointDirective, PluginConfig, PluginPlacement, PluginData, PluginService };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC13ZWItZXh0ZW5zaW9uLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vbW9kZWxzLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vcGx1Z2luLXNlcnZpY2UudHMiLCJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vQm9vdHN0cmFwRnJhbWV3b3JrLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vYXBwLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgUGx1Z2luQ29uZmlnID0gKGNvbmZpZykgPT4ge1xuICByZXR1cm4gKHR5cGUpID0+IHtcbiAgICB0eXBlLl9wbHVnaW5Db25maWcgPSBjb25maWc7XG4gIH07XG59O1xuXG5leHBvcnQgY2xhc3MgUGx1Z2luUGxhY2VtZW50IHtcbiAgcHVibGljIG5hbWU7XG4gIHB1YmxpYyBwcmlvcml0eTtcbiAgcHVibGljIGNvbXBvbmVudDtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgICB0aGlzLmNvbXBvbmVudCA9IG9wdGlvbnMuY29tcG9uZW50O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5EYXRhIHtcbiAgcHVibGljIHBsdWdpbjtcbiAgcHVibGljIHBsYWNlbWVudDtcbiAgY29uc3RydWN0b3IocGx1Z2luLCBwbGFjZW1lbnQpIHtcbiAgICB0aGlzLnBsdWdpbiA9IHBsdWdpbjtcbiAgICB0aGlzLnBsYWNlbWVudCA9IHBsYWNlbWVudDtcbiAgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGx1Z2luRGF0YX0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGx1Z2luU2VydmljZSB7XG4gIHB1YmxpYyBwbHVnaW5zO1xuICBwdWJsaWMgY2hhbmdlO1xuICBwcml2YXRlIGNvbmZpZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICB0aGlzLmNoYW5nZSA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMoY29uZmlnOiBhbnkpIHtcbiAgICBpZiAoIWNvbmZpZyB8fCAhQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBmcmFtZXdvcmsgY29uZmlndXJhdGlvbiEgRmFpbGVkIHRvIGxvYWQgcGx1Z2lucyEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnMubWFwKChkYXRhKSA9PiBkYXRhLm1haW4pO1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHBsdWdpbnMpIHtcbiAgICAgIHRoaXMubG9hZFBsdWdpbihwbHVnaW4pO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRQbHVnaW4ocGx1Z2luKSB7XG4gICAgICBjb25zdCBQbHVnaW4gPSA8YW55PnBsdWdpbjtcbiAgICAgIGNvbnN0IHBsdWdpbkRhdGEgPSB7XG4gICAgICAgIHR5cGU6IFBsdWdpbixcbiAgICAgICAgY29uZmlnOiBQbHVnaW4uX3BsdWdpbkNvbmZpZyxcbiAgICAgICAgaW5zdGFuY2U6IG5ldyBQbHVnaW4oKVxuICAgICAgfTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHRoaXMucGx1Z2lucy5jb25jYXQoW3BsdWdpbkRhdGFdKTtcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmoubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKHBsdWdpbikge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IHRoaXMucGx1Z2lucy5zbGljZSgpO1xuICAgICAgcGx1Z2lucy5zcGxpY2UocGx1Z2lucy5pbmRleE9mKHBsdWdpbiksIDEpO1xuICAgICAgdGhpcy5wbHVnaW5zID0gcGx1Z2lucztcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgICB9XG4gIH1cblxuICBnZXRQbHVnaW5EYXRhKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbnMucmVkdWNlKChjb21wb25lbnRzLCBwbHVnaW5EYXRhKSA9PiB7XG4gICAgICByZXR1cm4gY29tcG9uZW50cy5jb25jYXQoXG4gICAgICAgIHBsdWdpbkRhdGEuY29uZmlnLnBsYWNlbWVudHNcbiAgICAgICAgICAuZmlsdGVyKChwbGFjZW1lbnQpID0+IHBsYWNlbWVudC5uYW1lID09PSBuYW1lKVxuICAgICAgICAgIC5tYXAoKHBsYWNlbWVudCkgPT4gbmV3IFBsdWdpbkRhdGEocGx1Z2luRGF0YSwgcGxhY2VtZW50KSlcbiAgICAgICk7XG4gICAgfSwgW10pO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEaXJlY3RpdmUsIElucHV0LCBJbmplY3QsIFByb3ZpZGVyLCBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIFJlZmxlY3RpdmVJbmplY3RvciwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEV2ZW50RW1pdHRlciwgT3V0cHV0LCBPbkluaXQsIENvbXBvbmVudFJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFBsdWdpbkRhdGEgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBQbHVnaW5TZXJ2aWNlIH0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcblxuQERpcmVjdGl2ZSh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdleHRlbnNpb24tcG9pbnQnXG59KVxuZXhwb3J0IGNsYXNzIEV4dGVuc2lvblBvaW50RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcbiAgQElucHV0KCkgb3ZlcnJpZGU6IEJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgaW5wdXQ6IGFueTtcbiAgQE91dHB1dCgpIG91dHB1dDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xuICBwdWJsaWMgY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjtcbiAgcHVibGljIHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2U7XG4gIHB1YmxpYyBjb21wb25lbnRSZWZzOiBBcnJheTxhbnk+ID0gW107XG4gIHB1YmxpYyBwbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KFZpZXdDb250YWluZXJSZWYpIHZpZXdDb250YWluZXJSZWYsIEBJbmplY3QoQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSBjb21wb25lbnRSZXNvbHZlcixcbiAgICBASW5qZWN0KFBsdWdpblNlcnZpY2UpIHBsdWdpblNlcnZpY2UpIHtcbiAgICB0aGlzLnZpZXdDb250YWluZXJSZWYgPSB2aWV3Q29udGFpbmVyUmVmO1xuICAgIHRoaXMuY29tcG9uZW50UmVzb2x2ZXIgPSBjb21wb25lbnRSZXNvbHZlcjtcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UgPSBwbHVnaW5TZXJ2aWNlO1xuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmNoYW5nZS5zdWJzY3JpYmUoeCA9PiB0aGlzLmluaXRpYWxpemUoKSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0aWFsaXplKCkge1xuICAgIGlmICghdGhpcy5uYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBsdWdpbkRhdGEgPSB0aGlzLnBsdWdpblNlcnZpY2UuZ2V0UGx1Z2luRGF0YSh0aGlzLm5hbWUpO1xuICAgIGlmICh0aGlzLm92ZXJyaWRlKSB7XG4gICAgICBwbHVnaW5EYXRhLnNvcnQoKGEsIGIpID0+IGEucGxhY2VtZW50LnByaW9yaXR5ID4gYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAxIDogYS5wbGFjZW1lbnQucHJpb3JpdHkgPCBiLnBsYWNlbWVudC5wcmlvcml0eSA/IC0xIDogMCk7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW5EYXRhLnNoaWZ0KCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbHVnaW5EYXRhLnNvcnQoKGEsIGIpID0+IGEucGxhY2VtZW50LnByaW9yaXR5ID4gYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAxIDogYS5wbGFjZW1lbnQucHJpb3JpdHkgPCBiLnBsYWNlbWVudC5wcmlvcml0eSA/IC0xIDogMCk7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwocGx1Z2luRGF0YS5tYXAocGx1Z2luID0+IHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luKSkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW5EYXRhKSB7XG4gICAgaWYgKCFwbHVnaW5EYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBsdWdpbkRhdGEucGxhY2VtZW50LmNvbXBvbmVudCk7XG4gICAgY29uc3QgY29udGV4dEluamVjdG9yID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFt7IHByb3ZpZGU6IFBsdWdpbkRhdGEsIHVzZVZhbHVlOiBwbHVnaW5EYXRhIH1dO1xuICAgIGNvbnN0IGNoaWxkSW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShwcm92aWRlcnMsIGNvbnRleHRJbmplY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50UmVmOiBhbnkgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnksIHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGgsIGNoaWxkSW5qZWN0b3IpO1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dCA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQgfHwgbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQuc3Vic2NyaWJlKGNoaWxkQ29tcG9uZW50RXZlbnQgPT4gdGhpcy5vdXRwdXQuZW1pdChjaGlsZENvbXBvbmVudEV2ZW50KSk7XG4gICAgdGhpcy5jb21wb25lbnRSZWZzLnB1c2goY29tcG9uZW50UmVmKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gY29tcG9uZW50UmVmO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKGNvbXBvbmVudFJlZiA9PiB7XG4gICAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRSZWYuaW5zdGFuY2UubmdPbkNoYW5nZXMgPyBjb21wb25lbnRSZWYuaW5zdGFuY2UubmdPbkNoYW5nZXMoKSA6IHVuZGVmaW5lZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMuZm9yRWFjaChjb21wb25lbnRSZWYgPT4gY29tcG9uZW50UmVmLmRlc3Ryb3koKSk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwRnJhbWV3b3JrIHtcblxuICBwcml2YXRlIGNvbmZpZzogYW55O1xuXG4gIHByaXZhdGUgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoY29uZmlnOiBhbnkpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UubG9hZFBsdWdpbnModGhpcy5jb25maWcpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSB9IGZyb20gJy4vZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgQm9vdHN0cmFwRnJhbWV3b3JrIH0gZnJvbSAnLi9Cb290c3RyYXBGcmFtZXdvcmsnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgUGx1Z2luU2VydmljZSxcbiAgICBCb290c3RyYXBGcmFtZXdvcmtcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBXZWJFeHRlbnNpb25Nb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFdlYkV4dGVuc2lvbk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1BsdWdpblNlcnZpY2VdXG4gICAgfTtcbiAgfVxufVxuXG5cbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxxQkFBYSxZQUFZLEdBQUcsVUFBQyxNQUFNO0lBQ2pDLE9BQU8sVUFBQyxJQUFJO1FBQ1YsSUFBSSxDQUFDLGFBQWEsR0FB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