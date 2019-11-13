import { ExploreModule } from './../../../../../../src/app/modules/public/module/explore/explore.module';
import { OfflineFileUploaderService, ContentManagerService } from './services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule, SuiTabsModule, SuiSelectModule } from 'ng2-semantic-ui';
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
  LibraryComponent, DesktopHeaderComponent, LibraryFiltersComponent
} from './components';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { FileSizeModule } from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { SlickModule } from 'ngx-slick';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
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
    SlickModule
  ],
  providers: [DeviceDetectorService, OfflineFileUploaderService, ContentManagerService],
  declarations: [ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent,
    BrowseComponent, WatchVideoComponent, ContentImportHeaderComponent, BrowseComponent,
    NetworkStatusComponent, WatchVideoComponent, ContentManagerComponent, OfflineHelpCenterComponent,
    DesktopAppUpdateComponent,
    LibraryComponent,
    DesktopHeaderComponent,
    LibraryFiltersComponent
  ],
  entryComponents: [
    ContentImportHeaderComponent,
    BrowseComponent,
    NetworkStatusComponent,
    ContentManagerComponent,
    WatchVideoComponent,
    ContentImportHeaderComponent,
  ],
  exports: [DesktopAppUpdateComponent, DesktopHeaderComponent, LibraryFiltersComponent]
})
export class OfflineModule { }
