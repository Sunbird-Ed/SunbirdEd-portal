import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOrgTypeComponent, ViewOrgTypeComponent } from './components';

const routes: Routes = [
  {
    path: 'org-type', component: ViewOrgTypeComponent,
    children: [
      { path: 'create', component: CreateOrgTypeComponent},
      { path: 'update/:orgId', component: CreateOrgTypeComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgManagementRoutingModule { }

