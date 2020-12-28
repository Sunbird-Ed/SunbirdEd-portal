import { TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from './../navigation-helper/navigation-helper.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiscussionTelemetryService {

  constructor(private navigationHelperService: NavigationHelperService, private telemetryService: TelemetryService) { }

  generateImpressionObj (event) {
    const impressionData = {
      context: {
        env: 'discussion',
        cdata: event.context
      },
      edata: event.edata,
    };
    impressionData.edata.duration = this.navigationHelperService.getPageLoadTime();
    this.telemetryService.impression(impressionData);
  }

  generateInteractObj (event) {
    const interactData = {
      context: {
        env: 'discussion',
        cdata: event.context
      },
      edata: event.edata,
    };
    this.telemetryService.interact(interactData);
  }
}
