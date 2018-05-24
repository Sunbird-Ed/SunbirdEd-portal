import { Directive, Input, OnInit } from '@angular/core';
import { IShareEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryShare]'
})
export class TelemetryShareDirective implements OnInit {
  /**
   * Interact event input
  */
  @Input('appTelemetryShare') appTelemetryShare: IShareEventInput;
  /**
   * reference of permissionService service.
  */
  public telemetryService: TelemetryService;
  /**
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {TelemetryService} telemetryService Reference of TelemetryService
  */
  constructor( telemetryService: TelemetryService) {
    this.telemetryService = telemetryService;
  }
  ngOnInit() {
    if (this.appTelemetryShare) {
      this.share();
    }
  }
  share() {
    this.telemetryService.share(this.appTelemetryShare);
  }
}
