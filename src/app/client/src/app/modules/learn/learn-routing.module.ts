import { LearnPageComponent } from './components/index';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ResourceService } from '@sunbird/shared';


const routes: Routes = [
  {
    path: 'learn', component: LearnPageComponent,
    data: [{label: 'Home', url: '/home'}, {label: 'Courses', url: ''}]
  }
  // {
  //   path: 'learn', component: LearnPageComponent,
  //   data: [{label: ResourceService.frmelmnts.tab.home , url: '/home'}, {label: 'Courses', url: ''}],
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
