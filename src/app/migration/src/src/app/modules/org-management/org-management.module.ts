import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgManagementRoutingModule } from './org-management-routing.module';
import { SuiModule } from 'ng2-semantic-ui';
import { ResourceService, ToasterService, RouterNavigationService, SharedModule } from '@sunbird/shared';
import { OrgTypeService } from './services';
import { CreateOrgTypeComponent, ViewOrgTypeComponent } from './components';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    OrgManagementRoutingModule,
    SharedModule,
    SuiModule,
    ReactiveFormsModule
  ],
  declarations: [CreateOrgTypeComponent, ViewOrgTypeComponent],
  providers: [ResourceService, ToasterService, RouterNavigationService, OrgTypeService]
})
export class OrgManagementModule { }

