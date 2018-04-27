import { IUserProfile } from '../../../shared';





export interface IStartEventData {
  'type': 'app' | 'session' | 'editor' | 'player' | 'workflow' | 'assessment';
  'pageid': String;
  'mode': 'play' | 'edit' | 'preview';
  'dspec'?: Object;
  'uaspec'?: Object;
  'loc'?: String;
  'duration'?: Number;
}
export interface IImpressionEventData {
  'type': 'list' | 'detail' | 'view' | 'edit' | 'workflow' | 'search';
  'subtype'?: String;
  'pageid': String;
  'uri': String;
  'visits'?: Object;
}
export interface IInteractEventData {
  'id': String;
  'type': String;
  'subtype'?: String;
  'pageid'?: String;
  'extra'?: Object;
  'target'?: String;
  'plugin'?: String;
}
export interface IShareEventData {
  'type': 'File' | 'Link' | 'Message';
  'dir': 'In' | 'Out';
  'items': Array<Object>;
}
export interface IErrorEventData {
  'err': String;
  'errtype': String;
  'stacktrace': String;
}
export interface IEndEventData {
  'pageid'?: String;
  'duration'?: String;
  'type': 'app' | 'session' | 'editor' | 'player' | 'workflow' | 'assessment';
  'mode'?: 'play' | 'edit' | 'preview';
  'summary'?: Array<Object>;
  'contentId': String;
}
export interface ILogEventData {
  'type': 'system' | 'process' | 'api_access' | 'api_call' | 'job' | 'app_update';
  'level': 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';
  'message': String;
  'pageid'?: String;
  'params'?: Array<Object>;
}
export interface ITelemetryContextData {
  'channel': String;
  'uid': String;
  'env': String;
  'pdata'?: Object;
  'sid'?: String;
  'did'?: String;
  'cdata'?: Array<Object>;
  'rollup'?: Object;
}
export interface TelemetryObject {
  'id': String;
  'type': String;
  'ver'?: String;
  'rollup': Object;
}
export interface TelemetryEventOptions {
  'context'?: ITelemetryContextData;
  'object'?: TelemetryObject;
  'tags'?: Array<String>;
}
export interface ITelemetryEvent {
  'edata': IStartEventData | IImpressionEventData | IInteractEventData | IShareEventData
  | IErrorEventData | IEndEventData | ILogEventData;
  'contentId'?: String;
  'contentVer'?: String;
  'options': TelemetryEventOptions;
}

export interface IEndEventInput {
  'context': {
    'env': String;
  };
  'object'?: {
    'id': String;
    'type': String;
    'ver'?: String;
    'rollup'?: Object;
  };
  'edata': IEndEventData;
}

export interface IErrorEventInput {
  'context': {
    'env': String;
  };
  'object'?: {
    'id': String;
    'type': String;
    'ver'?: String;
    'rollup'?: Object;
  };
  'edata': IErrorEventData;
}

export interface IImpressionEventInput {
  'context': {
    'env': String;
  };
  'object'?: {
    'id': String;
    'type': String;
    'ver'?: String;
    'rollup'?: Object;
  };
  'edata': IImpressionEventData;
}

export interface IInteractEventInput {
  'context': {
    'env': String;
  };
  'object'?: {
    'id': String;
    'type': String;
    'ver'?: String;
    'rollup'?: Object;
  };
  'edata': IInteractEventData;
}

export interface ILogEventInput {
  'context': {
    'env': String;
  };
  'object'?: {
    'id': String;
    'type': String;
    'ver'?: String;
    'rollup'?: Object;
  };
  'edata': ILogEventData;
}

export interface IShareEventInput {
  'context': {
    'env': String;
  };
  'object'?: {
    'id': String;
    'type': String;
    'ver'?: String;
    'rollup'?: Object;
  };
  'edata': IShareEventData;
}

export interface IStartEventInput {
  context: {
    env: String;
    cdata?: Array<Object>;
  };
  object?: {
    id: String;
    type: String;
    ver?: String;
    rollup?: Object;
  };
  edata: IStartEventData;
}

export interface IProducerData {
  'id': String;
  'ver': String;
  'pid': String;
}

export interface ITelemetry {
  'pdata': IProducerData;
  'env': String;
  'apislug': String;
  'channel': String;
  'uid': String;
  'endpoint': String;
  'did'?: String;
  'authtoken'?: String;
  'sid'?: String;
  'batchsize'?: Number;
  'runningEnv'?: String;
  'mode'?: String;
  'host'?: String;
  'tags'?: Array<String>;
  'cdata'?: Array<Object>;
  'dispatcher'?: undefined;
}

export interface IUserOrgDetails {
  'userId': IUserProfile['userId'];
  'rootOrgId': IUserProfile['rootOrgId'];
  'rootOrg': IUserProfile['rootOrg'];
  'organisationIds': IUserProfile['organisationIds'];
}

export interface ITelemetryContext {
  'config': ITelemetry;
  'userOrgDetails': IUserOrgDetails;
}
