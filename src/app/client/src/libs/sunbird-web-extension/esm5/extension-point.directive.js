/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, Inject, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output } from '@angular/core';
import { PluginData } from './models';
import { PluginService } from './plugin-service';
var ExtensionPointDirective = /** @class */ (function () {
    function ExtensionPointDirective(viewContainerRef, componentResolver, pluginService) {
        var _this = this;
        this.override = false;
        this.output = new EventEmitter();
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
        var /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate(providers, contextInjector);
        var /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
        componentRef.instance.input = this.input;
        componentRef.instance.output = componentRef.instance.output || new EventEmitter();
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
        if (this.componentRefs.length) {
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
        if (this.componentRefs.length) {
            this.componentRefs.forEach(function (componentRef) { return componentRef.destroy(); });
            this.componentRefs = [];
        }
        this.pluginChangeSubscription.unsubscribe();
    };
    ExtensionPointDirective.decorators = [
        { type: Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: 'extension-point'
                },] },
    ];
    /** @nocollapse */
    ExtensionPointDirective.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [ViewContainerRef,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [ComponentFactoryResolver,] }] },
        { type: undefined, decorators: [{ type: Inject, args: [PluginService,] }] }
    ]; };
    ExtensionPointDirective.propDecorators = {
        name: [{ type: Input }],
        override: [{ type: Input }],
        input: [{ type: Input }],
        output: [{ type: Output }]
    };
    return ExtensionPointDirective;
}());
export { ExtensionPointDirective };
function ExtensionPointDirective_tsickle_Closure_declarations() {
    /** @type {?} */
    ExtensionPointDirective.prototype.name;
    /** @type {?} */
    ExtensionPointDirective.prototype.override;
    /** @type {?} */
    ExtensionPointDirective.prototype.input;
    /** @type {?} */
    ExtensionPointDirective.prototype.output;
    /** @type {?} */
    ExtensionPointDirective.prototype.viewContainerRef;
    /** @type {?} */
    ExtensionPointDirective.prototype.componentResolver;
    /** @type {?} */
    ExtensionPointDirective.prototype.pluginService;
    /** @type {?} */
    ExtensionPointDirective.prototype.componentRefs;
    /** @type {?} */
    ExtensionPointDirective.prototype.pluginChangeSubscription;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImV4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBWSxnQkFBZ0IsRUFDcEQsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQXdCLFlBQVksRUFBRSxNQUFNLEVBQ3pGLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztJQWtCL0MsaUNBQXNDLGdCQUFnQixFQUFvQyxpQkFBaUIsRUFDbEYsYUFBYTtRQUR0QyxpQkFNQzt3QkFmNEIsS0FBSztzQkFFSSxJQUFJLFlBQVksRUFBRTs2QkFJckIsRUFBRTtRQUtuQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFDekMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO1FBQzNDLElBQUksQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO1FBQ25DLElBQUksQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQWpCLENBQWlCLENBQUMsQ0FBQztLQUM3Rjs7OztJQUVELDBDQUFROzs7SUFBUjtRQUNFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjs7OztJQUVNLDRDQUFVOzs7OztRQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUM7U0FDUjtRQUNELHFCQUFNLFVBQVUsR0FBRyxJQUFJLENB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LENBQUMsWUFBWSxDQUFDOzs7OztJQUd0Qiw2Q0FBVzs7O0lBQVg7UUFBQSxpQkFPQztRQU5DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFlBQVk7Z0JBQ3JDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQzVGLENBQUMsQ0FBQztTQUNKO0tBQ0Y7Ozs7SUFFRCw2Q0FBVzs7O0lBQVg7UUFDRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZLElBQUksT0FBQSxZQUFZLENBQUMsT0FBTyxFQUFFLEVBQXRCLENBQXNCLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUM3Qzs7Z0JBMUVGLFNBQVMsU0FBQzs7b0JBRVQsUUFBUSxFQUFFLGlCQUFpQjtpQkFDNUI7Ozs7Z0RBWWMsTUFBTSxTQUFDLGdCQUFnQjtnREFBcUIsTUFBTSxTQUFDLHdCQUF3QjtnREFDckYsTUFBTSxTQUFDLGFBQWE7Ozt1QkFYdEIsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsTUFBTTs7a0NBaEJUOztTQVlhLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgSW5wdXQsIEluamVjdCwgUHJvdmlkZXIsIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgUmVmbGVjdGl2ZUluamVjdG9yLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIE9uSW5pdCwgQ29tcG9uZW50UmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1Z2luRGF0YSB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2V4dGVuc2lvbi1wb2ludCdcbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBvdmVycmlkZTogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBpbnB1dDogYW55O1xuICBAT3V0cHV0KCkgb3V0cHV0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG4gIHB1YmxpYyBjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuICBwdWJsaWMgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcbiAgcHVibGljIGNvbXBvbmVudFJlZnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHVibGljIHBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoVmlld0NvbnRhaW5lclJlZikgdmlld0NvbnRhaW5lclJlZiwgQEluamVjdChDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpIGNvbXBvbmVudFJlc29sdmVyLFxuICAgIEBJbmplY3QoUGx1Z2luU2VydmljZSkgcGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZiA9IHZpZXdDb250YWluZXJSZWY7XG4gICAgdGhpcy5jb21wb25lbnRSZXNvbHZlciA9IGNvbXBvbmVudFJlc29sdmVyO1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnBsdWdpblNlcnZpY2UuY2hhbmdlLnN1YnNjcmliZSh4ID0+IHRoaXMuaW5pdGlhbGl6ZSgpKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLm5hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGx1Z2luRGF0YSA9IHRoaXMucGx1Z2luU2VydmljZS5nZXRQbHVnaW5EYXRhKHRoaXMubmFtZSk7XG4gICAgaWYgKHRoaXMub3ZlcnJpZGUpIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEuc2hpZnQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwbHVnaW5EYXRhLm1hcChwbHVnaW4gPT4gdGhpcy5pbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW4pKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEpIHtcbiAgICBpZiAoIXBsdWdpbkRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkocGx1Z2luRGF0YS5wbGFjZW1lbnQuY29tcG9uZW50KTtcbiAgICBjb25zdCBjb250ZXh0SW5qZWN0b3IgPSB0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3I7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW3sgcHJvdmlkZTogUGx1Z2luRGF0YSwgdXNlVmFsdWU6IHBsdWdpbkRhdGEgfV07XG4gICAgY29uc3QgY2hpbGRJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVycywgY29udGV4dEluamVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWY6IGFueSA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aCwgY2hpbGRJbmplY3Rvcik7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmlucHV0ID0gdGhpcy5pbnB1dDtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dCB8fCBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dC5zdWJzY3JpYmUoY2hpbGRDb21wb25lbnRFdmVudCA9PiB0aGlzLm91dHB1dC5lbWl0KGNoaWxkQ29tcG9uZW50RXZlbnQpKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZnMucHVzaChjb21wb25lbnRSZWYpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiBjb21wb25lbnRSZWY7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzLmZvckVhY2goY29tcG9uZW50UmVmID0+IHtcbiAgICAgICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmlucHV0ID0gdGhpcy5pbnB1dDtcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5uZ09uQ2hhbmdlcyA/IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5uZ09uQ2hhbmdlcygpIDogdW5kZWZpbmVkO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmcy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKGNvbXBvbmVudFJlZiA9PiBjb21wb25lbnRSZWYuZGVzdHJveSgpKTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=