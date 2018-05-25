/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ExtensionPointDirective } from './extension-point.directive';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PluginService } from './plugin-service';
import { BootstrapFramework } from './BootstrapFramework';
export class WebExtensionModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: WebExtensionModule,
            providers: [PluginService]
        };
    }
}
WebExtensionModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ExtensionPointDirective
                ],
                imports: [
                    BrowserModule
                ],
                exports: [
                    ExtensionPointDirective
                ],
                providers: [
                    PluginService,
                    BootstrapFramework
                ],
                entryComponents: []
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFrQjFELE1BQU07Ozs7SUFDSixNQUFNLENBQUMsT0FBTztRQUNaLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzNCLENBQUM7S0FDSDs7O1lBdEJGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osdUJBQXVCO2lCQUN4QjtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsYUFBYTtpQkFDZDtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsdUJBQXVCO2lCQUN4QjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsYUFBYTtvQkFDYixrQkFBa0I7aUJBQ25CO2dCQUNELGVBQWUsRUFBRSxFQUFFO2FBQ3BCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEJvb3RzdHJhcEZyYW1ld29yayB9IGZyb20gJy4vQm9vdHN0cmFwRnJhbWV3b3JrJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEV4dGVuc2lvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICAgIFBsdWdpblNlcnZpY2UsXG4gICAgQm9vdHN0cmFwRnJhbWV3b3JrXG4gIF0sXG4gIGVudHJ5Q29tcG9uZW50czogW11cbn0pXG5leHBvcnQgY2xhc3MgV2ViRXh0ZW5zaW9uTW9kdWxlIHtcbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBXZWJFeHRlbnNpb25Nb2R1bGUsXG4gICAgICBwcm92aWRlcnM6IFtQbHVnaW5TZXJ2aWNlXVxuICAgIH07XG4gIH1cbn1cblxuXG4iXX0=