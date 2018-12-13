import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import {
  LandingPageComponent, SignupComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent
} from './components';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { SignupService, PublicPlayerService, SignupGuard, LandingpageGuard } from './services';
import { SharedModule } from '@sunbird/shared';
import { PublicRoutingModule } from './public-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BadgingModule } from '@sunbird/badge';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    PublicRoutingModule,
    TelemetryModule,
    NgInviewModule,
    DeviceDetectorModule,
    BadgingModule,
  ],
  declarations: [LandingPageComponent, SignupComponent, GetComponent, DialCodeComponent,
    PublicFooterComponent, PublicContentPlayerComponent, PublicCollectionPlayerComponent],
  providers: [SignupService, PublicPlayerService, DeviceDetectorService, SignupGuard, LandingpageGuard]
})
export class PublicModule { }
