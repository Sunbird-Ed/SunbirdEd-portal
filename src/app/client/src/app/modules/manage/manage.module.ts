import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModalModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService, ToasterService, SharedModule } from '@sunbird/shared';
import { UserOrgManagementComponent } from './components/user-org-management/user-org-management.component';
import { UserUploadComponent } from './components/user-upload/user-upload.component';
import { ManageRoutingModule } from './manage-routing.module';
import { ManageService } from './services/manage/manage.service';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';

@NgModule({
  declarations: [
      UserOrgManagementComponent,
      UserUploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SuiModalModule,
    HttpClientModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    ManageRoutingModule,
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
