import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import components directly to avoid circular dependency with barrel export
import { OrganisationComponent } from './components/organization/organization.component';
import { CourseConsumptionComponent } from './components/course-consumption/course-consumption.component';
import { CourseProgressComponent } from './components/course-progress/course-progress.component';
import { UsageReportsComponent } from './components/usage-reports/usage-reports.component';
import { ReportComponent } from './components/report/report.component';
import { ListAllReportsComponent } from './components/list-all-reports/list-all-reports.component';
import { CourseDashboardComponent } from './components/course-dashboard/course-dashboard.component';
import { ReIssueCertificateComponent } from './components/re-issue-certificate/re-issue-certificate.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { AuthGuard } from '../core/guard/auth-gard.service';

const telemetryEnv = 'course-dashboard';

export const DASHBOARD_ROUTES: Routes = [
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
      },
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
    path: 'organization', component: UsageReportsComponent, canActivate: [AuthGuard],
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
  imports: [RouterModule.forChild(DASHBOARD_ROUTES)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }