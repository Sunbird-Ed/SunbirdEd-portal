import { Directive, ElementRef, Input, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { IImpressionEventInput } from '../../interfaces';
import { TelemetryService } from '../../services';

/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryImpression]'
})
export class TelemetryImpressionDirective implements OnInit, OnDestroy, OnChanges {
  /**
   * Interact event input
  */
  @Input() appTelemetryImpression: IImpressionEventInput;
  /**
   * reference of permissionService service.
  */
  public telemetryService: TelemetryService;
  public eventTriggered = false;

  /**
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {TelemetryService} telemetryService Reference of TelemetryService
  */
  constructor(telemetryService: TelemetryService) {
    this.telemetryService = telemetryService;
  }
  ngOnInit() {
  }
  /** this is written in on changes as impression from components are been initalized inside set timeout */
  ngOnChanges() {
    if (this.appTelemetryImpression && !this.eventTriggered) {
      this.eventTriggered = true;
      this.telemetryService.impression(this.appTelemetryImpression);
    }
  }
  ngOnDestroy() {
    if (this.appTelemetryImpression && this.appTelemetryImpression.edata.subtype === 'pageexit') {
      this.telemetryService.impression(this.appTelemetryImpression);
    }
  }
}
