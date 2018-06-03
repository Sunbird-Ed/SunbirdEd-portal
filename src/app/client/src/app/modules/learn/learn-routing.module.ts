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

const telemetryEnv = 'course';
const objectType = 'course';
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
        data: {
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }]
        },
        children: [
          { path: 'flag', component: FlagContentComponent },
          {
            path: 'enroll/batch/:batchId', component: EnrollBatchComponent,
            data: {
              telemetry: { env: telemetryEnv, pageid: 'batch-enroll', type: 'view', object: { ver: '1.0', type: 'batch' } }
            }
          },
          {
            path: 'update/batch/:batchId', component: UpdateCourseBatchComponent,
            data: {
              telemetry: { env: telemetryEnv, pageid: 'batch-edit', type: 'view', object: { ver: '1.0', type: 'batch' } }
            }
          },
          {
            path: 'create/batch', component: CreateBatchComponent,
            data: { telemetry: { env: telemetryEnv, pageid: 'batch-create', type: 'view' } }
          }
        ]
      },
      {
        path: ':courseId/dashboard', component: CourseProgressComponent,
        data: { telemetry: { env: telemetryEnv, pageid: 'course-stats', type: 'view', object: { ver: '1.0', type: 'course' } } }
      },
      {
        path: ':courseId/batch/:batchId', component: CoursePlayerComponent,
        data: {
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }]
        },
        children: [
          { path: 'flag', component: FlagContentComponent }
        ]
      },
      {
        path: ':courseId/batch/:batchId/notes', component: NoteListComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'content-note-read', type: 'list', object: { type: objectType, ver: '1.0' }
          }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }]
        },
        children: [{ path: 'flag', component: FlagContentComponent }]
      },
      {
        path: ':courseId/:courseStatus', component: CoursePlayerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
