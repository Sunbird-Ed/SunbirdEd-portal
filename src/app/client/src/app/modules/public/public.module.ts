import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { LandingPageComponent } from './components';
import { PublicPlayerService, LandingpageGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    PublicRoutingModule
  ],
  declarations: [LandingPageComponent],
  providers: [PublicPlayerService, DeviceDetectorService, LandingpageGuard]
})
export class PublicModule { }
