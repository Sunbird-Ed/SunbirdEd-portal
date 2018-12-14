import { NoteListComponent } from '@sunbird/notes';
import {
  LearnPageComponent, CourseConsumptionPageComponent, CoursePlayerComponent,
  EnrollBatchComponent, CreateBatchComponent, UpdateCourseBatchComponent
} from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ResourceService } from '@sunbird/shared';
import { FlagContentComponent, AuthGuard } from '@sunbird/core';
import { CourseProgressComponent } from '@sunbird/dashboard';
import { RedirectComponent } from './../shared/components/redirect/redirect.component';
import { PreviewCourseComponent } from './components/preview-course/preview-course.component';
import { TestAllBatchesComponent } from './components/test-all-batches/test-all-batches.component';
const telemetryEnv = 'course';
const objectType = 'course';
const routes: Routes = [
  {
    path: '', component: LearnPageComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'learn', type: 'view' }
    }
  },
  {
    path: 'redirect', component: RedirectComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: 'learn-redirect', type: 'view' }
    }
  },
  {
    path: 'preview/:courseId' , component: PreviewCourseComponent
  },
  {
    path: 'course', component: CourseConsumptionPageComponent,
    data: { telemetry: { env: telemetryEnv } },
    children: [
      {
        path: ':courseId', component: TestAllBatchesComponent,
        // path: ':courseId', component: CoursePlayerComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'course-player', type: 'view', object: { ver: '1.0', type: 'batch' }
          },
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
            path: 'update/batch/:batchId', component: UpdateCourseBatchComponent, canActivate: [AuthGuard],
            data: {
              telemetry: { env: telemetryEnv, pageid: 'batch-edit', type: 'view', object: { ver: '1.0', type: 'batch' } },
              roles: 'coursebacthesRole'
            }
          },
          {
            path: 'create/batch', component: CreateBatchComponent, canActivate: [AuthGuard],
            data: { telemetry: { env: telemetryEnv, pageid: 'batch-create', type: 'view' }, roles: 'coursebacthesRole' }
          }
        ]
      },
      {
        path: ':courseId/dashboard', component: CourseProgressComponent, canActivate: [AuthGuard],
        data: {
          roles: 'coursebacthesRole',
          telemetry: { env: telemetryEnv, pageid: 'course-stats', type: 'view', object: { ver: '1.0', type: 'course' } }
        }
      },
      {
        path: ':courseId/batch/:batchId', component: CoursePlayerComponent,
        data: {
          telemetry: { env: telemetryEnv, pageid: 'course-read', type: 'workflow', object: { ver: '1.0', type: 'course' } },
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
        path: ':courseId/batch/:batchId/notes/:contentId', component: NoteListComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'content-note-read', type: 'list', object: { type: objectType, ver: '1.0' }
          }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }]
        },
        children: [{ path: 'flag', component: FlagContentComponent }]
      },
      {
        path: ':courseId/:courseStatus', component: CoursePlayerComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'course-player-unlisted', type: 'view', object: { ver: '1.0', type: 'batch' }
          },
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Courses', url: '/learn' }]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
