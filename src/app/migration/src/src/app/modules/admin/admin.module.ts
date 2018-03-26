import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@sunbird/shared';
import { OrganizationUploadComponent, UserComponent, BulkUploadComponent, StatusComponent } from './components';
import { CoreModule } from '@sunbird/core';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SuiModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [OrganizationUploadComponent, UserComponent, BulkUploadComponent, StatusComponent],
  providers: []
})
export class AdminModule { }
