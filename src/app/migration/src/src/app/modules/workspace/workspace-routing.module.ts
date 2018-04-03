import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
<<<<<<< HEAD
  ReviewSubmissionsComponent, PublishedComponent, CreateTextbookComponent, CreateUploadContentComponent, CreateStudyMaterialComponent,
  CreateCourseComponent, CreateCollectionComponent, CreateLessonPlanComponent, CollectionEditorComponent
} from './components/index';
=======
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent
} from './components';
>>>>>>> 9aed0d2436d299877fc31c2724d92c7a791f94bb
import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      {
        path: 'create', component: CreateContentComponent,
        children: [
          { path: 'textbook', component: CreateTextbookComponent },
          { path: 'uploadcontent', component: CreateUploadContentComponent },
          { path: 'course', component: CreateCourseComponent },
          { path: 'studymaterial', component: CreateStudyMaterialComponent },
          { path: 'collection', component: CreateCollectionComponent },
          { path: 'lessonplan', component: CreateLessonPlanComponent }
        ]
      },
      {path: 'edit/collection/:contentId/:type/:state/:framework', component: CollectionEditorComponent },
      { path: 'draft/:pageNumber', component: DraftComponent },
      { path: 'review/:pageNumber', component: ReviewSubmissionsComponent },
      { path: 'published/:pageNumber', component: PublishedComponent },
<<<<<<< HEAD
=======
      { path: 'uploaded/:pageNumber', component: UploadedComponent },
>>>>>>> 9aed0d2436d299877fc31c2724d92c7a791f94bb
      { path: '**', redirectTo: 'create' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


