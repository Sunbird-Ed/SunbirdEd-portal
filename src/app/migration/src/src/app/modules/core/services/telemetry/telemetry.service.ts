import { Injectable } from '@angular/core';
import {
  ITelemetry, IStartEventInput, ITelemetryEvent, ITelemetryContextData,
  TelemetryObject, IStartEventData
} from './../../interfaces';
import { ConfigService, ServerResponse } from '@sunbird/shared';
import { UserService } from './../user/user.service'

@Injectable()
export class TelemetryService {

  public telemetry: ITelemetry;
  private userService: UserService;
  private userDataSubscription: any;
  public userSession: any;
  public contextList: Array<Object>;

  /**
   *  To get url, app configs.
   */
  private config: ConfigService;
  constructor(userService: UserService) {
    this.userService = userService;
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
      'batchsize': 10,
      'host': '',
      'endpoint': "data/v1/telemetry",
      'apislug': "service/v1/content",
      'dispatcher': undefined,
      'runningEnv': 'client',
      'tags': []
    };
    this.contextList = [];
  }
  public initialize() {
    console.log('Initialize telemetry')
    EkTelemetry.initialize(this.telemetry) // eslint-disable-line no-undef
  }

  public startTelemetry(startEventInput: IStartEventInput) {
    let contextData = this.getEventContext(startEventInput);
    let eventObject = this.getEventObject(startEventInput);
    let startEventData: IStartEventData = {
      type: startEventInput.contentType,
      mode: startEventInput.mode,
      pageid: startEventInput.pageId,
      uaspec: this.getUserAgentSpec()
    };
    let iTelemetryEvent: ITelemetryEvent = {
      'edata': startEventData,
      'contentId': startEventInput.objectId,
      'contentVer': startEventInput.objectVersion,
      'options': {
        'context': contextData,
        'object': eventObject,
        'tags': [] //$rootScope.organisationIds
      }
    };
    this.fireStartEvent(iTelemetryEvent)

  }

  private fireStartEvent(iTelemetryEvent: ITelemetryEvent) {
    if (iTelemetryEvent.options.context) {
      this.contextList.push(iTelemetryEvent.options.context)
    }
    EkTelemetry.start(this.telemetry, iTelemetryEvent.contentId, iTelemetryEvent.contentVer,
      iTelemetryEvent.edata, iTelemetryEvent.options);
  }

  public getEventObject(startEventInput: IStartEventInput) {
    let eventObjectData: TelemetryObject = {
      'id': startEventInput.objectId,
      'type': startEventInput.objectType,
      'ver': startEventInput.objectVersion,
      'rollup': startEventInput.rollup || {}
    };
    return eventObjectData;
  }
  public getEventContext(startEventInput: IStartEventInput) {
    let eventContextData: ITelemetryContextData = {
      channel: this.telemetry.channel,
      pdata: this.telemetry.pdata,
      env: startEventInput.env || this.telemetry.env,
      sid: this.telemetry.sid,
      cdata: startEventInput.cdata || [],
      rollup: this.getRollUpData([])
    };
    return eventContextData;
  }
  /**
          * This function is used to get rollup data for context or object
          * data is array of strings
          * return rollup object
          */
  public getRollUpData(data) {
    var rollUp = {}
    var i = 1
    data = data || []

    if (data.constructor === Array) {
      data.forEach(function (element) {
        rollUp['l' + i] = element
        i += 1
      })
    }
    return rollUp
  }
  public getUserAgentSpec() {
    return {
      "agent": window.navigator.appCodeName,
      "ver": window.navigator.appVersion.split(' (')[0],
      "system": '',
      "platform": window.navigator.platform,
      "raw": window.navigator.userAgent
    }
  }

  private setConfigData() {
    this.telemetry.uid = this.userSession.userId;
    this.telemetry.sid = (<HTMLInputElement>document.getElementById('sessionId')).value;
  }

  /**
  * Angular life cycle hook
  */
  private loadUserSession() {
    this.userDataSubscription = this.userService.userData$.subscribe(data => {
      if (data && data.userProfile) {
        this.userSession = { userId: data.userProfile.userId, rootOrgId: data.userProfile.rootOrgId };
        this.setConfigData();
        this.userDataSubscription.unsubscribe();
      } else {
        console.log("data", data);
      }
    });
  }

}
