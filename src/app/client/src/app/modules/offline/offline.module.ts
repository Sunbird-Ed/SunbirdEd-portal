import { ExploreModule } from './../public/module/explore/explore.module';
import { OfflineFileUploaderService, DownloadManagerService } from './services';
import { SuiModalModule, SuiProgressModule, SuiAccordionModule } from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ContentImportComponent, ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent,
  BrowseComponent, DownloadManagerComponent
} from './components';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import {FileSizeModule} from 'ngx-filesize';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    OfflineRoutingModule,
    SuiModalModule,
    SuiProgressModule,
    WebExtensionModule,
    ExploreModule,
    FileSizeModule,
    SuiAccordionModule
  ],
  providers: [DeviceDetectorService, OfflineFileUploaderService, DownloadManagerService],
  declarations: [
    ContentImportComponent, ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent,
    BrowseComponent, WatchVideoComponent,
    ContentImportComponent, ContentImportHeaderComponent, BrowseComponent,
    NetworkStatusComponent, WatchVideoComponent, DownloadManagerComponent
  ],
  entryComponents: [
    ContentImportHeaderComponent,
    BrowseComponent,
    NetworkStatusComponent,
    DownloadManagerComponent,
    WatchVideoComponent,
    ContentImportHeaderComponent
  ]
})
export class OfflineModule { }
