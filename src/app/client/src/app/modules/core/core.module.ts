import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, PermissionService, AnnouncementService, ConceptPickerService,
  BadgesService, ContentService, CoursesService, PageApiService,
  TenantService, FrameworkService, FormService, PlayerService, SearchService, CopyContentService, BreadcrumbsService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent, SearchComponent, ConceptPickerComponent, DataDrivenFilterComponent,
  ErrorPageComponent, SortByComponent, FlagContentComponent, ContentPlayerMetadataComponent, BreadcrumbsComponent
} from './components';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
import { WebExtensionModule } from 'sunbird-web-extension';
import { TelemetryModule } from '@sunbird/telemetry';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    WebExtensionModule,
    TelemetryModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective, ConceptPickerComponent,
    DataDrivenFilterComponent, BreadcrumbsComponent, SortByComponent, ErrorPageComponent, FlagContentComponent,
    ContentPlayerMetadataComponent],
  exports: [MainHeaderComponent, PermissionDirective, ConceptPickerComponent, DataDrivenFilterComponent,
    SortByComponent, BreadcrumbsComponent, FlagContentComponent, ContentPlayerMetadataComponent, TelemetryModule],
  providers: [
    LearnerService, UserService, TenantService, SearchService, CopyContentService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
    AuthGuard, FrameworkService, FormService, CacheService,
    ConceptPickerService, BreadcrumbsService, PlayerService]
})
export class CoreModule {
}
