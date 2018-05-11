/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ExtenstionPointDirective } from './extension-point.directive';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PluginService } from './plugin-service';
import { BootstrapFramework } from './BootstrapFramework';
var WebFrameworkModule = /** @class */ (function () {
    function WebFrameworkModule() {
    }
    /**
     * @return {?}
     */
    WebFrameworkModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: WebFrameworkModule,
            providers: [PluginService]
        };
    };
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
    return WebFrameworkModule;
}());
export { WebFrameworkModule };
function WebFrameworkModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    WebFrameworkModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    WebFrameworkModule.ctorParameters;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7SUFtQmpELDBCQUFPOzs7SUFBZDtRQUNFLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzNCLENBQUM7S0FDSDs7Z0JBdEJGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osd0JBQXdCO3FCQUN6QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsYUFBYTtxQkFDZDtvQkFDRCxPQUFPLEVBQUU7d0JBQ1Asd0JBQXdCO3FCQUN6QjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsYUFBYTt3QkFDYixrQkFBa0I7cUJBQ25CO29CQUNELGVBQWUsRUFBRSxFQUFFO2lCQUNwQjs7NkJBckJEOztTQXNCYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHRlbnN0aW9uUG9pbnREaXJlY3RpdmUgfSBmcm9tICcuL2V4dGVuc2lvbi1wb2ludC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IFBsdWdpblNlcnZpY2UgfSBmcm9tICcuL3BsdWdpbi1zZXJ2aWNlJztcbmltcG9ydCB7IEJvb3RzdHJhcEZyYW1ld29yayB9IGZyb20gJy4vQm9vdHN0cmFwRnJhbWV3b3JrJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRXh0ZW5zdGlvblBvaW50RGlyZWN0aXZlXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBFeHRlbnN0aW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgUGx1Z2luU2VydmljZSxcbiAgICBCb290c3RyYXBGcmFtZXdvcmtcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBXZWJGcmFtZXdvcmtNb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFdlYkZyYW1ld29ya01vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1BsdWdpblNlcnZpY2VdXG4gICAgfTtcbiAgfVxufVxuXG5cbiJdfQ==