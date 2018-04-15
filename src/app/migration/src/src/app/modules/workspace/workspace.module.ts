import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WorkSpaceService, BatchService , EditorService} from './services';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent, WorkspacesidebarComponent, BatchListComponent,
  BatchCardComponent, UpdateBatchComponent, CreateTextbookComponent, CreateCourseComponent,
  CreateStudyMaterialComponent, CreateCollectionComponent, CreateLessonPlanComponent,
  CollectionEditorComponent, ContentEditorComponent, GenericEditorComponent
} from './components';
@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, BatchCardComponent, CreateTextbookComponent,
    CreateCourseComponent, UpdateBatchComponent, CreateStudyMaterialComponent,
    CreateCollectionComponent, CreateLessonPlanComponent, CollectionEditorComponent,
    ContentEditorComponent, GenericEditorComponent],
  providers: [WorkSpaceService, EditorService]
})
export class WorkspaceModule { }
