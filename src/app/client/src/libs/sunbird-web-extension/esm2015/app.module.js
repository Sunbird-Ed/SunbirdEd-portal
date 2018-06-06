/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { ExtensionPointDirective } from './extension-point.directive';
import { NgModule } from '@angular/core';
import { PluginService } from './plugin-service';
import { BootstrapFramework } from './BootstrapFramework';
import { CommonModule } from '@angular/common';
export class WebExtensionModule {
    /**
     * @return {?}
     */
    static forRoot() {
        return {
            ngModule: WebExtensionModule,
            providers: [PluginService, BootstrapFramework]
        };
    }
}
WebExtensionModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ExtensionPointDirective
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    ExtensionPointDirective
                ]
            },] },
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3N1bmJpcmQtd2ViLWV4dGVuc2lvbi8iLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3RFLE9BQU8sRUFBRSxRQUFRLEVBQXVCLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFhL0MsTUFBTTs7OztJQUNKLE1BQU0sQ0FBQyxPQUFPO1FBQ1osTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLGtCQUFrQjtZQUM1QixTQUFTLEVBQUUsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUM7U0FDL0MsQ0FBQztLQUNIOzs7WUFqQkYsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWix1QkFBdUI7aUJBQ3hCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxZQUFZO2lCQUNiO2dCQUNELE9BQU8sRUFBRTtvQkFDUCx1QkFBdUI7aUJBQ3hCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFeHRlbnNpb25Qb2ludERpcmVjdGl2ZSB9IGZyb20gJy4vZXh0ZW5zaW9uLXBvaW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUGx1Z2luU2VydmljZSB9IGZyb20gJy4vcGx1Z2luLXNlcnZpY2UnO1xuaW1wb3J0IHsgQm9vdHN0cmFwRnJhbWV3b3JrIH0gZnJvbSAnLi9Cb290c3RyYXBGcmFtZXdvcmsnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmVcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZVxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgRXh0ZW5zaW9uUG9pbnREaXJlY3RpdmVcbiAgXVxufSlcbmV4cG9ydCBjbGFzcyBXZWJFeHRlbnNpb25Nb2R1bGUge1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmdNb2R1bGU6IFdlYkV4dGVuc2lvbk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1BsdWdpblNlcnZpY2UsIEJvb3RzdHJhcEZyYW1ld29ya11cbiAgICB9O1xuICB9XG59XG5cblxuIl19