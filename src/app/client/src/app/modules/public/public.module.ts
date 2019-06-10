import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { LandingPageComponent } from './components';
import { PublicPlayerService, LandingpageGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { OfflineBannerComponent } from './components/offline-banner/offline-banner.component';
import { OfflineApplicationDownloadComponent } from './components/offline-application-download/offline-application-download.component';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    PublicRoutingModule
  ],
  declarations: [LandingPageComponent, OfflineBannerComponent, OfflineApplicationDownloadComponent],
  providers: [PublicPlayerService, DeviceDetectorService, LandingpageGuard],
  exports: [OfflineBannerComponent]
})
export class PublicModule { }
