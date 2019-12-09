import { ExploreModule } from './../../../../../../src/app/modules/public/module/explore/explore.module';
import { ContentManagerService } from './services';
import {
    SuiModalModule, SuiProgressModule, SuiAccordionModule,
    SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule
} from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent,
    BrowseComponent, ContentManagerComponent, OfflineHelpCenterComponent, DesktopAppUpdateComponent,
    LibraryComponent, DesktopHeaderComponent, LibraryFiltersComponent,
    OfflineFaqComponent, OfflineReportIssuesComponent, OfflineHelpVideosComponent, OnboardingComponent,
    OnboardingLocationComponent, OnboardingUserPreferenceComponent, DesktopProminentFilterComponent,
    LoadContentComponent, NoContentComponent, ConnectionStatusComponent, InfoCardComponent
} from './components';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { FileSizeModule } from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { SlickModule } from 'ngx-slick';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { DesktopExploreContentComponent } from './components/desktop-explore-content/desktop-explore-content.component';
import { NgInviewModule } from 'angular-inport';
import { SharedFeatureModule } from '@sunbird/shared-feature';

@NgModule({
    imports: [
        CommonConsumptionModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        CoreModule,
        SharedModule,
        OfflineRoutingModule,
        SuiModalModule,
        SuiProgressModule,
        SuiSelectModule,
        WebExtensionModule,
        ExploreModule,
        FileSizeModule,
        SuiAccordionModule,
        SuiTabsModule,
        OrderModule,
        SlickModule,
        ReactiveFormsModule,
        CommonConsumptionModule,
        SuiDimmerModule,
        NgInviewModule,
        SharedFeatureModule,
        SuiCollapseModule
    ],
    providers: [DeviceDetectorService, ContentManagerService],
    declarations: [ContentImportHeaderComponent, WatchVideoComponent,
        BrowseComponent, WatchVideoComponent, ContentImportHeaderComponent, BrowseComponent,
        NetworkStatusComponent, WatchVideoComponent, ContentManagerComponent, OfflineHelpCenterComponent,
        DesktopAppUpdateComponent,
        LibraryComponent,
        DesktopHeaderComponent,
        LibraryFiltersComponent,
        OfflineFaqComponent,
        OfflineReportIssuesComponent,
        OfflineHelpVideosComponent,
        DesktopExploreContentComponent,
        OnboardingComponent,
        OnboardingLocationComponent,
        OnboardingUserPreferenceComponent,
        DesktopProminentFilterComponent,
        ConnectionStatusComponent,
        NoContentComponent,
        LoadContentComponent,
        InfoCardComponent,
    ],
    entryComponents: [
        ContentImportHeaderComponent,
        BrowseComponent,
        NetworkStatusComponent,
        ContentManagerComponent,
        WatchVideoComponent,
        ContentImportHeaderComponent,
    ],
    exports: [DesktopAppUpdateComponent, DesktopHeaderComponent, LibraryFiltersComponent, OnboardingComponent,
        OnboardingLocationComponent]
})
export class OfflineModule { }
