import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './components';
import { WorkspacesidebarComponent } from './components/workspacesidebar/workspacesidebar.component';
import { CreateContentComponent } from './components/create-content/create-content.component';
import { DraftComponent } from './components/draft/draft.component';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkSpaceService } from './services';
import { ReviewSubmissionsComponent } from './components/review-submissions/review-submissions.component';
@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent, CreateContentComponent, DraftComponent, ReviewSubmissionsComponent],
   providers: [WorkSpaceService]
})
export class WorkspaceModule { }
