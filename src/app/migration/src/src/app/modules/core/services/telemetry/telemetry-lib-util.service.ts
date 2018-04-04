import { Injectable } from '@angular/core';
import {
  ITelemetry, ITelemetryEvent
} from './../../interfaces';
@Injectable()
export class TelemetryLibUtilService {
  constructor() {

  }
  public startEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.start(telemetry, iTelemetryEvent.contentId, iTelemetryEvent.contentVer,
      iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public impressionEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.impression(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public interactEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.interact(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public shareEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.share(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public errorEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.error(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
  public endEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.end(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
}
