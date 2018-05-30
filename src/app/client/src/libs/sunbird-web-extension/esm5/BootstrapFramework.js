/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { PluginService } from './plugin-service';
import { Injectable } from '@angular/core';
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
export { BootstrapFramework };
function BootstrapFramework_tsickle_Closure_declarations() {
    /** @type {?} */
    BootstrapFramework.prototype.config;
    /** @type {?} */
    BootstrapFramework.prototype.pluginService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vdHN0cmFwRnJhbWV3b3JrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vc3VuYmlyZC13ZWItZXh0ZW5zaW9uLyIsInNvdXJjZXMiOlsiQm9vdHN0cmFwRnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7SUFTekMsNEJBQVksYUFBNEI7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7S0FDcEM7Ozs7O0lBRUQsdUNBQVU7Ozs7SUFBVixVQUFXLE1BQVc7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzdDOztnQkFkRixVQUFVOzs7O2dCQUhGLGFBQWE7OzZCQUF0Qjs7U0FJYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbHVnaW5TZXJ2aWNlIH0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBCb290c3RyYXBGcmFtZXdvcmsge1xuXG4gIHByaXZhdGUgY29uZmlnOiBhbnk7XG5cbiAgcHJpdmF0ZSBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuXG4gIGNvbnN0cnVjdG9yKHBsdWdpblNlcnZpY2U6IFBsdWdpblNlcnZpY2UpIHtcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UgPSBwbHVnaW5TZXJ2aWNlO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShjb25maWc6IGFueSkge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMucGx1Z2luU2VydmljZS5sb2FkUGx1Z2lucyh0aGlzLmNvbmZpZyk7XG4gIH1cbn1cbiJdfQ==