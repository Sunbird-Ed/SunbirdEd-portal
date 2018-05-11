/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Directive, Input, Inject, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';
import { PluginData } from './models';
import { PluginService } from './plugin-service';
export class ExtenstionPointDirective {
    /**
     * @param {?} viewContainerRef
     * @param {?} componentResolver
     * @param {?} pluginService
     */
    constructor(viewContainerRef, componentResolver, pluginService) {
        this.override = false;
        this.viewContainerRef = viewContainerRef;
        this.componentResolver = componentResolver;
        this.pluginService = pluginService;
        this.componentRefs = [];
        this.pluginChangeSubscription = this.pluginService.change.subscribe(() => this.initialize());
    }
    /**
     * @return {?}
     */
    initialize() {
        if (!this.name) {
            return;
        }
        if (this.componentRefs.length > 0) {
            this.componentRefs.forEach((componentRef) => componentRef.destroy());
            this.componentRefs = [];
        }
        const /** @type {?} */ pluginData = this.pluginService.getPluginData(this.name);
        if (this.override) {
            pluginData.sort((a, b) => a.placement.priority > b.placement.priority ? 1 : a.placement.priority < b.placement.priority ? -1 : 0);
            return this.instantiatePluginComponent(pluginData.shift());
        }
        else {
            pluginData.sort((a, b) => a.placement.priority > b.placement.priority ? 1 : a.placement.priority < b.placement.priority ? -1 : 0);
            return Promise.all(pluginData.map((plugin) => this.instantiatePluginComponent(plugin)));
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
        const /** @type {?} */ providers = [
            { provide: PluginData, useValue: pluginData }
        ];
        const /** @type {?} */ childInjector = ReflectiveInjector.resolveAndCreate(providers, contextInjector);
        const /** @type {?} */ componentRef = this.viewContainerRef.createComponent(componentFactory, this.viewContainerRef.length, childInjector);
        this.componentRefs.push(componentRef);
        componentRef.changeDetectorRef.markForCheck();
        componentRef.changeDetectorRef.detectChanges();
        return componentRef;
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        this.initialize();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.pluginChangeSubscription.unsubscribe();
    }
}
ExtenstionPointDirective.decorators = [
    { type: Directive, args: [{
                selector: 'extension-point'
            },] },
];
/** @nocollapse */
ExtenstionPointDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [ViewContainerRef,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [ComponentFactoryResolver,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [PluginService,] },] },
];
ExtenstionPointDirective.propDecorators = {
    "name": [{ type: Input },],
    "override": [{ type: Input },],
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImV4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBWSxnQkFBZ0IsRUFDMUQsd0JBQXdCLEVBQUUsa0JBQWtCLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzNGLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBSy9DLE1BQU07Ozs7OztJQVNKLFlBQXNDLGdCQUFnQixFQUFvQyxpQkFBaUIsRUFDcEYsYUFBYTt3QkFSUCxLQUFLO1FBU2hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7UUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLHdCQUF3QixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUM5Rjs7OztJQUVNLFVBQVU7UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDO1NBQ1I7UUFFRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUUs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LGdCQUFnQjs0Q0FBcUIsTUFBTSxTQUFDLHdCQUF3Qjs0Q0FDdkYsTUFBTSxTQUFDLGFBQWE7OztxQkFUcEIsS0FBSzt5QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0LCBJbmplY3QsIFByb3ZpZGVyLCBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIFJlZmxlY3RpdmVJbmplY3RvciwgT25EZXN0cm95LCBPbkNoYW5nZXN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbHVnaW5EYXRhfSBmcm9tICcuL21vZGVscyc7XG5pbXBvcnQge1BsdWdpblNlcnZpY2V9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdleHRlbnNpb24tcG9pbnQnXG59KVxuZXhwb3J0IGNsYXNzIEV4dGVuc3Rpb25Qb2ludERpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcbiAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuICBASW5wdXQoKSBvdmVycmlkZTogQm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgdmlld0NvbnRhaW5lclJlZjtcbiAgcHVibGljIGNvbXBvbmVudFJlc29sdmVyO1xuICBwdWJsaWMgcGx1Z2luU2VydmljZTogUGx1Z2luU2VydmljZTtcbiAgcHVibGljIGNvbXBvbmVudFJlZnM7XG4gIHB1YmxpYyBwbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChWaWV3Q29udGFpbmVyUmVmKSB2aWV3Q29udGFpbmVyUmVmLCBASW5qZWN0KENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikgY29tcG9uZW50UmVzb2x2ZXIsIFxuICBASW5qZWN0KFBsdWdpblNlcnZpY2UpIHBsdWdpblNlcnZpY2UpIHtcbiAgICB0aGlzLnZpZXdDb250YWluZXJSZWYgPSB2aWV3Q29udGFpbmVyUmVmO1xuICAgIHRoaXMuY29tcG9uZW50UmVzb2x2ZXIgPSBjb21wb25lbnRSZXNvbHZlcjtcbiAgICB0aGlzLnBsdWdpblNlcnZpY2UgPSBwbHVnaW5TZXJ2aWNlO1xuICAgIHRoaXMuY29tcG9uZW50UmVmcyA9IFtdO1xuICAgIHRoaXMucGx1Z2luQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5wbHVnaW5TZXJ2aWNlLmNoYW5nZS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5pbml0aWFsaXplKCkpO1xuICB9XG5cbiAgcHVibGljIGluaXRpYWxpemUoKSB7XG4gICAgaWYgKCF0aGlzLm5hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb21wb25lbnRSZWZzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuY29tcG9uZW50UmVmcy5mb3JFYWNoKChjb21wb25lbnRSZWYpID0+IGNvbXBvbmVudFJlZi5kZXN0cm95KCkpO1xuICAgICAgdGhpcy5jb21wb25lbnRSZWZzID0gW107XG4gICAgfVxuXG4gICAgY29uc3QgcGx1Z2luRGF0YSA9IHRoaXMucGx1Z2luU2VydmljZS5nZXRQbHVnaW5EYXRhKHRoaXMubmFtZSk7XG4gICAgaWYgKHRoaXMub3ZlcnJpZGUpIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbkRhdGEuc2hpZnQoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsdWdpbkRhdGEuc29ydCgoYSwgYikgPT4gYS5wbGFjZW1lbnQucHJpb3JpdHkgPiBiLnBsYWNlbWVudC5wcmlvcml0eSA/IDEgOiBhLnBsYWNlbWVudC5wcmlvcml0eSA8IGIucGxhY2VtZW50LnByaW9yaXR5ID8gLTEgOiAwKTtcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChwbHVnaW5EYXRhLm1hcCgocGx1Z2luKSA9PiB0aGlzLmluc3RhbnRpYXRlUGx1Z2luQ29tcG9uZW50KHBsdWdpbikpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaW5zdGFudGlhdGVQbHVnaW5Db21wb25lbnQocGx1Z2luRGF0YSkge1xuICAgIGlmICghcGx1Z2luRGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBvbmVudEZhY3RvcnkgPSB0aGlzLmNvbXBvbmVudFJlc29sdmVyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KHBsdWdpbkRhdGEucGxhY2VtZW50LmNvbXBvbmVudCk7XG4gICAgY29uc3QgY29udGV4dEluamVjdG9yID0gdGhpcy52aWV3Q29udGFpbmVyUmVmLnBhcmVudEluamVjdG9yO1xuICAgIGNvbnN0IHByb3ZpZGVycyA9IFtcbiAgICAgIHsgcHJvdmlkZTogUGx1Z2luRGF0YSwgdXNlVmFsdWU6IHBsdWdpbkRhdGEgfVxuICAgIF07XG4gICAgY29uc3QgY2hpbGRJbmplY3RvciA9IFJlZmxlY3RpdmVJbmplY3Rvci5yZXNvbHZlQW5kQ3JlYXRlKHByb3ZpZGVycywgY29udGV4dEluamVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50KGNvbXBvbmVudEZhY3RvcnksIHRoaXMudmlld0NvbnRhaW5lclJlZi5sZW5ndGgsIGNoaWxkSW5qZWN0b3IpO1xuICAgIHRoaXMuY29tcG9uZW50UmVmcy5wdXNoKGNvbXBvbmVudFJlZik7XG4gICAgY29tcG9uZW50UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgIGNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgcmV0dXJuIGNvbXBvbmVudFJlZjtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5wbHVnaW5DaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19