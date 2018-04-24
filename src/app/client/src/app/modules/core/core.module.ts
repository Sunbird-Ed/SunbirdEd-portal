import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import {
  UserService, LearnerService, PermissionService, AnnouncementService, ConceptPickerService,
  BadgesService, ContentService, CoursesService, PageApiService, TelemetryService, TelemetryLibUtilService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent, SearchComponent, ConceptPickerComponent
} from './components';
import { AuthGuard } from './guard/auth-gard.service';
import * as $ from 'jquery';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective, ConceptPickerComponent],
  exports: [MainHeaderComponent, PermissionDirective, ConceptPickerComponent],
  providers: [
    LearnerService, UserService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
    AuthGuard, TelemetryService, TelemetryLibUtilService, ConceptPickerService]
})
export class CoreModule {
}
