import { IInteractEventEdata } from '@sunbird/telemetry';
import { Component, OnInit, Input } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { environment } from '@sunbird/environment';
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

  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }

  ngOnInit() {

  }

  setTelemetryInteractEdata(type): IInteractEventEdata {
    return {
      id: type,
      type: 'click',
      pageid: 'footer'
    };
  }

}
