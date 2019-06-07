import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
import { IInteractEventEdata } from '@sunbird/telemetry';
import * as _ from 'lodash-es';

@Component({
  selector: 'app-footer',
  templateUrl: './main-footer.component.html'
})
export class MainFooterComponent implements OnInit {
  /**
   * reference of resourceService service.
   */
  public resourceService: ResourceService;
  /*
  Date to show copyright year
  */
  date = new Date();
  /*
  Hide or show footer
  */
  showFooter = true;

  isOffline: boolean = environment.isOffline;
  instance: string;

  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {
    this.instance = _.upperCase(this.resourceService.instance);
  }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: 'footer'
    };
  }

}
