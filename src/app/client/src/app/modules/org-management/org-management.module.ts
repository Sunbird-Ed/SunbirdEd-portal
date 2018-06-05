import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgManagementRoutingModule } from './org-management-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ToasterService, RouterNavigationService, SharedModule } from '@sunbird/shared';
import { OrgTypeService, OrgManagementService } from './services';
import {
  CreateOrgTypeComponent, ViewOrgTypeComponent, OrganizationUploadComponent,
  UserUploadComponent, BulkUploadComponent, StatusComponent
} from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';

@NgModule({
  imports: [
    CommonModule,
    OrgManagementRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    TelemetryModule,
    NgInviewModule
  ],
  declarations: [CreateOrgTypeComponent, ViewOrgTypeComponent, OrganizationUploadComponent,
    UserUploadComponent, BulkUploadComponent, StatusComponent],
  exports: [BulkUploadComponent],
  providers: [ResourceService, ToasterService, RouterNavigationService, OrgTypeService, OrgManagementService]
})
export class OrgManagementModule { }

