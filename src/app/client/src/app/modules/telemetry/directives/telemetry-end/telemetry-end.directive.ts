import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { IEndEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

@Directive({
  selector: '[appTelemetryEnd]'
})
export class TelemetryEndDirective implements OnInit, OnChanges {

  /**
   * Interact event input
  */
  @Input('appTelemetryEnd') appTelemetryEnd: IEndEventInput;
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
    if (this.appTelemetryEnd) {
      this.telemetryEnd();
    }
  }
  telemetryEnd() {
    console.log('call TelemetryEnd method ');
    this.telemetryService.end(this.appTelemetryEnd);
  }

  ngOnChanges() {
    if (this.appTelemetryEnd) {
    }
  }

}
