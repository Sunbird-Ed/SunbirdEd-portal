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
    /** @type {?} */
    PluginService.prototype.plugins;
    /** @type {?} */
    PluginService.prototype.change;
    /** @type {?} */
    PluginService.prototype.config;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vIiwic291cmNlcyI6WyJwbHVnaW4tc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUNwQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOztJQVFuQztRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEM7Ozs7O0lBRUQsbUNBQVc7Ozs7SUFBWCxVQUFZLE1BQVc7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1NBQzdFO1FBRUQscUJBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsSUFBSSxDQUFDLElBQUksRUFBVCxDQUFTLENBQUMsQ0FBQzs7WUFDeEQsR0FBRyxDQUFDLENBQWlCLElBQUEsWUFBQSxpQkFBQSxPQUFPLENBQUEsZ0NBQUE7Z0JBQXZCLElBQU0sTUFBTSxvQkFBQTtnQkFDZixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3pCOzs7Ozs7Ozs7O0tBQ0Y7Ozs7O0lBRUQsa0NBQVU7Ozs7SUFBVixVQUFXLE1BQU07UUFDYixxQkFBTSxNQUFNLHFCQUFRLE1BQU0sQ0FBQSxDQUFDO1FBQzNCLHFCQUFNLFVBQVUsR0FBRztZQUNqQixJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYTtZQUM1QixRQUFRLEVBQUUsSUFBSSxNQUFNLEVBQUU7U0FDdkIsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQzs7Ozs7SUFFRCxvQ0FBWTs7OztJQUFaLFVBQWEsSUFBWTtRQUN2QixxQkFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxTQUFTLElBQUssT0FBQSxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksRUFBdkIsQ0FBdUIsQ0FBQyxDQUFDO1FBQ3pFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxxQkFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO0tBQ0Y7Ozs7O0lBRUQscUNBQWE7Ozs7SUFBYixVQUFjLElBQVk7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsVUFBVSxFQUFFLFVBQVU7WUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVTtpQkFDekIsTUFBTSxDQUFDLFVBQUMsU0FBUyxJQUFLLE9BQUEsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQXZCLENBQXVCLENBQUM7aUJBQzlDLEdBQUcsQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUM3RCxDQUFDO1NBQ0gsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSOztnQkFuREYsVUFBVTs7Ozt3QkFKWDs7U0FLYSxhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7UGx1Z2luRGF0YX0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUGx1Z2luU2VydmljZSB7XG4gIHB1YmxpYyBwbHVnaW5zO1xuICBwdWJsaWMgY2hhbmdlO1xuICBwcml2YXRlIGNvbmZpZztcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBsdWdpbnMgPSBbXTtcbiAgICB0aGlzLmNoYW5nZSA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMoY29uZmlnOiBhbnkpIHtcbiAgICBpZiAoIWNvbmZpZyB8fCAhQXJyYXkuaXNBcnJheShjb25maWcucGx1Z2lucykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBmcmFtZXdvcmsgY29uZmlndXJhdGlvbiEgRmFpbGVkIHRvIGxvYWQgcGx1Z2lucyEnKTtcbiAgICB9XG5cbiAgICBjb25zdCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnMubWFwKChkYXRhKSA9PiBkYXRhLm1haW4pO1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHBsdWdpbnMpIHtcbiAgICAgIHRoaXMubG9hZFBsdWdpbihwbHVnaW4pO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRQbHVnaW4ocGx1Z2luKSB7XG4gICAgICBjb25zdCBQbHVnaW4gPSA8YW55PnBsdWdpbjtcbiAgICAgIGNvbnN0IHBsdWdpbkRhdGEgPSB7XG4gICAgICAgIHR5cGU6IFBsdWdpbixcbiAgICAgICAgY29uZmlnOiBQbHVnaW4uX3BsdWdpbkNvbmZpZyxcbiAgICAgICAgaW5zdGFuY2U6IG5ldyBQbHVnaW4oKVxuICAgICAgfTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHRoaXMucGx1Z2lucy5jb25jYXQoW3BsdWdpbkRhdGFdKTtcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmoubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKHBsdWdpbikge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IHRoaXMucGx1Z2lucy5zbGljZSgpO1xuICAgICAgcGx1Z2lucy5zcGxpY2UocGx1Z2lucy5pbmRleE9mKHBsdWdpbiksIDEpO1xuICAgICAgdGhpcy5wbHVnaW5zID0gcGx1Z2lucztcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgICB9XG4gIH1cblxuICBnZXRQbHVnaW5EYXRhKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbnMucmVkdWNlKChjb21wb25lbnRzLCBwbHVnaW5EYXRhKSA9PiB7XG4gICAgICByZXR1cm4gY29tcG9uZW50cy5jb25jYXQoXG4gICAgICAgIHBsdWdpbkRhdGEuY29uZmlnLnBsYWNlbWVudHNcbiAgICAgICAgICAuZmlsdGVyKChwbGFjZW1lbnQpID0+IHBsYWNlbWVudC5uYW1lID09PSBuYW1lKVxuICAgICAgICAgIC5tYXAoKHBsYWNlbWVudCkgPT4gbmV3IFBsdWdpbkRhdGEocGx1Z2luRGF0YSwgcGxhY2VtZW50KSlcbiAgICAgICk7XG4gICAgfSwgW10pO1xuICB9XG59XG4iXX0=