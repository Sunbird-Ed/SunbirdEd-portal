import { ExploreModule } from './../public/module/explore/explore.module';
import { OfflineFileUploaderService } from './services';
import { SuiModalModule, SuiProgressModule } from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  ContentImportComponent, ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent,
  BrowseComponent
} from './components';
import { WebExtensionModule } from '@project-sunbird/web-extensions';


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
    ExploreModule
  ],
  providers: [DeviceDetectorService, OfflineFileUploaderService],
  declarations: [
    ContentImportComponent, ContentImportHeaderComponent, WatchVideoComponent, NetworkStatusComponent,
    BrowseComponent, WatchVideoComponent,
  ],
  entryComponents: [
    ContentImportHeaderComponent,
    BrowseComponent,
    NetworkStatusComponent,
    WatchVideoComponent
  ]
})
export class OfflineModule { }
