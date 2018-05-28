import { Directive, Input, OnInit, OnChanges } from '@angular/core';
import { IInteractEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryInteract]'
})
export class TelemetryInteractDirective implements OnChanges {
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
  constructor(telemetryService: TelemetryService) {
    this.telemetryService = telemetryService;
  }
  ngOnChanges() {
    if (this.appTelemetryInteract) {
      this.telemetryService.interact(this.appTelemetryInteract);
    }
  }
}
