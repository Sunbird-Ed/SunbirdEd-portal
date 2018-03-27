import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationUploadComponent, UserComponent, BulkUploadComponent, StatusComponent } from './components/index';

const routes: Routes = [
  {
        path: 'bulkUpload', component: BulkUploadComponent,
        children: [
          { path: 'uploadOrg', component: OrganizationUploadComponent },
          { path: 'uploadUser', component: UserComponent },
          { path: 'checkStatus', component: StatusComponent }
        ]
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
