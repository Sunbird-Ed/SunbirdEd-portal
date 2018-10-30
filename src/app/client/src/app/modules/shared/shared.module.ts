import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
   AnnouncementInboxCardComponent, ContentCreditsComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent, PlayerComponent,
  CollectionTreeComponent, FancyTreeComponent, CardComponent, ShareLinkComponent, CollectionPlayerMetadataComponent,
  BrowserCompatibilityComponent, QrCodeModalComponent, RedirectComponent, CustomMultiSelectComponent
} from './components';
import {
  ConfigService, ResourceService, FileUploadService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService
} from './services';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe, InterpolatePipe } from './pipes';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule,
    TelemetryModule,
    NgInviewModule
  ],
  declarations: [AppLoaderComponent, ContentCreditsComponent, AnnouncementInboxCardComponent,
    DateFormatPipe, PageSectionComponent, NoResultComponent, DateFilterXtimeAgoPipe,
    CollectionTreeComponent, FancyTreeComponent, PlayerComponent, CardComponent, FilterPipe, InterpolatePipe,
    ShareLinkComponent, CollectionPlayerMetadataComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe,
    RedirectComponent, CustomMultiSelectComponent],
  exports: [AppLoaderComponent, ContentCreditsComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, NoResultComponent, CollectionTreeComponent, FancyTreeComponent,
    PlayerComponent, CardComponent, FilterPipe, ShareLinkComponent, CollectionPlayerMetadataComponent, BrowserCompatibilityComponent,
    QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent, CustomMultiSelectComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, FileUploadService, ToasterService, Ng2IzitoastService, PaginationService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService]
    };
  }
}
