import { TelemetryService, TELEMETRY_PROVIDER } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryInteractDirective,  TelemetryStartDirective } from './directives';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TelemetryInteractDirective, TelemetryStartDirective],
  providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }],
  exports: [TelemetryInteractDirective, TelemetryStartDirective]
})
export class TelemetryModule { }
