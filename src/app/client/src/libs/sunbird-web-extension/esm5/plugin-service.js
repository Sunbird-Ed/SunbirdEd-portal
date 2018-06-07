/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { PluginData } from './models';
import { ReplaySubject } from 'rxjs';
/**
 * @record
 */
export function IPluginData() { }
function IPluginData_tsickle_Closure_declarations() {
    /** @type {?} */
    IPluginData.prototype.type;
    /** @type {?} */
    IPluginData.prototype.config;
    /** @type {?} */
    IPluginData.prototype.instance;
}
/**
 * @record
 */
export function IPluginClass() { }
function IPluginClass_tsickle_Closure_declarations() {
    /* TODO: handle strange member:
    new();
    */
    /** @type {?|undefined} */
    IPluginClass.prototype._pluginConfig;
}
/**
 * @record
 */
export function IPluginConfig() { }
function IPluginConfig_tsickle_Closure_declarations() {
    /** @type {?} */
    IPluginConfig.prototype.name;
    /** @type {?} */
    IPluginConfig.prototype.description;
    /** @type {?} */
    IPluginConfig.prototype.placements;
}
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
export { PluginService };
function PluginService_tsickle_Closure_declarations() {
    /** @type {?} */
    PluginService.prototype.plugins;
    /** @type {?} */
    PluginService.prototype.change;
    /** @type {?} */
    PluginService.prototype.config;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vIiwic291cmNlcyI6WyJwbHVnaW4tc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBbUIsTUFBTSxVQUFVLENBQUM7QUFDdkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQTBCbkM7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BDOzs7OztJQUVELG1DQUFXOzs7O0lBQVgsVUFBWSxNQUFXO1FBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQztTQUM3RTtRQUVELHFCQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksSUFBSyxPQUFBLElBQUksQ0FBQyxJQUFJLEVBQVQsQ0FBUyxDQUFDLENBQUM7O1lBQ3hELEdBQUcsQ0FBQyxDQUFpQixJQUFBLFlBQUEsaUJBQUEsT0FBTyxDQUFBLGdDQUFBO2dCQUF2QixJQUFNLE1BQU0sb0JBQUE7Z0JBQ2YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN6Qjs7Ozs7Ozs7OztLQUNGOzs7OztJQUVELGtDQUFVOzs7O0lBQVYsVUFBVyxNQUFvQjtRQUM3QixxQkFBTSxVQUFVLEdBQWdCO1lBQzlCLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQzVCLFFBQVEsRUFBRSxJQUFJLE1BQU0sRUFBRTtTQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDOzs7OztJQUVELG9DQUFZOzs7O0lBQVosVUFBYSxJQUFZO1FBQ3ZCLHFCQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksRUFBOUIsQ0FBOEIsQ0FBQyxDQUFDO1FBQ2hGLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxxQkFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO0tBQ0Y7Ozs7O0lBRUQscUNBQWE7Ozs7SUFBYixVQUFjLElBQVk7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsVUFBVSxFQUFFLFVBQVU7WUFDaEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVTtpQkFDekIsTUFBTSxDQUFDLFVBQUMsU0FBUyxJQUFLLE9BQUEsU0FBUyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQXZCLENBQXVCLENBQUM7aUJBQzlDLEdBQUcsQ0FBQyxVQUFDLFNBQVMsSUFBSyxPQUFBLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxTQUFTLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUM3RCxDQUFDO1NBQ0gsRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNSOztnQkFsREYsVUFBVTs7Ozt3QkF0Qlg7O1NBdUJhLGFBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhLCBQbHVnaW5QbGFjZW1lbnQgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBsdWdpbkRhdGEge1xuICB0eXBlOiBJUGx1Z2luQ2xhc3M7XG4gIGNvbmZpZzogSVBsdWdpbkNsYXNzWydfcGx1Z2luQ29uZmlnJ107XG4gIGluc3RhbmNlOiBuZXcgKCkgPT4gSVBsdWdpbkNsYXNzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQbHVnaW5DbGFzcyB7XG4gIG5ldygpO1xuICBfcGx1Z2luQ29uZmlnPzogSVBsdWdpbkNvbmZpZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUGx1Z2luQ29uZmlnIHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwbGFjZW1lbnRzOiBBcnJheTxQbHVnaW5QbGFjZW1lbnQ+O1xufVxuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXJ2aWNlIHtcbiAgcHVibGljIHBsdWdpbnM6IEFycmF5PElQbHVnaW5EYXRhPjtcbiAgcHVibGljIGNoYW5nZTtcbiAgcHJpdmF0ZSBjb25maWc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgdGhpcy5jaGFuZ2UgPSBuZXcgUmVwbGF5U3ViamVjdCgxKTtcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKGNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgaWYgKCFjb25maWcgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZnJhbWV3b3JrIGNvbmZpZ3VyYXRpb24hIEZhaWxlZCB0byBsb2FkIHBsdWdpbnMhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zLm1hcCgoZGF0YSkgPT4gZGF0YS5tYWluKTtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XG4gICAgICB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICB9XG4gIH1cblxuICBsb2FkUGx1Z2luKHBsdWdpbjogSVBsdWdpbkNsYXNzKTogdm9pZCB7XG4gICAgY29uc3QgcGx1Z2luRGF0YTogSVBsdWdpbkRhdGEgPSB7XG4gICAgICB0eXBlOiBwbHVnaW4sXG4gICAgICBjb25maWc6IHBsdWdpbi5fcGx1Z2luQ29uZmlnLFxuICAgICAgaW5zdGFuY2U6IG5ldyBwbHVnaW4oKVxuICAgIH07XG4gICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wbHVnaW5zLmNvbmNhdChbcGx1Z2luRGF0YV0pO1xuICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmouY29uZmlnLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChwbHVnaW4pIHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuc2xpY2UoKTtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pLCAxKTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnM7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGx1Z2luRGF0YShuYW1lOiBzdHJpbmcpOiBBcnJheTxQbHVnaW5EYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2lucy5yZWR1Y2UoKGNvbXBvbmVudHMsIHBsdWdpbkRhdGEpID0+IHtcbiAgICAgIHJldHVybiBjb21wb25lbnRzLmNvbmNhdChcbiAgICAgICAgcGx1Z2luRGF0YS5jb25maWcucGxhY2VtZW50c1xuICAgICAgICAgIC5maWx0ZXIoKHBsYWNlbWVudCkgPT4gcGxhY2VtZW50Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgLm1hcCgocGxhY2VtZW50KSA9PiBuZXcgUGx1Z2luRGF0YShwbHVnaW5EYXRhLCBwbGFjZW1lbnQpKVxuICAgICAgKTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbiJdfQ==