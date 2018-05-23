import { Directive, ElementRef, Input, OnInit , OnChanges } from '@angular/core';
import { IStartEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryStart]'
})
export class TelemetryStartDirective implements OnInit, OnChanges {
  /**
   * Interact event input
  */
  @Input('appTelemetryStart') appTelemetryStart: IStartEventInput;
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
   if (this.appTelemetryStart) {
      this.start();
    }
  }
  start() {
    console.log('call Telemetrystart method ', this.appTelemetryStart);
    this.telemetryService.start(this.appTelemetryStart);
  }
}


