import { Directive, ElementRef, Input, OnInit, OnChanges, DoCheck  } from '@angular/core';
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
  constructor(telemetryService: TelemetryService) {
    this.telemetryService = telemetryService;
  }
  ngOnChanges() {
    console.log(this.appTelemetryEnd);
    if (this.appTelemetryEnd) {
       this.telemetryEnd();
    }
  }
  ngOnInit() {
    console.log(this.appTelemetryEnd);
  }
  telemetryEnd() {
    console.log('call TelemetryEnd method ', this.appTelemetryEnd);
    this.telemetryService.end(this.appTelemetryEnd);
  }
}
