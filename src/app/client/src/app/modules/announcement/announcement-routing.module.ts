import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  OutboxComponent, DeleteComponent, DetailsComponent, DetailsPopupComponent,
  InboxComponent, CreateComponent
} from './components';
import { AuthGuard } from './../core/guard/auth-gard.service';
const telemetryEnv = 'announcement';
const objectType = 'announcement';
const routes: Routes = [
  {
    path: 'announcement/outbox/:pageNumber', component: OutboxComponent, canActivate: [AuthGuard],
    data: { roles : 'announcement',
    breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Announcements', url: '' }] },
    children: [
      { path: 'delete/:announcementId', component: DeleteComponent },
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
  },
  {
    path: 'announcement/inbox/:pageNumber', component: InboxComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Announcements', url: '' }] },
    children: [
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
  },
  {
    path: 'announcement/create/:stepNumber', component: CreateComponent,
    canActivate: [AuthGuard], data: { telemetry: {env: telemetryEnv, pageid: 'announcement-create',
    type: 'workflow',  mode: 'create', object: {  type: objectType, ver: '1.0' }}, roles : 'announcement'}
  },
  {
    path: 'announcement/resend/:identifier/:stepNumber', component: CreateComponent,
    canActivate: [AuthGuard], data: { telemetry: {env: telemetryEnv, pageid: 'announcement-resend',
    type: 'workflow',  mode: 'resend', object: {  type: objectType, ver: '1.0' }}, roles : 'announcement'}
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
