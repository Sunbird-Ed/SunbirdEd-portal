import { Injectable } from '@angular/core';
import { IImpressionEventInput, IInteractEventEdata, IInteractEventObject } from '@sunbird/telemetry';
import { UserService } from '@sunbird/core';
import { ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';


@Injectable({
  providedIn: 'root'
})
export class ProgramTelemetryService {

  constructor( public userService: UserService, public configService: ConfigService ) { }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type, // 'type': 'click',
      pageid, // 'pageid': 'header',
      extra
    }, _.isUndefined);

     // {
    //   id,
    //   type, // 'type': 'click',
    //   pageid // 'pageid': 'header',
    //   edata
    // };
  }
  getTelemetryInteractPdata(id?: string, pid?: string) {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    return {
      id, // this.userService.appId,
      ver: version,
      pid // `${this.configService.appConfig.TELEMETRY.PID}.programs`
    };
  }
  getTelemetryInteractObject(id: string, type: string, ver: string): IInteractEventObject {
    return {
      id, type, ver
    };
  }
  getTelemetryInteractCdata(id: string, type: string) {
    return [{
      type, id
    }];
  }
}
