import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModalModule } from 'ng2-semantic-ui';

import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';

import { OnboardingLocationComponent } from './components';
import { LocationRoutingModule } from './location-routing.module';

@NgModule({
  declarations: [
    OnboardingLocationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModalModule,
    SharedModule,
    TelemetryModule,
    LocationRoutingModule
  ],
  exports: [
    OnboardingLocationComponent
  ]
})
export class LocationModule { }
