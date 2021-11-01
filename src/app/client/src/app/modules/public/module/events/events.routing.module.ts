import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    EventViewTypeComponent, EventDetailComponent
} from './components';
// import { ViewAllComponent } from '@sunbird/content-search';
const routes: Routes = [
  // {
  //   path: '', loadChildren: '../../../learn/learn.module#LearnModule'
  // },
  
  
  {
    path: '', component: EventViewTypeComponent,  
  },
  { path: 'published', component: EventViewTypeComponent},
  { path: 'detail', component: EventDetailComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRoutingModule { }
