import { Injectable, Inject, InjectionToken } from '@angular/core';
import * as _ from 'lodash-es';
import {
  ITelemetryEvent, ITelemetryContextData, TelemetryObject,
  IStartEventInput, IImpressionEventInput, IExDataEventInput,
  IInteractEventInput, IShareEventInput, IErrorEventInput, IEndEventInput, ILogEventInput, ITelemetryContext, IFeedBackEventInput
} from './../../interfaces/telemetry';

export const TELEMETRY_PROVIDER = new InjectionToken('telemetryProvider');
/**
* Service for telemetry v3 event methods
*/

@Injectable()
export class TelemetryService {

  /**
   *
   *
   * @private
   * @type {ITelemetryContext}
   * @memberof TelemetryService
   */
  private context: ITelemetryContext;

  /**
   *
   *
   * @private
   * @type {*}
   * @memberof TelemetryService
   */
  private telemetryProvider: any;

  /**
   *
   *
   * @private
   * @type {Boolean}
   * @memberof TelemetryService
   */
  private isInitialized: Boolean = false;

  /**
   * Creates an instance of TelemetryService.
   * @param {*} telemetryProvider
   * @memberof TelemetryService
   */

  sessionId;
  public UTMparam;

  constructor() {
    // , { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }
    this.telemetryProvider = EkTelemetry;
    this.sessionId = (<HTMLInputElement>document.getElementById('sessionId'))
    ? (<HTMLInputElement>document.getElementById('sessionId')).value : undefined;
    if (sessionStorage.getItem('UTM')) {
      this.UTMparam = JSON.parse(sessionStorage.getItem('UTM'));
    }
  }

  /**
   *
   * Initializes the service
   * @param {ITelemetryContext} context
   * @memberof TelemetryService
   */
  public initialize(context: ITelemetryContext) {
    this.context = _.cloneDeep(context);
    this.telemetryProvider.initialize(this.context.config);
    this.isInitialized = true;
  }
  getDeviceId(callback) {
    EkTelemetry.getFingerPrint(callback);
  }
  /**
   *
   * Telemetry data sync method
   * @memberof TelemetryService
   */
  public syncEvents(async: Boolean = true) {
    this.telemetryProvider.syncEvents(async);
    console.log('Telemetry data is Synced!');
  }

  /**
   *
   *
   * @param {IStartEventInput} startEventInput
   * @memberof TelemetryService
   */
  public async start(startEventInput: IStartEventInput) {
    if (this.isInitialized) {
      startEventInput = await _.cloneDeep(this.addUTM(startEventInput));
      const eventData: ITelemetryEvent = this.getEventData(startEventInput);
      this.telemetryProvider.start(this.context.config, eventData.options.object.id, eventData.options.object.ver,
        eventData.edata, eventData.options);
    }
  }

  /**
   *
   * service method to trigger impression event telemetry
   * @param {IImpressionEventInput} impressionEventInput
   * @memberof TelemetryService
   */
  public async impression(impressionEventInput: IImpressionEventInput) {
    if (this.isInitialized) {
      impressionEventInput = await _.cloneDeep(this.addUTM(impressionEventInput));
      const eventData: ITelemetryEvent = this.getEventData(impressionEventInput);
      this.telemetryProvider.impression(eventData.edata, eventData.options);
    }
  }
  /**
   *
   * Logs 'interact' telemetry event
   * @param {IInteractEventInput} interactEventInput
   * @memberof TelemetryService
   */
  public async interact(interactEventInput: IInteractEventInput) {
    if (this.isInitialized) {
      interactEventInput = await _.cloneDeep(this.addUTM(interactEventInput));
      const eventData: ITelemetryEvent = this.getEventData(interactEventInput);
      this.telemetryProvider.interact(eventData.edata, eventData.options);
    }
  }

  /**
   * Logs 'share' telemetry event
   *
   * @param {IShareEventInput} shareEventInput
   * @memberof TelemetryService
   */
  public async share(shareEventInput: IShareEventInput) {
    if (this.isInitialized) {
      shareEventInput = await _.cloneDeep(this.addUTM(shareEventInput));
      const eventData: ITelemetryEvent = this.getEventData(shareEventInput);
      this.telemetryProvider.share(eventData.edata, eventData.options);
    }
  }
  /**
   * Logs 'error' telemetry event
   *
   * @param {IErrorEventInput} errorEventInput
   * @memberof TelemetryService
   */
  public async error(errorEventInput: IErrorEventInput) {
    if (this.isInitialized) {
      errorEventInput = await _.cloneDeep(this.addUTM(errorEventInput));
      const eventData: ITelemetryEvent = this.getEventData(errorEventInput);
      this.telemetryProvider.error(eventData.edata, eventData.options);
    }
  }

  public generateErrorEvent(data) {
    const telemetryErrorData = {
      context: {env: data.env},
      edata: {
        err: data.errorMessage,
        errtype: data.errorType,
        stacktrace: data.stackTrace,
        pageid: data.pageid
      }
    };
    this.error(telemetryErrorData);
  }

