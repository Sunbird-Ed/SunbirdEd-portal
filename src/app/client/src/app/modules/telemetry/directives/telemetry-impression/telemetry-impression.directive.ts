import { Directive, ElementRef, Input, OnInit, OnChanges } from '@angular/core';
import { IImpressionEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryImpression]'
})
export class TelemetryImpressionDirective implements OnInit, OnChanges {
  /**
   * Interact event input
  */
  @Input('appTelemetryImpression') appTelemetryImpression: IImpressionEventInput;
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
    if (this.appTelemetryImpression) {
    console.log('call TelemetryImpression method ', this.appTelemetryImpression);
    this.telemetryService.impression(this.appTelemetryImpression);
    }
  }

  ngOnChanges() {
    if (this.appTelemetryImpression) {
    console.log('call TelemetryImpression method ', this.appTelemetryImpression);
    this.telemetryService.impression(this.appTelemetryImpression);
    }
  }
}
