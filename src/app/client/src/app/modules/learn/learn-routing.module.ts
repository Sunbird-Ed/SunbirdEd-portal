import { NoteListComponent } from '@sunbird/notes';
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
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '' }] }
  },
  {
    path: 'learn/course', component: CourseConsumptionPageComponent,
    children: [
      {
        path: ':courseId', component: CoursePlayerComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }] },
        children: [{ path: 'flag', component: FlagContentComponent },
        { path: 'enroll/batch/:batchId', component: EnrollBatchComponent },
        { path: 'update/batch/:batchId', component: UpdateCourseBatchComponent },
        { path: 'create/batch', component: CreateBatchComponent }]
      },
      {
        path: ':courseId/dashboard', component: CourseProgressComponent
      },
      {
        path: ':courseId/batch/:batchId', component: CoursePlayerComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }] },
        children: [{ path: 'flag', component: FlagContentComponent }]
      },
      {
        path: ':courseId/batch/:batchId/notes', component: NoteListComponent,
        data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }] },
        children: [{ path: 'flag', component: FlagContentComponent }]
      },
      {
        path: ':courseId/:courseStatus', component: CoursePlayerComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
