export interface IStartEventData {
    'type': String;
    'mode': String;
    'duration'?: String;
    'pageid': String;
    'uaspec': Object;
}
export interface IImpressionEventData {
    'type': String;
    'subtype'?: String;
    'pageid': String;
    'uri': String;
    'visits'?: Object;
}
export interface IInteractEventData {
    'type': String;
    'subtype'?: String;
    'id': String;
    'pageid'?: String;
    'target'?: String;
    'plugin'?: String;
    'extra'?: Object;
}
export interface IShareEventData {
    'type': String;
    'dir': String;
    'items': Array<Object>;
}
export interface IErrorEventData {
    'err': String;
    'errType': String;
    'stacktrace': String;
    'pageid'?: String;
    'object'?: String;
    'plugin'?: String;
}
export interface IEndEventData {
    'type': String;
    'mode'?: String;
    'duration': String;
    'pageid'?: String;
    'summary'?: Array<Object>;
}
export interface ILogEventData {
    'type': String;
    'level': String;
    'message': String;
    'params': Array<Object>;
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


