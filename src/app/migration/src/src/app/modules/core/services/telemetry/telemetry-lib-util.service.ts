import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  ITelemetry, ITelemetryEvent
} from './../../interfaces';

@Injectable()
/**
 * service class to call telemetry library methods
 */
export class TelemetryLibUtilService {
  constructor() {

  }
  /**
   * method to execute 'initalize' telemetry lib function
   * @param telemetry 'ITelemetry' reference
   */
  public initEvent(telemetry: ITelemetry) {
    console.log('Initialize telemetry');
    EkTelemetry.initialize(telemetry);
  }

  /**
   * method to execute 'start' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   * @param telemetry 'ITelemetry' reference
   */
  public startEvent(iTelemetryEvent: ITelemetryEvent, telemetry: ITelemetry) {
    EkTelemetry.start(telemetry, iTelemetryEvent.contentId, iTelemetryEvent.contentVer,
      iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  /**
   * method to execute 'impression' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   */
  public impressionEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.impression(iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  /**
   * method to execute 'interact' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   */
  public interactEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.interact(iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  /**
   * method to execute 'share' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   */
  public shareEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.share(iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  /**
   * method to execute 'error' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   */
  public errorEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.error(iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  /**
   * method to execute 'end' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   */
  public endEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.end(iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  /**
   * method to execute 'log' telemetry lib method
   * @param iTelemetryEvent 'ITelemetryEvent' reference
   */
  public logEvent(iTelemetryEvent: ITelemetryEvent) {
    EkTelemetry.log(iTelemetryEvent.edata, iTelemetryEvent.options);
  }
}
