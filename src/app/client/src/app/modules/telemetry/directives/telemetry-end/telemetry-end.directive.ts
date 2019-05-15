import { Directive, ElementRef, Input, OnDestroy, DoCheck, HostListener } from '@angular/core';
import { IEndEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

@Directive({
  selector: '[appTelemetryEnd]'
})
export class TelemetryEndDirective implements OnDestroy {

  /**
   * Interact event input
  */
  @Input() appTelemetryEnd: IEndEventInput;
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

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
   this.endEvent();
  }

  ngOnDestroy() {
    this.endEvent();
  }
  endEvent () {
    if (this.appTelemetryEnd) {
      this.telemetryService.end(this.appTelemetryEnd);
    }
  }
}