  /**
   * Logs 'end' telemetry event
   *
   * @param {IEndEventInput} endEventInput
   * @memberof TelemetryService
   */
  public async end(endEventInput: IEndEventInput) {
    if (this.isInitialized) {
      endEventInput = await _.cloneDeep(this.addUTM(endEventInput));
      const eventData: ITelemetryEvent = this.getEventData(endEventInput);
      this.telemetryProvider.end(eventData.edata, eventData.options);
    }
  }

  /**
   * Logs 'log' telemetry event
   *
   * @param {ILogEventInput} logEventInput
   * @memberof TelemetryService
   */
  public async log(logEventInput: ILogEventInput) {
    if (this.isInitialized) {
      logEventInput = await _.cloneDeep(this.addUTM(logEventInput));
      const eventData: ITelemetryEvent = this.getEventData(logEventInput);
      this.telemetryProvider.log(eventData.edata, eventData.options);
    }
  }

  /**
   * Logs 'exdata' telemetry event
   *
   * @param {IExDataEventInput} exDataEventInput
   * @memberof TelemetryService
   */
  public async exData(exDataEventInput: IExDataEventInput) {
    if (this.isInitialized) {
      exDataEventInput = await _.cloneDeep(this.addUTM(exDataEventInput));
      const eventData: ITelemetryEvent = this.getEventData(exDataEventInput);
      this.telemetryProvider.exdata(eventData.edata, eventData.options);
    }
  }

  /**
   * Feedback 'feedback' telemetry event
   *
   * @param {IFeedBackEventInput} IFeedBackEventInput
   * @memberof TelemetryService
   */
  public async feedback(feedbackEventInput: IFeedBackEventInput) {
    if (this.isInitialized) {
      feedbackEventInput = await _.cloneDeep(this.addUTM(feedbackEventInput));
      const eventData: ITelemetryEvent = this.getEventData(feedbackEventInput);
      this.telemetryProvider.feedback(eventData.edata, eventData.options);
    }
  }

  /**
   *
   *
   * @private
   * @param {*} eventInput
   * @returns
   * @memberof TelemetryService
   */
  private getEventData(eventInput: any) {
    const event: ITelemetryEvent = {
      edata: eventInput.edata,
      options: {
        context: this.getEventContext(eventInput),
        object: this.getEventObject(eventInput),
        tags: _.compact(this.context.userOrgDetails.organisationIds)
      }
    };
    return event;
  }

  /**
   *
   *
   * @private
   * @param {*} eventInput
   * @returns
   * @memberof TelemetryService
   */
  private getEventObject(eventInput: any) {
    if (eventInput.object) {
      const eventObjectData: TelemetryObject = {
        id: eventInput.object.id || '',
        type: eventInput.object.type || '',
        ver: eventInput.object.ver || '',
        rollup: eventInput.object.rollup || {}
      };
      return eventObjectData;
    } else { // telemetry.min.js will take last sent object is not sent.
      return {};
    }
  }

  /**
   *
   *
   * @private
   * @param {*} eventInput
   * @returns
   * @memberof TelemetryService
   */
  private getEventContext(eventInput: any) {
    const eventContextData: ITelemetryContextData = {
      channel: eventInput.edata.channel || this.context.config.channel,
      pdata: eventInput.context.pdata || this.context.config.pdata,
      env: eventInput.context.env || this.context.config.env,
      sid: eventInput.sid || this.context.config.sid,
      uid: this.context.config.uid,
      cdata: eventInput.context.cdata || [],
      rollup: this.getRollUpData(this.context.userOrgDetails.organisationIds)
    };
    return eventContextData;
  }

  /**
   *
   *
   * @private
   * @param {Array<string>} [data=[]]
   * @returns
   * @memberof TelemetryService
   */
  public getRollUpData(data: Array<string> = []) {
    const rollUp = {};
    data.forEach((element, index) => rollUp['l' + (index + 1)] = element);
    return rollUp;
  }
  /**
   * returns client machine details
   *
   * @returns
   * @memberof TelemetryService
   */
  public getUserAgent() {
    return {
      agent: window.navigator.appCodeName,
      ver: window.navigator.appVersion.split(' (')[0],
      system: '',
      platform: window.navigator.platform,
      raw: window.navigator.userAgent
    };
  }

  public setUTMparam(utmParams) {
    this.UTMparam = utmParams;
  }

  public addUTM(object) {
    const cloneObject = _.cloneDeep(object);
    if (this.UTMparam) {
      cloneObject['context']['cdata'] ?
        _.forEach(this.UTMparam, item => {
          cloneObject['context']['cdata'].push(item);
        }) :
        cloneObject['context']['cdata'] = this.UTMparam;
      return cloneObject;
    } else {
      return cloneObject;
    }
  }
}
