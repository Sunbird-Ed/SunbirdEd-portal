import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryInteractDirective } from './directives/telemetry-interact.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TelemetryInteractDirective]
})
export class TelemetryModule { }
