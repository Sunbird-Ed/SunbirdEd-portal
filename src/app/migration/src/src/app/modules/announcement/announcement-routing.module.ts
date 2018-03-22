import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutboxComponent, DeleteComponent, DetailsComponent, DetailsPopupComponent, InboxComponent } from './components/index';
import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'announcement/outbox/:pageNumber', component: OutboxComponent,
    children: [
      { path: 'delete/:announcementId', component: DeleteComponent },
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
    , canActivate: [AuthGuard]
  },
  {
    path: 'announcement/inbox/:pageNumber', component: InboxComponent,
    children: [
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
    , canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
