import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { PublicPlayerService } from '@sunbird/public';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    OfflineRoutingModule
  ],
  providers: [PublicPlayerService, DeviceDetectorService]
})
export class OfflineModule { }
