import { RedirectComponent } from './../shared/components/redirect/redirect.component';
import {
  LearnPageComponent, CourseConsumptionPageComponent, CoursePlayerComponent,
  EnrollBatchComponent, CreateBatchComponent, UpdateCourseBatchComponent
} from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { FlagContentComponent } from '@sunbird/core';
import { CourseProgressComponent } from '@sunbird/dashboard';

const routes: Routes = [
  {
    path: 'learn', component: LearnPageComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '' }] },
  },
  {
    path: 'learn/redirect', component: RedirectComponent
  },
  {
    path: 'learn/course', component: CourseConsumptionPageComponent,
    children: [
      {
        path: ':courseId', component: CoursePlayerComponent,
        children: [{ path: 'flag', component: FlagContentComponent },
        { path: 'enroll/batch/:batchId', component: EnrollBatchComponent },
        { path: 'update/batch/:batchId', component: UpdateCourseBatchComponent },
        { path: 'create/batch', component: CreateBatchComponent }]
      },
      {
        path: ':courseId/dashboard', component: CourseProgressComponent
      },
      {
        path: ':courseId/:batchId', component: CoursePlayerComponent,
        children: [{ path: 'flag', component: FlagContentComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
