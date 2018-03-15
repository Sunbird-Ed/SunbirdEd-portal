import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { AdminRoutingModule } from './admin-routing.module';
import { OrganizationComponent, UserComponent, BulkUploadComponent, TestComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    SuiModule
  ],
  declarations: [OrganizationComponent, UserComponent, BulkUploadComponent, TestComponent]
})
export class AdminModule { }
