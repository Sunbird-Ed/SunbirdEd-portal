import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModalModule } from 'ng2-semantic-ui';

import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';

import { OnboardingLocationComponent } from './components';
import { LocationRoutingModule } from './location-routing.module';
import { CommonFormElementsModule } from 'common-form-elements';

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
    LocationRoutingModule,
    CommonFormElementsModule
  ],
  exports: [
    OnboardingLocationComponent
  ]
})
export class LocationModule { }
