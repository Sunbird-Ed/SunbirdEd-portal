import { TelemetryService, TELEMETRY_PROVIDER } from './services';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryInteractDirective,  TelemetryStartDirective } from './directives';

@NgModule({
  imports: [
    CommonModule
  ],
<<<<<<< HEAD
  declarations: [TelemetryInteractDirective],
  exports: [TelemetryInteractDirective],
  providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }]
=======
  declarations: [TelemetryInteractDirective, TelemetryStartDirective],
  providers: [TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }],
  exports: [TelemetryInteractDirective, TelemetryStartDirective]
>>>>>>> 3ef2cf516431198b193180e386fd647170237c63
})
export class TelemetryModule { }
