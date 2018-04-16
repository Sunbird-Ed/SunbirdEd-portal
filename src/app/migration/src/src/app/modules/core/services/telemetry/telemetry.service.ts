import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  ITelemetry, ITelemetryEvent, ITelemetryContextData, TelemetryObject,
  IStartEventInput, IImpressionEventInput,
  IInteractEventInput, IShareEventInput, IErrorEventInput, IEndEventInput, ILogEventInput
} from './../../interfaces';
import { UserService } from './../user/user.service';
import { TelemetryLibUtilService } from './telemetry-lib-util.service';
import { ConfigService } from '@sunbird/shared';

/**
* Service Class for telemetry v3 event methods
*/

@Injectable()
export class TelemetryService {

  /**
  * reference of 'ITelemetry' Interface used to have telemetry configuration object
  */
  public telemetry: ITelemetry;

  /**
  * reference of 'UserService' class
  */
  private userService: UserService;

  /**
  * variable used to store user data subscription data and
  * used to unsubsribe after loading user profile
  */
  private userDataSubscription: any;

  /**
  * Object used to store user session details like userId,org info etc
  */
  public userSession: any;

  /**
  * Array to store all context items
  */
  public contextList: Array<Object>;

  /**
  * reference of 'TelemetryLibUtilService' class
  */
  public telemetryLibUtilService: TelemetryLibUtilService;

  /**
   *  Array to store id's of user orgs
   */
  public organisationIds: Array<String>;

  /**
   *  To get url, app configs.
   */
  private config: ConfigService;

  /**
     * constructor
     * @param {UserService} userService UserService reference
     * @param {TelemetryLibUtilService} telemetryLibUtilService TelemetryLibUtilService reference
     * @param {ConfigService} config ConfigService reference
     */
  constructor(userService: UserService, telemetryLibUtilService: TelemetryLibUtilService,
    config: ConfigService) {
    this.config = config;
    this.userService = userService;
    this.telemetryLibUtilService = telemetryLibUtilService;
    this.telemetry = {
      pdata: {
        id: 'org.sunbird',
        ver: '1.0',
        pid: ''
      },
      env: 'Home',
      channel: 'sunbird',
      uid: '',
      sid: '',
      batchsize: this.config.appConfig.TELEMETRY.MAX_BATCH_SIZE || 10,
      host: '',
      endpoint: this.config.urlConFig.URLS.TELEMETRY.SYNC,
      apislug: this.config.urlConFig.URLS.CONTENT_PREFIX,
      runningEnv: 'client',
      tags: []
    };
    this.contextList = [];
  }

  /**
  *  initalize telemetry method
  */
  public initialize() {
    this.loadUserSession();
    this.telemetryLibUtilService.initEvent(this.telemetry);
  }

  /**
   * service method to trigger start event telemetry
   * @param startEventInput 'IStartEventInput' reference
   */
  public startTelemetry(startEventInput: IStartEventInput) {
    this.telemetryLibUtilService.startEvent(this.getEventData(startEventInput), this.telemetry);
  }

  /**
   * service method to trigger impression event telemetry
   * @param impressionEventInput 'IImpressionEventInput' reference
   */
  public impression(impressionEventInput: IImpressionEventInput) {
    this.telemetryLibUtilService.impressionEvent(this.getEventData(impressionEventInput));
  }

  /**
   * service method to trigger interact event telemetry
   * @param iInteractEventInput  'IInteractEventInput' reference
   */
  public interact(iInteractEventInput: IInteractEventInput) {
    this.telemetryLibUtilService.interactEvent(this.getEventData(iInteractEventInput));
  }

  /**
   * service method to trigger share event telemetry
   * @param iShareEventInput 'IShareEventInput' reference
   */
  public share(iShareEventInput: IShareEventInput) {
    this.telemetryLibUtilService.shareEvent(this.getEventData(iShareEventInput));
  }

  /**
   * service method to trigger error event telemetry
   * @param iErrorEventInput 'IErrorEventInput' reference
   */
  public error(iErrorEventInput: IErrorEventInput) {
    this.telemetryLibUtilService.errorEvent(this.getEventData(iErrorEventInput));
  }

  /**
   * service method to trigger end event telemetry
   * @param iEndEventInput 'IEndEventInput' reference
   */
  public endTelemetry(iEndEventInput: IEndEventInput) {
    this.telemetryLibUtilService.endEvent(this.getEventData(iEndEventInput));
  }

  /**
 * service method to trigger log event telemetry
 * @param iLogEventInput 'ILogEventInput' reference
 */
  public logTelemetry(iLogEventInput: ILogEventInput) {
    this.telemetryLibUtilService.logEvent(this.getEventData(iLogEventInput));
  }

  /**
   * function to prepare telemetry event data
   * @param eventInput
   * @returns iTelemetryEvent 'ITelemetryEvent' reference
   */
  public getEventData(eventInput: any) {
    const contextData = this.getEventContext(eventInput);
    const eventObject = this.getEventObject(eventInput);
    const iTelemetryEvent: ITelemetryEvent = {
      edata: eventInput.edata,
      options: {
        context: contextData,
        object: eventObject,
        tags: this.organisationIds
      }
    };
    if (iTelemetryEvent.options.context) {
      this.contextList.push(iTelemetryEvent.options.context);
    }
    return iTelemetryEvent;
  }

  /**
   * function to prepare telemetry event object
   * @param eventInput
   * @returns eventObjectData 'TelemetryObject' reference
   */
  public getEventObject(eventInput: any) {
    const eventObjectData: TelemetryObject = {
      id: eventInput.object.id || '',
      type: eventInput.object.type || '',
      ver: eventInput.object.ver || '',
      rollup: eventInput.object.rollup || {}
    };
    return eventObjectData;
  }

  /**
   * function to prepare telemetry event context object
   * @param eventInput
   * @returns eventContextData 'ITelemetryContextData' reference
   */
  public getEventContext(eventInput: any) {
    const eventContextData: ITelemetryContextData = {
      channel: eventInput.edata.channel || this.telemetry.channel,
      pdata: eventInput.edata.pdata || this.telemetry.pdata,
      env: eventInput.env || this.telemetry.env,
      sid: eventInput.sid || this.telemetry.sid,
      cdata: eventInput.cdata || [],
      rollup: this.getRollUpData(this.organisationIds)
    };
    return eventContextData;
  }
  /**
   * This function is used to get rollup data for context or object
   * data is array of strings
   * return rollup object
   */
  public getRollUpData(data) {
    const rollUp = {};
    let i = 1;
    data = data || [];

    if (data.constructor === Array) {
      data.forEach(function (element) {
        rollUp['l' + i] = element;
        i += 1;
      });
    }
    return rollUp;
  }

  /**
   * to get user agent details
   */
  public getUserAgentSpec() {
    return {
      agent: window.navigator.appCodeName,
      ver: window.navigator.appVersion.split(' (')[0],
      system: '',
      platform: window.navigator.platform,
      raw: window.navigator.userAgent
    };
  }

  /**
   * to set configuration details of 'telemetry' variable object
   */
  private setConfigData() {
    this.telemetry.uid = this.userSession.userId;
    this.telemetry.sid = (<HTMLInputElement>document.getElementById('sessionId')).value;
    const rootOrg = (this.userSession.rootOrg &&
      !_.isUndefined(this.userSession.rootOrg.hashTagId)) ? this.userSession.rootOrg.hashTagId : 'sunbird';
    this.telemetry.channel = rootOrg;
    const organisationIds = [];
    _.forEach(this.userSession.organisations, function (org) {
      if (org.organisationId) {
        organisationIds.push(org.organisationId);
      }
    });
    this.organisationIds = organisationIds;

  }

  /**
  * Angular life cycle hook to subscribe and load userprofile from userService
  */
  private loadUserSession() {
    this.userDataSubscription = this.userService.userData$.subscribe(data => {
      if (data && data.userProfile) {
        this.userSession = {
          userId: data.userProfile.userId, rootOrgId: data.userProfile.rootOrgId,
          rootOrg: data.userProfile.rootOrg, organisations: data.userProfile.organisations
        };
        this.setConfigData();
        this.userDataSubscription.unsubscribe();
      } else {
        console.log('data', data);
      }
    });
  }

}
