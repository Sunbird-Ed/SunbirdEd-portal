import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  ITelemetry, ITelemetryEvent
} from './../../interfaces';
@Injectable()
export class TelemetryLibUtilService {
  constructor() {

  }
  public initEvent(telemetry: ITelemetry) {
    console.log('Initialize telemetry');
    EkTelemetry.initialize(telemetry);
  }
  public startEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.start(telemetry, iTelemetryEvent.contentId, iTelemetryEvent.contentVer,
      iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public impressionEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.impression(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public interactEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.interact(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public shareEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.share(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public errorEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.error(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public endEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.end(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
}
