import { MY_GROUPS, NOTIFICATION } from './modules/groups';
import { NgModule } from '@angular/core';
import { ErrorPageComponent, AuthGuard } from '@sunbird/core';
import { RouterModule, Routes } from '@angular/router';
import { MlGuard } from './modules/observation/guards';

const appRoutes: Routes = [
  {
    path: 'learn/course', loadChildren: () => import('app/modules/learn/course-consumption.module').then(m => m.CourseConsumptionModule)
  },
  {
    path: 'learn', loadChildren: () => import('app/modules/learn/learn.module').then(m => m.LearnModule)
  },
  {
    path: 'resources', loadChildren: () => import('app/modules/resource/resource.module').then(m => m.ResourceModule)
  },
  {
    path: 'search', loadChildren: () => import('app/modules/search/search.module').then(m => m.SearchModule)
  },
  {
    path: 'workspace', loadChildren: () => import('app/modules/workspace/workspace.module').then(m => m.WorkspaceModule)
  },
  {
    path: 'org', loadChildren: () => import('app/modules/org-management/org-management.module').then(m => m.OrgManagementModule)
  },
  {
    path: 'dashBoard', loadChildren: () => import('app/modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'profile', loadChildren: () => import('app/plugins/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'certs', loadChildren: () => import('app/modules/certificate/certificate.module').then(m => m.CertificateModule)
  },
  {
    path: 'recover', loadChildren: () => import('app/modules/recover-account/recover-account.module').then(m => m.RecoverAccountModule)
  },
  {
    path: 'accountMerge', loadChildren: () => import('app/modules/merge-account/merge-account.module').then(m => m.MergeAccountModule)
  },
  {
    path: 'get', loadChildren: () => import('app/modules/dial-code-search/dial-code-search.module').then(m => m.DialCodeSearchModule)
  },
  {
    path: 'manage', loadChildren: () => import('app/modules/manage/manage.module').then(m => m.ManageModule)
  },
  {
    path: 'uci-admin', loadChildren: () => import('app/modules/uci-admin/uci-admin.module').then(m => m.UciAdminModule)
  },
  {
    path: '', loadChildren: () => import('app/modules/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'discussion-forum', loadChildren: () => import('app/modules/discussion/discussion.module').then(m => m.DiscussionModule)
  },
  {
    path: MY_GROUPS, loadChildren: () => import('app/modules/groups/groups.module').then(m => m.GroupsModule)
  },
  {
    path: NOTIFICATION, loadChildren: () => import('app/modules/notification/notification.module').then(m => m.NotificationModule)
  },
  {
    path: 'observation', loadChildren: () => import('app/modules/observation/observation.module').then(m => m.ObservationModule), canActivate: [MlGuard]
  },
  {
    path: 'questionnaire', loadChildren: () => import('app/modules/questionnaire/questionnaire.module').then(m => m.QuestionnaireModule)
  },
  {
    path: 'solution', loadChildren: () => import('app/modules/report/report.module').then(m => m.ReportModule)
  },
  {
    path: 'program', loadChildren: () => import('app/modules/program-dashboard/program-dashboard.module').then(m => m.programDashboardModule)
  },
  {
    path: 'error', component: ErrorPageComponent
  },
  {
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
