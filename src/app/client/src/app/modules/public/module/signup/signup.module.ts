import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent, OtpComponent, SignupBasicInfoComponent, SignupOnboardingInfoComponent, SignupEmailPasswordComponent } from './components';
import { SignupRoutingModule } from './signup-routing.module';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { SignupService } from './services';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { LocationModule } from '../../../../plugins/location';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    TelemetryModule,
    SharedModule,
    SharedFeatureModule,
    LocationModule
  ],
  declarations: [SignupComponent, OtpComponent, SignupBasicInfoComponent, SignupOnboardingInfoComponent, SignupEmailPasswordComponent],
  providers: [SignupService]
})
export class SignupModule { }
