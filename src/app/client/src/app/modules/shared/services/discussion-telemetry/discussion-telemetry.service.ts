import { TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from './../navigation-helper/navigation-helper.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class DiscussionTelemetryService {

  constructor(private navigationHelperService: NavigationHelperService, private telemetryService: TelemetryService) { }

  logTelemetryEvent(event) {
    const data = {
      context: {
        env: 'discussion',
        cdata: _.get(event, 'context.cdata') || []
      },
      edata: _.get(event, 'edata'),
      object: _.get(event, 'context.object')
    };

    data.context.cdata.push(
      {
        id: 'courseId',
        type: 'Course'
      }
    );
    data.context.cdata.push(
      {
        id: 'batchId',
        type: 'Batch'
      },
    );
    
    switch (event.eid) {
      case 'IMPRESSION':
        data.edata.duration = this.navigationHelperService.getPageLoadTime();
        this.telemetryService.impression(data);
        break;
      case 'INTERACT':
        this.telemetryService.interact(data);
        break;
    }
  }
}
