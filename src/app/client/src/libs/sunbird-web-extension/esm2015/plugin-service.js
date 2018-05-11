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
        for (let /** @type {?} */ plugin of plugins) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9zdW5iaXJkLXdlYi1leHRlbnNpb24vIiwic291cmNlcyI6WyJwbHVnaW4tc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFHckMsTUFBTTtJQUtKO1FBQ0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQzs7Ozs7SUFFRCxXQUFXLENBQUMsTUFBVztRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7U0FDN0U7UUFFRCx1QkFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4RCxHQUFHLENBQUMsQ0FBQyxxQkFBSSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0tBQ0Y7Ozs7O0lBRUQsVUFBVSxDQUFDLE1BQU07UUFDYix1QkFBTSxNQUFNLHFCQUFRLE1BQU0sQ0FBQSxDQUFDO1FBQzNCLHVCQUFNLFVBQVUsR0FBRztZQUNqQixJQUFJLEVBQUUsTUFBTTtZQUNaLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYTtZQUM1QixRQUFRLEVBQUUsSUFBSSxNQUFNLEVBQUU7U0FDdkIsQ0FBQztRQUNGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNsQzs7Ozs7SUFFRCxZQUFZLENBQUMsSUFBWTtRQUN2Qix1QkFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7UUFDekUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLHVCQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7S0FDRjs7Ozs7SUFFRCxhQUFhLENBQUMsSUFBWTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLEVBQUU7WUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQ3RCLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVTtpQkFDekIsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQztpQkFDOUMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FDN0QsQ0FBQztTQUNILEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDUjs7O1lBbkRGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbHVnaW5EYXRhfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBQbHVnaW5TZXJ2aWNlIHtcbiAgcHVibGljIHBsdWdpbnM7XG4gIHB1YmxpYyBjaGFuZ2U7XG4gIHByaXZhdGUgY29uZmlnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucGx1Z2lucyA9IFtdO1xuICAgIHRoaXMuY2hhbmdlID0gbmV3IFJlcGxheVN1YmplY3QoMSk7XG4gIH1cblxuICBsb2FkUGx1Z2lucyhjb25maWc6IGFueSkge1xuICAgIGlmICghY29uZmlnIHx8ICFBcnJheS5pc0FycmF5KGNvbmZpZy5wbHVnaW5zKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGZyYW1ld29yayBjb25maWd1cmF0aW9uISBGYWlsZWQgdG8gbG9hZCBwbHVnaW5zIScpO1xuICAgIH1cblxuICAgIGNvbnN0IHBsdWdpbnMgPSBjb25maWcucGx1Z2lucy5tYXAoKGRhdGEpID0+IGRhdGEubWFpbik7XG4gICAgZm9yIChsZXQgcGx1Z2luIG9mIHBsdWdpbnMpIHtcbiAgICAgIHRoaXMubG9hZFBsdWdpbihwbHVnaW4pO1xuICAgIH1cbiAgfVxuXG4gIGxvYWRQbHVnaW4ocGx1Z2luKSB7XG4gICAgICBjb25zdCBQbHVnaW4gPSA8YW55PnBsdWdpbjtcbiAgICAgIGNvbnN0IHBsdWdpbkRhdGEgPSB7XG4gICAgICAgIHR5cGU6IFBsdWdpbixcbiAgICAgICAgY29uZmlnOiBQbHVnaW4uX3BsdWdpbkNvbmZpZyxcbiAgICAgICAgaW5zdGFuY2U6IG5ldyBQbHVnaW4oKVxuICAgICAgfTtcbiAgICAgIHRoaXMucGx1Z2lucyA9IHRoaXMucGx1Z2lucy5jb25jYXQoW3BsdWdpbkRhdGFdKTtcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgfVxuXG4gIHJlbW92ZVBsdWdpbihuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwbHVnaW4gPSB0aGlzLnBsdWdpbnMuZmluZCgocGx1Z2luT2JqKSA9PiBwbHVnaW5PYmoubmFtZSA9PT0gbmFtZSk7XG4gICAgaWYgKHBsdWdpbikge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IHRoaXMucGx1Z2lucy5zbGljZSgpO1xuICAgICAgcGx1Z2lucy5zcGxpY2UocGx1Z2lucy5pbmRleE9mKHBsdWdpbiksIDEpO1xuICAgICAgdGhpcy5wbHVnaW5zID0gcGx1Z2lucztcbiAgICAgIHRoaXMuY2hhbmdlLm5leHQodGhpcy5wbHVnaW5zKTtcbiAgICB9XG4gIH1cblxuICBnZXRQbHVnaW5EYXRhKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnBsdWdpbnMucmVkdWNlKChjb21wb25lbnRzLCBwbHVnaW5EYXRhKSA9PiB7XG4gICAgICByZXR1cm4gY29tcG9uZW50cy5jb25jYXQoXG4gICAgICAgIHBsdWdpbkRhdGEuY29uZmlnLnBsYWNlbWVudHNcbiAgICAgICAgICAuZmlsdGVyKChwbGFjZW1lbnQpID0+IHBsYWNlbWVudC5uYW1lID09PSBuYW1lKVxuICAgICAgICAgIC5tYXAoKHBsYWNlbWVudCkgPT4gbmV3IFBsdWdpbkRhdGEocGx1Z2luRGF0YSwgcGxhY2VtZW50KSlcbiAgICAgICk7XG4gICAgfSwgW10pO1xuICB9XG59XG4iXX0=