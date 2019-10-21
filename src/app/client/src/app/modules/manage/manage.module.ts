import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModalModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { UserOrgManagementComponent } from './components/user-org-management/user-org-management.component';
import { ManageRoutingModule } from './manage-routing.module';

@NgModule({
  declarations: [
      UserOrgManagementComponent,
  ],
  imports: [
    CommonModule,
    SuiModalModule,
    FormsModule,
    ManageRoutingModule
  ]
})
export class ManageModule {

}
