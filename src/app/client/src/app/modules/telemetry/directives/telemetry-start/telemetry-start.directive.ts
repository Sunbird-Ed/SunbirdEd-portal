import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { IStartEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryStart]'
})
export class TelemetryStartDirective implements OnInit {
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
    if (this.appTelemetryStart) {
      this.interact();
    }
  }
  interact() {
    console.log('call TelemetryInteract method ');
    this.telemetryService.start(this.appTelemetryStart);
  }
}


