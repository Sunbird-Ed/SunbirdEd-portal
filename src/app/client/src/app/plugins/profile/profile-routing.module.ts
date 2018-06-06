import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePageComponent } from './components';
import {
  OrgManagementModule, OrganizationUploadComponent,
  UserUploadComponent, BulkUploadComponent, StatusComponent
} from '@sunbird/org-management';
import { AuthGuard } from '../../modules/core/guard/auth-gard.service';

const telemetryEnv = 'profile';
const objectType = 'profile';
const routes: Routes = [
  {
    path: 'profile', component: ProfilePageComponent,
    data: {
      telemetry: {
        env: telemetryEnv, type: 'view', mode: 'create', subtype: 'paginate', object: { type: objectType, ver: '1.0' }
      }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '' }]
    },
    children: [
      {
        path: 'bulkUpload/organizationUpload', component: OrganizationUploadComponent,
        data: {
          redirectUrl: '/profile', roles: 'bulkUpload',
          telemetry: {
            env: telemetryEnv, type: 'view', mode: 'create',
            subtype: 'paginate', object: { type: objectType, ver: '1.0' }
          }
        }, canActivate: [AuthGuard]
      },
      {
        path: 'bulkUpload/userUpload', component: UserUploadComponent,
        data: {
          redirectUrl: '/profile', roles: 'bulkUpload',
          telemetry: {
            env: telemetryEnv, type: 'view', mode: 'create',
            subtype: 'paginate', object: { type: objectType, ver: '1.0' }
          }
        }, canActivate: [AuthGuard]
      },
      {
        path: 'bulkUpload/checkStatus', component: StatusComponent,
        data: {
          redirectUrl: '/profile', roles: 'bulkUpload',
          telemetry: {
            env: telemetryEnv, type: 'view', mode: 'create',
            subtype: 'paginate', object: { type: objectType, ver: '1.0' }
          }
        }, canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: 'profile/:section', component: ProfilePageComponent,
    data: {
      telemetry: {
        env: telemetryEnv, type: 'view', mode: 'create', subtype: 'paginate', object: { type: objectType, ver: '1.0' }
      }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '' }]
    }
  },
  {
    path: 'profile/:section/:action', component: ProfilePageComponent,
    data: {
      telemetry: {
        env: telemetryEnv, type: 'view', mode: 'create', subtype: 'paginate', object: { type: objectType, ver: '1.0' }
      }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
