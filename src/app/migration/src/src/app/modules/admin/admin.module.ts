import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '@sunbird/shared';
import { OrganizationComponent, UserComponent, BulkUploadComponent, TestComponent, StatusComponent } from './components';
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
  declarations: [OrganizationComponent, UserComponent, BulkUploadComponent, TestComponent, StatusComponent],
  providers: []
})
export class AdminModule { }
