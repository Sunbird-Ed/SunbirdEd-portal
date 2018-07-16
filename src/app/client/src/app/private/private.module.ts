import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivateRoutingModule } from './private-routing.module';
import { HomeModule } from '@sunbird/home';
import { DashboardModule } from '@sunbird/dashboard';
import { AnnouncementModule } from '@sunbird/announcement';
import { NotesModule } from '@sunbird/notes';
import { OrgManagementModule } from '@sunbird/org-management';
import { BadgingModule } from '@sunbird/badge';

@NgModule({
  imports: [
    CommonModule,
    HomeModule,
    DashboardModule,
    AnnouncementModule,
    NotesModule,
    OrgManagementModule,
    BadgingModule,
    PrivateRoutingModule
  ],
  declarations: []
})
export class PrivateModule { }
