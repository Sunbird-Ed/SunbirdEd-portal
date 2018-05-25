/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { PluginService } from './plugin-service';
import { Injectable } from '@angular/core';
export class BootstrapFramework {
    /**
     * @param {?} pluginService
     */
    constructor(pluginService) {
        this.pluginService = pluginService;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    initialize(config) {
        this.config = config;
        this.pluginService.loadPlugins(this.config);
    }
}
BootstrapFramework.decorators = [
    { type: Injectable },
];
/** @nocollapse */
BootstrapFramework.ctorParameters = () => [
    { type: PluginService }
];
function BootstrapFramework_tsickle_Closure_declarations() {
    /** @type {?} */
    BootstrapFramework.prototype.config;
    /** @type {?} */
    BootstrapFramework.prototype.pluginService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vdHN0cmFwRnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uLyIsInNvdXJjZXMiOlsiQm9vdHN0cmFwRnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQyxNQUFNOzs7O0lBTUosWUFBWSxhQUE0QjtRQUN0QyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztLQUNwQzs7Ozs7SUFFRCxVQUFVLENBQUMsTUFBVztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDN0M7OztZQWRGLFVBQVU7Ozs7WUFIRixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwRnJhbWV3b3JrIHtcblxuICBwcml2YXRlIGNvbmZpZzogYW55O1xuXG4gIHByaXZhdGUgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcblxuICBjb25zdHJ1Y3RvcihwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgfVxuXG4gIGluaXRpYWxpemUoY29uZmlnOiBhbnkpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UubG9hZFBsdWdpbnModGhpcy5jb25maWcpO1xuICB9XG59XG4iXX0=