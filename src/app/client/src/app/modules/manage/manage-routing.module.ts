import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserOrgManagementComponent } from './components/user-org-management/user-org-management.component';
import { UserUploadComponent } from './components/user-upload/user-upload.component';
import { AuthGuard } from '@sunbird/core';

const routes: Routes = [
  {path: '', component: UserOrgManagementComponent, canActivate: [AuthGuard], data: {
    roles: 'bulkUpload',
    telemetry: {
      env: 'admin-dashboard', pageid: 'admin-manage-page', type: 'view'
    }
  }},
  {path: 'user-upload', component: UserUploadComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageRoutingModule { }
