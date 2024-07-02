import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModalModule } from 'ng2-semantic-ui-v9';

import { SharedModule } from '../../modules/shared/shared.module';
import { TelemetryModule } from '../../modules/telemetry/telemetry.module';

import { LocationSelectionComponent } from './components/location-selection/location-selection.component';
import { CommonFormElementsModule } from '@project-sunbird/common-form-elements-full';

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
