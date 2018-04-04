import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  ITelemetry, ITelemetryEvent, ITelemetryContextData, TelemetryObject,
  IStartEventData, IImpressionEventData, IInteractEventData, IEndEventData,
  IShareEventData, IErrorEventData, IStartEventInput, IImpressionEventInput,
  IInteractEventInput, IShareEventInput, IErrorEventInput, IEndEventInput
} from './../../interfaces';
import { UserService } from './../user/user.service';
import { TelemetryLibUtilService } from './telemetry-lib-util.service';
import { ConfigService } from '../../../shared';

@Injectable()
export class TelemetryService {

  public telemetry: ITelemetry;
  private userService: UserService;
  private userDataSubscription: any;
  public userSession: any;
  public contextList: Array<Object>;
  public telemetryLibUtilService: TelemetryLibUtilService;
  public organisationIds: Array<String>;

  /**
   *  To get url, app configs.
   */
  private config: ConfigService;
  constructor(userService: UserService, telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) {
    this.config = config;
    this.userService = userService;
    this.telemetryLibUtilService = telemetryLibUtilService;
    this.loadUserSession();
    this.telemetry = {
      'pdata': {
        'id': 'org.sunbird',
        'ver': '1.0',
        'pid': ''
      },
      'env': 'Home',
      'channel': 'sunbird',
      'did': undefined,
      'authtoken': undefined,
      'uid': '',
      'sid': '',
      'batchsize': this.config.appConfig.TELEMETRY.MAX_BATCH_SIZE || 10,
      'host': '',
      'endpoint': this.config.urlConFig.URLS.TELEMETRY.SYNC,
      'apislug': this.config.urlConFig.URLS.CONTENT_PREFIX,
      'dispatcher': undefined,
      'runningEnv': 'client',
      'tags': []
    };
    this.contextList = [];
  }
  public initialize() {
    console.log('Initialize telemetry');
    EkTelemetry.initialize(this.telemetry);
  }

  public startTelemetry(startEventInput: IStartEventInput) {
    const contextData = this.getEventContext(startEventInput);
    const eventObject = this.getEventObject(startEventInput);
    const startEventData: IStartEventData = {
      type: startEventInput.contentType,
      mode: startEventInput.mode,
      pageid: startEventInput.pageId,
      uaspec: this.getUserAgentSpec()
    };
    const iTelemetryEvent: ITelemetryEvent = {
      'edata': startEventData,
      'contentId': startEventInput.objectId,
      'contentVer': startEventInput.objectVersion,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': this.organisationIds
      }
    };
    if (iTelemetryEvent.options.context) {
      this.contextList.push(iTelemetryEvent.options.context);
    }
    this.telemetryLibUtilService.startEvent(iTelemetryEvent, this.telemetry);
  }

  public impression(impressionEventInput: IImpressionEventInput) {
    const contextData = this.getEventContext(impressionEventInput);
    const eventObject = this.getEventObject(impressionEventInput);
    const impressionEventData: IImpressionEventData = {
      type: 'view',
      subtype: impressionEventInput.subType,
      pageid: impressionEventInput.pageId,
      uri: impressionEventInput.uri,
      visits: impressionEventInput.visits
    };
    const iTelemetryEvent: ITelemetryEvent = {
      'edata': impressionEventData,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': this.organisationIds
      }
    };

    this.telemetryLibUtilService.impressionEvent(iTelemetryEvent, this.telemetry);
  }

  public interact(iInteractEventInput: IInteractEventInput) {
    const contextData = this.getEventContext(iInteractEventInput);
    const eventObject = this.getEventObject(iInteractEventInput);
    const interactEventData: IInteractEventData = {
      'type': 'CLICK',
      'subtype': '',
      'id': iInteractEventInput.edataId,
      'pageid': iInteractEventInput.pageId
    };
    const iTelemetryEvent: ITelemetryEvent = {
      'edata': interactEventData,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': this.organisationIds
      }
    };

    this.telemetryLibUtilService.interactEvent(iTelemetryEvent, this.telemetry);
  }
  public share(iShareEventInput: IShareEventInput) {
    const contextData = this.getEventContext(iShareEventInput);
    const eventObject = this.getEventObject(iShareEventInput);
    const shareEventData: IShareEventData = {
      'dir': 'Out',
      'type': 'Link',
      'items': [{
        'id': iShareEventInput.objectId,
        'type': iShareEventInput.objectType,
        'ver': iShareEventInput.objectVersion
      }]
    };
    const iTelemetryEvent: ITelemetryEvent = {
      'edata': shareEventData,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': this.organisationIds
      }
    };
    this.telemetryLibUtilService.shareEvent(iTelemetryEvent, this.telemetry);
  }

  public error(iErrorEventInput: IErrorEventInput) {
    const contextData = this.getEventContext(iErrorEventInput);
    const eventObject = this.getEventObject(iErrorEventInput);
    const errorEventData: IErrorEventData = {
      'err': iErrorEventInput.errCode,
      'errType': iErrorEventInput.errType,
      'pageid': iErrorEventInput.pageId,
      'stacktrace': iErrorEventInput.stacktrace
    };
    const iTelemetryEvent: ITelemetryEvent = {
      'edata': errorEventData,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': this.organisationIds
      }
    };
    this.telemetryLibUtilService.errorEvent(iTelemetryEvent, this.telemetry);
  }

  public endTelemetry(iEndEventInput: IEndEventInput) {
    const contextData = this.getEventContext(iEndEventInput);
    const eventObject = this.getEventObject(iEndEventInput);
    const endEventData: IEndEventData = {
      'type': iEndEventInput.type,
      'duration': iEndEventInput.duration,
      'mode': iEndEventInput.mode,
      'pageid': iEndEventInput.pageId,
      'summary': iEndEventInput.summary
    };
    const iTelemetryEvent: ITelemetryEvent = {
      'edata': endEventData,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': this.organisationIds
      }
    };
    this.telemetryLibUtilService.endEvent(iTelemetryEvent, this.telemetry);
  }


  public getEventObject(eventInput: any) {
    const eventObjectData: TelemetryObject = {
      'id': eventInput.objectId,
      'type': eventInput.objectType,
      'ver': eventInput.objectVersion,
      'rollup': eventInput.rollup || {}
    };
    return eventObjectData;
  }
  public getEventContext(eventInput: any) {
    const eventContextData: ITelemetryContextData = {
      channel: this.telemetry.channel,
      pdata: this.telemetry.pdata,
      env: eventInput.env || this.telemetry.env,
      sid: this.telemetry.sid,
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
  public getUserAgentSpec() {
    return {
      'agent': window.navigator.appCodeName,
      'ver': window.navigator.appVersion.split(' (')[0],
      'system': '',
      'platform': window.navigator.platform,
      'raw': window.navigator.userAgent
    };
  }

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
  * Angular life cycle hook
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
