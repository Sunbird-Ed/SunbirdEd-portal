import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import {
  NoResultComponent, AppLoaderComponent, CardComponent,
  CardCreationComponent, ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, RedirectComponent,
  CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, BatchCardComponent, AccountMergeModalComponent,
  OfflineBannerComponent, OfflineApplicationDownloadComponent, FullPageModalComponent, ConfirmPopupComponent, SelectOptionGroupComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService,
  OfflineCardService, RecaptchaService, LayoutService
} from './services';
import { ContentDirectionDirective, MarkdownDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, FilterPipe, InterpolatePipe, SortByPipe } from './pipes';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { HighlightTextDirective } from './directives/highlight-text/highlight-text.directive';
import { AppLandingSectionComponent } from './components/app-landing-section/app-landing-section.component';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    FormsModule,
    TelemetryModule,
    TranslateModule.forChild()
  ],
  declarations: [AppLoaderComponent, DateFormatPipe,
    BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe, InterpolatePipe,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent,
    InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineBannerComponent,
    OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, SortByPipe,
    ConfirmPopupComponent, SelectOptionGroupComponent, AppLandingSectionComponent, MarkdownDirective],
  exports: [AppLoaderComponent, DateFormatPipe, TranslateModule,
    BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe,
    OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, SortByPipe,
    ConfirmPopupComponent, SelectOptionGroupComponent, AppLandingSectionComponent,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent,
    CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineBannerComponent,
    MarkdownDirective]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService, RecaptchaService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService, OfflineCardService,
        LayoutService,TranslateStore]
    };
  }
}

