(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('sunbird-web-extension', ['exports', '@angular/core', 'rxjs', '@angular/common'], factory) :
    (factory((global['sunbird-web-extension'] = {}),global.ng.core,global.rxjs,global.ng.common));
}(this, (function (exports,core,rxjs,common) { 'use strict';

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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

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
                    for (var plugins_1 = __values(plugins), plugins_1_1 = plugins_1.next(); !plugins_1_1.done; plugins_1_1 = plugins_1.next()) {
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
            { type: core.Directive, args: [{
                        // tslint:disable-next-line:directive-selector
                        selector: 'extension-point'
                    },] },
        ];
        /** @nocollapse */
        ExtensionPointDirective.ctorParameters = function () {
            return [
                { type: core.ViewContainerRef },
                { type: core.ComponentFactoryResolver },
                { type: PluginService }
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
                    providers: [PluginService, BootstrapFramework]
                };
            };
        WebExtensionModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            ExtensionPointDirective
                        ],
                        imports: [
                            common.CommonModule
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

    exports.WebExtensionModule = WebExtensionModule;
    exports.BootstrapFramework = BootstrapFramework;
    exports.ExtensionPointDirective = ExtensionPointDirective;
    exports.PluginConfig = PluginConfig;
    exports.PluginPlacement = PluginPlacement;
    exports.PluginData = PluginData;
    exports.PluginService = PluginService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VuYmlyZC13ZWItZXh0ZW5zaW9uLnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uL21vZGVscy50cyIsbnVsbCwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vcGx1Z2luLXNlcnZpY2UudHMiLCJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vQm9vdHN0cmFwRnJhbWV3b3JrLnRzIiwibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vYXBwLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gUGx1Z2luQ29uZmlnKGNvbmZpZykge1xuICByZXR1cm4gZnVuY3Rpb24odHlwZSkge1xuICAgIHR5cGUuX3BsdWdpbkNvbmZpZyA9IGNvbmZpZztcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIFBsdWdpblBsYWNlbWVudCB7XG4gIHB1YmxpYyBuYW1lO1xuICBwdWJsaWMgcHJpb3JpdHk7XG4gIHB1YmxpYyBjb21wb25lbnQ7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5wcmlvcml0eSA9IG9wdGlvbnMucHJpb3JpdHk7XG4gICAgdGhpcy5jb21wb25lbnQgPSBvcHRpb25zLmNvbXBvbmVudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUGx1Z2luRGF0YSB7XG4gIHB1YmxpYyBwbHVnaW47XG4gIHB1YmxpYyBwbGFjZW1lbnQ7XG4gIGNvbnN0cnVjdG9yKHBsdWdpbiwgcGxhY2VtZW50KSB7XG4gICAgdGhpcy5wbHVnaW4gPSBwbHVnaW47XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBwbGFjZW1lbnQ7XG4gIH1cbn1cbiIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTsgeW91IG1heSBub3QgdXNlXHJcbnRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlXHJcbkxpY2Vuc2UgYXQgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcblxyXG5USElTIENPREUgSVMgUFJPVklERUQgT04gQU4gKkFTIElTKiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZXHJcbktJTkQsIEVJVEhFUiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBXSVRIT1VUIExJTUlUQVRJT04gQU5ZIElNUExJRURcclxuV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIFRJVExFLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSxcclxuTUVSQ0hBTlRBQkxJVFkgT1IgTk9OLUlORlJJTkdFTUVOVC5cclxuXHJcblNlZSB0aGUgQXBhY2hlIFZlcnNpb24gMi4wIExpY2Vuc2UgZm9yIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9uc1xyXG5hbmQgbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gX19hc3NpZ24odCkge1xyXG4gICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpIHRbcF0gPSBzW3BdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIGlmIChlLmluZGV4T2YocFtpXSkgPCAwKVxyXG4gICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgIHJldHVybiB0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xyXG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XHJcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xyXG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcGFyYW0ocGFyYW1JbmRleCwgZGVjb3JhdG9yKSB7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCwga2V5KSB7IGRlY29yYXRvcih0YXJnZXQsIGtleSwgcGFyYW1JbmRleCk7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fbWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpIHtcclxuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2F3YWl0ZXIodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhLCBQbHVnaW5QbGFjZW1lbnQgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBsdWdpbkRhdGEge1xuICB0eXBlOiBJUGx1Z2luQ2xhc3M7XG4gIGNvbmZpZzogSVBsdWdpbkNsYXNzWydfcGx1Z2luQ29uZmlnJ107XG4gIGluc3RhbmNlOiBuZXcgKCkgPT4gSVBsdWdpbkNsYXNzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQbHVnaW5DbGFzcyB7XG4gIG5ldygpO1xuICBfcGx1Z2luQ29uZmlnPzogSVBsdWdpbkNvbmZpZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUGx1Z2luQ29uZmlnIHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwbGFjZW1lbnRzOiBBcnJheTxQbHVnaW5QbGFjZW1lbnQ+O1xufVxuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXJ2aWNlIHtcbiAgcHVibGljIHBsdWdpbnM6IEFycmF5PElQbHVnaW5EYXRhPjtcbiAgcHVibGljIGNoYW5nZTtcbiAgcHJpdmF0ZSBjb25maWc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgdGhpcy5jaGFuZ2UgPSBuZXcgUmVwbGF5U3ViamVjdCgxKTtcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKGNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgaWYgKCFjb25maWcgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZnJhbWV3b3JrIGNvbmZpZ3VyYXRpb24hIEZhaWxlZCB0byBsb2FkIHBsdWdpbnMhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zLm1hcCgoZGF0YSkgPT4gZGF0YS5tYWluKTtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XG4gICAgICB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICB9XG4gIH1cblxuICBsb2FkUGx1Z2luKHBsdWdpbjogSVBsdWdpbkNsYXNzKTogdm9pZCB7XG4gICAgY29uc3QgcGx1Z2luRGF0YTogSVBsdWdpbkRhdGEgPSB7XG4gICAgICB0eXBlOiBwbHVnaW4sXG4gICAgICBjb25maWc6IHBsdWdpbi5fcGx1Z2luQ29uZmlnLFxuICAgICAgaW5zdGFuY2U6IG5ldyBwbHVnaW4oKVxuICAgIH07XG4gICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wbHVnaW5zLmNvbmNhdChbcGx1Z2luRGF0YV0pO1xuICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmouY29uZmlnLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChwbHVnaW4pIHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuc2xpY2UoKTtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pLCAxKTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnM7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGx1Z2luRGF0YShuYW1lOiBzdHJpbmcpOiBBcnJheTxQbHVnaW5EYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2lucy5yZWR1Y2UoKGNvbXBvbmVudHMsIHBsdWdpbkRhdGEpID0+IHtcbiAgICAgIHJldHVybiBjb21wb25lbnRzLmNvbmNhdChcbiAgICAgICAgcGx1Z2luRGF0YS5jb25maWcucGxhY2VtZW50c1xuICAgICAgICAgIC5maWx0ZXIoKHBsYWNlbWVudCkgPT4gcGxhY2VtZW50Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgLm1hcCgocGxhY2VtZW50KSA9PiBuZXcgUGx1Z2luRGF0YShwbHVnaW5EYXRhLCBwbGFjZW1lbnQpKVxuICAgICAgKTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgSW5wdXQsIEluamVjdCwgUHJvdmlkZXIsIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgUmVmbGVjdGl2ZUluamVjdG9yLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIE9uSW5pdCwgQ29tcG9uZW50UmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1Z2luRGF0YSB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2V4dGVuc2lvbi1wb2ludCdcbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBvdmVycmlkZTogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBpbnB1dDogYW55O1xuICBAT3V0cHV0KCkgb3V0cHV0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG4gIHB1YmxpYyBjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuICBwdWJsaWMgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcbiAgcHVibGljIGNvbXBvbmVudFJlZnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHVibGljIHBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZiA9IHZpZXdDb250YWluZXJSZWY7XG4gICAgdGhpcy5jb21wb25lbnRSZXNvbHZlciA9IGNvbXBvbmVudFJlc29sdmVyO1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnBsdWdpblNlcnZpY2UuY2hhbmdlLnN1YnNjcmliZSh4ID0+IHRoaXMuaW5pdGlhbGl6ZSgpKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLm5hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGx1Z2luRGF0YSA9IHRoaXMucGx1Z2luU2VydmljZS5nZXRQbHVnaW5EYXRhKHRoaXMubmFtZSk7XG4gICAgaWYgKHRoaXMub3ZlcnJpZGUpIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEuc2hpZnQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwbHVnaW5EYXRhLm1hcChwbHVnaW4gPT4gdGhpcy5pbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW4pKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGE6IFBsdWdpbkRhdGEpOiBDb21wb25lbnRSZWY8YW55PiB7XG4gICAgaWYgKCFwbHVnaW5EYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBsdWdpbkRhdGEucGxhY2VtZW50LmNvbXBvbmVudCk7XG4gICAgY29uc3QgY29udGV4dEluamVjdG9yID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFt7IHByb3ZpZGU6IFBsdWdpbkRhdGEsIHVzZVZhbHVlOiBwbHVnaW5EYXRhIH1dO1xuICAgIGNvbnN0IGNoaWxkSW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShwcm92aWRlcnMsIGNvbnRleHRJbmplY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50UmVmOiBhbnkgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnksIHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGgsIGNoaWxkSW5qZWN0b3IpO1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dCA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQgfHwgbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQuc3Vic2NyaWJlKGNoaWxkQ29tcG9uZW50RXZlbnQgPT4gdGhpcy5vdXRwdXQuZW1pdChjaGlsZENvbXBvbmVudEV2ZW50KSk7XG4gICAgdGhpcy5jb21wb25lbnRSZWZzLnB1c2goY29tcG9uZW50UmVmKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gY29tcG9uZW50UmVmO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMuZm9yRWFjaChjb21wb25lbnRSZWYgPT4ge1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXQgPSB0aGlzLmlucHV0O1xuICAgICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzID8gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzKCkgOiB1bmRlZmluZWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKGNvbXBvbmVudFJlZiA9PiBjb21wb25lbnRSZWYuZGVzdHJveSgpKTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQbHVnaW5TZXJ2aWNlIH0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCb290c3RyYXBGcmFtZXdvcmsge1xuXG4gIHByaXZhdGUgY29uZmlnOiBhbnk7XG5cbiAgcHJpdmF0ZSBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2UpIHtcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UgPSBwbHVnaW5TZXJ2aWNlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShjb25maWc6IGFueSkge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucGx1Z2luU2VydmljZS5sb2FkUGx1Z2lucyh0aGlzLmNvbmZpZyk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEV4dGVuc2lvblBvaW50RGlyZWN0aXZlIH0gZnJvbSAnLi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5TZXJ2aWNlIH0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5pbXBvcnQgeyBCb290c3RyYXBGcmFtZXdvcmsgfSBmcm9tICcuL0Jvb3RzdHJhcEZyYW1ld29yayc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIFdlYkV4dGVuc2lvbk1vZHVsZSB7XG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xuICAgIHJldHVybiB7XG4gICAgICBuZ01vZHVsZTogV2ViRXh0ZW5zaW9uTW9kdWxlLFxuICAgICAgcHJvdmlkZXJzOiBbUGx1Z2luU2VydmljZSwgQm9vdHN0cmFwRnJhbWV3b3JrXVxuICAgIH07XG4gIH1cbn1cblxuXG4iXSwibmFtZXMiOlsiUmVwbGF5U3ViamVjdCIsInRzbGliXzEuX192YWx1ZXMiLCJJbmplY3RhYmxlIiwiRXZlbnRFbWl0dGVyIiwiUmVmbGVjdGl2ZUluamVjdG9yIiwiRGlyZWN0aXZlIiwiVmlld0NvbnRhaW5lclJlZiIsIkNvbXBvbmVudEZhY3RvcnlSZXNvbHZlciIsIklucHV0IiwiT3V0cHV0IiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMEJBQTZCLE1BQU07UUFDakMsT0FBTyxVQUFTLElBQUk7WUFDbEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUM7U0FDN0IsQ0FBQztLQUNIO0FBRUQsUUFBQTtRQUlFLHlCQUFZLE9BQU87WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lB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