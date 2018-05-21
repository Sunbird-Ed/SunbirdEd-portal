import { TelemetryService, TELEMETRY_PROVIDER } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryInteractDirective } from './directives/telemetry-interact.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TelemetryInteractDirective],
  exports: [TelemetryInteractDirective],
  providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }]
})
export class TelemetryModule { }
