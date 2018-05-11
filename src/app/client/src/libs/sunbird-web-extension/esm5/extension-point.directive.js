/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, Inject, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';
import { PluginData } from './models';
import { PluginService } from './plugin-service';
var ExtenstionPointDirective = /** @class */ (function () {
    function ExtenstionPointDirective(viewContainerRef, componentResolver, pluginService) {
        var _this = this;
        this.override = false;
        this.viewContainerRef = viewContainerRef;
        this.componentResolver = componentResolver;
        this.pluginService = pluginService;
        this.componentRefs = [];
        this.pluginChangeSubscription = this.pluginService.change.subscribe(function () { return _this.initialize(); });
    }
    /**
     * @return {?}
     */
    ExtenstionPointDirective.prototype.initialize = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.name) {
            return;
        }
        if (this.componentRefs.length > 0) {
            this.componentRefs.forEach(function (componentRef) { return componentRef.destroy(); });
            this.componentRefs = [];
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
    ExtenstionPointDirective.prototype.instantiatePluginComponent = /**
     * @param {?} pluginData
     * @return {?}
     */
    function (pluginData) {
        if (!pluginData) {
            return;
        }
        var /** @type {?} */ componentFactory = this.componentResolver.resolveComponentFactory(pluginData.placement.component);
        var /** @type {?} */ contextInjector = this.viewContainerRef.parentInjector;
        var /** @type {?} */ providers = [
            { provide: PluginData, useValue: pluginData }
        ];
        var /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate(providers, contextInjector);
        var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
        this.componentRefs.push(componentRef);
        componentRef.changeDetectorRef.markForCheck();
        componentRef.changeDetectorRef.detectChanges();
        return componentRef;
    };
    /**
     * @return {?}
     */
    ExtenstionPointDirective.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        this.initialize();
    };
    /**
     * @return {?}
     */
    ExtenstionPointDirective.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.pluginChangeSubscription.unsubscribe();
    };
    ExtenstionPointDirective.decorators = [
        { type: Directive, args: [{
                    selector: 'extension-point'
                },] },
    ];
    /** @nocollapse */
    ExtenstionPointDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [ViewContainerRef,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [ComponentFactoryResolver,] },] },
        { type: undefined, decorators: [{ type: Inject, args: [PluginService,] },] },
    ]; };
    ExtenstionPointDirective.propDecorators = {
        "name": [{ type: Input },],
        "override": [{ type: Input },],
    };
    return ExtenstionPointDirective;
}());
export { ExtenstionPointDirective };
function ExtenstionPointDirective_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    ExtenstionPointDirective.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    ExtenstionPointDirective.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    ExtenstionPointDirective.propDecorators;
    /** @type {?} */
    ExtenstionPointDirective.prototype.name;
    /** @type {?} */
    ExtenstionPointDirective.prototype.override;
    /** @type {?} */
    ExtenstionPointDirective.prototype.viewContainerRef;
    /** @type {?} */
    ExtenstionPointDirective.prototype.componentResolver;
    /** @type {?} */
    ExtenstionPointDirective.prototype.pluginService;
    /** @type {?} */
    ExtenstionPointDirective.prototype.componentRefs;
    /** @type {?} */
    ExtenstionPointDirective.prototype.pluginChangeSubscription;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImV4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBWSxnQkFBZ0IsRUFDMUQsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDOztJQWM3QyxrQ0FBc0MsZ0JBQWdCLEVBQW9DLGlCQUFpQixFQUNwRixhQUFhO1FBRHBDLGlCQU9DO3dCQWQ0QixLQUFLO1FBU2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsS0FBSSxDQUFDLFVBQVUsRUFBRSxFQUFqQixDQUFpQixDQUFDLENBQUM7S0FDOUY7Ozs7SUFFTSw2Q0FBVTs7Ozs7UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDO1NBQ1I7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLFVBQUMsWUFBWSxJQUFLLE9BQUEsWUFBWSxDQUFDLE9BQU8sRUFBRSxFQUF0QixDQUFzQixDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7U0FDekI7UUFFRCxxQkFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQXRHLENBQXNHLENBQUMsQ0FBQztZQUNsSSxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzVEO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUF0RyxDQUFzRyxDQUFDLENBQUM7WUFDbEksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLE1BQU0sSUFBSyxPQUFBLEtBQUksQ0FBQywwQkFBMEIsQ0FBQyxNQUFNLENBQUMsRUFBdkMsQ0FBdUMsQ0FBQyxDQUFDLENBQUM7U0FDekY7Ozs7OztJQUdJLDZEQUEwQjs7OztjQUFDLFVBQVU7UUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQztTQUNSO1FBRUQscUJBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEcscUJBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLENBQUM7UUFDN0QscUJBQU0sU0FBUyxHQUFHO1lBQ2hCLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFO1NBQzlDLENBQUM7UUFDRixxQkFBTSxhQUFhLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3RGLHFCQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDMUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDdEMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzlDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUMvQyxNQUFNLENBQUMsWUFBWSxDQUFDOzs7OztJQUd0Qiw4Q0FBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkI7Ozs7SUFFRCw4Q0FBVzs7O0lBQVg7UUFDRSxJQUFJLENBQUMsd0JBQXdCLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDN0M7O2dCQWpFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLGlCQUFpQjtpQkFDNUI7Ozs7Z0RBVWMsTUFBTSxTQUFDLGdCQUFnQjtnREFBcUIsTUFBTSxTQUFDLHdCQUF3QjtnREFDdkYsTUFBTSxTQUFDLGFBQWE7Ozt5QkFUcEIsS0FBSzs2QkFDTCxLQUFLOzttQ0FWUjs7U0FRYSx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgSW5wdXQsIEluamVjdCwgUHJvdmlkZXIsIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgUmVmbGVjdGl2ZUluamVjdG9yLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsdWdpbkRhdGF9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7UGx1Z2luU2VydmljZX0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2V4dGVuc2lvbi1wb2ludCdcbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG92ZXJyaWRlOiBCb29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyB2aWV3Q29udGFpbmVyUmVmO1xuICBwdWJsaWMgY29tcG9uZW50UmVzb2x2ZXI7XG4gIHB1YmxpYyBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuICBwdWJsaWMgY29tcG9uZW50UmVmcztcbiAgcHVibGljIHBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KFZpZXdDb250YWluZXJSZWYpIHZpZXdDb250YWluZXJSZWYsIEBJbmplY3QoQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyKSBjb21wb25lbnRSZXNvbHZlciwgXG4gIEBJbmplY3QoUGx1Z2luU2VydmljZSkgcGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZiA9IHZpZXdDb250YWluZXJSZWY7XG4gICAgdGhpcy5jb21wb25lbnRSZXNvbHZlciA9IGNvbXBvbmVudFJlc29sdmVyO1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnBsdWdpblNlcnZpY2UuY2hhbmdlLnN1YnNjcmliZSgoKSA9PiB0aGlzLmluaXRpYWxpemUoKSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzLmZvckVhY2goKGNvbXBvbmVudFJlZikgPT4gY29tcG9uZW50UmVmLmRlc3Ryb3koKSk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMgPSBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBwbHVnaW5EYXRhID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmdldFBsdWdpbkRhdGEodGhpcy5uYW1lKTtcbiAgICBpZiAodGhpcy5vdmVycmlkZSkge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YS5zaGlmdCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBsdWdpbkRhdGEubWFwKChwbHVnaW4pID0+IHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luKSkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBpbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW5EYXRhKSB7XG4gICAgaWYgKCFwbHVnaW5EYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkocGx1Z2luRGF0YS5wbGFjZW1lbnQuY29tcG9uZW50KTtcbiAgICBjb25zdCBjb250ZXh0SW5qZWN0b3IgPSB0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3I7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW1xuICAgICAgeyBwcm92aWRlOiBQbHVnaW5EYXRhLCB1c2VWYWx1ZTogcGx1Z2luRGF0YSB9XG4gICAgXTtcbiAgICBjb25zdCBjaGlsZEluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUocHJvdmlkZXJzLCBjb250ZXh0SW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aCwgY2hpbGRJbmplY3Rvcik7XG4gICAgdGhpcy5jb21wb25lbnRSZWZzLnB1c2goY29tcG9uZW50UmVmKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gY29tcG9uZW50UmVmO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=