import { LibEntryComponent } from '../components/lib-entry/lib-entry.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConversationListComponent } from '../components/conversation-list/conversation-list.component';
import { ConversationAddComponent } from '../components/conversation-add/conversation-add.component';
import { ConversationSuccessComponent } from '../components/conversation-success/conversation-success.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
const routes = [
    {
        path: '',
        component: LibEntryComponent,
        children: [
            {
                path: 'home',
                pathMatch: 'full',
                component: ConversationListComponent
            },
            {
                path: 'add',
                pathMatch: 'full',
                component: ConversationAddComponent,
            },
            {
                path: ':id/edit',
                pathMatch: 'full',
                component: ConversationAddComponent,
            },
            {
                path: 'success',
                pathMatch: 'full',
                component: ConversationSuccessComponent,
            },
        ]
    }
];
export class UciRoutingModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciRoutingModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: UciRoutingModule, imports: [i1.RouterModule, CommonModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciRoutingModule, imports: [RouterModule.forChild(routes),
            CommonModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: UciRoutingModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [],
                    imports: [
                        RouterModule.forChild(routes),
                        CommonModule
                    ],
                    exports: [RouterModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWNpLXJvdXRpbmcubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvdWNpLWNvbnNvbGUvc3JjL2xpYi91Y2ktcm91dGluZy91Y2ktcm91dGluZy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sNkNBQTZDLENBQUM7QUFDOUUsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBUyxNQUFNLGlCQUFpQixDQUFDO0FBQ3JELE9BQU8sRUFBQyx5QkFBeUIsRUFBQyxNQUFNLDZEQUE2RCxDQUFDO0FBQ3RHLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLDJEQUEyRCxDQUFDO0FBR25HLE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLG1FQUFtRSxDQUFDOzs7QUFHL0csTUFBTSxNQUFNLEdBQVc7SUFDbkI7UUFDSSxJQUFJLEVBQUUsRUFBRTtRQUNSLFNBQVMsRUFBRSxpQkFBaUI7UUFDNUIsUUFBUSxFQUFFO1lBQ047Z0JBQ0ksSUFBSSxFQUFFLE1BQU07Z0JBQ1osU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLFNBQVMsRUFBRSx5QkFBeUI7YUFDdkM7WUFDRDtnQkFDSSxJQUFJLEVBQUUsS0FBSztnQkFDWCxTQUFTLEVBQUUsTUFBTTtnQkFDakIsU0FBUyxFQUFFLHdCQUF3QjthQUN0QztZQUNEO2dCQUNJLElBQUksRUFBRSxVQUFVO2dCQUNoQixTQUFTLEVBQUUsTUFBTTtnQkFDakIsU0FBUyxFQUFFLHdCQUF3QjthQUN0QztZQUNEO2dCQUNJLElBQUksRUFBRSxTQUFTO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixTQUFTLEVBQUUsNEJBQTRCO2FBQzFDO1NBQ0o7S0FDSjtDQUNKLENBQUM7QUFVRixNQUFNLE9BQU8sZ0JBQWdCOytHQUFoQixnQkFBZ0I7Z0hBQWhCLGdCQUFnQiw2QkFKckIsWUFBWSxhQUVOLFlBQVk7Z0hBRWIsZ0JBQWdCLFlBTHJCLFlBQVksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1lBQzdCLFlBQVksRUFFTixZQUFZOzs0RkFFYixnQkFBZ0I7a0JBUjVCLFFBQVE7bUJBQUM7b0JBQ04sWUFBWSxFQUFFLEVBQUU7b0JBQ2hCLE9BQU8sRUFBRTt3QkFDTCxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDN0IsWUFBWTtxQkFDZjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMaWJFbnRyeUNvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy9saWItZW50cnkvbGliLWVudHJ5LmNvbXBvbmVudCc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtSb3V0ZXJNb2R1bGUsIFJvdXRlc30gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7Q29udmVyc2F0aW9uTGlzdENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24tbGlzdC9jb252ZXJzYXRpb24tbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHtDb252ZXJzYXRpb25BZGRDb21wb25lbnR9IGZyb20gJy4uL2NvbXBvbmVudHMvY29udmVyc2F0aW9uLWFkZC9jb252ZXJzYXRpb24tYWRkLmNvbXBvbmVudCc7XG5pbXBvcnQge1VzZXJTZWdtZW50TGlzdENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy91c2VyLXNlZ21lbnQtbGlzdC91c2VyLXNlZ21lbnQtbGlzdC5jb21wb25lbnQnO1xuaW1wb3J0IHtVc2VyU2VnbWVudEFkZENvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy91c2VyLXNlZ21lbnQtYWRkL3VzZXItc2VnbWVudC1hZGQuY29tcG9uZW50JztcbmltcG9ydCB7Q29udmVyc2F0aW9uU3VjY2Vzc0NvbXBvbmVudH0gZnJvbSAnLi4vY29tcG9uZW50cy9jb252ZXJzYXRpb24tc3VjY2Vzcy9jb252ZXJzYXRpb24tc3VjY2Vzcy5jb21wb25lbnQnO1xuXG5cbmNvbnN0IHJvdXRlczogUm91dGVzID0gW1xuICAgIHtcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIGNvbXBvbmVudDogTGliRW50cnlDb21wb25lbnQsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogJ2hvbWUnLFxuICAgICAgICAgICAgICAgIHBhdGhNYXRjaDogJ2Z1bGwnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogQ29udmVyc2F0aW9uTGlzdENvbXBvbmVudFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBwYXRoOiAnYWRkJyxcbiAgICAgICAgICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IENvbnZlcnNhdGlvbkFkZENvbXBvbmVudCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogJzppZC9lZGl0JyxcbiAgICAgICAgICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJyxcbiAgICAgICAgICAgICAgICBjb21wb25lbnQ6IENvbnZlcnNhdGlvbkFkZENvbXBvbmVudCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcGF0aDogJ3N1Y2Nlc3MnLFxuICAgICAgICAgICAgICAgIHBhdGhNYXRjaDogJ2Z1bGwnLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudDogQ29udmVyc2F0aW9uU3VjY2Vzc0NvbXBvbmVudCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF1cbiAgICB9XG5dO1xuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW10sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBSb3V0ZXJNb2R1bGUuZm9yQ2hpbGQocm91dGVzKSxcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbUm91dGVyTW9kdWxlXVxufSlcbmV4cG9ydCBjbGFzcyBVY2lSb3V0aW5nTW9kdWxlIHtcbn1cbiJdfQ==