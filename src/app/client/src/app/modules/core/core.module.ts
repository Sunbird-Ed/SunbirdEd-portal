import { PermissionDirective, BodyScrollDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { AvatarModule } from 'ngx-avatar';
import {
  LearnerService, AnnouncementService, ConceptPickerService,
  BadgesService, ContentService, CoursesService, PageApiService,
  TenantService, FrameworkService, FormService, PlayerService, SearchService,
  CopyContentService, BreadcrumbsService, OrgDetailsService, ChannelService, DiscussionService
} from './services';
import {
  MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, ConceptPickerComponent,
  DataDrivenFilterComponent, ErrorPageComponent, SortByComponent, FlagContentComponent,
  ContentPlayerMetadataComponent, BreadcrumbsComponent, LanguageDropdownComponent, ProminentFilterComponent,
  TopicPickerComponent
} from './components';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
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
    TelemetryModule,
    AvatarModule
  ],
  declarations: [MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, PermissionDirective,
    BodyScrollDirective, ConceptPickerComponent, DataDrivenFilterComponent, BreadcrumbsComponent, SortByComponent,
    ErrorPageComponent, FlagContentComponent, ContentPlayerMetadataComponent, LanguageDropdownComponent,
    ProminentFilterComponent, TopicPickerComponent],
  exports: [MainHeaderComponent, MainFooterComponent, PermissionDirective, BodyScrollDirective, ConceptPickerComponent,
    DataDrivenFilterComponent, SortByComponent, BreadcrumbsComponent, FlagContentComponent,
    ContentPlayerMetadataComponent, TelemetryModule, LanguageDropdownComponent, ProminentFilterComponent,
    TopicPickerComponent]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [LearnerService, TenantService, SearchService, CopyContentService,
        AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService,
        AuthGuard, FrameworkService, FormService, CacheService,
        ConceptPickerService, BreadcrumbsService, PlayerService, OrgDetailsService,
        ChannelService, DiscussionService]
    };
  }
}
