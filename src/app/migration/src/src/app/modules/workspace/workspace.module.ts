import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspacesidebarComponent } from './components/workspacesidebar/workspacesidebar.component';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkSpaceService } from './services';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent,
  UpForReviewComponent
} from './components';
@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    CoreModule,
    FormsModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, UpForReviewComponent],
  providers: [WorkSpaceService]
})
export class WorkspaceModule { }
