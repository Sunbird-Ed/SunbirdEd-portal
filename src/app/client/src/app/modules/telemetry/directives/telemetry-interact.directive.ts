import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { IInteractEventInput } from '../interfaces/telemetry';
import { TelemetryService } from './../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryInteract]'
})
export class TelemetryInteractDirective implements OnInit {
  /**
   * Interact event input
  */
  @Input('appTelemetryInteract') appTelemetryInteract: IInteractEventInput;
  /**
   * reference of permissionService service.
  */
  public telemetryService: TelemetryService;
  /**
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {TelemetryService} telemetryService Reference of TelemetryService
  */
  constructor(private elRef: ElementRef, telemetryService: TelemetryService) {
    this.telemetryService = telemetryService;
  }
  ngOnInit() {
    if (this.appTelemetryInteract) {
      this.interact();
    }
  }
  interact() {
    console.log('call TelemetryInteract method ');
    this.telemetryService.interact(this.appTelemetryInteract);
  }
}


