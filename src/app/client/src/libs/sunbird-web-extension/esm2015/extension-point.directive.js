/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, EventEmitter, Output } from '@angular/core';
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
        if (this.componentRefs.length > 0) {
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
        if (this.componentRefs.length > 0) {
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
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver },
    { type: PluginService }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImV4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQUUsS0FBSyxFQUFvQixnQkFBZ0IsRUFDcEQsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQXdCLFlBQVksRUFBRSxNQUFNLEVBQ3pGLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDdEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBT2pELE1BQU07Ozs7OztJQVdKLFlBQVksZ0JBQWtDLEVBQUUsaUJBQTJDLEVBQ3pGLGFBQTRCO3dCQVZELEtBQUs7c0JBRUksSUFBSSxZQUFZLEVBQUU7NkJBSXJCLEVBQUU7UUFLbkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1FBQ3pDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztRQUMzQyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztRQUNuQyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDN0Y7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7O0lBRU0sVUFBVTtRQUNmLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUM7U0FDUjtRQUNELHVCQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFB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QUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQ3hDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3pDLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2FBQzVGLENBQUMsQ0FBQztTQUNKO0tBQ0Y7Ozs7SUFFRCxXQUFXO1FBQ1QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO1NBQ3pCO1FBQ0QsSUFBSSxDQUFDLHdCQUF3QixDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzdDOzs7WUExRUYsU0FBUyxTQUFDOztnQkFFVCxRQUFRLEVBQUUsaUJBQWlCO2FBQzVCOzs7O1lBVnFDLGdCQUFnQjtZQUNwRCx3QkFBd0I7WUFHakIsYUFBYTs7O21CQVFuQixLQUFLO3VCQUNMLEtBQUs7b0JBQ0wsS0FBSztxQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLCBJbnB1dCwgSW5qZWN0LCBQcm92aWRlciwgVmlld0NvbnRhaW5lclJlZixcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBSZWZsZWN0aXZlSW5qZWN0b3IsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgT25Jbml0LCBDb21wb25lbnRSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBQbHVnaW5EYXRhIH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6ZGlyZWN0aXZlLXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnZXh0ZW5zaW9uLXBvaW50J1xufSlcbmV4cG9ydCBjbGFzcyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG92ZXJyaWRlOiBCb29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGlucHV0OiBhbnk7XG4gIEBPdXRwdXQoKSBvdXRwdXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZjtcbiAgcHVibGljIGNvbXBvbmVudFJlc29sdmVyOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG4gIHB1YmxpYyBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlO1xuICBwdWJsaWMgY29tcG9uZW50UmVmczogQXJyYXk8YW55PiA9IFtdO1xuICBwdWJsaWMgcGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3Iodmlld0NvbnRhaW5lclJlZjogVmlld0NvbnRhaW5lclJlZiwgY29tcG9uZW50UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICBwbHVnaW5TZXJ2aWNlOiBQbHVnaW5TZXJ2aWNlKSB7XG4gICAgdGhpcy52aWV3Q29udGFpbmVyUmVmID0gdmlld0NvbnRhaW5lclJlZjtcbiAgICB0aGlzLmNvbXBvbmVudFJlc29sdmVyID0gY29tcG9uZW50UmVzb2x2ZXI7XG4gICAgdGhpcy5wbHVnaW5TZXJ2aWNlID0gcGx1Z2luU2VydmljZTtcbiAgICB0aGlzLnBsdWdpbkNoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMucGx1Z2luU2VydmljZS5jaGFuZ2Uuc3Vic2NyaWJlKHggPT4gdGhpcy5pbml0aWFsaXplKCkpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdGlhbGl6ZSgpIHtcbiAgICBpZiAoIXRoaXMubmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwbHVnaW5EYXRhID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmdldFBsdWdpbkRhdGEodGhpcy5uYW1lKTtcbiAgICBpZiAodGhpcy5vdmVycmlkZSkge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YS5zaGlmdCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGx1Z2luRGF0YS5zb3J0KChhLCBiKSA9PiBhLnBsYWNlbWVudC5wcmlvcml0eSA+IGIucGxhY2VtZW50LnByaW9yaXR5ID8gMSA6IGEucGxhY2VtZW50LnByaW9yaXR5IDwgYi5wbGFjZW1lbnQucHJpb3JpdHkgPyAtMSA6IDApO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBsdWdpbkRhdGEubWFwKHBsdWdpbiA9PiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbikpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YTogUGx1Z2luRGF0YSk6IENvbXBvbmVudFJlZjxhbnk+IHtcbiAgICBpZiAoIXBsdWdpbkRhdGEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY29tcG9uZW50RmFjdG9yeSA9IHRoaXMuY29tcG9uZW50UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkocGx1Z2luRGF0YS5wbGFjZW1lbnQuY29tcG9uZW50KTtcbiAgICBjb25zdCBjb250ZXh0SW5qZWN0b3IgPSB0aGlzLnZpZXdDb250YWluZXJSZWYucGFyZW50SW5qZWN0b3I7XG4gICAgY29uc3QgcHJvdmlkZXJzID0gW3sgcHJvdmlkZTogUGx1Z2luRGF0YSwgdXNlVmFsdWU6IHBsdWdpbkRhdGEgfV07XG4gICAgY29uc3QgY2hpbGRJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVycywgY29udGV4dEluamVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWY6IGFueSA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSwgdGhpcy52aWV3Q29udGFpbmVyUmVmLmxlbmd0aCwgY2hpbGRJbmplY3Rvcik7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLmlucHV0ID0gdGhpcy5pbnB1dDtcbiAgICBjb21wb25lbnRSZWYuaW5zdGFuY2Uub3V0cHV0ID0gY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dCB8fCBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgY29tcG9uZW50UmVmLmluc3RhbmNlLm91dHB1dC5zdWJzY3JpYmUoY2hpbGRDb21wb25lbnRFdmVudCA9PiB0aGlzLm91dHB1dC5lbWl0KGNoaWxkQ29tcG9uZW50RXZlbnQpKTtcbiAgICB0aGlzLmNvbXBvbmVudFJlZnMucHVzaChjb21wb25lbnRSZWYpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHJldHVybiBjb21wb25lbnRSZWY7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKGNvbXBvbmVudFJlZiA9PiB7XG4gICAgICAgIGNvbXBvbmVudFJlZi5pbnN0YW5jZS5pbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgICAgIHJldHVybiBjb21wb25lbnRSZWYuaW5zdGFuY2UubmdPbkNoYW5nZXMgPyBjb21wb25lbnRSZWYuaW5zdGFuY2UubmdPbkNoYW5nZXMoKSA6IHVuZGVmaW5lZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmNvbXBvbmVudFJlZnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzLmZvckVhY2goY29tcG9uZW50UmVmID0+IGNvbXBvbmVudFJlZi5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgfVxuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==