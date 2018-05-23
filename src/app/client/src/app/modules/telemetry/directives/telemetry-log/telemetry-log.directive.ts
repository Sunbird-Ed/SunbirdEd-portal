import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { ILogEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryLog]'
})
export class TelemetryLogDirective implements OnInit {
  /**
   * Interact event input
  */
  @Input('appTelemetryLog') appTelemetryLog: ILogEventInput;
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
    if (this.appTelemetryLog) {
      this.log();
    }
  }
  log() {
    console.log('call TelemetryLog method ');
    this.telemetryService.log(this.appTelemetryLog);
  }
  }




