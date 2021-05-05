import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModalModule } from 'ng2-semantic-ui';

import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';

import { LocationSelectionComponent } from './components';
import { CommonFormElementsModule } from 'common-form-elements';

@NgModule({
  declarations: [
    LocationSelectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModalModule,
    SharedModule,
    TelemetryModule,
    CommonFormElementsModule
  ],
  exports: [
    LocationSelectionComponent
  ]
})
export class LocationModule { }
