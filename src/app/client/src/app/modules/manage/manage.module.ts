import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModalModule, SuiSelectModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { UserOrgManagementComponent } from './components/user-org-management/user-org-management.component';
import { ManageRoutingModule } from './manage-routing.module';
import { ManageService } from './services/manage/manage.service';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { UserRoleAssignComponent } from './components/user-role-assign/user-role-assign.component';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  declarations: [
      UserOrgManagementComponent,
      UserRoleAssignComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedFeatureModule,
    SuiModalModule,
    SuiSelectModule,
    HttpClientModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    ManageRoutingModule,
    AvatarModule,
    NgInviewModule
  ],
  providers: [
    ResourceService,
    ToasterService,
    ManageService
  ]
})
export class ManageModule {

}
