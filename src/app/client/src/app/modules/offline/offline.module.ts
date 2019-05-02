import { SuiModalModule } from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContentImportComponent, ContentImportHeaderComponent } from './components';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    OfflineRoutingModule,
    SuiModalModule
  ],
  providers: [DeviceDetectorService],
  declarations: [
    ContentImportComponent, ContentImportHeaderComponent
  ],
  entryComponents: [
    ContentImportHeaderComponent
  ]
})
export class OfflineModule { }
