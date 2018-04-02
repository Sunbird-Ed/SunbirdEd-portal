import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspacesidebarComponent } from './components/workspacesidebar/workspacesidebar.component';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService } from './services';
// import { ReviewSubmissionsComponent } from './components/review-submissions/review-submissions.component';
// import { PublishedComponent } from './components/published/published.component';
// import { CreateTextbookComponent } from './components/content-creation-forms/create-textbook/create-textbook.component';
// import { CreateCourseComponent } from './components/content-creation-forms/create-course/create-course.component';
// import { CreateStudyMaterialComponent } from './components/content-creation-forms/create-study-material/create-study-material.component';
// import { CreateCollectionComponent } from './components/content-creation-forms/create-collection/create-collection.component';
// import { CreateLessonPlanComponent } from './components/content-creation-forms/create-lesson-plan/create-lesson-plan.component';
// import { CreateUploadContentComponent } from './components/content-creation-forms/create-upload-content/create-upload-content.component';
// import { CollectionEditorComponent } from './components/create-editors/collection-editor/collection-editor.component';

import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent, CreateTextbookComponent, CreateCourseComponent, 
  CreateStudyMaterialComponent, CreateCollectionComponent, CreateLessonPlanComponent,CreateUploadContentComponent,
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
