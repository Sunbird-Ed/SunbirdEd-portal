import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OutboxComponent, DeleteComponent, CreateComponent } from './components/index';

const routes: Routes = [
  {
    path: 'announcement/outbox/:pageNumber', component: OutboxComponent,
    children: [{path: 'delete/:announcementId', component: DeleteComponent}]
  },
  {
    path: 'announcement/create/:stepNumber', component: CreateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
