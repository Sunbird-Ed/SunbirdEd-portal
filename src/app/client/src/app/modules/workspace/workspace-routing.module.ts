import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, CollectionEditorComponent, ContentEditorComponent,
  GenericEditorComponent, UploadedComponent, DataDrivenComponent, FlaggedComponent, UpForReviewComponent,
  LimitedPublishedComponent
} from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      {
        path: 'create', component: CreateContentComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] },
        children: [
          {
            path: 'textbook', component: DataDrivenComponent,
            data: {
              breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'uploadcontent', component: DataDrivenComponent,
            data: {
              breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'course', component: DataDrivenComponent,
            data: {
              breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'studymaterial', component: DataDrivenComponent,
            data: {
              breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'collection', component: DataDrivenComponent,
            data: {
              breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'lessonplan', component: DataDrivenComponent,
            data: {
              breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          }
        ]
      },
      { path: 'edit/collection/:contentId/:type/:state/:framework', component: CollectionEditorComponent },
      { path: 'edit/content/:contentId/:state/:framework', component: ContentEditorComponent },
      { path: 'edit/generic', component: GenericEditorComponent },
      { path: 'edit/generic/:contentId/:state/:framework', component: GenericEditorComponent },
      {
        path: 'draft/:pageNumber', component: DraftComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      {
        path: 'review/:pageNumber', component: ReviewSubmissionsComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      {
        path: 'published/:pageNumber', component: PublishedComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      {
        path: 'uploaded/:pageNumber', component: UploadedComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      {
        path: 'flagged/:pageNumber', component: FlaggedComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      {
        path: 'upForReview/:pageNumber', component: UpForReviewComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      {
        path: 'limited/publish/:pageNumber', component: LimitedPublishedComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }] }
      },
      { path: '**', redirectTo: 'create' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


