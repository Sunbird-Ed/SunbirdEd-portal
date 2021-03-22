import { TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from './../navigation-helper/navigation-helper.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class DiscussionTelemetryService {

  constructor(private navigationHelperService: NavigationHelperService, private telemetryService: TelemetryService) { }

  private _contextCdata = [];
  logTelemetryEvent(event) {
    const data = {
      context: {
        env: 'discussion',
        cdata: _.union(_.get(event, 'context.cdata'), this.contextCdata)
      },
      edata: _.get(event, 'edata'),
      object: _.get(event, 'context.object')
    };

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

  set contextCdata(objectData: Array<object>) {
    this._contextCdata = objectData;
  }

  get contextCdata() {
    return this._contextCdata;
  }
}
