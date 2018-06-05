import { Directive, Input, OnInit, OnChanges, HostListener } from '@angular/core';
import { IInteractEventInput, IInteractEventObject , IInteractEventEdata } from '../../interfaces';
import { TelemetryService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
/**
 * TelemetryInteract Directive
 */
@Directive({
  selector: '[appTelemetryInteract]'
})
export class TelemetryInteractDirective {
  /**
   * Interact event input
  */
  appTelemetryInteractData: IInteractEventInput;

  public telemetryService: TelemetryService;

  @Input() telemetryInteractObject: IInteractEventObject;
  @Input() telemetryInteractEdata: IInteractEventEdata;

  @HostListener('click', ['$event'])
  private onClick(e) {
    if (this.telemetryInteractEdata) {
      this.appTelemetryInteractData = {
        context: {
          env: _.get(this.activatedRoute , 'snapshot.root.firstChild.data.telemetry.env') || this.activatedRoute.snapshot.data.telemetry.env
        },
        edata: this.telemetryInteractEdata
      };
      if (this.telemetryInteractObject) {
        this.appTelemetryInteractData.object = this.telemetryInteractObject;
      }
      this.telemetryService.interact(this.appTelemetryInteractData);
    }
  }
  /**
  * Constructor to create injected service(s) object Default method of Draft Component class
  * @param {TelemetryService} telemetryService Reference of TelemetryService
  */
  constructor( telemetryService: TelemetryService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.telemetryService = telemetryService;
  }
}
