import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import {
  UserService, LearnerService, PermissionService, AnnouncementService, ConceptPickerService,
  BadgesService, ContentService, CoursesService, PageApiService,
  TenantService, FrameworkService, FormService, PlayerService, SearchService,
  CopyContentService, BreadcrumbsService, OrgDetailsService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent, SearchComponent, ConceptPickerComponent, DataDrivenFilterComponent,
  ErrorPageComponent, SortByComponent, FlagContentComponent, ContentPlayerMetadataComponent,
  BreadcrumbsComponent, LanguageDropdownComponent, ProminentFilterComponent
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
    ContentPlayerMetadataComponent, LanguageDropdownComponent, ProminentFilterComponent],
  exports: [MainHeaderComponent, PermissionDirective, ConceptPickerComponent, DataDrivenFilterComponent,
    SortByComponent, BreadcrumbsComponent, FlagContentComponent, ContentPlayerMetadataComponent,
    TelemetryModule, LanguageDropdownComponent, ProminentFilterComponent]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [LearnerService, UserService, TenantService, SearchService, CopyContentService,
        PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
        AuthGuard, FrameworkService, FormService, CacheService,
        ConceptPickerService, BreadcrumbsService, PlayerService, OrgDetailsService]
    };
  }
}
