import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  CreateOrgTypeComponent, ViewOrgTypeComponent, OrganizationUploadComponent,
  UserUploadComponent, BulkUploadComponent, StatusComponent
} from './components';

const routes: Routes = [
  {
    path: 'org-type', component: ViewOrgTypeComponent,
    children: [
      { path: 'create', component: CreateOrgTypeComponent },
      { path: 'update/:orgId', component: CreateOrgTypeComponent },
      { path: '**', redirectTo: '' }
    ]
  },
  {
    path: 'bulkUpload', component: BulkUploadComponent,
    children: [
      { path: 'organizationUpload', component: OrganizationUploadComponent },
      { path: 'userUpload', component: UserUploadComponent },
      { path: 'checkStatus', component: StatusComponent }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgManagementRoutingModule { }

