import { Directive, Input, OnInit } from '@angular/core';
import { IShareEventInput, IShareEventData } from '../../interfaces';
import { TelemetryService } from '../../services';
import { ActivatedRoute } from '@angular/router';
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
  appTelemetryShare: IShareEventInput;
   @Input() TelemetryShareEdata: IShareEventData;
  /**
   * reference of permissionService service.
  */
  public telemetryService: TelemetryService;
  /**
  * Constructor to create injected service(s) object
  Default method of Draft Component class
  * @param {TelemetryService} telemetryService Reference of TelemetryService
  */
  constructor( telemetryService: TelemetryService, private activatedRoute: ActivatedRoute) {
    this.telemetryService = telemetryService;
  }
  ngOnInit() {
    if (this.TelemetryShareEdata) {
      this.appTelemetryShare = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: this.TelemetryShareEdata
      };
      this.telemetryService.share(this.appTelemetryShare);
    }
  }
}
