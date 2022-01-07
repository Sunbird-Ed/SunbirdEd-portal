import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    EventViewTypeComponent, EventDetailComponent,EventReportComponent, DetailedUserReportComponent
} from './components';
// import { ViewAllComponent } from '@sunbird/content-search';
const routes: Routes = [
  {
    path: '', component: EventViewTypeComponent,  
  },
  { path: 'published', component: EventViewTypeComponent},
  { path: 'detail', component: EventDetailComponent},
  { path: 'report', component: EventReportComponent},
  { path:'detailed-user-report', component: DetailedUserReportComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
