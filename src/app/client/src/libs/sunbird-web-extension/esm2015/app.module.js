/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ExtenstionPointDirective } from './extension-point.directive';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PluginService } from './plugin-service';
import { BootstrapFramework } from './BootstrapFramework';
export class WebFrameworkModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: WebFrameworkModule,
            providers: [PluginService]
        };
    }
}
WebFrameworkModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ExtenstionPointDirective
                ],
                imports: [
                    BrowserModule
                ],
                exports: [
                    ExtenstionPointDirective
                ],
                providers: [
                    PluginService,
                    BootstrapFramework
                ],
                entryComponents: []
            },] },
];
function WebFrameworkModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    WebFrameworkModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    WebFrameworkModule.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFrQjFELE1BQU07Ozs7SUFDSixNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzNCLENBQUM7S0FDSDs7O1lBdEJGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osd0JBQXdCO2lCQUN6QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsYUFBYTtpQkFDZDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1Asd0JBQXdCO2lCQUN6QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsYUFBYTtvQkFDYixrQkFBa0I7aUJBQ25CO2dCQUNELGVBQWUsRUFBRSxFQUFFO2FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlIH0gZnJvbSAnLi9leHRlbnNpb24tcG9pbnQuZGlyZWN0aXZlJztcbmltcG9ydCB7IE5nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBQbHVnaW5TZXJ2aWNlIH0gZnJvbSAnLi9wbHVnaW4tc2VydmljZSc7XG5pbXBvcnQgeyBCb290c3RyYXBGcmFtZXdvcmsgfSBmcm9tICcuL0Jvb3RzdHJhcEZyYW1ld29yayc7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEV4dGVuc3Rpb25Qb2ludERpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFBsdWdpblNlcnZpY2UsXG4gICAgQm9vdHN0cmFwRnJhbWV3b3JrXG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW11cbn0pXG5leHBvcnQgY2xhc3MgV2ViRnJhbWV3b3JrTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBXZWJGcmFtZXdvcmtNb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtQbHVnaW5TZXJ2aWNlXVxuICAgIH07XG4gIH1cbn1cblxuXG4iXX0=