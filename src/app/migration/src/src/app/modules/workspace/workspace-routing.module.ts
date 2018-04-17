import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent
} from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: CreateContentComponent,
      data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'My Workspace', url: ''}]},
      { path: 'draft/:pageNumber', component: DraftComponent,
      data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'My Workspace', url: ''}] },
      { path: 'review/:pageNumber', component: ReviewSubmissionsComponent,
      data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'My Workspace', url: ''}] },
      { path: 'published/:pageNumber', component: PublishedComponent,
      data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'My Workspace', url: ''}] },
      { path: 'uploaded/:pageNumber', component: UploadedComponent,
      data: [{label: 'Home', url: '/home'}, {label: 'Profile', url: '/profile'}, {label: 'My Workspace', url: ''}] },
      { path: '**', redirectTo: 'create' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


