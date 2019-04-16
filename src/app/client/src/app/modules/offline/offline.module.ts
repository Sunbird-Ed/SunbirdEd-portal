import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ContentImportComponent } from './components/content-import/content-import.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    CoreModule,
    SharedModule,
    OfflineRoutingModule
  ],
  providers: [PublicPlayerService, DeviceDetectorService],
  declarations: []
})
export class OfflineModule { }
