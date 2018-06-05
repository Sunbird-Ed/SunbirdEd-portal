import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  CreateOrgTypeComponent, ViewOrgTypeComponent, OrganizationUploadComponent,
  UserUploadComponent, BulkUploadComponent, StatusComponent
} from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'org-management';

const routes: Routes = [
  {
    path: 'orgType', component: ViewOrgTypeComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'view-organization-type', type: 'view', subtype: 'paginate'
      },
      roles: 'orgType', breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Organization Type', url: '' }]
    },
    children: [
      {
        path: 'create', component: CreateOrgTypeComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'create-organization-type', type: 'create', subtype: 'paginate'
          }
        }
      },
      {
        path: 'update/:orgId', component: CreateOrgTypeComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'update-organization-type', type: 'update', subtype: 'paginate'
          }
        }
      },
      { path: '**', redirectTo: '' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgManagementRoutingModule { }

