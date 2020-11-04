import { Injectable, Inject, InjectionToken } from '@angular/core';
import * as _ from 'lodash-es';
import { IAuditEventInput } from '../../interfaces/telemetry';
import {
  ITelemetryEvent, ITelemetryContextData, TelemetryObject,
  IStartEventInput, IImpressionEventInput, IExDataEventInput,
  IInteractEventInput, IShareEventInput, IErrorEventInput, IEndEventInput, ILogEventInput, ITelemetryContext, IFeedBackEventInput
} from './../../interfaces/telemetry';
import { DeviceDetectorService } from 'ngx-device-detector';

export const TELEMETRY_PROVIDER = new InjectionToken('telemetryProvider');
/**
* Service for telemetry v3 event methods
*/
enum UTM_PARAMS {
  channel = 'Source',
  utm_campaign = 'Source',
  utm_medium = 'UtmMedium',
  utm_source = 'UtmSource',
  utm_term = 'UtmTerm',
  utm_content = 'UtmContent'
}

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
  private isInitialized = false;

  /**
   * Creates an instance of TelemetryService.
   * @param {*} telemetryProvider
   * @memberof TelemetryService
   */

  sessionId;
  public UTMparam;
  userSid;
  private deviceType: string;

  constructor() {
    // , { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }
    this.telemetryProvider = EkTelemetry;
    this.sessionId = (<HTMLInputElement>document.getElementById('sessionId'))
    ? (<HTMLInputElement>document.getElementById('sessionId')).value : undefined;
    if (sessionStorage.getItem('UTM')) {
      this.UTMparam = JSON.parse(sessionStorage.getItem('UTM'));
    }
    this.userSid = (<HTMLInputElement>document.getElementById('userSid'))
    ? (<HTMLInputElement>document.getElementById('userSid')).value : undefined;
    this.deviceType = this.getDeviceType();
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
  public start(startEventInput: IStartEventInput) {
    if (this.isInitialized) {
      startEventInput = _.cloneDeep(this.addUTM(startEventInput));
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
  public impression(impressionEventInput: IImpressionEventInput) {
    if (this.isInitialized) {
      impressionEventInput = _.cloneDeep(this.addUTM(impressionEventInput));
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
  public interact(interactEventInput: IInteractEventInput) {
    if (this.isInitialized) {
      interactEventInput = _.cloneDeep(this.addUTM(interactEventInput));
      const eventData: ITelemetryEvent = this.getEventData(interactEventInput);
      this.telemetryProvider.interact(eventData.edata, eventData.options);
    }
  }

  public audit(auditEventInput: IAuditEventInput) {
    if (this.isInitialized) {
      auditEventInput = _.cloneDeep(this.addUTM(auditEventInput));
      const eventData: ITelemetryEvent = this.getEventData(auditEventInput);
      this.telemetryProvider.audit(eventData.edata, eventData.options);
    }
  }
  /**
   * Logs 'share' telemetry event
   *
   * @param {IShareEventInput} shareEventInput
   * @memberof TelemetryService
   */
  public share(shareEventInput: IShareEventInput) {
    if (this.isInitialized) {
      shareEventInput = _.cloneDeep(this.addUTM(shareEventInput));
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
  public error(errorEventInput: IErrorEventInput) {
    if (this.isInitialized) {
      errorEventInput = _.cloneDeep(this.addUTM(errorEventInput));
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
  public end(endEventInput: IEndEventInput) {
    if (this.isInitialized) {
      endEventInput = _.cloneDeep(this.addUTM(endEventInput));
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
  public log(logEventInput: ILogEventInput) {
    if (this.isInitialized) {
      logEventInput = _.cloneDeep(this.addUTM(logEventInput));
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
  public exData(exDataEventInput: IExDataEventInput) {
    if (this.isInitialized) {
      exDataEventInput = _.cloneDeep(this.addUTM(exDataEventInput));
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
  public feedback(feedbackEventInput: IFeedBackEventInput) {
    if (this.isInitialized) {
      feedbackEventInput = _.cloneDeep(this.addUTM(feedbackEventInput));
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
    if (this.userSid) {
      eventContextData.cdata.push({
        id: this.userSid,
        type: 'UserSession'
      });
    }
    eventContextData.cdata.push({
      id: this.deviceType,
      type: 'Device'
    });
    eventContextData.cdata.push({
      id: localStorage.getItem('layoutType') || 'default',
      type: 'Theme',
    });
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

  public makeUTMSession(params) {
    this.UTMparam = _.toPairs(params).
    filter(([key, value]) => value && _.isString(value) && UTM_PARAMS[key]).map(([key, value]) => ({id: value, type: UTM_PARAMS[key]}));
    sessionStorage.setItem('UTM', JSON.stringify(this.UTMparam));
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

  public setInitialization(value: boolean) {
    this.telemetryProvider.initialized = value;
    this.isInitialized = value;
  }

  public setSessionIdentifier(value) {
    this.userSid = value;
  }

  public getDeviceType() {
    const deviceDetectorService = new DeviceDetectorService('browser');
    let device = '';
    if (deviceDetectorService.isMobile()) {
      device = 'Mobile';
    } else if (deviceDetectorService.isTablet()) {
      device = 'Tab';
    } else if (deviceDetectorService.isDesktop()) {
      device = 'Desktop';
    }
    return device;
  }
}
