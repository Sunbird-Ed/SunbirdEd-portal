import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { IInteractEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryInteract]'
})
export class TelemetryInteractDirective implements OnInit, OnChanges {
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
  }
  ngOnChanges() {
    if (this.appTelemetryInteract) {
      this.interact();
    }
  }
  interact() {
    console.log('call TelemetryInteract method ');
    this.telemetryService.interact(this.appTelemetryInteract);
  }
}


