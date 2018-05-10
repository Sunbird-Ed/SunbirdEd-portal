import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, PermissionService, AnnouncementService, ConceptPickerService,
  BadgesService, ContentService, CoursesService, PageApiService, TelemetryService,
  TELEMETRY_PROVIDER, TenantService, FrameworkService, FormService, PlayerService, SearchService, CopyContentService
} from './services';
import { MainHeaderComponent, MainMenuComponent, SearchComponent,  ConceptPickerComponent, DataDrivenFilterComponent,
  ErrorPageComponent, SortByComponent, FlagContentComponent  } from './components';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
import { BreadcrumbsComponent, BreadcrumbsService } from './components';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective, ConceptPickerComponent,
     DataDrivenFilterComponent, BreadcrumbsComponent, SortByComponent, ErrorPageComponent, FlagContentComponent],
  exports: [MainHeaderComponent, PermissionDirective, ConceptPickerComponent, DataDrivenFilterComponent,
     SortByComponent, BreadcrumbsComponent, FlagContentComponent],
  providers: [
    LearnerService, UserService, TenantService, SearchService, CopyContentService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
    AuthGuard, TelemetryService, FrameworkService, FormService, CacheService,
     { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry}, ConceptPickerService, BreadcrumbsService, PlayerService]
})
export class CoreModule {
}
