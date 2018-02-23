
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ConfigService, UserService, LearnerService,
  ResourceService, PermissionService, AnnouncementService,
  BadgesService, ContentService
} from './services';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [],
  providers: [
    ConfigService, LearnerService, ResourceService, UserService,
    PermissionService, AnnouncementService, BadgesService, ContentService ]
})
export class CoreModule {
}


