/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, Inject, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output } from '@angular/core';
import { PluginData } from './models';
import { PluginService } from './plugin-service';
export class ExtensionPointDirective {
    /**
     * @param {?} viewContainerRef
     * @param {?} componentResolver
     * @param {?} pluginService
     */
    constructor(viewContainerRef, componentResolver, pluginService) {
        this.override = false;
        this.output = new EventEmitter();
        this.componentRefs = [];
        this.viewContainerRef = viewContainerRef;
        this.componentResolver = componentResolver;
        this.pluginService = pluginService;
        this.pluginChangeSubscription = this.pluginService.change.subscribe(x => this.initialize());
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.initialize();
    }
    /**
     * @return {?}
     */
    initialize() {
        if (!this.name) {
            return;
        }
        const /** @type {?} */ pluginData = this.pluginService.getPluginData(this.name);
        if (this.override) {
            pluginData.sort((a, b) => a.placement.priority > b.placement.priority ? 1 : a.placement.priority < b.placement.priority ? -1 : 0);
            return this.instantiatePluginComponent(pluginData.shift());
        }
        else {
            pluginData.sort((a, b) => a.placement.priority > b.placement.priority ? 1 : a.placement.priority < b.placement.priority ? -1 : 0);
            return Promise.all(pluginData.map(plugin => this.instantiatePluginComponent(plugin)));
        }
    }
    /**
     * @param {?} pluginData
     * @return {?}
     */
    instantiatePluginComponent(pluginData) {
        if (!pluginData) {
            return;
        }
        const /** @type {?} */ componentFactory = this.componentResolver.resolveComponentFactory(pluginData.placement.component);
        const /** @type {?} */ contextInjector = this.viewContainerRef.parentInjector;
        const /** @type {?} */ providers = [{ provide: PluginData, useValue: pluginData }];
        const /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate(providers, contextInjector);
        const /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
        componentRef.instance.input = this.input;
        componentRef.instance.output = componentRef.instance.output || new EventEmitter();
        componentRef.instance.output.subscribe(childComponentEvent => this.output.emit(childComponentEvent));
        this.componentRefs.push(componentRef);
        componentRef.changeDetectorRef.markForCheck();
        componentRef.changeDetectorRef.detectChanges();
        return componentRef;
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.componentRefs.length) {
            this.componentRefs.forEach(componentRef => {
                componentRef.instance.input = this.input;
                return componentRef.instance.ngOnChanges ? componentRef.instance.ngOnChanges() : undefined;
            });
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.componentRefs.length) {
            this.componentRefs.forEach(componentRef => componentRef.destroy());
            this.componentRefs = [];
        }
        this.pluginChangeSubscription.unsubscribe();
    }
}
ExtensionPointDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: 'extension-point'
            },] },
];
/** @nocollapse */
ExtensionPointDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [ViewContainerRef,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [ComponentFactoryResolver,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [PluginService,] }] }
];
ExtensionPointDirective.propDecorators = {
    name: [{ type: Input }],
    override: [{ type: Input }],
    input: [{ type: Input }],
    output: [{ type: Output }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImV4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBWSxnQkFBZ0IsRUFDcEQsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQXdCLFlBQVksRUFBRSxNQUFNLEVBQ3pGLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBT2pELE1BQU07Ozs7OztJQVdKLFlBQXNDLGdCQUFnQixFQUFvQyxpQkFBaUIsRUFDbEYsYUFBYTt3QkFWVCxLQUFLO3NCQUVJLElBQUksWUFBWSxFQUFFOzZCQUlyQixFQUFFO1FBS25DLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQzdGOzs7O0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjs7OztJQUVNLFVBQVU7UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDO1NBQ1I7UUFDRCx1QkFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xJLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDNUQ7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZGOzs7Ozs7SUFHSSwwQkFBMEIsQ0FBQyxVQUFVO1FBQzFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUM7U0FDUjtRQUNELHVCQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3hHLHVCQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDO1FBQzdELHVCQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUNsRSx1QkFBTSxhQUFhLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3RGLHVCQUFNLFlBQVksR0FBUSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0gsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ2xGLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3RDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUM5QyxZQUFZLENBQUMsaUJBQWlCLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDL0MsTUFBTSxDQUFDLFlBQVksQ0FBQzs7Ozs7SUFHdEIsV0FBVztRQUNULEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDeEMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDekMsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7YUFDNUYsQ0FBQyxDQUFDO1NBQ0o7S0FDRjs7OztJQUVELFdBQVc7UUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztZQUNuRSxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUM3Qzs7O1lBMUVGLFNBQVMsU0FBQzs7Z0JBRVQsUUFBUSxFQUFFLGlCQUFpQjthQUM1Qjs7Ozs0Q0FZYyxNQUFNLFNBQUMsZ0JBQWdCOzRDQUFxQixNQUFNLFNBQUMsd0JBQXdCOzRDQUNyRixNQUFNLFNBQUMsYUFBYTs7O21CQVh0QixLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBJbnB1dCwgSW5qZWN0LCBQcm92aWRlciwgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBSZWZsZWN0aXZlSW5qZWN0b3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgT25Jbml0LCBDb21wb25lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnZXh0ZW5zaW9uLXBvaW50J1xufSlcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG92ZXJyaWRlOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGlucHV0OiBhbnk7XG4gIEBPdXRwdXQoKSBvdXRwdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHVibGljIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gIHB1YmxpYyBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuICBwdWJsaWMgY29tcG9uZW50UmVmczogQXJyYXk8YW55PiA9IFtdO1xuICBwdWJsaWMgcGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChWaWV3Q29udGFpbmVyUmVmKSB2aWV3Q29udGFpbmVyUmVmLCBASW5qZWN0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgY29tcG9uZW50UmVzb2x2ZXIsXG4gICAgQEluamVjdChQbHVnaW5TZXJ2aWNlKSBwbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB0aGlzLmNvbXBvbmVudFJlc29sdmVyID0gY29tcG9uZW50UmVzb2x2ZXI7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMucGx1Z2luU2VydmljZS5jaGFuZ2Uuc3Vic2NyaWJlKHggPT4gdGhpcy5pbml0aWFsaXplKCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwbHVnaW5EYXRhID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmdldFBsdWdpbkRhdGEodGhpcy5uYW1lKTtcbiAgICBpZiAodGhpcy5vdmVycmlkZSkge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YS5zaGlmdCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBsdWdpbkRhdGEubWFwKHBsdWdpbiA9PiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbikpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YSkge1xuICAgIGlmICghcGx1Z2luRGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRSZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShwbHVnaW5EYXRhLnBsYWNlbWVudC5jb21wb25lbnQpO1xuICAgIGNvbnN0IGNvbnRleHRJbmplY3RvciA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5wYXJlbnRJbmplY3RvcjtcbiAgICBjb25zdCBwcm92aWRlcnMgPSBbeyBwcm92aWRlOiBQbHVnaW5EYXRhLCB1c2VWYWx1ZTogcGx1Z2luRGF0YSB9XTtcbiAgICBjb25zdCBjaGlsZEluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUocHJvdmlkZXJzLCBjb250ZXh0SW5qZWN0b3IpO1xuICAgIGNvbnN0IGNvbXBvbmVudFJlZjogYW55ID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChjb21wb25lbnRGYWN0b3J5LCB0aGlzLnZpZXdDb250YWluZXJSZWYubGVuZ3RoLCBjaGlsZEluamVjdG9yKTtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXQgPSB0aGlzLmlucHV0O1xuICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5vdXRwdXQgPSBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0IHx8IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0LnN1YnNjcmliZShjaGlsZENvbXBvbmVudEV2ZW50ID0+IHRoaXMub3V0cHV0LmVtaXQoY2hpbGRDb21wb25lbnRFdmVudCkpO1xuICAgIHRoaXMuY29tcG9uZW50UmVmcy5wdXNoKGNvbXBvbmVudFJlZik7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZnMuZm9yRWFjaChjb21wb25lbnRSZWYgPT4ge1xuICAgICAgICBjb21wb25lbnRSZWYuaW5zdGFuY2UuaW5wdXQgPSB0aGlzLmlucHV0O1xuICAgICAgICByZXR1cm4gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzID8gY29tcG9uZW50UmVmLmluc3RhbmNlLm5nT25DaGFuZ2VzKCkgOiB1bmRlZmluZWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzLmZvckVhY2goY29tcG9uZW50UmVmID0+IGNvbXBvbmVudFJlZi5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgfVxuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==