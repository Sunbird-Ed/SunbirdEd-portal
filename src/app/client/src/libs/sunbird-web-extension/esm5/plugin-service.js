/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { PluginData } from './models';
import { ReplaySubject } from 'rxjs';
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
            for (var plugins_1 = tslib_1.__values(plugins), plugins_1_1 = plugins_1.next(); !plugins_1_1.done; plugins_1_1 = plugins_1.next()) {
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
export { PluginService };
function PluginService_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    PluginService.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    PluginService.ctorParameters;
    /** @type {?} */
    PluginService.prototype.plugins;
    /** @type {?} */
    PluginService.prototype.change;
    /** @type {?} */
    PluginService.prototype.config;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vIiwic291cmNlcyI6WyJwbHVnaW4tc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNwQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOztJQVFuQztRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEM7Ozs7O0lBRUQsbUNBQVc7Ozs7SUFBWCxVQUFZLE1BQVc7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1NBQzdFO1FBRUQscUJBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksRUFBVCxDQUFTLENBQUMsQ0FBQzs7WUFDeEQsR0FBRyxDQUFDLENBQWUsSUFBQSxZQUFBLGlCQUFBLE9BQU8sQ0FBQSxnQ0FBQTtnQkFBckIsSUFBSSxNQUFNLG9CQUFBO2dCQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDekI7Ozs7Ozs7Ozs7S0FDRjs7Ozs7SUFFRCxrQ0FBVTs7OztJQUFWLFVBQVcsTUFBTTtRQUNiLHFCQUFNLE1BQU0scUJBQVEsTUFBTSxDQUFBLENBQUM7UUFDM0IscUJBQU0sVUFBVSxHQUFHO1lBQ2pCLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQzVCLFFBQVEsRUFBRSxJQUFJLE1BQU0sRUFBRTtTQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2xDOzs7OztJQUVELG9DQUFZOzs7O0lBQVosVUFBYSxJQUFZO1FBQ3ZCLHFCQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxFQUF2QixDQUF1QixDQUFDLENBQUM7UUFDekUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLHFCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7S0FDRjs7Ozs7SUFFRCxxQ0FBYTs7OztJQUFiLFVBQWMsSUFBWTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxVQUFVLEVBQUUsVUFBVTtZQUNoRCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FDdEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFVO2lCQUN6QixNQUFNLENBQUMsVUFBQyxTQUFTLElBQUssT0FBQSxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksRUFBdkIsQ0FBdUIsQ0FBQztpQkFDOUMsR0FBRyxDQUFDLFVBQUMsU0FBUyxJQUFLLE9BQUEsSUFBSSxVQUFVLENBQUMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQzdELENBQUM7U0FDSCxFQUFFLEVBQUUsQ0FBQyxDQUFDO0tBQ1I7O2dCQW5ERixVQUFVOzs7O3dCQUpYOztTQUthLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbHVnaW5EYXRhfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXJ2aWNlIHtcbiAgcHVibGljIHBsdWdpbnM7XG4gIHB1YmxpYyBjaGFuZ2U7XG4gIHByaXZhdGUgY29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuY2hhbmdlID0gbmV3IFJlcGxheVN1YmplY3QoMSk7XG4gIH1cblxuICBsb2FkUGx1Z2lucyhjb25maWc6IGFueSkge1xuICAgIGlmICghY29uZmlnIHx8ICFBcnJheS5pc0FycmF5KGNvbmZpZy5wbHVnaW5zKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGZyYW1ld29yayBjb25maWd1cmF0aW9uISBGYWlsZWQgdG8gbG9hZCBwbHVnaW5zIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucy5tYXAoKGRhdGEpID0+IGRhdGEubWFpbik7XG4gICAgZm9yIChsZXQgcGx1Z2luIG9mIHBsdWdpbnMpIHtcbiAgICAgIHRoaXMubG9hZFBsdWdpbihwbHVnaW4pO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRQbHVnaW4ocGx1Z2luKSB7XG4gICAgICBjb25zdCBQbHVnaW4gPSA8YW55PnBsdWdpbjtcbiAgICAgIGNvbnN0IHBsdWdpbkRhdGEgPSB7XG4gICAgICAgIHR5cGU6IFBsdWdpbixcbiAgICAgICAgY29uZmlnOiBQbHVnaW4uX3BsdWdpbkNvbmZpZyxcbiAgICAgICAgaW5zdGFuY2U6IG5ldyBQbHVnaW4oKVxuICAgICAgfTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHRoaXMucGx1Z2lucy5jb25jYXQoW3BsdWdpbkRhdGFdKTtcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmoubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKHBsdWdpbikge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IHRoaXMucGx1Z2lucy5zbGljZSgpO1xuICAgICAgcGx1Z2lucy5zcGxpY2UocGx1Z2lucy5pbmRleE9mKHBsdWdpbiksIDEpO1xuICAgICAgdGhpcy5wbHVnaW5zID0gcGx1Z2lucztcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgICB9XG4gIH1cblxuICBnZXRQbHVnaW5EYXRhKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbnMucmVkdWNlKChjb21wb25lbnRzLCBwbHVnaW5EYXRhKSA9PiB7XG4gICAgICByZXR1cm4gY29tcG9uZW50cy5jb25jYXQoXG4gICAgICAgIHBsdWdpbkRhdGEuY29uZmlnLnBsYWNlbWVudHNcbiAgICAgICAgICAuZmlsdGVyKChwbGFjZW1lbnQpID0+IHBsYWNlbWVudC5uYW1lID09PSBuYW1lKVxuICAgICAgICAgIC5tYXAoKHBsYWNlbWVudCkgPT4gbmV3IFBsdWdpbkRhdGEocGx1Z2luRGF0YSwgcGxhY2VtZW50KSlcbiAgICAgICk7XG4gICAgfSwgW10pO1xuICB9XG59XG4iXX0=