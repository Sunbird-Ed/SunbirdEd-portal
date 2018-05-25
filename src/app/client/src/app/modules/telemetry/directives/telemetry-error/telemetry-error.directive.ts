import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { IErrorEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryError]'
})
export class TelemetryErrorDirective implements OnInit , OnChanges {
  /**
   * Interact event input
  */
  @Input('appTelemetryError') appTelemetryError: IErrorEventInput;
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
  ngOnInit() {
    if (this.appTelemetryError) {
       this.telemetryService.error(this.appTelemetryError);
    }
  }
  ngOnChanges() {
    if (this.appTelemetryError) {
       this.telemetryService.error(this.appTelemetryError);
    }
  }
}




