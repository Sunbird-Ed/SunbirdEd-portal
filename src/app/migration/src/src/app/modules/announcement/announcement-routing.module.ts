import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutboxComponent, DeleteComponent, DetailsComponent, DetailsPopupComponent,
   InboxComponent, CreateComponent } from './components';
   import { AuthGuard } from './../core/guard/auth-gard.service';

const routes: Routes = [
  {
    path: 'announcement/outbox/:pageNumber', component: OutboxComponent, canActivate: [AuthGuard],
    children: [
      { path: 'delete/:announcementId', component: DeleteComponent },
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
  },
  {
    path: 'announcement/inbox/:pageNumber', component: InboxComponent,
    children: [
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
  },
  {
    path: 'announcement/create/:stepNumber', component: CreateComponent
  },
  {
    path: 'announcement/resend/:identifier/:stepNumber', component: CreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
