/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ExtensionPointDirective } from './extension-point.directive';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PluginService } from './plugin-service';
import { BootstrapFramework } from './BootstrapFramework';
var WebExtensionModule = /** @class */ (function () {
    function WebExtensionModule() {
    }
    /**
     * @return {?}
     */
    WebExtensionModule.forRoot = /**
     * @return {?}
     */
    function () {
        return {
            ngModule: WebExtensionModule,
            providers: [PluginService]
        };
    };
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
    return WebExtensionModule;
}());
export { WebExtensionModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7Ozs7Ozs7SUFtQmpELDBCQUFPOzs7SUFBZDtRQUNFLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzNCLENBQUM7S0FDSDs7Z0JBdEJGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osdUJBQXVCO3FCQUN4QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsYUFBYTtxQkFDZDtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsdUJBQXVCO3FCQUN4QjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsYUFBYTt3QkFDYixrQkFBa0I7cUJBQ25CO29CQUNELGVBQWUsRUFBRSxFQUFFO2lCQUNwQjs7NkJBckJEOztTQXNCYSxrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSB9IGZyb20gJy4vZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgQm9vdHN0cmFwRnJhbWV3b3JrIH0gZnJvbSAnLi9Cb290c3RyYXBGcmFtZXdvcmsnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZVxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAgUGx1Z2luU2VydmljZSxcbiAgICBCb290c3RyYXBGcmFtZXdvcmtcbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbXVxufSlcbmV4cG9ydCBjbGFzcyBXZWJFeHRlbnNpb25Nb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFdlYkV4dGVuc2lvbk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1BsdWdpblNlcnZpY2VdXG4gICAgfTtcbiAgfVxufVxuXG5cbiJdfQ==