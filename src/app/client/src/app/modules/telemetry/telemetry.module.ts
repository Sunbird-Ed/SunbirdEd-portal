import { TelemetryService, TELEMETRY_PROVIDER } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryInteractDirective,  TelemetryStartDirective, TelemetryEndDirective, TelemetryImpressionDirective,
  TelemetryShareDirective, TelemetryErrorDirective } from './directives';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TelemetryInteractDirective, TelemetryStartDirective, TelemetryEndDirective,
     TelemetryImpressionDirective, TelemetryShareDirective, TelemetryErrorDirective],
  providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }],
  exports: [TelemetryInteractDirective, TelemetryStartDirective, TelemetryEndDirective,
    TelemetryImpressionDirective, TelemetryShareDirective, TelemetryErrorDirective]
})
export class TelemetryModule { }
