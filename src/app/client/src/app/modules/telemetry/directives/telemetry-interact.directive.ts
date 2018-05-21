import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appTelemetryInteract]'
})
export class TelemetryInteractDirective {
  @Input('appTelemetryInteract') appTelemetryInteract: any;
  constructor(private elRef: ElementRef) { }
  telemetryInteract() {
    console.log('Telemetry service are called ');
  }
}


