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
    path: 'announcement/outbox/:pageNumber', component: OutboxComponent, canActivate: [AuthGuard], data: {
      env: telemetryEnv, pageid: 'announcement-outbox', type: 'pageexit', subtype: 'Paginate'
    },
    children: [
      { path: 'delete/:announcementId', component: DeleteComponent },
      {
        path: 'view/:announcementId', component: DetailsPopupComponent, data: {
          env: telemetryEnv, pageid: 'announcement-outbox-details', type: 'pageexit', subtype: 'Paginate',
          object: { idParam: 'announcementId', type: objectType, ver: '1.0' }
        }
      }
    ]
  },
  {
    path: 'announcement/inbox/:pageNumber', component: InboxComponent,
    children: [
      { path: 'view/:announcementId', component: DetailsPopupComponent }
    ]
  },
  {
    path: 'announcement/create/:stepNumber', component: CreateComponent, data: {
      pageid: 'announcement-create',
      env: telemetryEnv, objectType: telemetryEnv
    }
  },
  {
    path: 'announcement/resend/:identifier/:stepNumber', component: CreateComponent, data: {
      pageid: 'announcement-resend',
      env: telemetryEnv, objectType: telemetryEnv,
      object: { idParam: 'identifier', type: objectType, ver: '1.0' }
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
