import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspacesidebarComponent } from './components/workspacesidebar/workspacesidebar.component';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService } from './services';

import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent, CreateTextbookComponent, CreateCourseComponent,
  CreateStudyMaterialComponent, CreateCollectionComponent, CreateLessonPlanComponent, CreateUploadContentComponent,
  CollectionEditorComponent

} from './components';
@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, CreateTextbookComponent, CreateCourseComponent,
    CreateStudyMaterialComponent, CreateCollectionComponent, CreateLessonPlanComponent, CreateUploadContentComponent,
     CollectionEditorComponent],
  providers: [WorkSpaceService, EditorService]
})
export class WorkspaceModule { }
