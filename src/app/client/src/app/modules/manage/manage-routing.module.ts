import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserOrgManagementComponent } from './components';

const routes: Routes = [
  {path: 'manage', component: UserOrgManagementComponent}
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageRoutingModule { }
