import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { DashboardModule } from '@sunbird/dashboard';
import { OrgManagementModule } from '@sunbird/org-management';

@NgModule({
  imports: [
    CommonModule,
    DashboardModule,
    OrgManagementModule,
    PrivateRoutingModule
  ],
  declarations: []
})
export class PrivateModule { }
