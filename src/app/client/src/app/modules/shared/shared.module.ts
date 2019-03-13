import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule } from '@angular/forms';
import {
  AnnouncementInboxCardComponent, ContentCreditsComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent, PlayerComponent,
  CollectionTreeComponent, FancyTreeComponent, CardComponent, CardCreationComponent, ShareLinkComponent, CollectionPlayerMetadataComponent,
  BrowserCompatibilityComponent, QrCodeModalComponent, RedirectComponent, CustomMultiSelectComponent,
  InstallAppComponent, LockInfoPopupComponent, DataTableComponent, BatchCardComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService
} from './services';
import { ContentDirectionDirective } from './directives';
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
    DateFormatPipe, PageSectionComponent, BatchCardComponent, NoResultComponent, DateFilterXtimeAgoPipe,
    CollectionTreeComponent, FancyTreeComponent, PlayerComponent, CardComponent, CardCreationComponent, FilterPipe, InterpolatePipe,
    ShareLinkComponent, CollectionPlayerMetadataComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe,
    RedirectComponent, CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective,
    DataTableComponent],
  exports: [AppLoaderComponent, ContentCreditsComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, BatchCardComponent, NoResultComponent, CollectionTreeComponent, FancyTreeComponent,
    PlayerComponent, CardComponent, CardCreationComponent, FilterPipe, ShareLinkComponent, CollectionPlayerMetadataComponent,
    BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent, CustomMultiSelectComponent,
    InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, DataTableComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, Ng2IzitoastService, PaginationService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService]
    };
  }
}
