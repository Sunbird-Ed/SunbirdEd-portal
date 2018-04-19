import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, PermissionService, AnnouncementService, TenantService,
  BadgesService, ContentService, CoursesService, PageApiService, TelemetryService, TelemetryLibUtilService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent, SearchComponent
} from './components';
import { AuthGuard } from './guard/auth-gard.service';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective],
  exports: [MainHeaderComponent, PermissionDirective],
  providers: [
    LearnerService, UserService, TenantService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
    AuthGuard, TelemetryService, TelemetryLibUtilService]
})
export class CoreModule {
}


