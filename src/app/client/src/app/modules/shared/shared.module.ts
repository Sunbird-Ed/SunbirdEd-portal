import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NoResultComponent, AppLoaderComponent, CardComponent,
  CardCreationComponent, ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, RedirectComponent,
  CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, BatchCardComponent, AccountMergeModalComponent,
  OfflineBannerComponent,
  OfflineApplicationDownloadComponent, FullPageModalComponent, ConfirmPopupComponent, SelectOptionGroupComponent, SbDatatableComponent,
  OnDemandReportsComponent, DesktopAppUpdateComponent, SystemWarningComponent, AlertModalComponent, FullPageLoaderComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService,
  OfflineCardService, RecaptchaService, LayoutService, ConnectionService
} from './services';
import { ContentDirectionDirective, HighlightTextDirective, MarkdownDirective, TelemetryEventsDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import {DateFormatPipe, FilterPipe, InterpolatePipe, SortByPipe, SbDataTablePipe} from './pipes';
import { CacheService } from 'ng2-cache-service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '@sunbird/telemetry';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { AppLandingSectionComponent } from './components/app-landing-section/app-landing-section.component';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { AddToGroupDirective } from './directives/add-to-group/add-to-group.directive';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {TitleCasePipe} from '@angular/common';
import { NetworkStatusComponent } from './components/network-status/network-status.component';
import { LoadOfflineContentComponent } from './components/load-offline-content/load-offline-content.component';

@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    FormsModule, ReactiveFormsModule, NgxDatatableModule,
    TelemetryModule,
    TranslateModule.forChild()
  ],
  declarations: [AppLoaderComponent, DateFormatPipe,
    BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe, InterpolatePipe,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent,
    InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineBannerComponent,
    OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, SortByPipe,
    ConfirmPopupComponent, AddToGroupDirective, SelectOptionGroupComponent, AppLandingSectionComponent, MarkdownDirective,
    SbDatatableComponent, OnDemandReportsComponent, SbDataTablePipe, NetworkStatusComponent, LoadOfflineContentComponent,
    TelemetryEventsDirective, DesktopAppUpdateComponent, AlertModalComponent, SystemWarningComponent, FullPageLoaderComponent],
  exports: [AppLoaderComponent, DateFormatPipe, TranslateModule,
    BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe,
    OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, SortByPipe,
    ConfirmPopupComponent, SelectOptionGroupComponent, AppLandingSectionComponent,
    ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent,
    CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineBannerComponent,
    MarkdownDirective, AddToGroupDirective, SbDatatableComponent, OnDemandReportsComponent, NgxDatatableModule, SbDataTablePipe,
    InterpolatePipe, NetworkStatusComponent, LoadOfflineContentComponent, DesktopAppUpdateComponent, SystemWarningComponent, TelemetryEventsDirective,
    AlertModalComponent, FullPageLoaderComponent],
  entryComponents: [AlertModalComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService, RecaptchaService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
        DeviceDetectorModule, DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService, OfflineCardService,
        LayoutService, TranslateStore, TitleCasePipe, ConnectionService]
    };
  }
}

