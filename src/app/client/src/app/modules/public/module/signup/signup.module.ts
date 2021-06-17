import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent, OtpComponent } from './components';
import { SignupRoutingModule } from './signup-routing.module';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { SignupService } from './services';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import {SharedFeatureModule } from '@sunbird/shared-feature';


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
    SharedFeatureModule
  ],
  declarations: [SignupComponent, OtpComponent],
  providers: [SignupService]
})
export class SignupModule { }
