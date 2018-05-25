/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from '@angular/core';
import { PluginData } from './models';
import { ReplaySubject } from 'rxjs';
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
        const /** @type {?} */ Plugin = /** @type {?} */ (plugin);
        const /** @type {?} */ pluginData = {
            type: Plugin,
            config: Plugin._pluginConfig,
            instance: new Plugin()
        };
        this.plugins = this.plugins.concat([pluginData]);
        this.change.next(this.plugins);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    removePlugin(name) {
        const /** @type {?} */ plugin = this.plugins.find((pluginObj) => pluginObj.name === name);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vIiwic291cmNlcyI6WyJwbHVnaW4tc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHckMsTUFBTTtJQUtKO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQzs7Ozs7SUFFRCxXQUFXLENBQUMsTUFBVztRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDN0U7UUFFRCx1QkFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxHQUFHLENBQUMsQ0FBQyx1QkFBTSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0tBQ0Y7Ozs7O0lBRUQsVUFBVSxDQUFDLE1BQU07UUFDYix1QkFBTSxNQUFNLHFCQUFRLE1BQU0sQ0FBQSxDQUFDO1FBQzNCLHVCQUFNLFVBQVUsR0FBRztZQUNqQixJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYTtZQUM1QixRQUFRLEVBQUUsSUFBSSxNQUFNLEVBQUU7U0FDdkIsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQzs7Ozs7SUFFRCxZQUFZLENBQUMsSUFBWTtRQUN2Qix1QkFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDekUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLHVCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7S0FDRjs7Ozs7SUFFRCxhQUFhLENBQUMsSUFBWTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUU7WUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVTtpQkFDekIsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztpQkFDOUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDN0QsQ0FBQztTQUNILEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDUjs7O1lBbkRGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbHVnaW5EYXRhfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXJ2aWNlIHtcbiAgcHVibGljIHBsdWdpbnM7XG4gIHB1YmxpYyBjaGFuZ2U7XG4gIHByaXZhdGUgY29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuY2hhbmdlID0gbmV3IFJlcGxheVN1YmplY3QoMSk7XG4gIH1cblxuICBsb2FkUGx1Z2lucyhjb25maWc6IGFueSkge1xuICAgIGlmICghY29uZmlnIHx8ICFBcnJheS5pc0FycmF5KGNvbmZpZy5wbHVnaW5zKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGZyYW1ld29yayBjb25maWd1cmF0aW9uISBGYWlsZWQgdG8gbG9hZCBwbHVnaW5zIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucy5tYXAoKGRhdGEpID0+IGRhdGEubWFpbik7XG4gICAgZm9yIChjb25zdCBwbHVnaW4gb2YgcGx1Z2lucykge1xuICAgICAgdGhpcy5sb2FkUGx1Z2luKHBsdWdpbik7XG4gICAgfVxuICB9XG5cbiAgbG9hZFBsdWdpbihwbHVnaW4pIHtcbiAgICAgIGNvbnN0IFBsdWdpbiA9IDxhbnk+cGx1Z2luO1xuICAgICAgY29uc3QgcGx1Z2luRGF0YSA9IHtcbiAgICAgICAgdHlwZTogUGx1Z2luLFxuICAgICAgICBjb25maWc6IFBsdWdpbi5fcGx1Z2luQ29uZmlnLFxuICAgICAgICBpbnN0YW5jZTogbmV3IFBsdWdpbigpXG4gICAgICB9O1xuICAgICAgdGhpcy5wbHVnaW5zID0gdGhpcy5wbHVnaW5zLmNvbmNhdChbcGx1Z2luRGF0YV0pO1xuICAgICAgdGhpcy5jaGFuZ2UubmV4dCh0aGlzLnBsdWdpbnMpO1xuICB9XG5cbiAgcmVtb3ZlUGx1Z2luKG5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IHBsdWdpbiA9IHRoaXMucGx1Z2lucy5maW5kKChwbHVnaW5PYmopID0+IHBsdWdpbk9iai5uYW1lID09PSBuYW1lKTtcbiAgICBpZiAocGx1Z2luKSB7XG4gICAgICBjb25zdCBwbHVnaW5zID0gdGhpcy5wbHVnaW5zLnNsaWNlKCk7XG4gICAgICBwbHVnaW5zLnNwbGljZShwbHVnaW5zLmluZGV4T2YocGx1Z2luKSwgMSk7XG4gICAgICB0aGlzLnBsdWdpbnMgPSBwbHVnaW5zO1xuICAgICAgdGhpcy5jaGFuZ2UubmV4dCh0aGlzLnBsdWdpbnMpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBsdWdpbkRhdGEobmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMucGx1Z2lucy5yZWR1Y2UoKGNvbXBvbmVudHMsIHBsdWdpbkRhdGEpID0+IHtcbiAgICAgIHJldHVybiBjb21wb25lbnRzLmNvbmNhdChcbiAgICAgICAgcGx1Z2luRGF0YS5jb25maWcucGxhY2VtZW50c1xuICAgICAgICAgIC5maWx0ZXIoKHBsYWNlbWVudCkgPT4gcGxhY2VtZW50Lm5hbWUgPT09IG5hbWUpXG4gICAgICAgICAgLm1hcCgocGxhY2VtZW50KSA9PiBuZXcgUGx1Z2luRGF0YShwbHVnaW5EYXRhLCBwbGFjZW1lbnQpKVxuICAgICAgKTtcbiAgICB9LCBbXSk7XG4gIH1cbn1cbiJdfQ==