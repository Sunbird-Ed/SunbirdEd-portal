import { Directive, Input, OnInit, OnChanges, HostListener } from '@angular/core';
import { IInteractEventInput, IInteractEventObject, IInteractEventEdata, IProducerData } from '../../interfaces';
import { TelemetryService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
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

  @Input() telemetryInteractCdata: Array<{}>;
  @Input() telemetryInteractContext;
  @Input() telemetryInteractPdata: IProducerData;



  @HostListener('click', ['$event'])

  private onClick(e) {

    if (this.telemetryInteractEdata) {
      this.appTelemetryInteractData = {
       context: {
          env: _.get(this.telemetryInteractContext, 'env') || _.get(this.activatedRoute, 'snapshot.root.firstChild.data.telemetry.env') ||
          _.get(this.activatedRoute, 'snapshot.data.telemetry.env') ||
          _.get(this.activatedRoute.snapshot.firstChild, 'children[0].data.telemetry.env') ,
          cdata: this.telemetryInteractCdata || [],
        },
        edata: this.telemetryInteractEdata
      };
      if (this.telemetryInteractObject) {
        if (this.telemetryInteractObject.ver) {
          this.telemetryInteractObject.ver = _.isNumber(this.telemetryInteractObject.ver) ?
          _.toString(this.telemetryInteractObject.ver) : this.telemetryInteractObject.ver;
        }
        this.appTelemetryInteractData.object = this.telemetryInteractObject;
      }
      if (this.telemetryInteractPdata) {
        this.appTelemetryInteractData.context.pdata = this.telemetryInteractPdata;
      }
      this.telemetryService.interact(this.appTelemetryInteractData);
    }
  }
  /**
  * Constructor to create injected service(s) object Default method of Draft Component class
  * @param {TelemetryService} telemetryService Reference of TelemetryService
  */
  constructor(telemetryService: TelemetryService, public activatedRoute: ActivatedRoute, public router: Router) {
    this.telemetryService = telemetryService;
  }
}
