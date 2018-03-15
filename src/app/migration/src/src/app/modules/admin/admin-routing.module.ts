import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationComponent, UserComponent, BulkUploadComponent, TestComponent } from './components/index';

const routes: Routes = [
  {
    path: 'admin', component: TestComponent,
    children: [
      {
        path: 'bulkUpload', component: BulkUploadComponent,
        children: [
          { path: 'uploadOrg', component: OrganizationComponent },
          { path: 'uploadUser', component: UserComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
