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
  OnDemandReportsComponent, DesktopAppUpdateComponent, SystemWarningComponent, AlertModalComponent, FullPageLoaderComponent, ModalWrapperComponent, ModalContentDirective, SlickComponent
} from './components';
import {
  ConfigService, ResourceService, ToasterService, WindowScrollService, BrowserCacheTtlService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService, ExternalUrlPreviewService,
  OfflineCardService, RecaptchaService, ConnectionService, GenericResourceService
} from './services';
import { ContentDirectionDirective, HighlightTextDirective, MarkdownDirective, TelemetryEventsDirective } from './directives';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DateFormatPipe, FilterPipe, InterpolatePipe, SortByPipe, SbDataTablePipe, TransposeTermsPipe } from './pipes';
import { CacheService } from '../shared/services/cache-service/cache.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { CdnprefixPipe } from './pipes/cdnprefix.pipe';
import { AppLandingSectionComponent } from './components/app-landing-section/app-landing-section.component';
import { TranslateModule, TranslateStore } from '@ngx-translate/core';
import { AddToGroupDirective } from './directives/add-to-group/add-to-group.directive';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TitleCasePipe } from '@angular/common';
import { NetworkStatusComponent } from './components/network-status/network-status.component';
import { LoadOfflineContentComponent } from './components/load-offline-content/load-offline-content.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { AutocompletePipe } from './components/material-auto-complete/auto-complete-pipe';
import { MaterialAutoCompleteComponent } from './components/material-auto-complete/material-auto-complete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule   } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialModule } from './modules/material/material.module';
// import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
    imports: [
        CommonModule,
        SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
        SuiRatingModule, SuiCollapseModule,
        FormsModule, ReactiveFormsModule, NgxDatatableModule,
        TelemetryModule,
        TranslateModule.forChild(),
        MatTooltipModule, MatTabsModule, MatDialogModule,
        MatAutocompleteModule, MatFormFieldModule, MatInputModule,
        MatChipsModule, MatIconModule, MatSelectModule, MatListModule, MatButtonModule, MatCheckboxModule, MaterialModule
    ],
    declarations: [AppLoaderComponent, DateFormatPipe,
        BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe, InterpolatePipe,
        ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, RedirectComponent, CustomMultiSelectComponent,
        InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineBannerComponent,
        OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, SortByPipe,
        ConfirmPopupComponent, AddToGroupDirective, SelectOptionGroupComponent, AppLandingSectionComponent, MarkdownDirective,
        SbDatatableComponent, OnDemandReportsComponent, SbDataTablePipe, NetworkStatusComponent, LoadOfflineContentComponent,
        TelemetryEventsDirective, DesktopAppUpdateComponent, AlertModalComponent, SystemWarningComponent, FullPageLoaderComponent, ModalWrapperComponent, ModalContentDirective,
        AutocompletePipe, MaterialAutoCompleteComponent, TransposeTermsPipe, SlickComponent
    ],
    exports: [AppLoaderComponent, DateFormatPipe, TranslateModule,
        BatchCardComponent, NoResultComponent, CardComponent, CardCreationComponent, FilterPipe,
        OfflineApplicationDownloadComponent, HighlightTextDirective, FullPageModalComponent, AccountMergeModalComponent, SortByPipe,
        ConfirmPopupComponent, SelectOptionGroupComponent, AppLandingSectionComponent,
        ShareLinkComponent, BrowserCompatibilityComponent, QrCodeModalComponent, CdnprefixPipe, InterpolatePipe, RedirectComponent,
        CustomMultiSelectComponent, InstallAppComponent, LockInfoPopupComponent, ContentDirectionDirective, OfflineBannerComponent,
        MarkdownDirective, AddToGroupDirective, SbDatatableComponent, OnDemandReportsComponent, NgxDatatableModule, SbDataTablePipe,
        InterpolatePipe, NetworkStatusComponent, LoadOfflineContentComponent, DesktopAppUpdateComponent, SystemWarningComponent, TelemetryEventsDirective,
        AlertModalComponent, FullPageLoaderComponent, MatTooltipModule, MatTabsModule, MatDialogModule, ModalWrapperComponent, ModalContentDirective,
        AutocompletePipe, MaterialAutoCompleteComponent, MaterialModule, TransposeTermsPipe, SlickComponent
    ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [ResourceService, ConfigService, ToasterService, PaginationService, RecaptchaService,
        RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService,
       DeviceDetectorService, BrowserCacheTtlService, ExternalUrlPreviewService, OfflineCardService, TranslateStore, TitleCasePipe, ConnectionService, GenericResourceService]
    };
  }
}

