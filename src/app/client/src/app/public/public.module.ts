import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import {
  LandingPageComponent, SignupComponent, PublicContentPlayerComponent,
  PublicCollectionPlayerComponent, ExploreContentComponent
} from './components';
import { Routes, RouterModule } from '@angular/router';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';
import { PublicFooterComponent } from './components/public-footer/public-footer.component';
import { SignupService, PublicPlayerService, OrgManagementService } from './services';
import { SharedModule } from '@sunbird/shared';
// import { DiscussionModule } from '@sunbird/discussion';
import { PublicRoutingModule } from './public-routing.module';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DeviceDetectorService } from 'ngx-device-detector';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    // DiscussionModule,
    PublicRoutingModule,
    TelemetryModule,
    NgInviewModule,
    DeviceDetectorModule
  ],
  declarations: [LandingPageComponent, SignupComponent, GetComponent, DialCodeComponent,
    PublicFooterComponent, PublicContentPlayerComponent, PublicCollectionPlayerComponent, ExploreContentComponent],
  providers: [SignupService, PublicPlayerService, OrgManagementService, DeviceDetectorService]
})
export class PublicModule { }
