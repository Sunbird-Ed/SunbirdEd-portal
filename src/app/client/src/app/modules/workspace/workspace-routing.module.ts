import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, CollectionEditorComponent, ContentEditorComponent,
  GenericEditorComponent, UploadedComponent, UpForReviewComponent, DataDrivenComponent
} from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      {
        path: 'create', component: CreateContentComponent,
        children: [
          { path: 'textbook', component: DataDrivenComponent },
          { path: 'uploadcontent', component: DataDrivenComponent },
          { path: 'course', component: DataDrivenComponent },
          { path: 'studymaterial', component: DataDrivenComponent },
          { path: 'collection', component: DataDrivenComponent },
          { path: 'lessonplan', component: DataDrivenComponent }
        ]
      },
      {path: 'edit/collection/:contentId/:type/:state/:framework', component: CollectionEditorComponent },
      {path: 'edit/content/:contentId/:state/:framework', component: ContentEditorComponent },
      {path: 'edit/generic', component: GenericEditorComponent },
      {path: 'edit/generic/:contentId/:state/:framework', component: GenericEditorComponent },
      { path: 'draft/:pageNumber', component: DraftComponent },
      { path: 'review/:pageNumber', component: ReviewSubmissionsComponent },
      { path: 'published/:pageNumber', component: PublishedComponent },
      { path: 'uploaded/:pageNumber', component: UploadedComponent },
      {path: 'upForReview/:pageNumber', component: UpForReviewComponent },
      { path: '**', redirectTo: 'create' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


