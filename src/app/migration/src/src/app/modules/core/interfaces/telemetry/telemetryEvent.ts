export interface IStartEventData {
    'type': String;
    'pageid': String;
    'mode': String;
    'dspec'?: Object;
    'uaspec'?: Object;
    'loc'?: String;
    'duration'?: Number;
}
export interface IImpressionEventData {
    'type': String;
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
    'type': String;
    'dir': String;
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
    'type': String;
    'mode'?: String;
    'summary'?: Array<Object>;
    'contentId': String;
}
export interface ILogEventData {
    'type': String;
    'level': String;
    'message': String;
    'pageid'?: String;
    'params'?: Array<Object>;
}
export interface ITelemetryContextData {
    'channel': String;
    'pdata'?: Object;
    'env': String;
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


