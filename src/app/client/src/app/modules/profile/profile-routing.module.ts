import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePageComponent } from './components';
import {
  OrgManagementModule, OrganizationUploadComponent,
  UserUploadComponent, BulkUploadComponent, StatusComponent
} from '@sunbird/org-management';
import { AuthGuard } from '../core/guard/auth-gard.service';

const routes: Routes = [
  {
    path: 'profile', component: ProfilePageComponent, children: [
      {
        path: 'bulkUpload/organizationUpload', component: OrganizationUploadComponent,
        data: { redirectUrl: '/profile' }, canActivate: [AuthGuard]
      },
      { path: 'bulkUpload/userUpload', component: UserUploadComponent, data: { redirectUrl: '/profile' }, canActivate: [AuthGuard] },
      { path: 'bulkUpload/checkStatus', component: StatusComponent, data: { redirectUrl: '/profile' }, canActivate: [AuthGuard] }
    ]
  },
  { path: 'profile/:section', component: ProfilePageComponent },
  { path: 'profile/:section/:action', component: ProfilePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
