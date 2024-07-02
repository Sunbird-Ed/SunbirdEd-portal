import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { LandingPageComponent } from './components';
import { PublicPlayerService, LandingpageGuard, PendingchangesGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CslFrameworkService } from './services/csl-framework/csl-framework.service';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    PublicRoutingModule
  ],
  declarations: [LandingPageComponent],
  providers: [PublicPlayerService, DeviceDetectorService, LandingpageGuard, PendingchangesGuard,CslFrameworkService]
})
export class PublicModule { }
