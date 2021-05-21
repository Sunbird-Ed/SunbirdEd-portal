import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserOrgManagementComponent } from './components/user-org-management/user-org-management.component';
import { AuthGuard } from '@sunbird/core';

const routes: Routes = [
  {path: '', component: UserOrgManagementComponent, canActivate: [AuthGuard], data: {
    roles: 'bulkUpload',
    telemetry: {
      env: 'admin-dashboard', pageid: 'admin-manage-page', type: 'view'
    }
  }}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageRoutingModule { }
