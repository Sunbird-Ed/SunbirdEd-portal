/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output } from '@angular/core';
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
        if (this.componentRefs.length > 0) {
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
        if (this.componentRefs.length > 0) {
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
        { type: ViewContainerRef },
        { type: ComponentFactoryResolver },
        { type: PluginService }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImV4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBSyxFQUFvQixnQkFBZ0IsRUFDcEQsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQXdCLFlBQVksRUFBRSxNQUFNLEVBQ3pGLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDOztJQWtCL0MsaUNBQVksZ0JBQWtDLEVBQUUsaUJBQTJDLEVBQ3pGLGFBQTRCO1FBRDlCLGlCQU1DO3dCQWY0QixLQUFLO3NCQUVJLElBQUksWUFBWSxFQUFFOzZCQUlyQixFQUFFO1FBS25DLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEtBQUksQ0FBQyxVQUFVLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0tBQzdGOzs7O0lBRUQsMENBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7O0lBRU0sNENBQVU7Ozs7O1FBQ2YsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNmLE1BQU0sQ0FBQztTQUNSO1FBQ0QscUJBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENB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WSxDQUFDOzs7OztJQUd0Qiw2Q0FBVzs7O0lBQVg7UUFBQSxpQkFPQztRQU5DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsVUFBQSxZQUFZO2dCQUNyQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDO2dCQUN6QyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzthQUM1RixDQUFDLENBQUM7U0FDSjtLQUNGOzs7O0lBRUQsNkNBQVc7OztJQUFYO1FBQ0UsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFBLFlBQVksSUFBSSxPQUFBLFlBQVksQ0FBQyxPQUFPLEVBQUUsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzdDOztnQkExRUYsU0FBUyxTQUFDOztvQkFFVCxRQUFRLEVBQUUsaUJBQWlCO2lCQUM1Qjs7OztnQkFWcUMsZ0JBQWdCO2dCQUNwRCx3QkFBd0I7Z0JBR2pCLGFBQWE7Ozt1QkFRbkIsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7eUJBQ0wsTUFBTTs7a0NBaEJUOztTQVlhLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgSW5wdXQsIEluamVjdCwgUHJvdmlkZXIsIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgUmVmbGVjdGl2ZUluamVjdG9yLCBPbkRlc3Ryb3ksIE9uQ2hhbmdlcywgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIE9uSW5pdCwgQ29tcG9uZW50UmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1Z2luRGF0YSB9IGZyb20gJy4vbW9kZWxzJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2V4dGVuc2lvbi1wb2ludCdcbn0pXG5leHBvcnQgY2xhc3MgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBvdmVycmlkZTogQm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBpbnB1dDogYW55O1xuICBAT3V0cHV0KCkgb3V0cHV0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgcHVibGljIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWY7XG4gIHB1YmxpYyBjb21wb25lbnRSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyO1xuICBwdWJsaWMgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcbiAgcHVibGljIGNvbXBvbmVudFJlZnM6IEFycmF5PGFueT4gPSBbXTtcbiAgcHVibGljIHBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gICAgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZSkge1xuICAgIHRoaXMudmlld0NvbnRhaW5lclJlZiA9IHZpZXdDb250YWluZXJSZWY7XG4gICAgdGhpcy5jb21wb25lbnRSZXNvbHZlciA9IGNvbXBvbmVudFJlc29sdmVyO1xuICAgIHRoaXMucGx1Z2luU2VydmljZSA9IHBsdWdpblNlcnZpY2U7XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLnBsdWdpblNlcnZpY2UuY2hhbmdlLnN1YnNjcmliZSh4ID0+IHRoaXMuaW5pdGlhbGl6ZSgpKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLm5hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGx1Z2luRGF0YSA9IHRoaXMucGx1Z2luU2VydmljZS5nZXRQbHVnaW5EYXRhKHRoaXMubmFtZSk7XG4gICAgaWYgKHRoaXMub3ZlcnJpZGUpIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEuc2hpZnQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwbHVnaW5EYXRhLm1hcChwbHVnaW4gPT4gdGhpcy5pbnN0YW50aWF0ZVBsdWdpbkNvbXBvbmVudChwbHVnaW4pKSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGE6IFBsdWdpbkRhdGEpOiBDb21wb25lbnRSZWY8YW55PiB7XG4gICAgaWYgKCFwbHVnaW5EYXRhKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBsdWdpbkRhdGEucGxhY2VtZW50LmNvbXBvbmVudCk7XG4gICAgY29uc3QgY29udGV4dEluamVjdG9yID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFt7IHByb3ZpZGU6IFBsdWdpbkRhdGEsIHVzZVZhbHVlOiBwbHVnaW5EYXRhIH1dO1xuICAgIGNvbnN0IGNoaWxkSW5qZWN0b3IgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShwcm92aWRlcnMsIGNvbnRleHRJbmplY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50UmVmOiBhbnkgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnksIHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGgsIGNoaWxkSW5qZWN0b3IpO1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dCA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQgfHwgbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQuc3Vic2NyaWJlKGNoaWxkQ29tcG9uZW50RXZlbnQgPT4gdGhpcy5vdXRwdXQuZW1pdChjaGlsZENvbXBvbmVudEV2ZW50KSk7XG4gICAgdGhpcy5jb21wb25lbnRSZWZzLnB1c2goY29tcG9uZW50UmVmKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gY29tcG9uZW50UmVmO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMuY29tcG9uZW50UmVmcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMuZm9yRWFjaChjb21wb25lbnRSZWYgPT4ge1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXQgPSB0aGlzLmlucHV0O1xuICAgICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzID8gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzKCkgOiB1bmRlZmluZWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKGNvbXBvbmVudFJlZiA9PiBjb21wb25lbnRSZWYuZGVzdHJveSgpKTtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcyA9IFtdO1xuICAgIH1cbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=