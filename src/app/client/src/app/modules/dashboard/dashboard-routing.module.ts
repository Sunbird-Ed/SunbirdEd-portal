import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  OrganisationComponent, CourseConsumptionComponent, CourseProgressComponent, UsageReportsComponent,
  ReportComponent, ListAllReportsComponent, CourseDashboardComponent, ReIssueCertificateComponent,
  DashboardSidebarComponent
} from './components/';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'course-dashboard';
const routes: Routes = [
  {
    path: '', component: DashboardSidebarComponent, canActivate: [AuthGuard],
    data: {
      roles: 'createBatchRole',
      telemetry: { env: 'Course', pageid: 'course-dashboard', type: 'view', object: { ver: '1.0', type: 'course' } }
    },
    children: [
      {
        path: 'course-stats', component: CourseDashboardComponent, canActivate: [AuthGuard],
        data: {
          roles: 'createBatchRole',
          telemetry: {
            env: telemetryEnv, pageid: 'course-stats', uri: '/dashboard/course-stats',
            type: 'view', object: { ver: '1.0', type: 'course' }
          },
          menuBar: {
            visible: false
          }
        }
      },
      {
        path: 'batches', component: CourseProgressComponent, canActivate: [AuthGuard],
        data: {
          roles: 'createBatchRole',
          telemetry: {
            env: telemetryEnv, pageid: 'batches', uri: '/dashboard/batches',
            type: 'view', object: { ver: '1.0', type: 'course' }
          },
          menuBar: {
            visible: false
          }
        }
      },
      {
        path: 'certificates', component: ReIssueCertificateComponent, canActivate: [AuthGuard],
        data: {
          roles: 'createBatchRole',
          telemetry: {
            env: telemetryEnv, pageid: 'certificates', uri: '/dashboard/certificates',
            type: 'view', object: { ver: '1.0', type: 'course' }
          },
          menuBar: {
            visible: false
          }
        }
      }
    ]
  },
  {
    path: 'myActivity', component: CourseConsumptionComponent,
    data: {
      telemetry: { env: 'course', pageid: 'course-creator-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Course', url: '/learn' }, { label: 'Course Creator Dashboard', url: '' }]
    }
  },
  {
    path: 'activity/course/consumption/:id/:timePeriod', component: CourseConsumptionComponent,
    data: {
      telemetry: { env: 'course', pageid: 'course-creator-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Course', url: '/learn' }, { label: 'Course Creator Dashboard', url: '' }]
    }
  },
  {
    path: 'organization', component: UsageReportsComponent, 
    canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' },
      menuBar: {
        visible: false
      },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'organization/creation/:id/:timePeriod', component: OrganisationComponent,
    data: {
      telemetry: { env: 'profile', pageid: 'org-admin-dashboard', type: 'view' },
      menuBar: {
        visible: false
      },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'reports', component: ListAllReportsComponent, data: {
      roles: 'reportViewerRole',
      telemetry: { env: 'reports', pageid: 'reports-list', type: 'view' },
      menuBar: {
        visible: false
      }
    }
  },
  {
    path: 'reports/:reportId', component: ReportComponent,
    data: {
      roles: 'reportViewerRole',
      telemetry: { env: 'reports', pageid: 'report-chart', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Report Page', url: '' }]
    }
  },
  {
    path: 'reports/:reportId/:hash', component: ReportComponent,
    data: {
      roles: 'reportViewerRole',
      telemetry: { env: 'reports', pageid: 'report-chart', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Report Page', url: '' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
