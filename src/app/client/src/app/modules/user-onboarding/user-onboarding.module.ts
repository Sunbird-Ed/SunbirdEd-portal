import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingPopupComponent } from './components/onboarding-popup/onboarding-popup.component';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import {LocationModule} from '../../plugins/location/location.module';
import { SharedModule } from '@sunbird/shared';
import {MatStepperModule} from '@angular/material/stepper';
import {CdkStepperModule} from '@angular/cdk/stepper';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';


@NgModule({
  declarations: [
    OnboardingPopupComponent,
  ],
  imports: [
    CommonModule,
    SharedFeatureModule,
    LocationModule,
    SharedModule,
    MatStepperModule,
    CdkStepperModule,
    SunbirdVideoPlayerModule
  ],
  exports: [
    OnboardingPopupComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserOnboardingModule { }
