/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
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
export class PluginService {
    constructor() {
        this.plugins = [];
        this.change = new ReplaySubject(1);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    loadPlugins(config) {
        if (!config || !Array.isArray(config.plugins)) {
            throw new Error('invalid framework configuration! Failed to load plugins!');
        }
        const /** @type {?} */ plugins = config.plugins.map((data) => data.main);
        for (const /** @type {?} */ plugin of plugins) {
            this.loadPlugin(plugin);
        }
    }
    /**
     * @param {?} plugin
     * @return {?}
     */
    loadPlugin(plugin) {
        const /** @type {?} */ pluginData = {
            type: plugin,
            config: plugin._pluginConfig,
            instance: new plugin()
        };
        this.plugins = this.plugins.concat([pluginData]);
        this.change.next(this.plugins);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    removePlugin(name) {
        const /** @type {?} */ plugin = this.plugins.find((pluginObj) => pluginObj.config.name === name);
        if (plugin) {
            const /** @type {?} */ plugins = this.plugins.slice();
            plugins.splice(plugins.indexOf(plugin), 1);
            this.plugins = plugins;
            this.change.next(this.plugins);
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getPluginData(name) {
        return this.plugins.reduce((components, pluginData) => {
            return components.concat(pluginData.config.placements
                .filter((placement) => placement.name === name)
                .map((placement) => new PluginData(pluginData, placement)));
        }, []);
    }
}
PluginService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PluginService.ctorParameters = () => [];
function PluginService_tsickle_Closure_declarations() {
    /** @type {?} */
    PluginService.prototype.plugins;
    /** @type {?} */
    PluginService.prototype.change;
    /** @type {?} */
    PluginService.prototype.config;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vIiwic291cmNlcyI6WyJwbHVnaW4tc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFtQixNQUFNLFVBQVUsQ0FBQztBQUN2RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQnJDLE1BQU07SUFLSjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEM7Ozs7O0lBRUQsV0FBVyxDQUFDLE1BQVc7UUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO1NBQzdFO1FBRUQsdUJBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLENBQUMsdUJBQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN6QjtLQUNGOzs7OztJQUVELFVBQVUsQ0FBQyxNQUFvQjtRQUM3Qix1QkFBTSxVQUFVLEdBQWdCO1lBQzlCLElBQUksRUFBRSxNQUFNO1lBQ1osTUFBTSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQzVCLFFBQVEsRUFBRSxJQUFJLE1BQU0sRUFBRTtTQUN2QixDQUFDO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ2hDOzs7OztJQUVELFlBQVksQ0FBQyxJQUFZO1FBQ3ZCLHVCQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDaEYsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLHVCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7S0FDRjs7Ozs7SUFFRCxhQUFhLENBQUMsSUFBWTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUU7WUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVTtpQkFDekIsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztpQkFDOUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDN0QsQ0FBQztTQUNILEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDUjs7O1lBbERGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhLCBQbHVnaW5QbGFjZW1lbnQgfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBsdWdpbkRhdGEge1xuICB0eXBlOiBJUGx1Z2luQ2xhc3M7XG4gIGNvbmZpZzogSVBsdWdpbkNsYXNzWydfcGx1Z2luQ29uZmlnJ107XG4gIGluc3RhbmNlOiBuZXcgKCkgPT4gSVBsdWdpbkNsYXNzO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQbHVnaW5DbGFzcyB7XG4gIG5ldygpO1xuICBfcGx1Z2luQ29uZmlnPzogSVBsdWdpbkNvbmZpZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUGx1Z2luQ29uZmlnIHtcbiAgbmFtZTogc3RyaW5nO1xuICBkZXNjcmlwdGlvbjogc3RyaW5nO1xuICBwbGFjZW1lbnRzOiBBcnJheTxQbHVnaW5QbGFjZW1lbnQ+O1xufVxuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXJ2aWNlIHtcbiAgcHVibGljIHBsdWdpbnM6IEFycmF5PElQbHVnaW5EYXRhPjtcbiAgcHVibGljIGNoYW5nZTtcbiAgcHJpdmF0ZSBjb25maWc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wbHVnaW5zID0gW107XG4gICAgdGhpcy5jaGFuZ2UgPSBuZXcgUmVwbGF5U3ViamVjdCgxKTtcbiAgfVxuXG4gIGxvYWRQbHVnaW5zKGNvbmZpZzogYW55KTogdm9pZCB7XG4gICAgaWYgKCFjb25maWcgfHwgIUFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgZnJhbWV3b3JrIGNvbmZpZ3VyYXRpb24hIEZhaWxlZCB0byBsb2FkIHBsdWdpbnMhJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zLm1hcCgoZGF0YSkgPT4gZGF0YS5tYWluKTtcbiAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiBwbHVnaW5zKSB7XG4gICAgICB0aGlzLmxvYWRQbHVnaW4ocGx1Z2luKTtcbiAgICB9XG4gIH1cblxuICBsb2FkUGx1Z2luKHBsdWdpbjogSVBsdWdpbkNsYXNzKTogdm9pZCB7XG4gICAgY29uc3QgcGx1Z2luRGF0YTogSVBsdWdpbkRhdGEgPSB7XG4gICAgICB0eXBlOiBwbHVnaW4sXG4gICAgICBjb25maWc6IHBsdWdpbi5fcGx1Z2luQ29uZmlnLFxuICAgICAgaW5zdGFuY2U6IG5ldyBwbHVnaW4oKVxuICAgIH07XG4gICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wbHVnaW5zLmNvbmNhdChbcGx1Z2luRGF0YV0pO1xuICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmouY29uZmlnLm5hbWUgPT09IG5hbWUpO1xuICAgIGlmIChwbHVnaW4pIHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSB0aGlzLnBsdWdpbnMuc2xpY2UoKTtcbiAgICAgIHBsdWdpbnMuc3BsaWNlKHBsdWdpbnMuaW5kZXhPZihwbHVnaW4pLCAxKTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnM7XG4gICAgICB0aGlzLmNoYW5nZS5uZXh0KHRoaXMucGx1Z2lucyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGx1Z2luRGF0YShuYW1lOiBzdHJpbmcpOiBBcnJheTxQbHVnaW5EYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2lucy5yZWR1Y2UoKGNvbXBvbmVudHMsIHBsdWdpbkRhdGEpID0+IHtcbiAgICAgIHJldHVybiBjb21wb25lbnRzLmNvbmNhdChcbiAgICAgICAgcGx1Z2luRGF0YS5jb25maWcucGxhY2VtZW50c1xuICAgICAgICAgIC5maWx0ZXIoKHBsYWNlbWVudCkgPT4gcGxhY2VtZW50Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgLm1hcCgocGxhY2VtZW50KSA9PiBuZXcgUGx1Z2luRGF0YShwbHVnaW5EYXRhLCBwbGFjZW1lbnQpKVxuICAgICAgKTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbiJdfQ==