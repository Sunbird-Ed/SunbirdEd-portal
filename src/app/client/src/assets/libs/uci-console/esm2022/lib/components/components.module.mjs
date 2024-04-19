import { PipesModule } from '../pipes/pipes.module';
import { UciService } from '../services/uci.service';
import { ConfigService } from '../services/config.service';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TagInputModule } from 'ngx-chips';
import { ConversationListComponent } from './conversation-list/conversation-list.component';
import { ConversationAddComponent } from './conversation-add/conversation-add.component';
import { UserSegmentListComponent } from './user-segment-list/user-segment-list.component';
import { CommonFormElementsModule } from '@project-sunbird/common-form-elements-full';
import { UserSegmentAddComponent } from './user-segment-add/user-segment-add.component';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { ConversationSuccessComponent } from './conversation-success/conversation-success.component';
import { UciGraphQlService } from '../services/uci-graph-ql.service';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import * as i0 from "@angular/core";
export class ComponentsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ComponentsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.2.12", ngImport: i0, type: ComponentsModule, declarations: [SidePanelComponent,
            ConversationListComponent,
            ConversationAddComponent,
            UserSegmentListComponent,
            UserSegmentAddComponent,
            TermsConditionsComponent,
            ConversationSuccessComponent], imports: [CommonModule,
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
            TagInputModule,
            PipesModule,
            CommonFormElementsModule,
            SuiModule], exports: [SidePanelComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ComponentsModule, providers: [
            UciService,
            ConfigService,
            UciGraphQlService
        ], imports: [CommonModule,
            HttpClientModule,
            FormsModule,
            ReactiveFormsModule,
            TagInputModule,
            PipesModule,
            CommonFormElementsModule,
            SuiModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: ComponentsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        SidePanelComponent,
                        ConversationListComponent,
                        ConversationAddComponent,
                        UserSegmentListComponent,
                        UserSegmentAddComponent,
                        TermsConditionsComponent,
                        ConversationSuccessComponent
                    ],
                    imports: [
                        CommonModule,
                        HttpClientModule,
                        FormsModule,
                        ReactiveFormsModule,
                        TagInputModule,
                        PipesModule,
                        CommonFormElementsModule,
                        SuiModule,
                    ],
                    exports: [
                        SidePanelComponent,
                    ],
                    providers: [
                        UciService,
                        ConfigService,
                        UciGraphQlService
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50cy5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy91Y2ktY29uc29sZS9zcmMvbGliL2NvbXBvbmVudHMvY29tcG9uZW50cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNuRCxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sNEJBQTRCLENBQUM7QUFDekQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDdEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sbUNBQW1DLENBQUM7QUFDckUsT0FBTyxFQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDekMsT0FBTyxFQUFDLHlCQUF5QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFDMUYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sK0NBQStDLENBQUM7QUFDdkYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0saURBQWlELENBQUM7QUFDekYsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sNENBQTRDLENBQUM7QUFDcEYsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sK0NBQStDLENBQUM7QUFDdEYsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQzNELE9BQU8sRUFBQyw0QkFBNEIsRUFBQyxNQUFNLHVEQUF1RCxDQUFDO0FBQ25HLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGtDQUFrQyxDQUFDO0FBQ25FLE9BQU8sRUFBQyx3QkFBd0IsRUFBQyxNQUFNLCtDQUErQyxDQUFDOztBQStCdkYsTUFBTSxPQUFPLGdCQUFnQjsrR0FBaEIsZ0JBQWdCO2dIQUFoQixnQkFBZ0IsaUJBM0JyQixrQkFBa0I7WUFDbEIseUJBQXlCO1lBQ3pCLHdCQUF3QjtZQUN4Qix3QkFBd0I7WUFDeEIsdUJBQXVCO1lBQ3ZCLHdCQUF3QjtZQUN4Qiw0QkFBNEIsYUFHNUIsWUFBWTtZQUNaLGdCQUFnQjtZQUNoQixXQUFXO1lBQ1gsbUJBQW1CO1lBQ25CLGNBQWM7WUFDZCxXQUFXO1lBQ1gsd0JBQXdCO1lBQ3hCLFNBQVMsYUFHVCxrQkFBa0I7Z0hBUWIsZ0JBQWdCLGFBTmQ7WUFDUCxVQUFVO1lBQ1YsYUFBYTtZQUNiLGlCQUFpQjtTQUNwQixZQWhCRyxZQUFZO1lBQ1osZ0JBQWdCO1lBQ2hCLFdBQVc7WUFDWCxtQkFBbUI7WUFDbkIsY0FBYztZQUNkLFdBQVc7WUFDWCx3QkFBd0I7WUFDeEIsU0FBUzs7NEZBV0osZ0JBQWdCO2tCQTdCNUIsUUFBUTttQkFBQztvQkFDTixZQUFZLEVBQUU7d0JBQ1Ysa0JBQWtCO3dCQUNsQix5QkFBeUI7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIsd0JBQXdCO3dCQUN4Qix1QkFBdUI7d0JBQ3ZCLHdCQUF3Qjt3QkFDeEIsNEJBQTRCO3FCQUMvQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsWUFBWTt3QkFDWixnQkFBZ0I7d0JBQ2hCLFdBQVc7d0JBQ1gsbUJBQW1CO3dCQUNuQixjQUFjO3dCQUNkLFdBQVc7d0JBQ1gsd0JBQXdCO3dCQUN4QixTQUFTO3FCQUNaO29CQUNELE9BQU8sRUFBRTt3QkFDTCxrQkFBa0I7cUJBQ3JCO29CQUNELFNBQVMsRUFBRTt3QkFDUCxVQUFVO3dCQUNWLGFBQWE7d0JBQ2IsaUJBQWlCO3FCQUNwQjtpQkFDSiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UGlwZXNNb2R1bGV9IGZyb20gJy4uL3BpcGVzL3BpcGVzLm1vZHVsZSc7XG5pbXBvcnQge1VjaVNlcnZpY2V9IGZyb20gJy4uL3NlcnZpY2VzL3VjaS5zZXJ2aWNlJztcbmltcG9ydCB7Q29uZmlnU2VydmljZX0gZnJvbSAnLi4vc2VydmljZXMvY29uZmlnLnNlcnZpY2UnO1xuaW1wb3J0IHtIdHRwQ2xpZW50TW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTaWRlUGFuZWxDb21wb25lbnR9IGZyb20gJy4vc2lkZS1wYW5lbC9zaWRlLXBhbmVsLmNvbXBvbmVudCc7XG5pbXBvcnQge0Zvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge1RhZ0lucHV0TW9kdWxlfSBmcm9tICduZ3gtY2hpcHMnO1xuaW1wb3J0IHtDb252ZXJzYXRpb25MaXN0Q29tcG9uZW50fSBmcm9tICcuL2NvbnZlcnNhdGlvbi1saXN0L2NvbnZlcnNhdGlvbi1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQge0NvbnZlcnNhdGlvbkFkZENvbXBvbmVudH0gZnJvbSAnLi9jb252ZXJzYXRpb24tYWRkL2NvbnZlcnNhdGlvbi1hZGQuY29tcG9uZW50JztcbmltcG9ydCB7VXNlclNlZ21lbnRMaXN0Q29tcG9uZW50fSBmcm9tICcuL3VzZXItc2VnbWVudC1saXN0L3VzZXItc2VnbWVudC1saXN0LmNvbXBvbmVudCc7XG5pbXBvcnQge0NvbW1vbkZvcm1FbGVtZW50c01vZHVsZX0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9jb21tb24tZm9ybS1lbGVtZW50cy1mdWxsJztcbmltcG9ydCB7VXNlclNlZ21lbnRBZGRDb21wb25lbnR9IGZyb20gJy4vdXNlci1zZWdtZW50LWFkZC91c2VyLXNlZ21lbnQtYWRkLmNvbXBvbmVudCc7XG5pbXBvcnQge1N1aU1vZHVsZX0gZnJvbSAnQHByb2plY3Qtc3VuYmlyZC9uZzItc2VtYW50aWMtdWknO1xuaW1wb3J0IHtDb252ZXJzYXRpb25TdWNjZXNzQ29tcG9uZW50fSBmcm9tICcuL2NvbnZlcnNhdGlvbi1zdWNjZXNzL2NvbnZlcnNhdGlvbi1zdWNjZXNzLmNvbXBvbmVudCc7XG5pbXBvcnQge1VjaUdyYXBoUWxTZXJ2aWNlfSBmcm9tICcuLi9zZXJ2aWNlcy91Y2ktZ3JhcGgtcWwuc2VydmljZSc7XG5pbXBvcnQge1Rlcm1zQ29uZGl0aW9uc0NvbXBvbmVudH0gZnJvbSAnLi90ZXJtcy1jb25kaXRpb25zL3Rlcm1zLWNvbmRpdGlvbnMuY29tcG9uZW50JztcblxuQE5nTW9kdWxlKHtcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgU2lkZVBhbmVsQ29tcG9uZW50LFxuICAgICAgICBDb252ZXJzYXRpb25MaXN0Q29tcG9uZW50LFxuICAgICAgICBDb252ZXJzYXRpb25BZGRDb21wb25lbnQsXG4gICAgICAgIFVzZXJTZWdtZW50TGlzdENvbXBvbmVudCxcbiAgICAgICAgVXNlclNlZ21lbnRBZGRDb21wb25lbnQsXG4gICAgICAgIFRlcm1zQ29uZGl0aW9uc0NvbXBvbmVudCxcbiAgICAgICAgQ29udmVyc2F0aW9uU3VjY2Vzc0NvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIEh0dHBDbGllbnRNb2R1bGUsXG4gICAgICAgIEZvcm1zTW9kdWxlLFxuICAgICAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgICAgICBUYWdJbnB1dE1vZHVsZSxcbiAgICAgICAgUGlwZXNNb2R1bGUsXG4gICAgICAgIENvbW1vbkZvcm1FbGVtZW50c01vZHVsZSxcbiAgICAgICAgU3VpTW9kdWxlLFxuICAgIF0sXG4gICAgZXhwb3J0czogW1xuICAgICAgICBTaWRlUGFuZWxDb21wb25lbnQsXG4gICAgXSxcbiAgICBwcm92aWRlcnM6IFtcbiAgICAgICAgVWNpU2VydmljZSxcbiAgICAgICAgQ29uZmlnU2VydmljZSxcbiAgICAgICAgVWNpR3JhcGhRbFNlcnZpY2VcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIENvbXBvbmVudHNNb2R1bGUge1xufVxuIl19