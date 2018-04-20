import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, PermissionService, AnnouncementService,
  BadgesService, ContentService, CoursesService, PageApiService, TelemetryService, TelemetryLibUtilService , FrameworkService, FormService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent, SearchComponent , DataDrivenFilterComponent
} from './components';
import { AuthGuard } from './guard/auth-gard.service';
import * as $ from 'jquery';
import { CacheService } from 'ng2-cache-service';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective, DataDrivenFilterComponent],
  exports: [MainHeaderComponent, PermissionDirective, DataDrivenFilterComponent],
  providers: [
    LearnerService, UserService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
    AuthGuard, TelemetryService, TelemetryLibUtilService, FrameworkService, FormService, CacheService]
})
export class CoreModule {
}
